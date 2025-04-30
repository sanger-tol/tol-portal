"""rename worklists for tum

Revision ID: 7e234da3d49e
Revises: 216c09f1d930
Create Date: 2025-04-30 10:35:11.916600

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.orm import Session


# revision identifiers, used by Alembic.
revision = '7e234da3d49e'
down_revision = '216c09f1d930'
branch_labels = None
depends_on = None


def upgrade() -> None:
    connection = op.get_bind()
    session = Session(bind=connection)

    session.execute(
        sa.text(
            """
            UPDATE action
            SET params = jsonb_set(params, '{worklist_name}', '"ROUTINE DNA ready for LI pacbio prep"')
            WHERE "name" = 'Insert into LI Work List'
            AND flow_name = 'elastic_tum_benchling'
            AND params->>'worklist_name' = 'ROUTINE - DNA ready for LI pacbio prep'
            """
        )
    )

    session.execute(
        sa.text(
            """
            UPDATE action
            SET params = jsonb_set(params, '{worklist_name}', '"ROUTINE DNA ready for ULI pacbio prep"')
            WHERE "name" = 'Insert into ULI Work List'
            AND flow_name = 'elastic_tum_benchling'
            AND params->>'worklist_name' = 'DNA ready for ULI pacbio prep'
            """
        )
    )

    session.commit()


def downgrade() -> None:
    pass
