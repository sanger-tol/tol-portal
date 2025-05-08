"""changing value counts to counts

Revision ID: 962dc27d9727
Revises: 7e234da3d49e
Create Date: 2025-05-06 09:38:40.649909

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '962dc27d9727'
down_revision = '7e234da3d49e'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("""
        UPDATE summary 
        SET stats = \'[]\'
        WHERE id = 26
    """)

    op.execute("""
        UPDATE summary 
        SET stats = \'[]\'
        WHERE id = 27
    """)


def downgrade() -> None:
    pass
