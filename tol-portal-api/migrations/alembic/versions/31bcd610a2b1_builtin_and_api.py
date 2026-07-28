"""builtin and api

Revision ID: 31bcd610a2b1
Revises: 5f3a925dad6b
Create Date: 2026-06-12 16:58:18.408837

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '31bcd610a2b1'
down_revision = '5f3a925dad6b'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.alter_column('data_source_instance', 'builtin_name', new_column_name='direct_name')
    op.alter_column('data_source_instance', 'kwargs', new_column_name='direct_kwargs')
    op.add_column(
        'data_source_instance',
        sa.Column('api_name', sa.String(), nullable=True)
    )
    op.add_column(
        'data_source_instance',
        sa.Column('api_kwargs', sa.JSON(), nullable=True)
    )

    op.execute(
        """
        UPDATE data_source_instance
        SET api_name = 'portal',
            api_kwargs = json_build_object(
                'dataspace', id
            )
        WHERE direct_name = 'elastic'
        AND publish = true
        """
    )


def downgrade() -> None:
    op.alter_column('data_source_instance', 'direct_name', new_column_name='builtin_name')
    op.alter_column('data_source_instance', 'direct_kwargs', new_column_name='kwargs')
    op.drop_column('data_source_instance', 'api_name')
    op.drop_column('data_source_instance', 'api_kwargs')
