"""add data_source_instance.config column

Revision ID: 4428f2cf7741
Revises: 81c01adb8680
Create Date: 2026-03-31 14:27:32.847042

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4428f2cf7741'
down_revision = '81c01adb8680'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        'data_source_instance',
        sa.Column('config', sa.JSON(), nullable=False, server_default='{}')
    )
    op.execute(
        sa.text(
            "UPDATE data_source_instance"
            " SET config = json_build_object("
            "    'module', 'tol.flows.converters',"
            "    'class_name', convert_class,"
            "    'is_validator', false"
            " )"
            " WHERE convert_class IS NOT NULL"
        )
    )

    op.execute(
        sa.text(
            "UPDATE data_source_instance"
            " SET config = json_build_object("
            "    'module', 'tol.core',"
            "    'class_name', 'DefaultDataObjectToDataObjectConverter,"
            "    'is_validator', false"
            " )"
            " WHERE convert_class IS NULL"
        )
    )


def downgrade() -> None:
    op.drop_column('data_source_instance', 'config')
