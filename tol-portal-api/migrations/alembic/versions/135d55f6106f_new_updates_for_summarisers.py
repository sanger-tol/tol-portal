"""new updates for summarisers

Revision ID: 135d55f6106f
Revises: a42a658b61df
Create Date: 2025-03-26 11:20:24.956119

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '135d55f6106f'
down_revision = 'a42a658b61df'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Fix field prefix for tolid summariser
    op.execute("UPDATE summary SET prefix = 'calc' WHERE source_object_type = 'sequencing_request' AND destination_object_type = 'tolid' AND prefix = 'benchling' AND stats_fields::text LIKE '%calc_mlwh_volume_remaining%'")

def downgrade() -> None:
    pass
