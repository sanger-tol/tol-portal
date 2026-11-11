"""Remove return_type from function_kwargs of existing runtime fields

Revision ID: 4893299ca751
Revises: b22035db2422
Create Date: 2026-11-06 16:44:29.697396

"""
import json

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4893299ca751'
down_revision = 'b22035db2422'
branch_labels = None
depends_on = None


FUNCTIONS_WITH_RETURN_TYPE = {'coalesce', 'substring', 'concatenate'}


def upgrade() -> None:
    connection = op.get_bind()
    config_attributes = connection.execute(
        sa.text(
            """
            SELECT id, runtime_definition
            FROM data_source_config_attribute
            WHERE runtime_definition IS NOT NULL
            """
        )
    )

    updates = []
    for row in config_attributes:
        runtime_definition = row.runtime_definition
        function_kwargs = runtime_definition.get('function_kwargs')

        if isinstance(function_kwargs, dict) and 'return_type' in function_kwargs:
            del function_kwargs['return_type']
            updates.append({
                'id': row.id,
                'runtime_definition': json.dumps(runtime_definition),
            })

    if updates:
        connection.execute(
            sa.text(
                """
                UPDATE data_source_config_attribute
                SET runtime_definition = CAST(:runtime_definition AS JSONB)
                WHERE id = :id
                """
            ),
            updates,
        )


def downgrade() -> None:
    connection = op.get_bind()
    config_attributes = connection.execute(
        sa.text(
            """
            SELECT id, runtime_definition
            FROM data_source_config_attribute
            WHERE runtime_definition IS NOT NULL
            """
        )
    )

    updates = []
    for row in config_attributes:
        runtime_definition = row.runtime_definition
        if (
            runtime_definition.get('function') in FUNCTIONS_WITH_RETURN_TYPE
            and 'type' in runtime_definition
        ):
            function_kwargs = runtime_definition.setdefault('function_kwargs', {})
            if 'return_type' not in function_kwargs:
                function_kwargs['return_type'] = runtime_definition['type']
                updates.append({
                    'id': row.id,
                    'runtime_definition': json.dumps(runtime_definition),
                })

    if updates:
        connection.execute(
            sa.text(
                """
                UPDATE data_source_config_attribute
                SET runtime_definition = CAST(:runtime_definition AS JSONB)
                WHERE id = :id
                """
            ),
            updates,
        )
