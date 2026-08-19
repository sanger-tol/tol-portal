"""filter_pass_through_for_zones

Revision ID: b77923994607
Revises: 9f558102d9ac
Create Date: 2026-08-11 10:41:38.957880

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b77923994607'
down_revision = '76b4b918b8a4'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Translations
    op.alter_column('zone', 'translations', new_column_name='attribute_translations')
    op.add_column('zone', sa.Column('relationship_translation', sa.Boolean(), nullable=False, server_default=sa.true()))
    op.add_column('zone', sa.Column('translation_path', sa.TEXT, nullable=True))

    # Filter pass through
    op.add_column('zone', sa.Column('filter_pass_through', sa.Boolean(), nullable=False, server_default=sa.false()))


def downgrade() -> None:
    op.drop_column('zone', 'filter_pass_through')
    op.drop_column('zone', 'relationship_translation')
    op.drop_column('zone', 'translation_path')
    op.alter_column('zone', 'attribute_translations', new_column_name='translations')
