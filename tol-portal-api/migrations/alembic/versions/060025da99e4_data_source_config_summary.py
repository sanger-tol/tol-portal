"""data_source_config_summary

Revision ID: 060025da99e4
Revises: f6f142c1a7bb
Create Date: 2025-11-11 14:39:39.803612

"""
from alembic import op
from sqlalchemy.dialects.postgresql import JSONB
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '060025da99e4'
down_revision = 'f6f142c1a7bb'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'data_source_config_summary',
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('source_object_type', sa.String, nullable=False),
        sa.Column('destination_object_type', sa.String, nullable=False),
        sa.Column('object_filters', JSONB, nullable=False, default={}),
        sa.Column('group_by', JSONB, nullable=False, default=[]),
        sa.Column('stats_fields', JSONB, nullable=False, default=[]),
        sa.Column('stats', JSONB, nullable=False, default=[]),
        sa.Column('prefix', sa.String, nullable=False, default=''),
        sa.Column('data_source_config_id', sa.Integer, sa.ForeignKey('data_source_config.id'), nullable=False),
    )

    # elastic_extraction_summariser.load_sequencing_request_stats()
    op.execute('INSERT INTO data_source_config_summary (data_source_config_id, source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) '
               'SELECT 1,source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix FROM summary')
    op.drop_table('summary')


def downgrade() -> None:
    op.drop_table('data_source_config_summary')
