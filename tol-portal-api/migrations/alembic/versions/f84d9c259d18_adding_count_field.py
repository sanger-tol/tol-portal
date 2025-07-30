"""Adding_Count_Field

Revision ID: f84d9c259d18
Revises: 2316b87822d2
Create Date: 2025-07-25 13:17:19.992240

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f84d9c259d18'
down_revision = '2316b87822d2'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        'tolid_event',
        sa.Column('tol_tum_action_count', sa.Integer, nullable=True)
    )


def downgrade() -> None:
    pass
