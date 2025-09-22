"""datasource_to_data_source_instance_fk

Revision ID: cd6c3a0ae19a
Revises: 76284ef5166d
Create Date: 2025-09-22 13:07:57.229405

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB


# revision identifiers, used by Alembic.
revision = 'cd6c3a0ae19a'
down_revision = '76284ef5166d'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Remove `datasource` fields
    op.drop_column('component', 'datasource')
    op.drop_column('zone', 'datasource')

    # Create new `data_source_instance_id` fields in their places,
    # with foreign keys linking to the `data_source_instance` table
    op.add_column('component', sa.Column('data_source_instance_id', sa.Integer, nullable=False))
    op.create_foreign_key(
        'fk_component_data_source_instance',
        'component', 'data_source_instance',
        ['data_source_instance_id'], ['id']
    )
    op.add_column('zone', sa.Column('data_source_instance_id', sa.Integer, nullable=False))
    op.create_foreign_key(
        'fk_zone_data_source_instance',
        'zone', 'data_source_instance',
        ['data_source_instance_id'], ['id']
    )


def downgrade() -> None:
    # Remove `data_source_instance_id` fields from `component` and `zone` tables
    op.drop_constraint('fk_component_data_source_instance', 'component')
    op.drop_column('component', 'data_source_instance_id')
    op.drop_constraint('fk_zone_data_source_instance', 'zone')
    op.drop_column('zone', 'data_source_instance_id')

    # Replace back old `datasource` field into these tables
    op.add_column('component', sa.Column('datasource', JSONB, nullable=False, server_default='{}'))
    op.add_column('zone', sa.Column('datasource', JSONB, nullable=False, server_default='{}'))
