"""add_sample_status_attribute

Revision ID: f1436e01b2cd
Revises: 0585189d6b2e
Create Date: 2026-06-04 15:16:56.573059

"""
from alembic import op


# revision identifiers, used by Alembic.
revision = 'f1436e01b2cd'
down_revision = '0585189d6b2e'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        INSERT INTO public.data_source_config_attribute (
            data_source_config_id,
            object_type,
            name,
            display_name,
            description,
            available_on_relationships,
            is_authoritative,
            source,
            runtime_definition_old,
            runtime_definition,
            acts_as
        )
        VALUES (
            1,
            'sample',
            'ready_for_lab_date',
            'Date Ready for General Lab/Pipeline',
            'Date when arrival checklist status changed to Ready for General Lab/Pipeline.',
            false,
            false,
            'sts',
            null,
            null,
            null
        );
        """
    )


def downgrade() -> None:
    op.execute(
        """
        DELETE FROM public.data_source_config_attribute
        WHERE data_source_config_id = 1
          AND object_type = 'sample'
          AND name = 'ready_for_lab_date';
        """
    )
