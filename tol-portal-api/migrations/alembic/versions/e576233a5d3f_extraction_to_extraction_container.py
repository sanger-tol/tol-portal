"""extraction to extraction container

Revision ID: e576233a5d3f
Revises: fde0a833b72a
Create Date: 2026-01-20 11:37:31.079812

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e576233a5d3f'
down_revision = 'fde0a833b72a'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table('extraction_container_event',
        sa.Column('extraction_container_id', sa.VARCHAR(length=255), primary_key=True, nullable=False),
        sa.Column('date_abandoned', sa.TIMESTAMP(timezone=True), nullable=True),
        sa.Column('abandoned_by', sa.VARCHAR(length=255), nullable=True),
        sa.Column('date_topup_actioned', sa.TIMESTAMP(timezone=True), nullable=True),
        sa.Column('topup_actioned_by', sa.VARCHAR(length=255), nullable=True),
    )
    mappings = {
        'bfi_SvYnn5cE': '1',
        'bfi_F0c9l8iR': '2',
        'bfi_C9dG4fCT': '3',
        'bfi_PFiZlcHL': '4',
        'bfi_BLFqDTN5eD': '5',
        'bfi_G2MzFpAQ': '6',
        'bfi_J1bt5HQ2': '7',
        'bfi_Vpl1Xsyp': '8',
        'bfi_bXoRetjG': '9',
        'bfi_TB6zwgs4': '10',
        'bfi_NZCdXKez': '11'
    }
    for extraction_id, extraction_container_id in mappings.items():
        op.execute(
            f"""
            INSERT INTO extraction_container_event (extraction_container_id, date_abandoned, abandoned_by, date_topup_actioned, topup_actioned_by)
            SELECT '{extraction_container_id}', date_abandoned, abandoned_by, date_topup_actioned, topup_actioned_by
            FROM extraction_event
            WHERE extraction_id = '{extraction_id}';
            """
        )
    op.drop_table('extraction_event')


def downgrade() -> None:
    pass
