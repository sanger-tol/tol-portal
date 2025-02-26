"""add abandon action

Revision ID: 053beb338b14
Revises: 985881c9c950
Create Date: 2025-02-26 09:27:15.504713

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
                    'Mark as Not Valid',
                    'sequencing_request',
                    'elastic_tum_benchling',
                    '{"action": "abandon"}'::JSONB
                );
                """
            )
        )

    session.execute(
            sa.text(
                """
                INSERT INTO action ("name", object_type, flow_name, params)
                VALUES (
                    'Mark as Not Valid',
                    'extraction',
                    'elastic_tum_benchling',
                    '{"action": "abandon"}'::JSONB
                );
                """
            )
        )

    session.execute(
            sa.text(
                """
                INSERT INTO action ("name", object_type, flow_name, params)
                VALUES (
                    'Mark as Not Valid',
                    'tissue_prep',
                    'elastic_tum_benchling',
                    '{"action": "abandon"}'::JSONB
                );
                """
            )
        )

    session.execute(
            sa.text(
                """
                INSERT INTO action ("name", object_type, flow_name, params)
                VALUES (
                    'Mark as Not Valid',
                    'sample',
                    'elastic_tum_benchling',
                    '{"action": "abandon"}'::JSONB
                );
                """
            )
        )
    
    session.execute(
            sa.text(
                """
                INSERT INTO action ("name", object_type, flow_name, params)
                VALUES (
                    'Mark as Not Valid',
                    'tolid',
                    'elastic_tum_benchling',
                    '{"action": "abandon"}'::JSONB
                );
                """
            )
        )



def downgrade() -> None:
    pass