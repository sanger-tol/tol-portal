"""empty message

Revision ID: 4c93e179786d
Revises: 
Create Date: 2023-06-09 10:24:40.607260

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5c93e179786d'
down_revision = '4c93e179786d'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'sequencing_request_event',
        sa.Column('sample_ref', sa.String(255), primary_key=True),
        sa.Column('date_sent_to_sciops', sa.DateTime, nullable=False),
    )

def downgrade() -> None:
    op.drop_table('sequencing_request')
