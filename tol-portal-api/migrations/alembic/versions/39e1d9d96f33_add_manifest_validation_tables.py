"""Add manifest validation tables

Revision ID: 39e1d9d96f33
Revises: 8ab120b0785f
Create Date: 2025-11-25 11:07:02.654302

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = '39e1d9d96f33'
down_revision = '060025da99e4'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table('pipeline',
                    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
                    sa.Column('name', sa.String(), nullable=False, unique=True),
                    sa.Column('config', postgresql.JSONB(), nullable=False, server_default='{}'),
                    sa.PrimaryKeyConstraint('id'),
                    sa.UniqueConstraint('name')
                    )

    op.create_table('pipeline_steps',
                    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
                    sa.Column('pipeline_id', sa.Integer(), nullable=False),
                    sa.Column('step_name', sa.String(), nullable=False),
                    sa.Column('stage', sa.Integer(), nullable=False),
                    sa.Column('step_order', sa.Integer(), nullable=False),
                    sa.Column('config', postgresql.JSONB(), nullable=False, server_default='{}'),
                    sa.ForeignKeyConstraint(['pipeline_id'], ['pipeline.id'], ),
                    sa.PrimaryKeyConstraint('id'),
                    sa.UniqueConstraint(
                        'pipeline_id',
                        'stage',
                        'step_order',
                        name='uq_pipeline_stage_step_order')
                    )

    op.create_table('upload',
                    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
                    sa.Column('s3_bucket', sa.String(), nullable=False),
                    sa.Column('s3_filename', sa.String(), nullable=False),
                    sa.Column('spreadsheet_config', sa.String(), nullable=True),
                    sa.Column('user_id', sa.Integer(), nullable=True),
                    sa.Column('pipeline_id', sa.Integer(), nullable=False),
                    sa.Column('destination', sa.String(), nullable=False),
                    sa.Column('flow_run_id', sa.String(), nullable=True),
                    sa.Column('date_started', sa.DateTime(), nullable=False),
                    sa.Column('validation_results',
                              postgresql.JSONB(),
                              nullable=False,
                              server_default='[]'),
                    sa.Column('completed', sa.Boolean(), default=False, nullable=False),
                    sa.Column('failure_message', sa.String(), nullable=True),
                    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
                    sa.ForeignKeyConstraint(['pipeline_id'], ['pipeline.id'], ),
                    sa.PrimaryKeyConstraint('id')
                    )


def downgrade() -> None:
    pass
