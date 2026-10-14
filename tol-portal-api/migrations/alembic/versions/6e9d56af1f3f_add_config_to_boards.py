"""add_config_to_boards

Revision ID: 6e9d56af1f3f
Revises: 248076bd4c0d
Create Date: 2026-10-08 09:23:13.127612

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = '6e9d56af1f3f'
down_revision = '248076bd4c0d'
branch_labels = None
depends_on = None


def upgrade() -> None:
    for table in ("board", "view", "zone"):
        op.add_column(
            table,
            sa.Column(
                "config",
                postgresql.JSONB(),
                nullable=False,
                server_default=sa.text("'{}'::jsonb"),
            ),
        )


def downgrade() -> None:
    for table in ("zone", "view", "board"):
        op.drop_column(table, "config")
