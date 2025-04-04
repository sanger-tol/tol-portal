"""fix prefix for summariser

Revision ID: c093fb9bb952
Revises: 8014237691fc
Create Date: 2025-04-04 09:03:50.430363

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c093fb9bb952'
down_revision = '8014237691fc'
branch_labels = None
depends_on = None


def upgrade() -> None:
     # Fix field prefix for species summariser
    op.execute("UPDATE summary SET prefix = 'calc' WHERE source_object_type = 'sequencing_request' AND destination_object_type = 'tolid' AND prefix = 'benchling' AND stats_fields::text LIKE '%calc_mlwh_volume_remaining%'")


def downgrade() -> None:
    pass
