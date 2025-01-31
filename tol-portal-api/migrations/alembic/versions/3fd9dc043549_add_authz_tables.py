"""add authz tables

Revision ID: 3fd9dc043549
Revises: 9ce06a984e70
Create Date: 2025-01-31 07:59:04.351807

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3fd9dc043549'
down_revision = '9ce06a984e70'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        'role',
        sa.Column('system_access', sa.Boolean(), nullable=False, default=False)
    )

    # Create tables for each model

    op.create_table(
        'membership',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('parent_id', sa.Integer(), nullable=True),
        sa.Column('name', sa.String(), nullable=True),
        sa.ForeignKeyConstraint(['parent_id'], ['membership.id']),
        sa.PrimaryKeyConstraint('id')
    )
    
    op.create_table(
        'user_membership',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('membership_id', sa.Integer(), nullable=True),
        sa.Column('role_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['user.id']),
        sa.ForeignKeyConstraint(['membership_id'], ['membership.id']),
        sa.ForeignKeyConstraint(['role_id'], ['role.id']),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_table(
        'source',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_table(
        'data_object_type',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('source_id', sa.Integer(), nullable=True),
        sa.Column('name', sa.String(), nullable=True),
        sa.ForeignKeyConstraint(['source_id'], ['source.id']),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_table(
        'need',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('data_object_type_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['data_object_type_id'], ['data_object_type.id']),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_table(
        'data_object_type_attribute',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('data_object_type_id', sa.Integer(), nullable=True),
        sa.Column('name', sa.String(), nullable=True),
        sa.Column('system', sa.Boolean(), nullable=False, default=False),
        sa.ForeignKeyConstraint(['data_object_type_id'], ['data_object_type.id']),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_table(
        'membership_data_object_type',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('membership_id', sa.Integer(), nullable=True),
        sa.Column('data_object_type_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['membership_id'], ['membership.id']),
        sa.ForeignKeyConstraint(['data_object_type_id'], ['data_object_type.id']),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_table(
        'membership_data_object_type_allowed_attribute',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('membership_data_object_type_id', sa.Integer(), nullable=True),
        sa.Column('data_object_type_attribute_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['membership_data_object_type_id'], ['membership_data_object_type.id']),
        sa.ForeignKeyConstraint(['data_object_type_attribute_id'], ['data_object_type_attribute.id']),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_table(
        'membership_need',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('membership_id', sa.Integer(), nullable=True),
        sa.Column('need_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['membership_id'], ['membership.id']),
        sa.ForeignKeyConstraint(['need_id'], ['need.id']),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_table(
        'source_membership',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('source_id', sa.Integer(), nullable=True),
        sa.Column('membership_id', sa.Integer(), nullable=True),
        sa.Column('source_member_ship_object_name', sa.String(), nullable=True),
        sa.ForeignKeyConstraint(['source_id'], ['source.id']),
        sa.ForeignKeyConstraint(['membership_id'], ['membership.id']),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_table(
        'method',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('identifier', sa.String(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_table(
        'need_method',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('need_id', sa.Integer(), nullable=True),
        sa.Column('method_id', sa.Integer(), nullable=True),
        sa.Column('role_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['need_id'], ['need.id']),
        sa.ForeignKeyConstraint(['method_id'], ['method.id']),
        sa.ForeignKeyConstraint(['role_id'], ['role.id']),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    pass
