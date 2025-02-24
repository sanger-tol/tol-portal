"""add uli worklist action

Revision ID: 40a49a9f11fb
Revises: e2ece2f28e88
Create Date: 2025-02-20 14:17:21.229424

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.orm import Session


# revision identifiers, used by Alembic.
revision = '40a49a9f11fb'
down_revision = 'e2ece2f28e88'
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
                    'ULI Work List',
                    'extraction',
                    'elastic_tum_benchling',
                    '{"worklist_name": "DNA ready for ULI pacbio prep"}'::JSONB
                );
                """
            )
        )



def downgrade() -> None:
    pass
