"""renaming_review_action

Revision ID: e5f69ea9d468
Revises: 5eb35941fe23
Create Date: 2025-08-11 09:00:01.671807

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.orm import Session

# revision identifiers, used by Alembic.
revision = 'e5f69ea9d468'
down_revision = 'a487b2575476'
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
                    'Remove from ARA Review',
                    'tolid',
                    'elastic_tum_benchling',
                    '{"action": "out_of_ara_review"}'::JSONB
                );
                """
            )
        )

    op.execute("""
        UPDATE action
        SET params = '{"action": "in_ara_review"}'::JSONB
        WHERE name = 'Send for ARA Review'
    """)


def downgrade() -> None:
    pass
