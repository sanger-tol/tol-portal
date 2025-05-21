"""redefining pacbio stats

Revision ID: dab1d36794e6
Revises: 4595655ff277
Create Date: 2025-05-21 09:47:50.175644

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'dab1d36794e6'
down_revision = '4595655ff277'
branch_labels = None
depends_on = None


def upgrade() -> None:

    op.execute("""
        UPDATE summary 
        SET object_filters = \'{"benchling_sequencing_platform": {"eq": {"value": "pacbio"}}, "mlwh_run_data_count": {"gte": {"value": 1}}}\'
        WHERE id = 40
    """)

def downgrade() -> None:
    pass
