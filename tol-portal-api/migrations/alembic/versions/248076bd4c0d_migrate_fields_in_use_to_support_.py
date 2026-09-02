"""Migrate fields in use to support provenance

Revision ID: 248076bd4c0d
Revises: b77923994607
Create Date: 2026-08-10 08:12:44.340674

"""
from collections.abc import Callable, Sequence
from typing import Any
import dataclasses
import re

from alembic import op
import dacite
import sqlalchemy as sa
from tol.core import DataSourceFilter


# revision identifiers, used by Alembic.
revision = '248076bd4c0d'
down_revision = 'b77923994607'
branch_labels = None
depends_on = None


FIELD_EXCEPTIONS = {
    'tolid_prefix': 'tolid_prefix'
}


def __check(check_passed: bool) -> None:
    if not check_passed:
        raise Exception(
            "Migration 248076bd4c0d failed due either to a programming error "
            "or to malformed data in the database"
        )


def __is_summarised_attribute(attribute: str) -> bool:
    return attribute.endswith((
        'min',
        'max',
        'sum',
        'union',
        'recent',
    ))


def __remove_attribute_source_prefix(attribute: str, starting_at_index: int = 0) -> str:
    before_substr = attribute[:starting_at_index]
    after_substr = attribute[starting_at_index:]

    # Remove the source prefix.
    # NOTE: This also accounts for 'tolid' being both an object type and a source,
    # as if it's an object type it won't be followed by an underscore
    for source_prefix in (
        'benchling_', 'benchling_pacbio_', 'benchling_pacbio_completed_', 'calc_', 'gn_', 'goat_',
        'grit_', 'informatics_', 'mlwh_', 'sts_', 'tolid_', 'tolqc_',
    ):
        if after_substr.startswith(source_prefix):
            return before_substr + after_substr.removeprefix(source_prefix)

    return before_substr + after_substr


def __upgrade_field_part(part: str) -> str:
    """
    Upgrade a single field part to the Provenance format
    """
    if part in FIELD_EXCEPTIONS:
        return FIELD_EXCEPTIONS[part]
    elif __is_summarised_attribute(part):
        # Remove the first source prefix at the start
        attr_first_source_removed = __remove_attribute_source_prefix(part)

        # The second source prefix comes after the object type,
        # so we need to work out where that ends
        index_the_object_type_ends_at = 0
        for object_type in (
            'assembly', 'assembly_analysis', 'curation', 'extraction', 'extraction_container',
            'family', 'genome_note', 'issue', 'manifest', 'run_data', 'sample', 'sampleset',
            'sequencing_request', 'species', 'specimen', 'study', 'tissue_prep', 'tolid'
        ):
            if attr_first_source_removed.startswith(object_type):
                # The second source prefix starts after the object type plus an underscore
                index_the_object_type_ends_at = len(object_type) + 1

        # Remove the source prefix after the first object type
        return __remove_attribute_source_prefix(
            attr_first_source_removed,
            starting_at_index=index_the_object_type_ends_at
        )
    else:
        # Just remove the first source prefix
        return __remove_attribute_source_prefix(part)


def _upgrade_field(attribute: str) -> str:
    """
    Upgrades a single field to the Provenance format.
    This is the core conversion made in this migration.
    """
    # Call upgrade part for each part (split by '.')
    return '.'.join(map(__upgrade_field_part, attribute.split('.')))


def _upgrade_field_list(field_list: list[str]) -> list[str]:
    """
    Upgrades each field in a list
    """
    __check(isinstance(field_list, list))
    return [
        _upgrade_field(field)
        for field in field_list
    ]

def _upgrade_keys_and_values(dictionary: dict) -> dict:
    """
    Upgrades each key AND value in a dictionary
    """
    return {
        _upgrade_field(key): _upgrade_field(value)
        for key, value in dictionary.items()
    }


