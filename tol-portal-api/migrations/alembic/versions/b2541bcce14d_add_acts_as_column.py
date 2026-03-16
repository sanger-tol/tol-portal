"""add_acts_as_column

Revision ID: b2541bcce14d
Revises: f0cf5e525b9e
Create Date: 2026-03-12 16:51:36.471100

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b2541bcce14d'
down_revision = 'f0cf5e525b9e'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        'data_source_config_attribute',
        sa.Column('acts_as', sa.String(), nullable=True)
    )


def downgrade() -> None:
    pass
