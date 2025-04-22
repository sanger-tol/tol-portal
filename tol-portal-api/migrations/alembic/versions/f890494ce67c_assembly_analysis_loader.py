"""assembly_analysis loader

Revision ID: f890494ce67c
Revises: 1d6f32212917
Create Date: 2025-04-22 13:16:42.118177

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f890494ce67c'
down_revision = '1d6f32212917'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute('INSERT INTO loader (source_data_source_instance_id, source_object_type, destination_data_source_instance_id, destination_object_type, object_filters, convert_class, prefix) '
        f'VALUES (3, \'assembly\', 1, \'assembly_analysis\', \'{{}}\', \'GapAssemblyToElasticAssemblyAnalysisConverter\', \'gap\')')


def downgrade() -> None:
    pass
