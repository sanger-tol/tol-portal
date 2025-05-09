"""load via ids

Revision ID: a6742154c867
Revises: 7e234da3d49e
Create Date: 2025-05-07 10:08:18.647705

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Session

# revision identifiers, used by Alembic.
revision = 'a6742154c867'
down_revision = 'b514ce799491'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        'loader',
        sa.Column('frequency_weekly', sa.Boolean, nullable=True)
    )
    op.add_column(
        'loader',
        sa.Column('frequency_daily', sa.Boolean, nullable=True)
    )
    op.add_column(
        'loader',
        sa.Column('frequency_hourly', sa.Boolean, nullable=True)
    )
    op.add_column(
        'loader',
        sa.Column('frequency_quarter_hourly', sa.Boolean, nullable=True)
    )
    op.execute(
        sa.text(
            "UPDATE loader SET frequency_daily = true where frequency = 'daily'"
        )
    )
    op.execute(
        sa.text(
            "UPDATE loader SET frequency_hourly = true where frequency = 'hourly'"
        )
    )
    op.execute(
        sa.text(
            "UPDATE loader SET frequency_quarter_hourly = true where frequency = 'quarter_hourly'"
        )
    )
    op.add_column(
        'loader',
        sa.Column('ids_data_source_instance_id', sa.Integer, nullable=True)
    )
    op.add_column(
        'loader',
        sa.Column('ids_object_type', sa.String, nullable=True)
    )
    op.add_column(
        'loader',
        sa.Column('ids_attribute', sa.String, nullable=True)
    )
    op.add_column(
        'loader',
        sa.Column('ids_object_filters', JSONB, nullable=True)
    )
    op.add_column(
        'loader',
        sa.Column('ids_sort_by', sa.String, nullable=True)
    )
    op.add_column(
        'loader',
        sa.Column('ids_attribute_in_source', sa.String, nullable=True)
    )

    bind = op.get_bind()
    session = Session(bind=bind)

    result = session.execute(
        sa.text("INSERT INTO data_source_instance (name, builtin_name) VALUES ('bold', 'bold') RETURNING id")
    )
    bold_data_source_instance_id = result.scalar()
    result = session.execute(
        sa.text("INSERT INTO data_source_instance (name, builtin_name) VALUES ('labwhere', 'labwhere') RETURNING id")
    )
    labwhere_data_source_instance_id = result.scalar()

    op.execute(
        'UPDATE loader '
        'SET frequency_daily = true '
        'WHERE frequency = \'daily\''
    )
    op.execute(
        'UPDATE loader '
        'SET frequency_hourly = true '
        'WHERE frequency = \'hourly\''
    )
    op.execute(
        'UPDATE loader '
        'SET frequency_quarter_hourly = true '
        'WHERE frequency = \'quarter_hourly\''
    )
    op.drop_column(
        'loader',
        'frequency')

    op.execute(
        'UPDATE loader '
        'SET object_filters = jsonb_build_object(\'and_\', object_filters) '
        'WHERE object_filters IS NOT NULL'
    )

    # elastic_run_data_mlwh - Illumina
    op.execute('INSERT INTO loader (source_data_source_instance_id, source_object_type, destination_data_source_instance_id, destination_object_type, object_filters, convert_class, prefix, frequency_daily, ids_data_source_instance_id, ids_object_type, ids_attribute, ids_object_filters, ids_sort_by, ids_attribute_in_source) '
               'VALUES (6, \'run_data\', 1, \'run_data\', \'{"and_": {"platform_type": {"eq": {"value": "Illumina"}}}}\', \'MlwhRunDataToElasticRunDataConverter\', \'mlwh\','
               'true, 9, \'project\', \'study_id\', null, null, \'study_id\')')

    # elastic_run_data_mlwh - Pacbio
    op.execute('INSERT INTO loader (source_data_source_instance_id, source_object_type, destination_data_source_instance_id, destination_object_type, object_filters, convert_class, prefix, frequency_daily, ids_data_source_instance_id, ids_object_type, ids_attribute, ids_object_filters, ids_sort_by, ids_attribute_in_source) '
               'VALUES (6, \'run_data\', 1, \'run_data\', \'{"and_":{"platform_type": {"eq": {"value": "PacBio"}}}}\', \'MlwhRunDataToElasticRunDataConverter\', \'mlwh\','
               'true, 9, \'project\', \'study_id\', null, null, \'study_id\')')

    # elastic_seq_req_mlwh
    op.execute('INSERT INTO loader (source_data_source_instance_id, source_object_type, destination_data_source_instance_id, destination_object_type, object_filters, convert_class, prefix, frequency_daily, ids_data_source_instance_id, ids_object_type, ids_attribute, ids_object_filters, ids_sort_by, ids_attribute_in_source) '
               'VALUES (6, \'sequencing_request\', 1, \'sequencing_request\', null, \'MlwhSequencingRequestToElasticSequencingRequestConverter\', \'mlwh\','
               'true, 9, \'project\', \'study_id\', null, null, \'study_id\')')

    # elastic_seq_req_mlwh - BIOSCAN
    op.execute('INSERT INTO loader (source_data_source_instance_id, source_object_type, destination_data_source_instance_id, destination_object_type, object_filters, convert_class, prefix, frequency_daily, ids_data_source_instance_id, ids_object_type, ids_attribute, ids_object_filters, ids_sort_by, ids_attribute_in_source) '
               'VALUES (6, \'sequencing_request\', 1, \'sequencing_request\', null, \'MlwhSequencingRequestToElasticSequencingRequestConverter\', \'mlwh\','
               'true, 6, \'study\', \'study_id_lims\', \'{"and_": {"abbreviation": {"in_list": {"value": ["BIOSCAN"]}}}}\', null, \'study_id\')')

    # elastic_curation_grit
    op.execute('INSERT INTO loader (source_data_source_instance_id, source_object_type, destination_data_source_instance_id, destination_object_type, object_filters, convert_class, prefix, candidate_key, frequency_daily, ids_data_source_instance_id, ids_object_type, ids_attribute, ids_object_filters, ids_sort_by, ids_attribute_in_source) '
               'VALUES (1, \'tolid\', 1, \'curation\', null, \'ElasticTolidToElasticCurationUpdateConverter\', \'grit\',\'["grit_tolid.id"]\','
               'true, 1, \'curation\', \'grit_tolid.id\', \'{"and_": {"grit_tolid.id": {"exists": {}}}}\', null, null)')

    # elastic_location_labwhere
    op.execute('INSERT INTO loader (source_data_source_instance_id, source_object_type, destination_data_source_instance_id, destination_object_type, object_filters, convert_class, prefix, candidate_key, frequency_daily, ids_data_source_instance_id, ids_object_type, ids_attribute, ids_object_filters, ids_sort_by, ids_attribute_in_source) '
               f'VALUES ({labwhere_data_source_instance_id}, \'location\', 1, \'sample\', null, \'LabwhereLocationToElasticSampleUpdateConverter\', \'sts_labwhere\',\'["sts_location"]\','
               'true, 1, \'sample\', \'sts_location\', \'{"and_":{"sts_location": {"exists": {}}}}\', null, null)')

    # elastic_project_sts
    op.execute('INSERT INTO loader (source_data_source_instance_id, source_object_type, destination_data_source_instance_id, destination_object_type, object_filters, convert_class, prefix, candidate_key, frequency_daily, ids_data_source_instance_id, ids_object_type, ids_attribute, ids_object_filters, ids_sort_by, ids_attribute_in_source) '
               'VALUES (2, \'project\', 1, \'sample\', null, \'StsProjectToElasticSampleUpdateConverter\', \'\',\'["sts_project"]\','
               'true, 1, \'sample\', \'sts_project\', \'{"and_":{"sts_project": {"exists": {}}}}\', \'target_coverage\', null)')

    # elastic_sample_bold
    op.execute('INSERT INTO loader (source_data_source_instance_id, source_object_type, destination_data_source_instance_id, destination_object_type, object_filters, convert_class, prefix, candidate_key, frequency_daily, ids_data_source_instance_id, ids_object_type, ids_attribute, ids_object_filters, ids_sort_by, ids_attribute_in_source) '
               f'VALUES ({bold_data_source_instance_id}, \'sample\', 1, \'sample\', null, \'BoldSampleToElasticSampleUpdateConverter\', \'bold\',\'["sts_specimen.id"]\','
               'true, 1, \'sample\', \'sts_specimen.id\', \'{"and_":{"sts_project": {"eq": {"value": "BIOSCAN"}}}}\', null, null)')

    # elastic_sequencing_request_volume_mlwh
    op.execute('INSERT INTO loader (source_data_source_instance_id, source_object_type, destination_data_source_instance_id, destination_object_type, object_filters, convert_class, prefix, candidate_key, frequency_daily, ids_data_source_instance_id, ids_object_type, ids_attribute, ids_object_filters, ids_sort_by, ids_attribute_in_source) '
               'VALUES (6, \'sequencing_request_volume\', 1, \'sequencing_request\', null, null, \'mlwh\',null,'
               'true, 1, \'sequencing_request\', \'id\', null, null, null)')


def downgrade() -> None:
    pass
