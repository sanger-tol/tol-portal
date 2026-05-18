"""fix_validation_failed_system_error_status

Revision ID: 54426c2530d2
Revises: c11cc136cba3
Create Date: 2026-05-18 09:32:13.328336

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '54426c2530d2'
down_revision = 'c11cc136cba3'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("""
        UPDATE upload
        SET validation_status = 'validation_system_error'
        WHERE validation_status = 'validation_failed_system_error'
    """)


def downgrade() -> None:
    pass
