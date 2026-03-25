"""provenance_override

Revision ID: ede2933e026f
Revises: 452f817312e7
Create Date: 2026-03-25 11:18:53.604991

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ede2933e026f'
down_revision = '452f817312e7'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.rename_column('loader', 'provenance', 'provenance_override')
    op.rename_column('data_source_config_summary', 'provenance', 'provenance_override')


def downgrade() -> None:
    op.rename_column('loader', 'provenance_override', 'provenance')
    op.rename_column('data_source_config_summary', 'provenance_override', 'provenance')
