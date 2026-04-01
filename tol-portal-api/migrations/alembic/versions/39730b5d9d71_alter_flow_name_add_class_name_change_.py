"""alter_flow_name_add_class_name_change_status_type_acts_as

Revision ID: 39730b5d9d71
Revises: ede2933e026f
Create Date: 2026-04-01 14:56:46.269010

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '39730b5d9d71'
down_revision = 'ede2933e026f'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.alter_column(
        'action',
        'flow_name',
        existing_type=sa.String(),
        nullable=True
    )
    op.add_column(
        'action',
        sa.Column('class_name', sa.String(), nullable=True)
    )
    op.execute(
        sa.text(
            """
            UPDATE public.data_source_config_attribute
            SET acts_as = 'status'
            WHERE object_type = 'metagenome_status_type'
              AND name = 'id'
            """
        )
    )


def downgrade() -> None:
    pass
