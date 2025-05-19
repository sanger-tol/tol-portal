"""mlwh_hifi_read_bases_to_tolqc_bases

Revision ID: 4595655ff277
Revises: 20988335ae0a
Create Date: 2025-05-19 07:54:42.736792

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4595655ff277'
down_revision = '20988335ae0a'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        UPDATE summary
        SET
            stats_fields = (
                SELECT jsonb_agg(
                    CASE WHEN elem = 'mlwh_hifi_read_bases' THEN 'tolqc_bases' ELSE elem END
                )
                FROM jsonb_array_elements_text(stats_fields) AS elems(elem)
            ),
            prefix = 'tolqc'
        WHERE stats_fields @> '["mlwh_hifi_read_bases"]'::jsonb;
        """
    )


def downgrade() -> None:
    pass
