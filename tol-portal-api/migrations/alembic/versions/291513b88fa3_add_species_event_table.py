"""add_species_event_table

Revision ID: 291513b88fa3
Revises: cac873e74a2a
Create Date: 2025-03-13 15:20:54.418259

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '291513b88fa3'
down_revision = 'cac873e74a2a'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'species_event',
        sa.Column('species_id', sa.String(255), primary_key=True),
        sa.Column('date_marked_for_recollection', sa.DateTime),
        sa.Column('marked_for_recollection_by', sa.String),
    )


def downgrade() -> None:
    op.drop_table('species_event')


