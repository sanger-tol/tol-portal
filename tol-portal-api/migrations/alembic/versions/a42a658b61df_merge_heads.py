"""merge heads

Revision ID: a42a658b61df
Revises: 622ae94b2d4a, abee098dc8ce
Create Date: 2025-03-25 11:49:21.992111

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a42a658b61df'
down_revision = ('622ae94b2d4a', 'abee098dc8ce')
branch_labels = None
depends_on = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
