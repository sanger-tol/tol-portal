"""remove role_binding

Revision ID: 9ce06a984e70
Revises: 207e21b2b09e
Create Date: 2025-01-31 07:57:04.712351

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9ce06a984e70'
down_revision = '207e21b2b09e'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.drop_table('role_binding')


def downgrade() -> None:
    pass
