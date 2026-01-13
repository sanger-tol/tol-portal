"""Add source_order JSONB column to data_source_config_relationship

Revision ID: fde0a833b72a
Revises: 1a0633f13421
Create Date: 2026-01-13 13:30:11.719913

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'fde0a833b72a'
down_revision = '1a0633f13421'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        'data_source_config_relationship',
        sa.Column('source_order', sa.JSON(), nullable=True)
    )


def downgrade() -> None:
    op.drop_column('data_source_config_relationship', 'source_order')
