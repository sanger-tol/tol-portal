"""add pipeline and pipeline_config

Revision ID: 7d2c8deb3d8a
Revises: eb298c0a75a0
Create Date: 2025-06-16 11:52:10.528469

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = '7d2c8deb3d8a'
down_revision = 'eb298c0a75a0'
branch_labels = None
depends_on = None


def upgrade():
	op.create_table(
		'pipeline',
		sa.Column('id', sa.String(), primary_key=True),
		sa.Column('validation_results', postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default='[]')
	)

	op.create_table(
		'pipeline_config',
		sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
		sa.Column('config', postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default='{}')
	)


def downgrade():
	op.drop_table('pipeline_config')
	op.drop_table('pipeline')
