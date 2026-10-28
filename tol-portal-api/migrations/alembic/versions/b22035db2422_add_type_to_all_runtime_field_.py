"""Add type to all runtime field definitions

Revision ID: b22035db2422
Revises: 6e9d56af1f3f
Create Date: 2026-10-28 13:12:08.596876

"""
import json

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b22035db2422'
down_revision = '6e9d56af1f3f'
branch_labels = None
depends_on = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    connection = op.get_bind()

    # Get all runtime field definition rows
    config_attributes = connection.execute(
        sa.text(
            """
            SELECT id, runtime_definition
            FROM data_source_config_attribute
            WHERE runtime_definition IS NOT NULL
            """
        )
    ).fetchall()

    # Build up a list of updates. Each update removes the 'type' key if the runtime field
    # is a function runtime field (rather than a script runtime field)
    updates = []
    for row in config_attributes:
        runtime_definition = json.loads(row.runtime_definition)
        if not isinstance(runtime_definition, dict):
            raise ValueError(
                f'runtime_definition for data_source_config_attribute {row.id} '
                'must be a JSON object'
            )

        if 'function' in runtime_definition and 'type' in runtime_definition:
            del runtime_definition['type']
            updates.append(
                {
                    'id': row.id,
                    'runtime_definition': json.dumps(runtime_definition),
                }
            )

    # Save the changes
    if updates:
        connection.execute(
            sa.text(
                """
                UPDATE data_source_config_attribute
                SET runtime_definition = :runtime_definition
                WHERE id = :id
                """
            ),
            updates,
        )
