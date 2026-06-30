"""added new columns to user table

Revision ID: 5f3a925dad6b
Revises: b4559bcbcef0
Create Date: 2026-06-25 12:42:14.234296

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5f3a925dad6b'
down_revision = 'b4559bcbcef0'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        'user',
        sa.Column('name', sa.String, nullable=True),
    )
    op.add_column(
        'user',
        sa.Column('email', sa.String, nullable=True, unique=True),
    )
    op.add_column(
        'user',
        sa.Column('workplace', sa.String, nullable=True),
    )


def downgrade() -> None:
    op.drop_column('user', 'workplace')
    op.drop_column('user', 'email')
    op.drop_column('user', 'name')
