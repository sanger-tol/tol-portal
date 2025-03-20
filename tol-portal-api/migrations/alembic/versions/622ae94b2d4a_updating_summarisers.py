"""updating summarisers

Revision ID: 622ae94b2d4a
Revises: 291513b88fa3
Create Date: 2025-03-19 16:22:01.728631

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '622ae94b2d4a'
down_revision = '291513b88fa3'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Remove portaldb_date_abandoned filter from all entries
    op.execute("UPDATE summary SET object_filters = '{}' WHERE object_filters::text LIKE '%portaldb_date_abandoned%'")

    # Fix field prefix for tolid summariser
    op.execute("UPDATE summary SET prefix = 'calc' WHERE source_object_type = 'sample' AND destination_object_type = 'tolid' AND prefix = 'benchling' AND stats_fields::text LIKE '%benchling_remaining_weight%'")

    # Fix field prefix for species summariser
    op.execute("UPDATE summary SET prefix = 'calc' WHERE source_object_type = 'sample' AND destination_object_type = 'species' AND prefix = 'benchling' AND stats_fields::text LIKE '%benchling_remaining_weight%'")
    op.execute("UPDATE summary SET prefix = 'calc' WHERE source_object_type = 'extraction' AND destination_object_type = 'species' AND prefix = 'benchling' AND stats_fields::text LIKE '%benchling_volume_ul%'")
    op.execute("UPDATE summary SET prefix = 'calc' WHERE source_object_type = 'tissue_prep' AND destination_object_type = 'species' AND prefix = 'benchling' AND stats_fields::text LIKE '%benchling_weight_mg%'")

    # Fix field prefix for sample summariser
    op.execute("UPDATE summary SET prefix = 'calc' WHERE source_object_type = 'extraction' AND destination_object_type = 'sample' AND prefix = 'benchling' AND stats_fields::text LIKE '%benchling_volume_ul%'")
    op.execute("UPDATE summary SET prefix = 'calc' WHERE source_object_type = 'tissue_prep' AND destination_object_type = 'sample' AND prefix = 'benchling' AND stats_fields::text LIKE '%benchling_weight_mg%'")

    # Fix field prefix for tissue_prep summariser
    op.execute("UPDATE summary SET prefix = 'calc' WHERE source_object_type = 'extraction' AND destination_object_type = 'tissue_prep' AND prefix = 'benchling' AND stats_fields::text LIKE '%benchling_volume_ul%'")
    op.execute("UPDATE summary SET prefix = 'calc' WHERE source_object_type = 'sequencing_request' AND destination_object_type = 'tissue_prep' AND prefix = 'benchling' AND stats_fields::text LIKE '%mlwh_volume_remaining%'")
    
    # Fix field prefix for extraction summariser
    op.execute("UPDATE summary SET prefix = 'calc' WHERE source_object_type = 'sequencing_request' AND destination_object_type = 'extraction' AND prefix = 'benchling' AND stats_fields::text LIKE '%mlwh_volume_remaining%'")
    
    # Fix group_by to include extraction_type
    op.execute("UPDATE summary SET group_by = '[\"benchling_sample.id\", \"benchling_extraction_type\"]' WHERE source_object_type = 'extraction' AND destination_object_type = 'sample' AND stats_fields::text LIKE '%benchling_volume_ul%'")
    op.execute("UPDATE summary SET group_by = '[\"benchling_species.id\", \"benchling_extraction_type\"]' WHERE source_object_type = 'extraction' AND destination_object_type = 'species' AND stats_fields::text LIKE '%benchling_volume_ul%'")
    op.execute("UPDATE summary SET group_by = '[\"benchling_tissue_prep.id\", \"benchling_extraction_type\"]' WHERE source_object_type = 'extraction' AND destination_object_type = 'tissue_prep' AND stats_fields::text LIKE '%benchling_volume_ul%'")  
    
    # Add missing elastic_extraction_summariser.load_sequencing_request_mlwh_volume stats
    op.execute("INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) "
               "VALUES ('sequencing_request', 'sample', '{}', '[\"benchling_sample.id\"]', '[\"calc_mlwh_volume_remaining\"]', '[\"min\", \"max\"]', 'calc')")

    # Add missing elastic_species_summariser.load_sequencing_request_lrpacbio_library_remaining_stats
    op.execute("INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) "
               "VALUES ('sequencing_request', 'species', '{}', '[\"benchling_species.id\"]', '[\"lrpacbio_library_remaining\"]', '[\"sum\"]', 'benchling')")
    
    # Add missing elastic_tolid_summariser.load_extraction_volume_stats()
    op.execute("INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) "
               "VALUES ('extraction', 'tolid', '{}', '[\"benchling_tolid.id\", \"benchling_extraction_type\"]', '[\"calc_benchling_volume_ul\"]', '[\"min\", \"max\"]', 'calc')")
    
    # Fix tissue_prep_date_stats and tissue_prep_stats for tolid (separate them)
    op.execute("UPDATE summary SET stats_fields = '[\"benchling_sampleprep_date\"]' WHERE source_object_type = 'tissue_prep' AND destination_object_type = 'tolid' AND stats_fields::text LIKE '%benchling_sampleprep_date%' AND stats_fields::text LIKE '%benchling_weight_mg%'")
    op.execute("INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) "
               "VALUES ('tissue_prep', 'tolid', '{}', '[\"benchling_tolid.id\"]', '[\"calc_benchling_weight_mg\"]', '[\"min\", \"max\"]', 'calc')")
    
    # Update stats_fields to match the correct field names
    op.execute("UPDATE summary SET stats_fields = '[\"calc_mlwh_volume_remaining\"]' WHERE source_object_type = 'sequencing_request' AND destination_object_type = 'tissue_prep' AND stats_fields = '[\"mlwh_volume_remaining\"]'")
    op.execute("UPDATE summary SET stats_fields = '[\"calc_mlwh_volume_remaining\"]' WHERE source_object_type = 'sequencing_request' AND destination_object_type = 'extraction' AND stats_fields = '[\"mlwh_volume_remaining\"]'")
    op.execute("UPDATE summary SET stats_fields = '[\"calc_mlwh_volume_remaining\"]' WHERE source_object_type = 'sequencing_request' AND destination_object_type = 'tolid' AND stats_fields = '[\"mlwh_volume_remaining\"]'")

    op.execute("UPDATE summary SET stats_fields = '[\"calc_benchling_volume_ul\"]' WHERE source_object_type = 'extraction' AND destination_object_type = 'sample' AND stats_fields = '[\"benchling_volume_ul\"]'")
    op.execute("UPDATE summary SET stats_fields = '[\"calc_benchling_volume_ul\"]' WHERE source_object_type = 'extraction' AND destination_object_type = 'tissue_prep' AND stats_fields = '[\"benchling_volume_ul\"]'")
    op.execute("UPDATE summary SET stats_fields = '[\"calc_benchling_volume_ul\"]' WHERE source_object_type = 'extraction' AND destination_object_type = 'species' AND stats_fields = '[\"benchling_volume_ul\"]'")
    
    op.execute("UPDATE summary SET stats_fields = '[\"calc_benchling_weight_mg\"]' WHERE source_object_type = 'tissue_prep' AND destination_object_type = 'sample' AND stats_fields = '[\"benchling_weight_mg\"]'")
    op.execute("UPDATE summary SET stats_fields = '[\"calc_benchling_weight_mg\"]' WHERE source_object_type = 'tissue_prep' AND destination_object_type = 'species' AND stats_fields = '[\"benchling_weight_mg\"]'")
    op.execute("UPDATE summary SET stats_fields = '[\"calc_benchling_weight_mg\"]' WHERE source_object_type = 'tissue_prep' AND destination_object_type = 'tolid' AND stats_fields = '[\"benchling_weight_mg\"]'")

    op.execute("UPDATE summary SET stats_fields = '[\"calc_benchling_remaining_weight\"]' WHERE source_object_type = 'sample' AND destination_object_type = 'tolid' AND stats_fields = '[\"benchling_remaining_weight\"]'")
    op.execute("UPDATE summary SET stats_fields = '[\"calc_benchling_remaining_weight\"]' WHERE source_object_type = 'sample' AND destination_object_type = 'species' AND stats_fields = '[\"benchling_remaining_weight\"]'")

    # Fix special case for topup_required and individual_exhausted filters
    op.execute("UPDATE summary SET object_filters = '{\"calc_topup_required\": {\"in_list\": {\"value\": [\"true\"]}}}' WHERE source_object_type = 'tolid' AND destination_object_type = 'species' AND prefix = 'calc_topup_required'")
    op.execute("UPDATE summary SET object_filters = '{\"calc_individual_exhausted\": {\"in_list\": {\"value\": [\"true\"]}}}' WHERE source_object_type = 'tolid' AND destination_object_type = 'species' AND prefix = 'calc_individual_exhausted'")


def downgrade() -> None:
    # Store original portaldb_date_abandoned filters for specific entries
    op.execute("UPDATE summary SET object_filters = '{\"portaldb_date_abandoned\": {\"exists\": {\"negate\": true}}}' WHERE source_object_type = 'sequencing_request' AND destination_object_type = 'extraction'")
    op.execute("UPDATE summary SET object_filters = '{\"portaldb_date_abandoned\": {\"exists\": {\"negate\": true}}}' WHERE source_object_type = 'sequencing_request' AND destination_object_type = 'sample' AND stats_fields::text LIKE '%mlwh_volume_remaining%'")
    op.execute("UPDATE summary SET object_filters = '{\"portaldb_date_abandoned\": {\"exists\": {\"negate\": true}}}' WHERE source_object_type = 'extraction' AND destination_object_type = 'sample'")
    op.execute("UPDATE summary SET object_filters = '{\"portaldb_date_abandoned\": {\"exists\": {\"negate\": true}}}' WHERE source_object_type = 'tissue_prep' AND destination_object_type = 'sample'")
    op.execute("UPDATE summary SET object_filters = '{\"portaldb_date_abandoned\": {\"exists\": {\"negate\": true}}}' WHERE source_object_type = 'sample' AND destination_object_type = 'species' AND stats_fields::text LIKE '%remaining_weight%'")
    op.execute("UPDATE summary SET object_filters = '{\"portaldb_date_abandoned\": {\"exists\": {\"negate\": true}}}' WHERE source_object_type = 'extraction' AND destination_object_type = 'species' AND stats_fields::text LIKE '%volume_ul%'")
    op.execute("UPDATE summary SET object_filters = '{\"portaldb_date_abandoned\": {\"exists\": {\"negate\": true}}}' WHERE source_object_type = 'tissue_prep' AND destination_object_type = 'species' AND stats_fields::text LIKE '%weight_mg%'")
    op.execute("UPDATE summary SET object_filters = '{\"portaldb_date_abandoned\": {\"exists\": {\"negate\": true}}}' WHERE source_object_type = 'tolid' AND destination_object_type = 'species' AND prefix = 'tolid'")
    op.execute("UPDATE summary SET object_filters = '{\"portaldb_date_abandoned\": {\"exists\": {\"negate\": true}}}' WHERE source_object_type = 'extraction' AND destination_object_type = 'tolid'")
    op.execute("UPDATE summary SET object_filters = '{\"portaldb_date_abandoned\": {\"exists\": {\"negate\": true}}}' WHERE source_object_type = 'sequencing_request' AND destination_object_type = 'tolid' AND stats_fields::text LIKE '%volume_remaining%'")
    op.execute("UPDATE summary SET object_filters = '{\"portaldb_date_abandoned\": {\"exists\": {\"negate\": true}}}' WHERE source_object_type = 'tissue_prep' AND destination_object_type = 'tolid' AND stats_fields::text LIKE '%weight_mg%'")
    op.execute("UPDATE summary SET object_filters = '{\"portaldb_date_abandoned\": {\"exists\": {\"negate\": true}}}' WHERE source_object_type = 'extraction' AND destination_object_type = 'tissue_prep'")
    op.execute("UPDATE summary SET object_filters = '{\"portaldb_date_abandoned\": {\"exists\": {\"negate\": true}}}' WHERE source_object_type = 'sequencing_request' AND destination_object_type = 'tissue_prep'")
    
    # Restore special case filters for topup_required and individual_exhausted
    op.execute("UPDATE summary SET object_filters = '{\"portaldb_date_abandoned\": {\"exists\": {\"negate\": true}}, \"calc_topup_required\": {\"in_list\": {\"value\": [\"true\"]}}}' WHERE source_object_type = 'tolid' AND destination_object_type = 'species' AND prefix = 'calc_topup_required'")
    op.execute("UPDATE summary SET object_filters = '{\"portaldb_date_abandoned\": {\"exists\": {\"negate\": true}}, \"calc_individual_exhausted\": {\"in_list\": {\"value\": [\"true\"]}}}' WHERE source_object_type = 'tolid' AND destination_object_type = 'species' AND prefix = 'calc_individual_exhausted'")
    
    # Revert field prefix changes
    op.execute("UPDATE summary SET prefix = 'benchling' WHERE source_object_type = 'sample' AND destination_object_type = 'species' AND prefix = 'calc' AND stats_fields::text LIKE '%calc_benchling_remaining_weight%'")
    op.execute("UPDATE summary SET prefix = 'benchling' WHERE source_object_type = 'extraction' AND destination_object_type = 'species' AND prefix = 'calc' AND stats_fields::text LIKE '%calc_benchling_volume_ul%'")
    op.execute("UPDATE summary SET prefix = 'benchling' WHERE source_object_type = 'tissue_prep' AND destination_object_type = 'species' AND prefix = 'calc' AND stats_fields::text LIKE '%calc_benchling_weight_mg%'")
    op.execute("UPDATE summary SET prefix = 'benchling' WHERE source_object_type = 'extraction' AND destination_object_type = 'tolid' AND prefix = 'calc'")
    op.execute("UPDATE summary SET prefix = 'benchling' WHERE source_object_type = 'extraction' AND destination_object_type = 'sample' AND prefix = 'calc'")
    op.execute("UPDATE summary SET prefix = 'benchling' WHERE source_object_type = 'tissue_prep' AND destination_object_type = 'sample' AND prefix = 'calc'")
    op.execute("UPDATE summary SET prefix = 'benchling' WHERE source_object_type = 'extraction' AND destination_object_type = 'tissue_prep' AND prefix = 'calc'")
    op.execute("UPDATE summary SET prefix = 'benchling' WHERE source_object_type = 'sequencing_request' AND destination_object_type = 'tissue_prep' AND prefix = 'calc'")
    op.execute("UPDATE summary SET prefix = 'benchling' WHERE source_object_type = 'sequencing_request' AND destination_object_type = 'extraction' AND prefix = 'calc'")
    
    # Revert group_by changes
    op.execute("UPDATE summary SET group_by = '[\"benchling_species.id\"]' WHERE source_object_type = 'extraction' AND destination_object_type = 'species' AND stats_fields::text LIKE '%calc_benchling_volume_ul%'")
    op.execute("UPDATE summary SET group_by = '[\"benchling_sample.id\"]' WHERE source_object_type = 'extraction' AND destination_object_type = 'sample' AND stats_fields::text LIKE '%calc_benchling_volume_ul%'")
    
    # Revert stats changes
    op.execute("UPDATE summary SET stats = '[\"min\", \"max\", \"sum\"]' WHERE source_object_type = 'sample' AND destination_object_type = 'species' AND stats_fields::text LIKE '%calc_benchling_remaining_weight%'")
    op.execute("UPDATE summary SET stats = '[\"min\", \"max\", \"sum\"]' WHERE source_object_type = 'extraction' AND destination_object_type = 'species' AND stats_fields::text LIKE '%calc_benchling_volume_ul%'")
    op.execute("UPDATE summary SET stats = '[\"min\", \"max\", \"sum\"]' WHERE source_object_type = 'tissue_prep' AND destination_object_type = 'species' AND stats_fields::text LIKE '%calc_benchling_weight_mg%'")
    
    # Revert stats_fields changes
    op.execute("UPDATE summary SET stats_fields = '[\"benchling_volume_ul\"]' WHERE source_object_type = 'extraction' AND destination_object_type = 'sample' AND stats_fields = '[\"calc_benchling_volume_ul\"]'")
    op.execute("UPDATE summary SET stats_fields = '[\"benchling_weight_mg\"]' WHERE source_object_type = 'tissue_prep' AND destination_object_type = 'sample' AND stats_fields = '[\"calc_benchling_weight_mg\"]'")
    op.execute("UPDATE summary SET stats_fields = '[\"benchling_volume_ul\"]' WHERE source_object_type = 'extraction' AND destination_object_type = 'tissue_prep' AND stats_fields = '[\"calc_benchling_volume_ul\"]'")
    op.execute("UPDATE summary SET stats_fields = '[\"mlwh_volume_remaining\"]' WHERE source_object_type = 'sequencing_request' AND destination_object_type = 'tissue_prep' AND stats_fields = '[\"calc_mlwh_volume_remaining\"]'")
    op.execute("UPDATE summary SET stats_fields = '[\"mlwh_volume_remaining\"]' WHERE source_object_type = 'sequencing_request' AND destination_object_type = 'extraction' AND stats_fields = '[\"calc_mlwh_volume_remaining\"]'")
    op.execute("UPDATE summary SET stats_fields = '[\"benchling_remaining_weight\"]' WHERE source_object_type = 'sample' AND destination_object_type = 'species' AND stats_fields = '[\"calc_benchling_remaining_weight\"]'")
    op.execute("UPDATE summary SET stats_fields = '[\"benchling_volume_ul\"]' WHERE source_object_type = 'extraction' AND destination_object_type = 'species' AND stats_fields = '[\"calc_benchling_volume_ul\"]'")
    op.execute("UPDATE summary SET stats_fields = '[\"benchling_weight_mg\"]' WHERE source_object_type = 'tissue_prep' AND destination_object_type = 'species' AND stats_fields = '[\"calc_benchling_weight_mg\"]'")
    op.execute("UPDATE summary SET stats_fields = '[\"mlwh_volume_remaining\"]' WHERE source_object_type = 'sequencing_request' AND destination_object_type = 'tolid' AND stats_fields = '[\"calc_mlwh_volume_remaining\"]'")
    
    # Revert tissue_prep changes for tolid
    op.execute("UPDATE summary SET stats_fields = '[\"benchling_sampleprep_date\", \"benchling_weight_mg\"]' WHERE source_object_type = 'tissue_prep' AND destination_object_type = 'tolid' AND stats_fields = '[\"benchling_sampleprep_date\"]'")
    op.execute("DELETE FROM summary WHERE source_object_type = 'tissue_prep' AND destination_object_type = 'tolid' AND stats_fields = '[\"calc_benchling_weight_mg\"]'")
    
    # Delete added sequencing_request_lrpacbio_library_remaining_stats
    op.execute("DELETE FROM summary WHERE source_object_type = 'sequencing_request' AND destination_object_type = 'species' AND stats_fields = '[\"lrpacbio_library_remaining\"]'")
    
    # Revert pacbio_stats changes
    op.execute("DELETE FROM summary WHERE source_object_type = 'sequencing_request' AND destination_object_type = 'tolid' AND prefix IN ('benchling_pacbio', 'benchling_pacbio_completed')")
    op.execute("INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) "
               "VALUES ('sequencing_request', 'tolid', '{\"benchling_sequencing_platform\": {\"eq\": {\"value\": \"pacbio\"}}}', '[\"benchling_tolid.id\"]', '[]', '[]', 'benchling_pacbio')")
    op.execute("INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) "
               "VALUES ('sequencing_request', 'tolid', '{\"benchling_sequencing_platform\": {\"exists\": {\"negate\": true}}, \"mlwh_run_data_count\": {\"gte\": {\"value\": 1}}}', '[\"benchling_tolid.id\"]', '[]', '[]', 'benchling_pacbio_completed')")
    