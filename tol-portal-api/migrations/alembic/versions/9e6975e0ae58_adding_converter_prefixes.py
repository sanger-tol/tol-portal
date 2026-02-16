"""adding_converter_prefixes

Revision ID: 9e6975e0ae58
Revises: c83d3dc6e323
Create Date: 2026-02-16 10:46:39.575964

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import table, column


# revision identifiers, used by Alembic.
revision = '9e6975e0ae58'
down_revision = 'c83d3dc6e323'
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    loader = table(
        'loader',
        column('convert_class', sa.String()),
        column('prefix', sa.String()),
    )

    mappings = {
        'BioscanImageToElasticSampleUpdateConverter': 'bioscan_image',
        'StsManifestToElasticManifestConverter': 'sts',
        'StsProjectToElasticSampleUpdateConverter': 'sts',
        'TolidSpecimenToElasticTolidConverter': 'tolid',
    }

    empty_prefix = sa.or_(loader.c.prefix.is_(None), loader.c.prefix == '')

    for convert_class, prefix in mappings.items():
        update_statement = (
            sa.update(loader)
            .where(
                sa.and_(
                    empty_prefix,
                    loader.c.convert_class == convert_class,
                )
            )
            .values(prefix=prefix)
        )
        bind.execute(update_statement)


def downgrade() -> None:
    pass
