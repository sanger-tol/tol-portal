"""adding mark for recollection reason column

Revision ID: eb298c0a75a0
Revises: dab1d36794e6
Create Date: 2025-05-21 10:20:28.473893

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'eb298c0a75a0'
down_revision = 'dab1d36794e6'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # First add the column as nullable
    op.add_column(
        'species_event',
        sa.Column('marked_for_recollection_reason', sa.String, nullable=True)
    )
    
    # Update existing rows to have the default value
    op.execute("UPDATE species_event SET marked_for_recollection_reason = 'PacBio'")
    
    # Then make it non-nullable
    op.alter_column('species_event', 'marked_for_recollection_reason', nullable=False,
                   existing_type=sa.String, server_default="PacBio")

def downgrade() -> None:
    pass
