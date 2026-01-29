"""count_component_type_upgrade

Revision ID: c83d3dc6e323
Revises: e576233a5d3f
Create Date: 2026-01-29 15:02:02.165356

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c83d3dc6e323'
down_revision = 'e576233a5d3f'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        UPDATE component
        SET component_type = 'statistics'
        WHERE component_type = 'count';
        """
    )


def downgrade() -> None:
    pass
