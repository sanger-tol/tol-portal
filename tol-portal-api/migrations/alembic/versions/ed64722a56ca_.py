"""

Revision ID: ed64722a56ca
Revises: 16288b926ab7
Create Date: 2024-12-16 16:28:42.150301

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.orm import Session


# revision identifiers, used by Alembic.
revision = 'ed64722a56ca'
down_revision = '16288b926ab7'
branch_labels = None
depends_on = None


def upgrade() -> None:
    connection = op.get_bind()
    session = Session(bind=connection)

    session.execute(
        sa.text("INSERT INTO role (\"name\") VALUES ('exporter');")
    )


def downgrade() -> None:
    pass
