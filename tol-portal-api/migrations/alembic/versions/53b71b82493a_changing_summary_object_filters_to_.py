"""changing summary object filters to reflect boolean type

Revision ID: 53b71b82493a
Revises: 1d6f32212917
Create Date: 2025-04-16 06:21:48.352867

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '53b71b82493a'
down_revision = '1d6f32212917'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Update id 26,27 to use boolean eq filter instead of string in_list
    op.execute("""
        UPDATE summary 
        SET object_filters = '{"portaldb_date_abandoned": {"exists": {"negate": true}},"calc_topup_required": {"eq": {"value": true}}}'
        WHERE id = 26
    """)

    op.execute("""
        UPDATE summary 
        SET object_filters = '{"portaldb_date_abandoned": {"exists": {"negate": true}},"calc_individual_exhausted": {"eq": {"value": true}}}'
        WHERE id = 27
    """)

def downgrade() -> None:
    pass