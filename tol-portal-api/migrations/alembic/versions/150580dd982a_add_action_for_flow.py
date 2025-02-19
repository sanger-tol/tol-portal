"""add action for flow

Revision ID: 150580dd982a
Revises: 47c84935af83
Create Date: 2025-02-06 16:00:06.423070

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.orm import Session


# revision identifiers, used by Alembic.
revision = '150580dd982a'
down_revision = '47c84935af83'
branch_labels = None
depends_on = None


def upgrade() -> None:
    connection = op.get_bind()
    session = Session(bind=connection)

    session.execute(
        sa.text(
            """
            INSERT INTO action ("name", object_type, flow_name, params)
            VALUES (
                'DNA Extraction',
                'extraction',
                'action_example',
                '{}'::JSONB
            );
            """
        )
    )


def downgrade() -> None:
    pass
