"""component_ds_refactor

Revision ID: 05f47c1e8f71
Revises: eb298c0a75a0
Create Date: 2025-06-25 16:06:00.823028

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB


# revision identifiers, used by Alembic.
revision = '05f47c1e8f71'
down_revision = 'eb298c0a75a0'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('component', sa.Column('datasource', JSONB, nullable=False, server_default='{}'))
    op.add_column('zone', sa.Column('datasource', JSONB, nullable=False, server_default='{}'))

    op.drop_column('component', 'base_url')
    op.drop_column('zone', 'base_url')


def downgrade() -> None:
    pass
