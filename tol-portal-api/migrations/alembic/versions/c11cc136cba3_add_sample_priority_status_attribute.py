"""add_sample_priority_status_attribute

Revision ID: c11cc136cba3
Revises: 4428f2cf7741
Create Date: 2026-05-08 11:03:01.877218

"""
from alembic import op


# revision identifiers, used by Alembic.
revision = 'c11cc136cba3'
down_revision = '4428f2cf7741'
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
            'species',
            'sts_sample_sts_priority_status',
            'Prioritised',
            'Human-readable priority status derived from sts_sample_sts_priority_max. Displays Yes when priority value is 1, 2 or 3; otherwise displays No.',
            false,
            false,
            'calc',
            null,
            jsonb_build_object(
                'type',
                'keyword',
                'script',
                $$
                if (doc.containsKey('sts_sample_sts_priority_max') &&
                    doc['sts_sample_sts_priority_max'].size() > 0) {
                    def value = doc['sts_sample_sts_priority_max'].value;
                    if (value == 1 || value == 2 || value == 3) {
                        emit('Yes');
                    } else {
                        emit('No');
                    }
                } else {
                    emit('No');
                }
                $$
            ),
            null
        );
        """
    )


def downgrade() -> None:
    op.execute(
        """
        DELETE FROM public.data_source_config_attribute
        WHERE data_source_config_id = 1
                    AND object_type = 'species'
          AND name = 'sts_sample_sts_priority_status';
        """
    )
