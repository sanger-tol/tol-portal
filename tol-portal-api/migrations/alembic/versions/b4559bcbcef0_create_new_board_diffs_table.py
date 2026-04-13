"""create new board_diffs table

Revision ID: b4559bcbcef0
Revises: 4428f2cf7741
Create Date: 2026-04-13 07:44:31.468831

"""
from alembic import op
import sqlalchemy as sa

from sqlalchemy.dialects.postgresql import JSONB


# revision identifiers, used by Alembic.
revision = 'b4559bcbcef0'
down_revision = '4428f2cf7741'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'board_diffs',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('board_id', sa.String(), nullable=False),
        sa.Column('component_id', sa.String(), nullable=False),
        sa.Column('config', JSONB(), nullable=False),
        sa.ForeignKeyConstraint(['board_id'], ['board.id']),
        sa.ForeignKeyConstraint(['user_id'], ['user.id']),
        sa.ForeignKeyConstraint(['component_id'], ['component.id']),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    op.drop_table('board_diffs')
