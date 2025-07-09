"""update id fields in boards

Revision ID: 51c4f6492a16
Revises: 05f47c1e8f71
Create Date: 2025-07-09 12:09:50.308242

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import text


# revision identifiers, used by Alembic.
revision = '51c4f6492a16'
down_revision = '05f47c1e8f71'
branch_labels = None
depends_on = None


def upgrade() -> None:
    conn = op.get_bind()
    # update the config field in the component table
    conn.execute(
        text("""
        UPDATE component
        SET config = REPLACE(config::text, '"uid"', '"id"')::jsonb
        WHERE config::text LIKE '%"uid"%'
        """)
    )
    # update the filter field in the component table
    conn.execute(
        text("""
        UPDATE component
        SET filter = REPLACE(filter::text, '"uid"', '"id"')::jsonb
        WHERE filter::text LIKE '%"uid"%'
        """)
    )
    # update the filter field in the zone table
    conn.execute(
        text("""
        UPDATE zone
        SET filter = REPLACE(filter::text, '"uid"', '"id"')::jsonb
        WHERE filter::text LIKE '%"uid"%'
        """)
    )


def downgrade() -> None:
    pass
