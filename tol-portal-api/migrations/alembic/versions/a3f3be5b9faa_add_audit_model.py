"""Add audit model

Revision ID: a3f3be5b9faa
Revises: 5c93e179786d
Create Date: 2023-09-11 09:56:50.587899

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a3f3be5b9faa'
down_revision = '5c93e179786d'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'data_load_event',
        sa.Column('loader_name', sa.String, primary_key=True),
        sa.Column('start_time', sa.DateTime, nullable=False),
        sa.Column('end_time', sa.DateTime),
        sa.Column('source_object_type', sa.String),
        sa.Column('destination_object_type', sa.String)
    )


def downgrade() -> None:
    pass
