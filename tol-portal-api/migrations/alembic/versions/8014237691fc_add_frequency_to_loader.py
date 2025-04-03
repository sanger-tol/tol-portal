"""Add frequency to loader

Revision ID: 8014237691fc
Revises: ef0cfb361373
Create Date: 2025-04-02 10:06:11.543106

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8014237691fc'
down_revision = 'ef0cfb361373'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        'loader',
        sa.Column('frequency', sa.String, nullable=False, server_default='daily')
    )
    op.execute(
        sa.text(
            "UPDATE loader SET frequency = 'quarter_hourly' WHERE id in (3)"
        )
    )
    op.execute(
        sa.text(
            "UPDATE loader SET frequency = 'hourly' WHERE id in (11)"
        )
    )
    op.execute(
        sa.text(
            "DELETE FROM loader WHERE id in (15)"
        )
    )


def downgrade() -> None:
    pass
