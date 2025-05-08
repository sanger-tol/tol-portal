"""new count for abandoned sts samples

Revision ID: b514ce799491
Revises: 962dc27d9727
Create Date: 2025-05-08 09:45:13.541282

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b514ce799491'
down_revision = '962dc27d9727'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute('INSERT INTO summary (source_object_type, destination_object_type, object_filters, group_by, stats_fields, stats, prefix) '
               'VALUES (\'sample\', \'tolid\', \'{"calc_sample_abandoned_in_sts": {"eq": {"value": true}}}\', \'["sts_tolid.id"]\', \'[]\', \'[]\', \'sts\')')

def downgrade() -> None:
    pass
