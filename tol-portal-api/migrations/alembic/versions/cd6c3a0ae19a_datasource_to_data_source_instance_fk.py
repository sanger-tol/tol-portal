"""datasource_to_data_source_instance_fk

Revision ID: cd6c3a0ae19a
Revises: f6f142c1a7bb
Create Date: 2025-09-22 13:07:57.229405

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import text


# revision identifiers, used by Alembic.
revision = 'cd6c3a0ae19a'
down_revision = 'f6f142c1a7bb'
branch_labels = None
depends_on = None


def upgrade() -> None:
    conn = op.get_bind()

    # Create new `api_details` field to data_source_instance table
    op.add_column('data_source_instance', sa.Column('ui_api_details', JSONB, nullable=True))

    # Remove autoincrement from id column and change to string type
    op.alter_column('data_source_instance', 'id', 
                   type_=sa.String(),
                   autoincrement=False,
                   nullable=False)

    # Update all id fields to use name values
    conn.execute(
        text("""
        UPDATE data_source_instance
        SET id = name
        """)
    )

    # Drop the name column
    op.drop_column('data_source_instance', 'name')

    # Update api_details for 'tol_production' data source instance
    conn.execute(
        text("""
        UPDATE data_source_instance
        SET ui_api_details = '{"url": "https://portal.tol.sanger.ac.uk", "apiPath": "/api/v1", "apiDataPath": "/data", "dataspace": "tol_production"}'
        WHERE id = 'tol_production'
        """)
    )

    # Update tolqc id
    conn.execute(
        text("""
        UPDATE data_source_instance
        SET id = 'tolqc_production'
        WHERE id = 'tolqc'
        """)
    )

    # Update api_details for 'tolqc_production' data source instance
    conn.execute(
        text("""
        UPDATE data_source_instance
        SET ui_api_details = '{"url": "https://portal.tol.sanger.ac.uk", "apiPath": "/api/v1", "apiDataPath": "/data", "dataspace": "tolqc_production"}'
        WHERE id = 'tolqc_production'
        """)
    )

    # Remove `datasource` fields
    op.drop_column('component', 'datasource')
    op.drop_column('zone', 'datasource')

    # Create new `data_source_instance_id` fields in their places,
    # with foreign keys linking to the `data_source_instance` table
    op.add_column('component', sa.Column('data_source_instance_id', sa.Integer, nullable=True))
    op.create_foreign_key(
        'fk_component_data_source_instance',
        'component', 'data_source_instance',
        ['data_source_instance_id'], ['id']
    )
    op.add_column('zone', sa.Column('data_source_instance_id', sa.Integer, nullable=True))
    op.create_foreign_key(
        'fk_zone_data_source_instance',
        'zone', 'data_source_instance',
        ['data_source_instance_id'], ['id']
    )

    # Pre-populate `datasource_instance_id` fields with `1` ('tol-production')
    conn.execute(
        text("""
        UPDATE component
        SET data_source_instance_id=1
        """)
    )
    conn.execute(
        text("""
        UPDATE zone
        SET data_source_instance_id=1
        """)
    )

    # Set columns as NOT NULL now that data is populated
    op.alter_column('component', 'data_source_instance_id', nullable=False)
    op.alter_column('zone', 'data_source_instance_id', nullable=False)


def downgrade() -> None:
    pass