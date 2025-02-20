"""add columns to user_action

Revision ID: 554b0a6fd915
Revises: 985881c9c950
Create Date: 2025-02-20 13:33:09.123581

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB


# revision identifiers, used by Alembic.
revision = '554b0a6fd915'
down_revision = '985881c9c950'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        'user_action',
        sa.Column(
            'ids',
            JSONB,
            nullable=True
        )
    )

    op.add_column(
        'user_action',
        sa.Column(
            'filters',
            JSONB,
            nullable=True
        )
    )

    op.create_check_constraint(
        None,
        'user_action',
        'NOT(ids IS NULL AND filters IS NULL)'
    )


def downgrade() -> None:
    pass