def _upgrade_filter(filter_dict: dict) -> dict:
    __check(isinstance(filter_dict, dict))

    # Convert dict to DataSourceFilter
    filter = dacite.from_dict(DataSourceFilter, filter_dict)

    # Extract the `and_`. If there are no filters, it's sometimes stored as `None`, and sometimes
    # as `{}`, so ensure both are the same (it'll be easier to iterate over in a moment)
    and_filters = filter.and_ or {}

    # Upgrade each field in the filter
    new_filter = DataSourceFilter(
        and_={
            _upgrade_field(field): operators
            for field, operators in and_filters.items()
        }
    )

    # Convert back to a dict
    new_filter_dict = {'_and': new_filter.and_}
    return new_filter_dict


def __upgrade_field_meta_data(field_meta_data: dict) -> dict:
    """
    Helper function for _upgrade_component_config for upgrading config['fieldMeta']['data'],
    as there may be cell renderer config
    """
    cell_renderer_config = field_meta_data.get('cellRenderer')
    if not cell_renderer_config:
        return field_meta_data

    def upgrade_field_in_text_prop(prop_name):
        """
        Convenience function to find embedded field values and upgrade them:
        'Lorem ipsum ${source_field_name} dolor' -> 'Lorem ipsum ${field_name} dolor'
        """
        text: str | None = cell_renderer_config['props'].get(prop_name)
        if text:
            cell_renderer_config['props'][prop_name] = re.sub(
                r'\${(.*?)\}',
                lambda match: '${' + _upgrade_field(match.group(1)) + '}',
                text
            )

    def upgrade_condition(condition_name):
        """
        Convenience function to call `_upgrade_filter`
        on `cell_renderer_config['props'][condition_name]`.
        """
        filter_dict = cell_renderer_config['props'].get(condition_name)
        if filter_dict:
            cell_renderer_config['props'][condition_name] = _upgrade_filter(filter_dict)

    # Call an upgrade for each prop of each cell renderer type that will need upgrading
    match cell_renderer_config['type']:
        case 'card':
            upgrade_field_in_text_prop('content')
            upgrade_condition('successBackground')
            upgrade_condition('warningBackground')
            upgrade_condition('errorBackground')
        case 'image':
            upgrade_field_in_text_prop('value')
            upgrade_field_in_text_prop('captions')
        case 'link':
            upgrade_field_in_text_prop('url')
            upgrade_field_in_text_prop('text')
        case 'priority':
            upgrade_condition('lowest')
            upgrade_condition('low')
            upgrade_condition('medium')
            upgrade_condition('high')
            upgrade_condition('highest')
        case 'relationship':
            upgrade_field_in_text_prop('relationshipId')
        case 'traffic_light_status':
            upgrade_condition('success')
            upgrade_condition('warning')
            upgrade_condition('danger')

    return field_meta_data


def _upgrade_component_config(config: dict) -> dict:
    __check(isinstance(config, dict))
    if not config:
        # Skip empty dicts
        return config

    # Upgrade fieldMeta (for tables)
    field_meta = config.get('fieldMeta')
    if field_meta:
        # Two lists of field names
        if field_meta.get('order') is not None:
            if field_meta['order'].get('active'):
                field_meta['order']['active'] = [
                    _upgrade_field(field)
                    for field in field_meta['order']['active']
                ]
            if field_meta['order'].get('inactive'):
                field_meta['order']['inactive'] = [
                    _upgrade_field(field)
                    for field in field_meta['order']['inactive']
                ]

        # 'data' is more complicated because the keys are fields,
        # but there may also be cell renderers containing filters
        if field_meta.get('data') is not None:
            field_meta['data'] = {
                _upgrade_field(field): __upgrade_field_meta_data(field_meta_data)
                for field, field_meta_data in field_meta['data'].items()
            }

    # Upgrade sortBy (for tables)
    sort_by = config.get('sortBy')
    if sort_by:
        config['sortBy'] = _upgrade_field(sort_by)

    # Upgrade sliceBy (for sunbursts)
    slice_by = config.get('sliceBy')
    if slice_by:
        config['sliceBy'] = [_upgrade_field(field) for field in slice_by]

    # Upgrade xAxis (for charts)
    x_axis = config.get('xAxis')
    if x_axis:
        config['xAxis'] = _upgrade_field(x_axis)

    # Upgrade breakDownBy (for charts)
    break_down_by = config.get('breakDownBy')
    if break_down_by:
        config['breakDownBy'] = _upgrade_field(break_down_by)

    return config


