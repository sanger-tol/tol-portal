"""merge heads

Revision ID: 47c84935af83
Revises: 207e21b2b09e, ac8e39913c4c
Create Date: 2025-02-06 15:37:58.792765

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '47c84935af83'
down_revision = ('207e21b2b09e', 'ac8e39913c4c')
branch_labels = None
depends_on = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
