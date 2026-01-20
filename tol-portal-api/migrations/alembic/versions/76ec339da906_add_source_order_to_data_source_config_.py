"""add source_order to data_source_config_relationship

Revision ID: 76ec339da906
Revises: 1a0633f13421
Create Date: 2026-01-20 10:33:05.992830

"""
from alembic import op
import sqlalchemy as sa

from sqlalchemy.dialects.postgresql import JSONB


# revision identifiers, used by Alembic.
revision = '76ec339da906'
down_revision = '1a0633f13421'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        'data_source_config_relationship',
        sa.Column('source_order', JSONB, nullable=True)
    )


def downgrade() -> None:
    pass
