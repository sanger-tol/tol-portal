"""add new user role and migrate users to that role

Revision ID: bbc207dbbf53
Revises: fde0a833b72a
Create Date: 2026-01-20 11:03:01.877218

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'bbc207dbbf53'
down_revision = 'fde0a833b72a'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute('INSERT INTO role (name) VALUES (\'tol\')')

    op.execute('''
               INSERT INTO role_binding (user_id, role_id)
               SELECT u.id, r.id
               from "user" u
               CROSS JOIN role r
               WHERE r.name = 'tol'
               ''')


def downgrade() -> None:
    pass
