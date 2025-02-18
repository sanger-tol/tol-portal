"""Add event tables

Revision ID: 985881c9c950
Revises: 150580dd982a
Create Date: 2025-02-18 09:59:23.409221

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '985881c9c950'
down_revision = '150580dd982a'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        'sequencing_request_event',
        sa.Column('date_abandoned', sa.DateTime, nullable=True)
    )
    op.add_column(
        'sequencing_request_event',
        sa.Column('abandoned_by', sa.String, nullable=True)
    )
    op.alter_column('sequencing_request_event', 'date_sent_to_sciops', nullable=True)
    op.create_table(
        'tolid_event',
        sa.Column('tolid', sa.String(255), primary_key=True),
        sa.Column('date_topup_actioned', sa.DateTime),
        sa.Column('topup_actioned_by', sa.String),
        sa.Column('date_abandoned', sa.DateTime),
        sa.Column('abandoned_by', sa.String),
    )
    op.create_table(
        'sample_event',
        sa.Column('sample_id', sa.String(255), primary_key=True),
        sa.Column('date_abandoned', sa.DateTime),
        sa.Column('abandoned_by', sa.String),
    )
    op.create_table(
        'tissue_prep_event',
        sa.Column('tissue_prep_id', sa.String(255), primary_key=True),
        sa.Column('date_abandoned', sa.DateTime),
        sa.Column('abandoned_by', sa.String),
    )
    op.create_table(
        'extraction_event',
        sa.Column('extraction_id', sa.String(255), primary_key=True),
        sa.Column('date_abandoned', sa.DateTime),
        sa.Column('abandoned_by', sa.String),
    )


def downgrade() -> None:
    op.drop_column('sequencing_request_event', 'date_abandoned')
    op.drop_column('sequencing_request_event', 'abandoned_by')
    op.alter_column('sequencing_request_event', 'date_sent_to_sciops', nullable=False)
    op.drop_table('tolid_event')
    op.drop_table('sample_event')
    op.drop_table('tissue_prep_event')
    op.drop_table('extraction_event')
