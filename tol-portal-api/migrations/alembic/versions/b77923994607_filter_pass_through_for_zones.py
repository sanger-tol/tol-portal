"""filter_pass_through_for_zones

Revision ID: b77923994607
Revises: 9f558102d9ac
Create Date: 2026-08-11 10:41:38.957880

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB


# revision identifiers, used by Alembic.
revision = 'b77923994607'
down_revision = '9f558102d9ac'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Translations
    op.alter_column('zone', 'translations', new_column_name='attribute_translations')
    op.add_column('zone', sa.Column('relationship_translations', JSONB, nullable=False, server_default='{}'))
    op.add_column('zone', sa.Column('auto_translations', sa.Boolean(), nullable=False, server_default=sa.true()))

    # Filter pass through
    op.add_column('zone', sa.Column('filter_pass_through', sa.Boolean(), nullable=False, server_default=sa.false()))


def downgrade() -> None:
    op.drop_column('zone', 'filter_pass_through')
    op.drop_column('zone', 'auto_translations')
    op.drop_column('zone', 'relationship_translations')
    op.alter_column('zone', 'attribute_translations', new_column_name='translations')
