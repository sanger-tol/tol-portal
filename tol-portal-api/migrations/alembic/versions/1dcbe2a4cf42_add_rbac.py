"""add rbac

Revision ID: 1dcbe2a4cf42
Revises: a3f3be5b9faa
Create Date: 2024-05-01 15:53:04.452816

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '1dcbe2a4cf42'
down_revision = 'a3f3be5b9faa'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'oidc_state',
        sa.Column('id', sa.String, primary_key=True),
        sa.Column('created_at', sa.DateTime, nullable=False),
    )

    op.create_table(
        'user',
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('oidc_id', sa.String, unique=True, nullable=False),
    )

    op.create_table(
        'token',
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('token', sa.String, unique=True, nullable=False),
        sa.Column('created_at', sa.DateTime, nullable=False),
        sa.Column('expires_at', sa.DateTime, nullable=False),
        sa.Column('user_id', sa.Integer, nullable=False),
        sa.ForeignKeyConstraint(
            ('user_id',),
            ['user.id'],
        ),
    )

    op.create_table(
        'role',
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('name', sa.String, unique=True, nullable=False),
    )

    op.create_table(
        'role_binding',
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('user_id', sa.Integer, nullable=False),
        sa.Column('role_id', sa.Integer, nullable=False),
        sa.ForeignKeyConstraint(
            ('user_id',),
            ['user.id'],
        ),
        sa.ForeignKeyConstraint(
            ('role_id',),
            ['role.id'],
        ),
    )


def downgrade() -> None:
    pass
