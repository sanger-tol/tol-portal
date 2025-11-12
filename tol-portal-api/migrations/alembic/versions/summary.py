"""summary table

Revision ID: 5e94af5fc651
Revises: abc65fe1da64
Create Date: 2025-03-10 14:39:15.022094

"""
from alembic import op
import sqlalchemy as sa

from sqlalchemy.dialects.postgresql import JSONB

# revision identifiers, used by Alembic.
revision = '5e94af5fc651'
down_revision = 'abc65fe1da64'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'summary',
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('source_object_type', sa.String, nullable=False),
        sa.Column('destination_object_type', sa.String, nullable=False),
        sa.Column('object_filters', JSONB, nullable=False, default={}),
        sa.Column('group_by', JSONB, nullable=False, default=[]),
        sa.Column('stats_fields', JSONB, nullable=False, default=[]),
        sa.Column('stats', JSONB, nullable=False, default=[]),
        sa.Column('prefix', sa.String, nullable=False, default=''),
    )

    # elastic_extraction_summariser.load_sequencing_request_stats()
    op.execute('INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) '
               'VALUES (\'sequencing_request\', \'extraction\', \'{"portaldb_date_abandoned": {"exists": {"negate": true}}}\', \'["benchling_extraction.id"]\', \'["mlwh_volume_remaining"]\', \'["min", "max"]\', \'benchling\')')

    # elastic_sample_summariser.load_tissue_prep_date_stats()
    op.execute('INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) '
               'VALUES (\'tissue_prep\', \'sample\', \'{}\', \'["benchling_sample.id"]\', \'["benchling_sampleprep_date"]\', \'["min", "max"]\', \'benchling\')')

    # elastic_sample_summariser.load_sequencing_request_labwork_stats()
    op.execute('INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) '
               'VALUES (\'sequencing_request\', \'sample\', \'{}\', \'["benchling_sample.id", "benchling_sequencing_platform"]\', \'["benchling_completion_date"]\', \'["min", "max"]\', \'benchling\')')

    # elastic_sample_summariser.load_sequencing_request_stats()
    op.execute('INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) '
               'VALUES (\'sequencing_request\', \'sample\', \'{"portaldb_date_abandoned": {"exists": {"negate": true}}}\', \'["benchling_sample.id"]\', \'["benchling_completion_date", "mlwh_volume_remaining"]\', \'["min", "max"]\', \'benchling\')')
    
    # elastic_sample_summariser.load_sequencing_request_mlwh_stats()
    op.execute('INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) '
               'VALUES (\'sequencing_request\', \'sample\', \'{}\', \'["mlwh_sample.id"]\', \'["mlwh_order_date"]\', \'["min", "max"]\', \'mlwh\')')
    
    # elastic_sample_summariser.load_extraction_stats()
    op.execute('INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) '
               'VALUES (\'extraction\', \'sample\', \'{"portaldb_date_abandoned": {"exists": {"negate": true}}}\', \'["benchling_sample.id"]\', \'["benchling_volume_ul"]\', \'["min", "max"]\', \'benchling\')')
    
    # elastic_sample_summariser.load_tissue_prep_stats()
    op.execute('INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) '
               'VALUES (\'tissue_prep\', \'sample\', \'{"portaldb_date_abandoned": {"exists": {"negate": true}}}\', \'["benchling_sample.id"]\', \'["benchling_weight_mg"]\', \'["min", "max"]\', \'benchling\')')
    
    # elastic_sampleset_summariser.load_sample_stats()
    op.execute('INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) '
               'VALUES (\'sample\', \'sampleset\', \'{}\', \'["sts_sampleset.id"]\', \'["sts_receive_date", "sts_accept_date"]\', \'["min", "max"]\', \'sts\')')

    # elastic_sequencing_request_summariser.load_run_data_stats()
    op.execute('INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) '
               'VALUES (\'run_data\', \'sequencing_request\', \'{}\', \'["mlwh_sequencing_request.id"]\', \'["mlwh_hifi_read_bases"]\', \'["sum"]\', \'mlwh\')')

    # elastic_sequencing_request_summariser.load_run_data_labwork_stats()
    op.execute('INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) '
               'VALUES (\'run_data\', \'sequencing_request\', \'{}\', \'["mlwh_sequencing_request.id"]\', \'["mlwh_run_complete"]\', \'["min", "max"]\', \'mlwh\')')

    # elastic_species_summariser.load_sample_stats()
    op.execute('INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) '
               'VALUES (\'sample\', \'species\', \'{}\', \'["sts_species.id"]\', \'["sts_accept_date", "sts_col_date", "sts_priority", "sts_receive_date", "sts_submit_date", "sts_tollab_assign_date", "benchling_date_assigned_to_lab"]\', \'["min", "max"]\', \'sts\')')

    # elastic_species_summariser.load_tolid_stats()
    op.execute('INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) '
               'VALUES (\'tolid\', \'species\', \'{}\', \'["tolid_species.id"]\', \'["informatics_status", "informatics_status_summary"]\', \'["min", "max"]\', \'informatics\')')

    # elastic_species_summariser.load_sample_project_stats()
    op.execute('INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) '
               'VALUES (\'sample\', \'species\', \'{}\', \'["sts_species.id"]\', \'["sts_gal_name", "sts_project", "sts_programme"]\', \'["union"]\', \'sts\')')

    # elastic_species_summariser.load_extraction_stats()
    op.execute('INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) '
               'VALUES (\'extraction\', \'species\', \'{}\', \'["benchling_species.id"]\', \'["benchling_completion_date"]\', \'["min", "max"]\', \'benchling\')')

    # elastic_species_summariser.load_run_data_stats()
    op.execute('INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) '
               'VALUES (\'run_data\', \'species\', \'{}\', \'["mlwh_species.id"]\', \'["mlwh_hifi_read_bases"]\', \'["sum"]\', \'mlwh\')')

    # elastic_species_summariser.load_sample_remaining_weight_stats()
    op.execute('INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) '
               'VALUES (\'sample\', \'species\', \'{"portaldb_date_abandoned": {"exists": {"negate": true}}}\', \'["benchling_species.id"]\', \'["benchling_remaining_weight"]\', \'["min", "max", "sum"]\', \'benchling\')')

    # elastic_species_summariser.load_extraction_volume_stats()
    op.execute('INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) '
               'VALUES (\'extraction\', \'species\', \'{"portaldb_date_abandoned": {"exists": {"negate": true}}}\', \'["benchling_species.id"]\', \'["benchling_volume_ul"]\', \'["min", "max", "sum"]\', \'benchling\')')

    # elastic_species_summariser.load_tissue_prep_weight_stats()
    op.execute('INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) '
               'VALUES (\'tissue_prep\', \'species\', \'{"portaldb_date_abandoned": {"exists": {"negate": true}}}\', \'["benchling_species.id"]\', \'["benchling_weight_mg"]\', \'["min", "max", "sum"]\', \'benchling\')')

    # elastic_species_summariser.load_tissue_prep_date_stats()
    op.execute('INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) '
               'VALUES (\'tissue_prep\', \'species\', \'{}\', \'["benchling_species.id"]\', \'["benchling_sampleprep_date"]\', \'["min", "max"]\', \'benchling\')')

    # elastic_species_summariser.load_sequencing_request_labwork_stats()
    op.execute('INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) '
               'VALUES (\'sequencing_request\', \'species\', \'{}\', \'["benchling_species.id", "benchling_sequencing_platform"]\', \'["benchling_completion_date"]\', \'["min", "max"]\', \'benchling\')')

    # elastic_species_summariser.load_run_data_labwork_stats()
    op.execute('INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) '
               'VALUES (\'run_data\', \'species\', \'{}\', \'["mlwh_species.id", "tolqc_reporting_category"]\', \'["mlwh_run_complete"]\', \'["min", "max"]\', \'mlwh\')')

    # elastic_species_summariser.load_tolid_stats_tolid()
    op.execute('INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) '
               'VALUES (\'tolid\', \'species\', \'{"portaldb_date_abandoned": {"exists": {"negate": true}}}\', \'["tolid_species.id"]\', \'[]\', \'[]\', \'tolid\')')

    # elastic_species_summariser.load_curation_date_stats()
    op.execute('INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) '
               'VALUES (\'curation\', \'species\', \'{}\', \'["grit_species.id"]\', \'["grit_created", "grit_done_date", "grit_open_date", "grit_in_submission_date"]\', \'["min", "max"]\', \'grit\')')

    # elastic_species_summariser.load_genome_note_stats()
    op.execute('INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) '
               'VALUES (\'genome_note\', \'species\', \'{}\', \'["gn_species.id"]\', \'["gn_date_published"]\', \'["min", "max"]\', \'gn\')')

    # elastic_species_summariser.load_topup_management_stats()
    op.execute('INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) '
               'VALUES (\'tolid\', \'species\', \'{"portaldb_date_abandoned": {"exists": {"negate": true}}}\', \'["tolid_species.id"]\', \'["calc_topup_required", "calc_individual_exhausted"]\', \'["min", "max"]\', \'calc\')')

    # elastic_species_summariser.load_calc_topup_required_count()
    op.execute('INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) '
               'VALUES (\'tolid\', \'species\', \'{"portaldb_date_abandoned": {"exists": {"negate": true}}, "calc_topup_required": {"in_list": {"value": ["true"]}}}\', \'["tolid_species.id"]\', \'["calc_topup_required"]\', \'["value_count"]\', \'calc_topup_required\')')

    # elastic_species_summariser.load_calc_individual_exhausted_count()
    op.execute('INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) '
               'VALUES (\'tolid\', \'species\', \'{"portaldb_date_abandoned": {"exists": {"negate": true}}, "calc_individual_exhausted": {"in_list": {"value": ["true"]}}}\', \'["tolid_species.id"]\', \'["calc_individual_exhausted"]\', \'["value_count"]\', \'calc_individual_exhausted\')')

    # elastic_specimen_summariser.load_run_data_stats()
    op.execute('INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) '
               'VALUES (\'run_data\', \'specimen\', \'{}\', \'["mlwh_specimen.id"]\', \'["mlwh_hifi_read_bases"]\', \'["sum"]\', \'mlwh\')')

    # elastic_specimen_summariser.load_sample_stats()
    op.execute('INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) '
               'VALUES (\'sample\', \'specimen\', \'{}\', \'["sts_specimen.id"]\', \'["sts_col_date", "sts_receive_date", "sts_submit_date"]\', \'["min", "max"]\', \'sts\')')

    # elastic_tissue_prep_summariser.load_extraction_stats()
    op.execute('INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) '
               'VALUES (\'extraction\', \'tissue_prep\', \'{"portaldb_date_abandoned": {"exists": {"negate": true}}}\', \'["benchling_tissue_prep.id"]\', \'["benchling_volume_ul"]\', \'["min", "max"]\', \'benchling\')')

    # elastic_tissue_prep_summariser.load_sequencing_request_stats()
    op.execute('INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) '
               'VALUES (\'sequencing_request\', \'tissue_prep\', \'{"portaldb_date_abandoned": {"exists": {"negate": true}}}\', \'["benchling_tissue_prep.id"]\', \'["mlwh_volume_remaining"]\', \'["min", "max"]\', \'benchling\')')

    # elastic_tolid_summariser.load_run_data_stats()
    op.execute('INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) '
               'VALUES (\'run_data\', \'tolid\', \'{}\', \'["mlwh_tolid.id"]\', \'["mlwh_hifi_read_bases"]\', \'["sum"]\', \'mlwh\')')

    # elastic_tolid_summariser.load_sample_stats()
    op.execute('INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) '
               'VALUES (\'sample\', \'tolid\', \'{}\', \'["sts_tolid.id"]\', \'["sts_accept_date", "sts_col_date", "sts_priority", "sts_receive_date", "sts_submit_date", "sts_tollab_assign_date", "benchling_date_assigned_to_lab", "sts_target_coverage"]\', \'["min", "max"]\', \'sts\')')

    # elastic_tolid_summariser.load_extraction_stats()
    op.execute('INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) '
               'VALUES (\'extraction\', \'tolid\', \'{"portaldb_date_abandoned": {"exists": {"negate": true}}}\', \'["benchling_tolid.id"]\', \'["calc_dna_volume_remaining", "benchling_volume_ul"]\', \'["min", "max"]\', \'benchling\')')

    # elastic_tolid_summariser.load_sample_project_stats()
    op.execute('INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) '
               'VALUES (\'sample\', \'tolid\', \'{}\', \'["sts_tolid.id"]\', \'["sts_project", "sts_programme"]\', \'["union"]\', \'sts\')')

    # elastic_tolid_summariser.load_run_complete_stats()
    op.execute('INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) '
               'VALUES (\'run_data\', \'tolid\', \'{}\', \'["mlwh_tolid.id"]\', \'["mlwh_run_complete"]\', \'["min", "max"]\', \'mlwh\')')

    # elastic_tolid_summariser.load_tissue_prep_stats()
    op.execute('INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) '
               'VALUES (\'tissue_prep\', \'tolid\', \'{"portaldb_date_abandoned": {"exists": {"negate": true}}}\', \'["benchling_tolid.id"]\', \'["benchling_sampleprep_date", "benchling_weight_mg"]\', \'["min", "max"]\', \'benchling\')')

    # elastic_tolid_summariser.load_curation_date_stats()
    op.execute('INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) '
               'VALUES (\'curation\', \'tolid\', \'{}\', \'["grit_tolid.id"]\', \'["grit_created", "grit_done_date"]\', \'["min", "max"]\', \'grit\')')

    # elastic_tolid_summariser.load_pacbio_stats()
    op.execute('INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) '
               'VALUES (\'sequencing_request\', \'tolid\', \'{"benchling_sequencing_platform": {"eq": {"value": "pacbio"}}}\', \'["benchling_tolid.id"]\', \'[]\', \'[]\', \'benchling_pacbio\')')
    op.execute('INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) '
               'VALUES (\'sequencing_request\', \'tolid\', \'{"benchling_sequencing_platform": {"exists": {"negate": true}}, "mlwh_run_data_count": {"gte": {"value": 1}}}\', \'["benchling_tolid.id"]\', \'[]\', \'[]\', \'benchling_pacbio_completed\')')

    # elastic_tolid_summariser.load_sequencing_request_stats()
    op.execute('INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) '
               'VALUES (\'sequencing_request\', \'tolid\', \'{"portaldb_date_abandoned": {"exists": {"negate": true}}}\', \'["benchling_tolid.id"]\', \'["mlwh_volume_remaining"]\', \'["min", "max"]\', \'benchling\')')

    # elastic_tolid_summariser.load_tissue_remaining_stats()
    op.execute('INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) '
               'VALUES (\'sample\', \'tolid\', \'{"portaldb_date_abandoned": {"exists": {"negate": true}}}\', \'["benchling_tolid.id"]\', \'["benchling_remaining_weight"]\', \'["min", "max"]\', \'benchling\')')



def downgrade() -> None:
    pass
