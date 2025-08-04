"""adding_review_action

Revision ID: a487b2575476
Revises: 8be1ee670d23
Create Date: 2025-08-04 09:22:11.894018

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.orm import Session

# revision identifiers, used by Alembic.
revision = 'a487b2575476'
down_revision = '8be1ee670d23'
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
                    'Send for ARA Review',
                    'tolid',
                    'elastic_tum_benchling',
                    '{"action": "review"}'::JSONB
                );
                """
            )
        )


def downgrade() -> None:
    pass
