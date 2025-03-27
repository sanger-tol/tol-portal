"""filter_pass_through

Revision ID: ef0cfb361373
Revises: a42a658b61df
Create Date: 2025-03-25 10:56:49.250735

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ef0cfb361373'
down_revision = 'a42a658b61df'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add column with default value
    op.add_column('component', sa.Column('filter_pass_through', sa.Boolean(), nullable=False, server_default=sa.false()))

    # Update existing rows to ensure consistency
    op.execute("UPDATE component SET filter_pass_through = FALSE")


def downgrade() -> None:
    op.drop_column('component', 'filter_pass_through')
