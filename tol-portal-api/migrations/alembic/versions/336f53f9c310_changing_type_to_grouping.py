"""changing_type_to_grouping

Revision ID: 336f53f9c310
Revises: 847226e48309
Create Date: 2025-05-14 11:38:50.641570

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '336f53f9c310'
down_revision = '847226e48309'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("""
        UPDATE component
        SET config = CASE
            -- if already has chartType, just do the rename
            WHEN config ? 'chartType' THEN
                jsonb_set(
                    config - 'type',
                    '{grouping}',
                    to_jsonb(config->'type')
                )
            -- else do rename AND inject chartType = "bar"
            ELSE
                jsonb_set(
                    jsonb_set(
                        config - 'type',
                        '{grouping}',
                        to_jsonb(config->'type')
                    ),
                    '{chartType}',
                    to_jsonb('bar'::text)
                )
        END
        WHERE component_type = 'chart' AND config ? 'type';
    """)


def downgrade() -> None:
    pass
