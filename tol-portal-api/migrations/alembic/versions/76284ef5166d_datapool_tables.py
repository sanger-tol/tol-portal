"""data_source_config tables

Revision ID: 76284ef5166d
Revises: a487b2575476
Create Date: 2025-07-08 10:25:56.399553

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '76284ef5166d'
down_revision = 'e5f69ea9d468'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        'data_source_instance',
        sa.Column('kwargs', sa.JSON(), nullable=True)
    )
    op.add_column(
        'data_source_instance',
        sa.Column('publish', sa.Boolean(), nullable=True)
    )
    op.create_table(
        'data_source_config',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('description', sa.String(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('name')
    )
    op.create_table(
        'loader_instance',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('loader_id', sa.Integer(), nullable=False),
        sa.Column('source_data_source_instance_id', sa.Integer(), nullable=False),
        sa.Column('destination_data_source_instance_id', sa.Integer(), nullable=False),
        sa.Column('frequency_weekly', sa.Boolean(), nullable=True),
        sa.Column('frequency_daily', sa.Boolean(), nullable=True),
        sa.Column('frequency_hourly', sa.Boolean(), nullable=True),
        sa.Column('frequency_quarter_hourly', sa.Boolean(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(
            ['source_data_source_instance_id'],
            ['data_source_instance.id'],
            ondelete='CASCADE'
        ),
        sa.ForeignKeyConstraint(
            ['destination_data_source_instance_id'],
            ['data_source_instance.id'],
            ondelete='CASCADE'
        ),
        sa.ForeignKeyConstraint(
            ['loader_id'],
            ['loader.id'],
            ondelete='CASCADE'
        )
    )
    op.add_column(
        'data_source_instance',
        sa.Column('data_source_config_id', sa.Integer(), nullable=True)
    )
    op.create_foreign_key(
        'fk_data_source_instance_config',
        'data_source_instance',
        'data_source_config',
        ['data_source_config_id'],
        ['id'],
        ondelete='SET NULL'
    )
    op.create_table(
        'data_source_config_attribute',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('data_source_config_id', sa.Integer(), nullable=False),
        sa.Column('object_type', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('display_name', sa.String(), nullable=True),
        sa.Column('description', sa.String(), nullable=True),
        sa.Column('available_on_relationships', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('is_authoritative', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('source', sa.String(), nullable=True),
        sa.Column('runtime_definition', sa.String(), nullable=True),
        sa.ForeignKeyConstraint(['data_source_config_id'], ['data_source_config.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('data_source_config_id', 'object_type', 'name')
    )
    op.create_table(
        'data_source_config_relationship',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('data_source_config_id', sa.Integer(), nullable=False),
        sa.Column('object_type', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('foreign_object_type', sa.String(), nullable=False),
        sa.Column('foreign_name', sa.String(), nullable=False),
        sa.ForeignKeyConstraint(['data_source_config_id'], ['data_source_config.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('data_source_config_id', 'object_type', 'name'),
        sa.UniqueConstraint('data_source_config_id', 'foreign_object_type', 'foreign_name')
    )
    op.execute(
        sa.text(
            "INSERT INTO data_source_config (name, description) "
            "VALUES ('tol', 'Tree of Life data');"
        )
    )
    op.execute(
        sa.text(
            "INSERT INTO data_source_config (name, description) "
            "VALUES ('test', 'A set of test data');"
        )
    )
    op.execute(
        sa.text(
            "INSERT INTO data_source_config (name, description) "
            "VALUES ('treeofsex', 'Tree of Sex data');"
        )
    )
    op.execute(
        sa.text(
            "INSERT INTO data_source_instance (name, builtin_name, kwargs, publish, data_source_config_id) "
            "VALUES ('test', 'elastic', '{\"product\": \"test\", \"environment\": \"production\"}', true, (SELECT id FROM data_source_config WHERE name = 'test'));"
        )
    )
    op.execute(
        sa.text(
            "INSERT INTO data_source_instance (name, builtin_name, kwargs, publish, data_source_config_id) "
            "VALUES ('tol_building', 'elastic', '{ \"product\": \"portal\", \"environment\": \"building\"}', true, (SELECT id FROM data_source_config WHERE name = 'tol'));"
        )
    )
    op.execute(
        sa.text(
            "INSERT INTO data_source_instance (name, builtin_name, kwargs, publish, data_source_config_id) "
            "VALUES ('treeofsexdb', 'treeofsex', '{}', false, null);"
        )
    )
    op.execute(
        sa.text(
            "INSERT INTO data_source_instance (name, builtin_name, kwargs, publish, data_source_config_id) "
            "VALUES ('treeofsex', 'elastic', '{ \"product\": \"treeofsex\", \"environment\": \"production\"}', true, (SELECT id FROM data_source_config WHERE name = 'treeofsex'));"
        )
    )

    op.execute(
        sa.text(
            "UPDATE data_source_instance set publish=true where builtin_name='tolqc'"
        )
    )

    op.execute(
        sa.text(
            "UPDATE data_source_instance "
            "SET data_source_config_id = (SELECT id FROM data_source_config WHERE name = 'tol'), "
            "kwargs = '{\"product\": \"portal\", \"environment\": \"production\"}', "
            "publish = true, "
            "name = 'tol_production' "
            "WHERE name = 'elastic';"
        )
    )

    # Up to daily loading in tol_production
    op.execute(
        sa.text(
            "INSERT INTO loader_instance (loader_id, source_data_source_instance_id, "
            "destination_data_source_instance_id, frequency_quarter_hourly, frequency_hourly, frequency_daily) "
            "SELECT id, source_data_source_instance_id, destination_data_source_instance_id, frequency_quarter_hourly, frequency_hourly, frequency_daily "
            "FROM loader "
            "WHERE frequency_weekly IS NOT NULL OR frequency_hourly IS NOT NULL OR frequency_daily IS NOT NULL;"
        )
    )

    # Weekly loading in tol_building
    op.execute(
        sa.text(
            "INSERT INTO loader_instance (loader_id, source_data_source_instance_id, "
            "destination_data_source_instance_id, frequency_weekly) "
            "SELECT loader.id, source_data_source_instance_id, data_source_instance.id, frequency_weekly "
            "FROM loader, data_source_instance "
            "WHERE frequency_weekly IS NOT NULL " \
            "AND data_source_instance.name = 'tol_building';"
        )
    )

    op.drop_column(
        'loader',
        'source_data_source_instance_id'
    )
    op.drop_column(
        'loader',
        'destination_data_source_instance_id'
    )
    op.drop_column(
        'loader',
        'frequency_quarter_hourly'
    )
    op.drop_column(
        'loader',
        'frequency_hourly'
    )
    op.drop_column(
        'loader',
        'frequency_daily'
    )
    op.drop_column(
        'loader',
        'frequency_weekly'
    )


    rels = [
        ('run_data', 'benchling_extraction', 'extraction', 'benchling_run_datas'),
        ('run_data', 'benchling_sample', 'sample', 'benchling_run_datas'),
        ('run_data', 'mlwh_sequencing_request', 'sequencing_request', 'mlwh_run_datas'),
        ('run_data', 'mlwh_specimen', 'specimen', 'mlwh_run_datas'),
        ('run_data', 'mlwh_species', 'species', 'mlwh_run_datas'),
        ('run_data', 'mlwh_tolid', 'tolid', 'mlwh_run_datas'),
        ('run_data', 'tolqc_sequencing_request', 'sequencing_request', 'tolqc_run_datas'),
        ('run_data', 'tolqc_specimen', 'specimen', 'tolqc_run_datas'),
        ('run_data', 'tolqc_species', 'species', 'tolqc_run_datas'),
        ('run_data', 'tolqc_tolid', 'tolid', 'tolqc_run_datas'),
        ('sequencing_request', 'benchling_extraction', 'extraction', 'benchling_sequencing_requests'),
        ('sequencing_request', 'benchling_sample', 'sample', 'benchling_sequencing_requests'),
        ('sequencing_request', 'benchling_species', 'species', 'benchling_sequencing_requests'),
        ('sequencing_request', 'benchling_tolid', 'tolid', 'benchling_sequencing_requests'),
        ('sequencing_request', 'benchling_specimen', 'specimen', 'benchling_sequencing_requests'),
        ('sequencing_request', 'benchling_tissue_prep', 'tissue_prep', 'benchling_sequencing_requests'),
        ('sequencing_request', 'mlwh_species', 'species', 'mlwh_sequencing_requests'),
        ('sequencing_request', 'mlwh_tolid', 'tolid', 'mlwh_sequencing_requests'),
        ('sequencing_request', 'mlwh_specimen', 'specimen', 'mlwh_sequencing_requests'),
        ('sequencing_request', 'mlwh_sample', 'sample', 'mlwh_sequencing_requests'),
        ('extraction', 'benchling_sample', 'sample', 'benchling_extractions'),
        ('extraction', 'benchling_species', 'species', 'benchling_extractions'),
        ('extraction', 'benchling_specimen', 'specimen', 'benchling_extractions'),
        ('extraction', 'benchling_tolid', 'tolid', 'benchling_extractions'),
        ('extraction', 'benchling_tissue_prep', 'tissue_prep', 'benchling_extractions'),
        ('extraction', 'benchling_sequencing_requests', 'sequencing_request', 'benchling_extractions'),
        ('sample', 'sts_specimen', 'specimen', 'sts_samples'),
        ('sample', 'benchling_specimen', 'specimen', 'benchling_samples'),
        ('sample', 'sts_species', 'species', 'sts_samples'),
        ('sample', 'benchling_species', 'species', 'benchling_samples'),
        ('sample', 'sts_tolid', 'tolid', 'sts_samples'),
        ('sample', 'tolid_tolid', 'tolid', 'tolid_samples'),
        ('sample', 'benchling_tolid', 'tolid', 'benchling_samples'),
        ('sample', 'sts_manifest', 'manifest', 'sts_samples'),
        ('sample', 'sts_sampleset', 'sampleset', 'sts_samples'),
        ('sample', 'benchling_sequencing_requests', 'sequencing_request', 'benchling_samples'),
        ('sample', 'benchling_tissue_preps', 'tissue_prep', 'benchling_samples'),
        ('sampleset', 'sts_manifests', 'manifest', 'sts_samplesets'),
        ('sampleset', 'sts_samples', 'sample', 'sts_samplesets'),
        ('manifest', 'sts_sampleset', 'sampleset', 'sts_manifests'),
        ('manifest', 'sts_samples', 'sample', 'sts_manifests'),
        ('tolid', 'informatics_specimen', 'specimen', 'informatics_tolids'),
        ('tolid', 'tolid_specimen', 'specimen', 'tolid_tolids'),
        ('tolid', 'tolid_species', 'species', 'tolid_tolids'),
        ('tolid', 'benchling_tissue_preps', 'tissue_prep', 'benchling_tolids'),
        ('tolid', 'grit_curations', 'curation', 'grit_tolids'),
        ('tolid', 'gap_assemblies', 'assembly', 'gap_tolids'),
        ('tolid', 'gn_genome_notes', 'genome_note', 'gn_tolids'),
        ('specimen', 'benchling_extractions', 'extraction', 'benchling_specimens'),
        ('specimen', 'benchling_samples', 'sample', 'benchling_specimens'),
        ('specimen', 'benchling_sequencing_request', 'sequencing_request', 'benchling_specimens'),
        ('specimen', 'mlwh_sequencing_requests', 'sequencing_request', 'mlwh_specimens'),
        ('specimen', 'sts_samples', 'sample', 'sts_specimens'),
        ('species', 'sts_samples', 'sample', 'sts_species'),
        ('species', 'benchling_samples', 'sample', 'benchling_species'),
        ('species', 'benchling_tissue_preps', 'tissue_prep', 'benchling_species'),
        ('species', 'grit_curations', 'curation', 'grit_species'),
        ('species', 'gap_assemblies', 'assembly', 'gap_species'),
        ('species', 'gn_genome_notes', 'genome_note', 'gn_species'),
        ('tissue_prep', 'benchling_species', 'species', 'benchling_tissue_preps'),
        ('tissue_prep', 'benchling_sample', 'sample', 'benchling_tissue_preps'),
        ('tissue_prep', 'benchling_specimen', 'specimen', 'benchling_tissue_preps'),
        ('tissue_prep', 'benchling_tolid', 'tolid', 'benchling_tissue_preps'),
        ('curation', 'grit_species', 'species', 'grit_curations'),
        ('curation', 'grit_tolid', 'tolid', 'grit_curations'),
        ('assembly', 'gap_species', 'species', 'gap_assemblies'),
        ('assembly_analysis', 'gap_species', 'species', 'gap_assembly_analyses'),
        ('assembly_analysis', 'gap_assembly', 'assembly', 'gap_assembly_analyses'),
        ('genome_note', 'gn_assembly', 'assembly', 'gn_assemblies'),
        ('genome_note', 'gn_species', 'species', 'gn_species'),
        ('genome_note', 'gn_tolid', 'tolid', 'gn_tolids')

    ]
    for rel in rels:
        op.execute(
            sa.text(
                "INSERT INTO data_source_config_relationship (data_source_config_id, object_type, name, foreign_object_type, foreign_name) "
                "VALUES ((SELECT id FROM data_source_config WHERE name = 'tol'), :object_type, :name, :foreign_object_type, :foreign_name)"
            ).bindparams(
                object_type=rel[0],
                name=rel[1],
                foreign_object_type=rel[2],
                foreign_name=rel[3]
            )
        )


def downgrade() -> None:
    op.drop_table('data_source_config_relationship')
    op.drop_table('data_source_config_attribute')
    op.drop_table('data_source_config')
