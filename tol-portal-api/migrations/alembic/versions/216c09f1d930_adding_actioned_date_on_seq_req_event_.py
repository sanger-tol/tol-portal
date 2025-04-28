"""adding actioned date on seq req event table

Revision ID: 216c09f1d930
Revises: 53b71b82493a
Create Date: 2025-04-28 14:42:44.933493

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '216c09f1d930'
down_revision = '53b71b82493a'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        'sequencing_request_event',
        sa.Column('date_topup_actioned', sa.DateTime, nullable=True)
    )
    op.add_column(
        'sequencing_request_event',
        sa.Column('topup_actioned_by', sa.String, nullable=True)
    )

def downgrade() -> None:
    pass
