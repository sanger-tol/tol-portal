"""update file validation config & tables

Revision ID: db0635afe457
Revises: f0cf5e525b9e
Create Date: 2026-02-18 15:05:12.538552

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'db0635afe457'
down_revision = 'f0cf5e525b9e'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.drop_column(
        'upload',
        'is_ready'
    )

    op.add_column(
        'upload',
        sa.Column('rejection_reason', sa.String(), nullable=True),
    )

    op.add_column(
        'upload',
        sa.Column(
            'validation_status',
            sa.String(),
            nullable=False,
            default='in_progress'
        )
    )

    op.add_column(
        'upload',
        sa.Column('hidden', sa.Boolean(), default=False, nullable=False)
    )

    op.add_column(
        'upload',
        sa.Column('upload_name', sa.String(), nullable=True)
    )

    op.execute("""
        UPDATE pipeline_steps
        SET config = jsonb_set(
            jsonb_set(
                config,
                '{config_details,regexes,"SANGER INSTITUTE",0,regex}',
                '"(^SAN\\\\d{8}$)|(^ERGA_[A-Z]{2}_[A-Z]{2}\\\\d{3}$)"'
            ),
            '{config_details,regexes,"SANGER INSTITUTE",0,detail}',
            '"SPECIMEN_ID must start with SAN followed by 8 digits or ERGA format: ERGA_XX_XX000"'
        )
    """)


def downgrade() -> None:
    pass
