"""adding_review_fields_to_tolid_events

Revision ID: 8be1ee670d23
Revises: f84d9c259d18
Create Date: 2025-07-30 10:30:30.212074

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8be1ee670d23'
down_revision = 'f84d9c259d18'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        'tolid_event',
        sa.Column('in_review', bool, nullable=True),
    )
    op.add_column(
        'tolid_event',
        sa.Column('sent_to_review_by', sa.String(), nullable=True)
    )
    op.add_column(
        'tolid_event',
        sa.Column('date_sent_to_review', sa.DateTime(), nullable=True)
    )


def downgrade() -> None:
    pass
