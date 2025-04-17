"""added bioscan extra new pantheon species bioscan qc specimen and bioscan uksi entry

Revision ID: 1d6f32212917
Revises: a725ad636622
Create Date: 2025-04-16 14:11:11.604845

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.orm import Session


# revision identifiers, used by Alembic.
revision = '1d6f32212917'
down_revision = 'a725ad636622'
branch_labels = None
depends_on = None


def upgrade() -> None:
        
    bind = op.get_bind()
    session = Session(bind=bind)

    result = session.execute(
        sa.text("INSERT INTO data_source_instance (name, builtin_name) VALUES ('bioscan_qc', 'bioscan_qc') RETURNING id")
    )
    bioscan_qc_datasource_instance_id = result.scalar()

    op.execute('INSERT INTO loader (source_data_source_instance_id, source_object_type, destination_data_source_instance_id, destination_object_type, object_filters, convert_class, prefix) '
        f'VALUES ({bioscan_qc_datasource_instance_id}, \'uksi_entry\', 1, \'species\', \'{{}}\', \'BioscanQcUksiEntryToElasticSpeciesUpdateConverter\', \'bioscan_qc\')')

    op.execute('INSERT INTO loader (source_data_source_instance_id, source_object_type, destination_data_source_instance_id, destination_object_type, object_filters, convert_class, prefix) '
        f'VALUES ({bioscan_qc_datasource_instance_id}, \'specimen\', 1, \'species\', \'{{}}\', \'BioscanQcSpecimenToElasticSpeciesUpdateConverter\', \'bioscan_qc\')')
    
    op.execute('INSERT INTO loader (source_data_source_instance_id, source_object_type, destination_data_source_instance_id, destination_object_type, object_filters, convert_class, prefix) '
        f'VALUES (10, \'new_pantheon_species\', 1, \'species\', \'{{}}\', \'BioscanExtraNewPantheonSpeciesToElasticSpeciesUpdateConverter\', \'bioscan_extra\')')


def downgrade() -> None:
    pass
