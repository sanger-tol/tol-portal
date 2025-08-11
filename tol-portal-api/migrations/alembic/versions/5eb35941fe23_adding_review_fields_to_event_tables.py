"""adding_review_fields_to_event_tables

Revision ID: 5eb35941fe23
Revises: a487b2575476
Create Date: 2025-08-11 08:18:14.816194

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5eb35941fe23'
down_revision = 'a487b2575476'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        'extraction_event',
        sa.Column('in_review', sa.Boolean, nullable=True),
    )
    op.add_column(
        'extraction_event',
        sa.Column('sent_to_review_by', sa.String(), nullable=True)
    )
    op.add_column(
        'extraction_event',
        sa.Column('date_sent_to_review', sa.DateTime(), nullable=True)
    )
    
    op.add_column(
        'sample_event',
        sa.Column('in_review', sa.Boolean, nullable=True),
    )
    op.add_column(
        'sample_event',
        sa.Column('sent_to_review_by', sa.String(), nullable=True)
    )
    op.add_column(
        'sample_event',
        sa.Column('date_sent_to_review', sa.DateTime(), nullable=True)
    )
    
    op.add_column(
        'sequencing_request_event',
        sa.Column('in_review', sa.Boolean, nullable=True),
    )
    op.add_column(
        'sequencing_request_event',
        sa.Column('sent_to_review_by', sa.String(), nullable=True)
    )
    op.add_column(
        'sequencing_request_event',
        sa.Column('date_sent_to_review', sa.DateTime(), nullable=True)
    )
    
    op.add_column(
        'tissue_prep_event',
        sa.Column('in_review', sa.Boolean, nullable=True),
    )
    op.add_column(
        'tissue_prep_event',
        sa.Column('sent_to_review_by', sa.String(), nullable=True)
    )
    op.add_column(
        'tissue_prep_event',
        sa.Column('date_sent_to_review', sa.DateTime(), nullable=True)
    )


def downgrade() -> None:
    pass
