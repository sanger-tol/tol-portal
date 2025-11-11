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

    """
    Update data_source_instance id to be the name as PK in data_source_instance table
    1. Create copies of data_source_instance_id fields in loader table
    2. Pre-populate the copy fields with data_source_instance.name values
    3. Drop foreign key constraints
    4. Drop the original columns
    5. Rename the copy columns to the original names
    6. Update data_source_instance.id ready to take string values
    7. Update all id fields to use name values
    8. Drop the now old name column
    9. Re-create foreign key constraints for loader table
    """

    # Create copies of data_source_instance_id fields in loader table
    op.add_column('loader', sa.Column('source_data_source_instance_id_COPY', sa.String(), nullable=True))
    op.add_column('loader', sa.Column('destination_data_source_instance_id_COPY', sa.String(), nullable=True))
    op.add_column('loader', sa.Column('ids_data_source_instance_id_COPY', sa.String(), nullable=True))

    # Pre-populate the copy fields with data_source_instance.name values
    conn.execute(
        text("""
        UPDATE loader
        SET source_data_source_instance_id_COPY = (
            SELECT name FROM data_source_instance 
            WHERE data_source_instance.id = loader.source_data_source_instance_id
        )
        WHERE source_data_source_instance_id IS NOT NULL
        """)
    )
    
    conn.execute(
        text("""
        UPDATE loader
        SET destination_data_source_instance_id_COPY = (
            SELECT name FROM data_source_instance 
            WHERE data_source_instance.id = loader.destination_data_source_instance_id
        )
        WHERE destination_data_source_instance_id IS NOT NULL
        """)
    )
    
    conn.execute(
        text("""
        UPDATE loader
        SET ids_data_source_instance_id_COPY = (
            SELECT name FROM data_source_instance 
            WHERE data_source_instance.id = loader.ids_data_source_instance_id
        )
        WHERE ids_data_source_instance_id IS NOT NULL
        """)
    )

    # Drop foreign key constraints
    op.drop_constraint('fk_loader_source_data_source_instance', 'loader', type_='foreignkey')
    op.drop_constraint('fk_loader_destination_data_source_instance', 'loader', type_='foreignkey')
    op.drop_constraint('fk_loader_data_source_instance', 'loader', type_='foreignkey')

    # Drop the original columns
    op.drop_column('loader', 'source_data_source_instance_id')
    op.drop_column('loader', 'destination_data_source_instance_id')
    op.drop_column('loader', 'ids_data_source_instance_id')

    # Rename the copy columns to the original names
    op.alter_column('loader', 'source_data_source_instance_id_COPY', new_column_name='source_data_source_instance_id')
    op.alter_column('loader', 'destination_data_source_instance_id_COPY', new_column_name='destination_data_source_instance_id')
    op.alter_column('loader', 'ids_data_source_instance_id_COPY', new_column_name='ids_data_source_instance_id')

    # Update data_source_instance.id ready to take string values
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

    # Drop the now old name column
    op.drop_column('data_source_instance', 'name')
    
    # Re-create foreign key constraints for loader table
    op.create_foreign_key(
        'fk_loader_source_data_source_instance',
        'loader', 'data_source_instance',
        ['source_data_source_instance_id'], ['id']
    )
    op.create_foreign_key(
        'fk_loader_destination_data_source_instance',
        'loader', 'data_source_instance',
        ['destination_data_source_instance_id'], ['id']
    )
    op.create_foreign_key(
        'fk_loader_data_source_instance',
        'loader', 'data_source_instance',
        ['ids_data_source_instance_id'], ['id']
    )


    """
    Add ui_api_details field to data_source_instance table and add for tol_production and tolqc_production instances
    1. Create new `api_details` field to data_source_instance table
    2. Update api_details field to data_source_instance table for 'tol_production'
    3. Update tolqc id to be more specific
    4. Update api_details for 'tolqc_production' data source instance
    """

    # Create new `api_details` field to data_source_instance table
    op.add_column('data_source_instance', sa.Column('ui_api_details', JSONB, nullable=True))

    # Update api_details field to data_source_instance table
    conn.execute(
        text("""
        UPDATE data_source_instance
        SET ui_api_details = '{"url": "https://portal.tol.sanger.ac.uk", "apiPath": "/api/v1", "apiDataPath": "/data", "dataspace": "tol_production"}'
        WHERE id = 'tol_production'
        """)
    )

    # Update tolqc id to be more specific
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


    """
    Migrate component and zone tables to use data_source_instance foreign keys
    1. Remove old `datasource` fields
    2. Create new `data_source_instance_id` fields in their places,
       with foreign keys linking to the `data_source_instance` table
    3. Pre-populate `datasource_instance_id` fields with 'tol_production'
    4. Set columns as NOT NULL now that data is populated
    """

    # Remove `datasource` fields
    op.drop_column('component', 'datasource')
    op.drop_column('zone', 'datasource')

    # Create new `data_source_instance_id` fields in their places,
    # with foreign keys linking to the `data_source_instance` table
    op.add_column('component', sa.Column('data_source_instance_id', sa.String, nullable=True))
    op.create_foreign_key(
        'fk_component_data_source_instance',
        'component', 'data_source_instance',
        ['data_source_instance_id'], ['id']
    )
    op.add_column('zone', sa.Column('data_source_instance_id', sa.String, nullable=True))
    op.create_foreign_key(
        'fk_zone_data_source_instance',
        'zone', 'data_source_instance',
        ['data_source_instance_id'], ['id']
    )

    # Pre-populate `datasource_instance_id` fields with 'tol-production'
    conn.execute(
        text("""
        UPDATE component
        SET data_source_instance_id='tol_production'
        """)
    )
    conn.execute(
        text("""
        UPDATE zone
        SET data_source_instance_id='tol_production'
        """)
    )

    # Set columns as NOT NULL now that data is populated
    op.alter_column('component', 'data_source_instance_id', nullable=False)
    op.alter_column('zone', 'data_source_instance_id', nullable=False)


def downgrade() -> None:
    pass