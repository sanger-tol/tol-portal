"""re-adding original authoritative summariser fields

Revision ID: a725ad636622
Revises: c093fb9bb952
Create Date: 2025-04-05 06:16:47.299166

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a725ad636622'
down_revision = 'c093fb9bb952'
branch_labels = None
depends_on = None


def upgrade() -> None:
    
    # =====================================================
    # Stats field: mlwh_volume_remaining
    # =====================================================
    # Summarising sequencing_request into extraction
    op.execute('INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) '
            'VALUES (\'sequencing_request\', \'extraction\', \'{}\', \'["benchling_extraction.id"]\', \'["mlwh_volume_remaining"]\', \'["min", "max"]\', \'mlwh\')')

    # Summarising sequencing_request into sample
    op.execute('INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) '
            'VALUES (\'sequencing_request\', \'sample\', \'{}\', \'["benchling_sample.id"]\', \'["mlwh_volume_remaining"]\', \'["min", "max"]\', \'mlwh\')')

    # Summarising sequencing_request into tissue_prep
    op.execute('INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) '
            'VALUES (\'sequencing_request\', \'tissue_prep\', \'{}\', \'["benchling_tissue_prep.id"]\', \'["mlwh_volume_remaining"]\', \'["min", "max"]\', \'mlwh\')')

    # Summarising sequencing_request into tolid
    op.execute('INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) '
            'VALUES (\'sequencing_request\', \'tolid\', \'{}\', \'["benchling_tolid.id"]\', \'["mlwh_volume_remaining"]\', \'["min", "max"]\', \'mlwh\')')

    # =====================================================
    # Stats field: benchling_volume_ul
    # =====================================================
    # Summarising extraction into sample
    op.execute('INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) '
            'VALUES (\'extraction\', \'sample\', \'{}\', \'["benchling_sample.id", "benchling_extraction_type"]\', \'["benchling_volume_ul"]\', \'["min", "max"]\', \'benchling\')')

    # Summarising extraction into species
    op.execute('INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) '
            'VALUES (\'extraction\', \'species\', \'{}\', \'["benchling_species.id", "benchling_extraction_type"]\', \'["benchling_volume_ul"]\', \'["min", "max", "sum"]\', \'benchling\')')

    # Summarising extraction into tissue_prep
    op.execute('INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) '
            'VALUES (\'extraction\', \'tissue_prep\', \'{}\', \'["benchling_tissue_prep.id", "benchling_extraction_type"]\', \'["benchling_volume_ul"]\', \'["min", "max"]\', \'benchling\')')

    # Summarising extraction into tolid
    op.execute('INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) '
            'VALUES (\'extraction\', \'tolid\', \'{}\', \'["benchling_tolid.id", "benchling_extraction_type"]\', \'["benchling_volume_ul"]\', \'["min", "max"]\', \'benchling\')')

    # =====================================================
    # Stats field: benchling_weight_mg
    # =====================================================
    # Summarising tissue_prep into sample
    op.execute('INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) '
            'VALUES (\'tissue_prep\', \'sample\', \'{}\', \'["benchling_sample.id"]\', \'["benchling_weight_mg"]\', \'["min", "max"]\', \'benchling\')')

    # Summarising tissue_prep into species
    op.execute('INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) '
            'VALUES (\'tissue_prep\', \'species\', \'{}\', \'["benchling_species.id"]\', \'["benchling_weight_mg"]\', \'["min", "max", "sum"]\', \'benchling\')')

    # Summarising tissue_prep into tolid
    op.execute('INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) '
            'VALUES (\'tissue_prep\', \'tolid\', \'{}\', \'["benchling_tolid.id"]\', \'["benchling_weight_mg"]\', \'["min", "max"]\', \'benchling\')')

    # =====================================================
    # Stats field: benchling_remaining_weight
    # =====================================================
    # Summarising sample into species
    op.execute('INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) '
            'VALUES (\'sample\', \'species\', \'{}\', \'["benchling_species.id"]\', \'["benchling_remaining_weight"]\', \'["min", "max", "sum"]\', \'benchling\')')

    # Summarising sample into tolid
    op.execute('INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) '
            'VALUES (\'sample\', \'tolid\', \'{}\', \'["benchling_tolid.id"]\', \'["benchling_remaining_weight"]\', \'["min", "max"]\', \'benchling\')')


def downgrade() -> None:
    pass
