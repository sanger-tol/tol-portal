"""changing calc_sample_abandoned_in_sts prefix

Revision ID: 20988335ae0a
Revises: a6742154c867
Create Date: 2025-05-12 18:04:28.105120

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '20988335ae0a'
down_revision = 'a6742154c867'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Update summary #26 to remove date abandoned as object filter
    op.execute("""
        UPDATE summary 
        SET 
            object_filters = '{"calc_topup_required": {"eq": {"value": true}}}'
        WHERE id = 26
    """)
    
    # Update summary #27 to remove date abandoned as object filter
    op.execute("""
        UPDATE summary 
        SET 
            object_filters = '{"calc_individual_exhausted": {"eq": {"value": true}}}'
        WHERE id = 27
    """)

    # Update summary #64 to explicitly count calc_sample_abandoned_in_sts=true
    op.execute("""
        UPDATE summary 
        SET 
            prefix = 'calc_sample_abandoned_in_sts'
        WHERE id = 64
    """)


def downgrade() -> None:
    pass
