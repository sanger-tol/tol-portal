"""advanced_translators

Revision ID: 9f558102d9ac
Revises: 5f3a925dad6b
Create Date: 2026-07-28 15:22:09.202112

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB


# revision identifiers, used by Alembic.
revision = '9f558102d9ac'
down_revision = '5f3a925dad6b'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('component', sa.Column(
        'filter_exclude_incoming',
        sa.Boolean(),
        nullable=False,
        server_default='false'
    ))
    op.add_column('zone', sa.Column(
        'translations',
        JSONB,
        nullable=False,
        server_default='{}'
    ))
    op.add_column('zone', sa.Column(
        'filter_exclude_incoming',
        sa.Boolean(),
        nullable=False,
        server_default='false'
    ))


def downgrade() -> None:
    op.drop_column('zone', 'filter_exclude_incoming')
    op.drop_column('component', 'translations')
    op.drop_column('component', 'filter_exclude_incoming')
