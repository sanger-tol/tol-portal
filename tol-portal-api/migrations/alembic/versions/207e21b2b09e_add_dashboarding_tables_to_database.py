"""add dashboarding tables to database

Revision ID: 207e21b2b09e
Revises: 1dcbe2a4cf42
Create Date: 2025-01-15 15:43:47.701361

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB

# revision identifiers, used by Alembic.
revision = '207e21b2b09e'
down_revision = '1dcbe2a4cf42'
branch_labels = None
depends_on = None


def upgrade():
    # Create table `component`
    op.create_table(
        'component',
        sa.Column('id', sa.String, primary_key=True),
        sa.Column('title', sa.String, nullable=False),
        sa.Column('object_type', sa.String, nullable=False),
        sa.Column('base_url', sa.String, nullable=True),
        sa.Column('component_type', sa.String, nullable=False),
        sa.Column('widget_type', sa.String, nullable=False),
        sa.Column('config', JSONB, nullable=False),
        sa.Column('filter', JSONB, nullable=False, default={}, server_default='{}'),
        sa.Column('user_id', sa.Integer, sa.ForeignKey('user.id'), nullable=False)
    )

    # Create table `zone`
    op.create_table(
        'zone',
        sa.Column('id', sa.String, primary_key=True),
        sa.Column('title', sa.String, nullable=False),
        sa.Column('object_type', sa.String, nullable=False),
        sa.Column('base_url', sa.String, nullable=True),
        sa.Column('filter', JSONB, nullable=False, default={}, server_default='{}'),
        sa.Column('user_id', sa.Integer, sa.ForeignKey('user.id'), nullable=False)
    )

    # Create table `view`
    op.create_table(
        'view',
        sa.Column('id', sa.String, primary_key=True),
        sa.Column('title', sa.String, nullable=False),
        sa.Column('filter', JSONB, nullable=False, default={}, server_default='{}'),
        sa.Column('user_id', sa.Integer, sa.ForeignKey('user.id'), nullable=False)
    )

    # Create table `board`
    op.create_table(
        'board',
        sa.Column('id', sa.String, primary_key=True),
        sa.Column('title', sa.String, nullable=False),
        sa.Column('filter', JSONB, nullable=False, default={}, server_default='{}'),
        sa.Column('user_id', sa.Integer, sa.ForeignKey('user.id'), nullable=False)
    )

    # Create table `component_zone`
    op.create_table(
        'component_zone',
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('order', sa.Integer, nullable=False),
        sa.Column('component_id', sa.String, sa.ForeignKey('component.id'), nullable=False),
        sa.Column('zone_id', sa.String, sa.ForeignKey('zone.id'), nullable=False)
    )

    # Create table `zone_view`
    op.create_table(
        'zone_view',
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('order', sa.Integer, nullable=False),
        sa.Column('zone_id', sa.String, sa.ForeignKey('zone.id'), nullable=False),
        sa.Column('view_id', sa.String, sa.ForeignKey('view.id'), nullable=False)
    )

    # Create table `view_board`
    op.create_table(
        'view_board',
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('order', sa.Integer, nullable=False),
        sa.Column('view_id', sa.String, sa.ForeignKey('view.id'), nullable=False),
        sa.Column('board_id', sa.String, sa.ForeignKey('board.id'), nullable=False)
    )

    # add order uniqueness constraints
    op.create_unique_constraint(
        None,
        'component_zone',
        ['zone_id', 'order']
    )
    op.create_unique_constraint(
        None,
        'zone_view',
        ['view_id', 'order']
    )
    op.create_unique_constraint(
        None,
        'view_board',
        ['board_id', 'order']
    )


def downgrade():
    # Drop tables in reverse order of creation
    op.drop_table('board')
    op.drop_table('view_board')
    op.drop_table('view')
    op.drop_table('zone_view')
    op.drop_table('zone')
    op.drop_table('component_zone')
    op.drop_table('component')