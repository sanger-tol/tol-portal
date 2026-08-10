"""Migrate fields in use to support provenance

Revision ID: 248076bd4c0d
Revises: 9f558102d9ac
Create Date: 2026-08-10 08:12:44.340674

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '248076bd4c0d'
down_revision = '9f558102d9ac'
branch_labels = None
depends_on = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
