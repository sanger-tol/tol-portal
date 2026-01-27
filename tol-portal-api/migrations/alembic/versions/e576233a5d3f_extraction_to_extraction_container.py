"""extraction to extraction container

Revision ID: e576233a5d3f
Revises: bbc207dbbf53
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
        'con_BzqGm4Cu': 'bfi_bXoRetjG',
        'con_mQXTh1Au': 'bfi_bXoRetjG',
        'con_VdvdSgbu': 'bfi_C9dG4fCT',	
        'con_MSaITmFQ': 'bfi_C9dG4fCT',	
        'con_RyIWfLj0': 'bfi_F0c9l8iR',	
        'con_4VjXyU1E': 'bfi_NZCdXKez',	
        'con_aXEtix0Y': 'bfi_NZCdXKez',	
        'con_K5EuTN4P': 'bfi_SvYnn5cE',
        'con_bHfrft6y': 'bfi_SvYnn5cE',	
        'con_vNbfi0eI': 'bfi_TB6zwgs4',
        'con_cv8EsO0a': 'bfi_TB6zwgs4'	
    }
    for extraction_container_id, extraction_id in mappings.items():
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
