"""Rename prefix to provenance

Revision ID: 452f817312e7
Revises: b2541bcce14d
Create Date: 2026-03-16 10:10:26.640983

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '452f817312e7'
down_revision = 'b2541bcce14d'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.alter_column('loader', 'prefix', new_column_name='provenance')


def downgrade() -> None:
    op.alter_column('loader', 'provenance', new_column_name='prefix')
