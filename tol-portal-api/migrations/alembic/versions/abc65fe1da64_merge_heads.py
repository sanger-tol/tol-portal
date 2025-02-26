"""merge heads

Revision ID: abc65fe1da64
Revises: 40a49a9f11fb, 50de7f434b93
Create Date: 2025-02-26 10:29:34.728702

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'abc65fe1da64'
down_revision = ('40a49a9f11fb', '50de7f434b93')
branch_labels = None
depends_on = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
