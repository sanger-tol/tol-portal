"""builtin and api

Revision ID: 31bcd610a2b1
Revises: b77923994607
Create Date: 2026-06-12 16:58:18.408837

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '31bcd610a2b1'
down_revision = 'b77923994607'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        'data_source_instance',
        sa.Column('direct_name', sa.String(), nullable=True)
    )
    op.add_column(
        'data_source_instance',
        sa.Column('direct_kwargs', sa.JSON(), nullable=True)
    )
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
        SET direct_name = builtin_name, direct_kwargs = kwargs
        """
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
    op.drop_column('data_source_instance', 'direct_name')
    op.drop_column('data_source_instance', 'direct_kwargs')
    op.drop_column('data_source_instance', 'api_name')
    op.drop_column('data_source_instance', 'api_kwargs')
