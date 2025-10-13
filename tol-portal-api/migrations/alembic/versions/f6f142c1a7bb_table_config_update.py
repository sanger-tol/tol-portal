"""table_config_update

Revision ID: f6f142c1a7bb
Revises: 76284ef5166d
Create Date: 2025-10-13 08:29:33.152833

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f6f142c1a7bb'
down_revision = '76284ef5166d'
branch_labels = None
depends_on = None



def upgrade() -> None:
    # Update fieldMeta in the config column to remove specified keys
    op.execute("""
        UPDATE component
        SET config = jsonb_set(
            jsonb_set(
                config,
                '{fieldMeta}',
                (config->'fieldMeta') - 'data'::TEXT
            ),
            '{fieldMeta,order}',
            (config->'fieldMeta'->'order') - 'inactive'::TEXT
        )
        WHERE config ? 'fieldMeta';
    """)

    # Remove the action key from the config column as actions not on boards yet
    op.execute("""
        UPDATE component
        SET config = config - 'action'
        WHERE config ? 'action';
    """)

    # Transform sort_by key into defaultSortByAttribute and defaultSortByType
    op.execute("""
        UPDATE component
        SET config = (
            CASE
                WHEN config->>'sort_by' = '' THEN config - 'sort_by'
                ELSE jsonb_set(
                    jsonb_set(
                        config - 'sort_by',
                        '{defaultSortByAttribute}',
                        to_jsonb(
                            CASE
                                WHEN config->>'sort_by' LIKE '-%' THEN substr(config->>'sort_by', 2)
                                ELSE config->>'sort_by'
                            END
                        )
                    ),
                    '{defaultSortByType}',
                    to_jsonb(
                        CASE
                            WHEN config->>'sort_by' LIKE '-%' THEN 'desc'
                            ELSE 'asc'
                        END
                    )
                )
            END
        )
        WHERE config ? 'sort_by';
    """)


def downgrade() -> None:
    pass