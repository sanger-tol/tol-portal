"""actions

Revision ID: ac8e39913c4c
Revises: 1dcbe2a4cf42
Create Date: 2025-01-14 13:35:09.614372

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB

from datetime import datetime


# revision identifiers, used by Alembic.
revision = 'ac8e39913c4c'
down_revision = '1dcbe2a4cf42'
branch_labels = None
depends_on = None




def upgrade() -> None:
    op.create_table(
        'action',
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('name', sa.String, nullable=False),
        sa.Column('object_type', sa.String, nullable=False),
        sa.UniqueConstraint('name', 'object_type'),
        sa.Column('flow_name', sa.String, nullable=False),
        sa.Column('params', JSONB, nullable=False, default={}),
    )

    op.create_table(
        'user_action',
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('created_at', sa.DateTime, nullable=False, default=datetime.now),
        sa.Column('params', JSONB, nullable=False, default={}),
        sa.Column('user_id', sa.Integer, nullable=False),
        sa.ForeignKeyConstraint(
            ('user_id',),
            ['user.id'],
        ),
        sa.Column('action_id', sa.Integer, nullable=False),
        sa.ForeignKeyConstraint(
            ('action_id',),
            ['action.id'],
        ),
    )


def downgrade() -> None:
    pass
