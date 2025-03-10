"""add tum action

Revision ID: e2ece2f28e88
Revises: 985881c9c950
Create Date: 2025-02-20 14:07:06.395586

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.orm import Session

# revision identifiers, used by Alembic.
revision = 'e2ece2f28e88'
down_revision = '985881c9c950'
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
                    'Request Resequencing',
                    'sequencing_request',
                    'elastic_tum_benchling',
                    '{"action": "tum"}'::JSONB
                );
                """
            )
        )

    session.execute(
            sa.text(
                """
                INSERT INTO action ("name", object_type, flow_name, params)
                VALUES (
                    'Insert into LI Work List',
                    'extraction',
                    'elastic_tum_benchling',
                    '{"worklist_name": "ROUTINE - DNA ready for LI pacbio prep", "action": "tum"}'::JSONB
                );
                """
            )
        )
    
    session.execute(
            sa.text(
                """
                INSERT INTO action ("name", object_type, flow_name, params)
                VALUES (
                    'Insert into ULI Work List',
                    'extraction',
                    'elastic_tum_benchling',
                    '{"worklist_name": "DNA ready for ULI pacbio prep", "action": "tum"}'::JSONB
                );
                """
            )
        )
    
    session.execute(
            sa.text(
                """
                INSERT INTO action ("name", object_type, flow_name, params)
                VALUES (
                    'Insert into Tissue Prep Work List',
                    'tissue_prep',
                    'elastic_tum_benchling',
                    '{"worklist_name": "TUM tissue preps", "action": "tum"}'::JSONB
                );
                """
            )
        )
    
    session.execute(
            sa.text(
                """
                INSERT INTO action ("name", object_type, flow_name, params)
                VALUES (
                    'Insert into Benchling Tissue Work List',
                    'sample',
                    'elastic_tum_benchling',
                    '{"worklist_name": "TUM tissues", "action": "tum"}'::JSONB
                );
                """
            )
        )

    session.execute(
            sa.text(
                """
                INSERT INTO action ("name", object_type, flow_name, params)
                VALUES (
                    'Export into Benchling',
                    'sample',
                    'elastic_tum_benchling',
                    '{"action": "tum", "create_entity": true, "folder_name": "Core Lab Entities",}'::JSONB
                );
                """
            )
        )
    
def downgrade() -> None:
    pass
