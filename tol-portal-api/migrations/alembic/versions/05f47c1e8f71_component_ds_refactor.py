"""component_ds_refactor

Revision ID: 05f47c1e8f71
Revises: eb298c0a75a0
Create Date: 2025-06-25 16:06:00.823028

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '05f47c1e8f71'
down_revision = 'eb298c0a75a0'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add column with default value
    op.add_column('component', sa.Column('api_prefix', sa.String(), nullable=True))
    op.add_column('zone', sa.Column('api_prefix', sa.String(), nullable=True))


def downgrade() -> None:
    pass
