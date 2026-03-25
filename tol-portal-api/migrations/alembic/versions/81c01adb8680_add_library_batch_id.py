"""add library_batch_id

Revision ID: 81c01adb8680
Revises: 452f817312e7
Create Date: 2026-03-22 22:49:29.451656

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.orm import Session


# revision identifiers, used by Alembic.
revision = '81c01adb8680'
down_revision = '452f817312e7'
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    session = Session(bind=bind)

    result = session.execute(
        sa.text(
            "INSERT INTO data_source_instance (id, builtin_name, kwargs, publish, data_source_config_id) "
            "VALUES ('library_batch_ids', 'library_batch_ids', '{}', false, (SELECT id FROM data_source_config WHERE name = 'tol')) "
            "RETURNING id"
        )
    )
    library_batch_ids_data_source_instance_id = result.scalar()

    result = session.execute(
        sa.text(
            "INSERT INTO loader (source_object_type, destination_object_type, object_filters, convert_class, provenance) "
            "VALUES ('sequencing_request', 'sequencing_request', '{}', null, 'benchling') "
            "RETURNING id"
        )
    )
    loader_id = result.scalar()

    session.execute(
        sa.text(
            "INSERT INTO loader_instance (loader_id, source_data_source_instance_id, destination_data_source_instance_id, frequency_daily) "
            "VALUES (:loader_id, :source_id, 'tol_production', true)"
        ),
        {"loader_id": loader_id, "source_id": library_batch_ids_data_source_instance_id}
    )
 
def downgrade() -> None:
    pass