def __select_with_dataspace(
    connection: sa.Connection,
    table: sa.Table,
    id_column: sa.Column,
    target_column: sa.Column,
    dataspace_check_column: sa.Column
) -> Sequence[sa.Row]:
    """
    Selects (`id_column`, `target_column`, `dataspace_check_column`) from `table`.
    If there is no dataspace associated with this table (e.g. 'view') then the returned
    datasource_instance_id will be None.
    """
    component_table = sa.Table(
        'component', sa.MetaData(), autoload_with=connection
    ).alias('dataspace_component')
    zone_table = sa.Table(
        'zone', sa.MetaData(), autoload_with=connection
    ).alias('dataspace_zone')

    select_statement = (
        sa.select(
            id_column,
            target_column,
            sa.func.coalesce(
                component_table.c.data_source_instance_id,
                zone_table.c.data_source_instance_id
            )
        )
        .select_from(table)
        .outerjoin(component_table, dataspace_check_column == component_table.c.id)
        .outerjoin(zone_table, dataspace_check_column == zone_table.c.id)
    )
    return connection.execute(select_statement).all()


def _perform_upgrade(
    table_name: str,
    column_name: str,
    upgrade_action: Callable[[Any], Any],
    dataspace_check_column_name: str = 'id'
) -> None:
    """
    Function providing a delcarative interface for what isbeing upgraded, such that `upgrade` is
    more a description of what's upgraded in this migration.

    Extracts all values for the column `column_name` in the table `table_name`, upgrades it
    by passing it through `upgrade_action`, then saves the changes to the database.

    `dataspace_check_column_name` is the column whose value identifies the entity to check the
    dataspace of. It's in entity ID format. This defaults to `id` (e.g. for the `zone` table),
    but some tables (e.g. `entity_diff`) reference an ID in a different way (in that case,
    through the `component_id` column), so this can refer to that instead.
    """
    connection = op.get_bind()
    # Reflect the table so SQLAlchemy knows the column types
    metadata = sa.MetaData()
    table = sa.Table(table_name, metadata, autoload_with=connection)
    id_column = table.c.id
    dataspace_check_column = table.c[dataspace_check_column_name]
    target_column = table.c[column_name]

    rows = __select_with_dataspace(
        connection, table, id_column, target_column, dataspace_check_column
    )
    # For each row, perform the upgrade action on the value then save back to the database
    update_statement = (
        sa.update(table)
        .where(id_column == sa.bindparam('row_id'))
        .values({column_name: sa.bindparam('new_value')})
    )
    for row_id, old_value, data_source_instance_id in rows:
        if data_source_instance_id != 'tol_production':
            # Don't perform the migration on anything not using the tol_production dataspace
            continue
        elif old_value is None:
            # NULL values can be skipped over
            continue

        new_value = upgrade_action(old_value)
        connection.execute(update_statement, {'new_value': new_value, 'row_id': row_id})


def upgrade() -> None:
    """
    Extracts every field, calls `_upgrade_field` to convert it to the new format
    supporting Provenance, then saves the field back to the database.
    """
    # User-specified fields
    _perform_upgrade('board', 'filter', _upgrade_filter)
    _perform_upgrade('component', 'config', _upgrade_component_config)
    _perform_upgrade('component', 'filter', _upgrade_filter)
    _perform_upgrade('view', 'filter', _upgrade_filter)
    _perform_upgrade('zone', 'filter', _upgrade_filter)
    _perform_upgrade('zone', 'attribute_translations', _upgrade_keys_and_values)
    _perform_upgrade(
        'entity_diff',
        'config',
        # Currently, only components (specifically tables) can have entity diffs
        _upgrade_component_config,
        # entity_diff's own id is an unrelated autoincrement integer, so use its
        # linked component's id for the dataspace check instead
        dataspace_check_column_name='component_id'
    )


def downgrade() -> None:
    raise Exception('This migration cannot be downgraded because its upgrade is lossy')
