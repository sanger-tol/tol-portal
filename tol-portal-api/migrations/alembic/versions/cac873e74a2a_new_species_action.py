"""new species action

Revision ID: cac873e74a2a
Revises: abc65fe1da64
Create Date: 2025-03-13 15:17:41.397325

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.orm import Session

# revision identifiers, used by Alembic.
revision = 'cac873e74a2a'
down_revision = '5e94af5fc651'
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
                'Mark for recollection',
                'species',
                'elastic_tum_benchling',
                '{"action": "recollect"}'::JSONB
            );
            """
        )
    )

def downgrade() -> None:
    pass
