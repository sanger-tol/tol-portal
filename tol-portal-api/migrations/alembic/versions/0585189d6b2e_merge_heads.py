"""merge heads

Revision ID: 0585189d6b2e
Revises: 606a8b287608, c11cc136cba3
Create Date: 2026-05-21 09:36:24.754992

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0585189d6b2e'
down_revision = ('606a8b287608', 'c11cc136cba3')
branch_labels = None
depends_on = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
