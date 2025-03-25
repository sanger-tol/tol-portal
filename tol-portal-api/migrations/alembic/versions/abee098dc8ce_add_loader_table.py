"""Add loader table

Revision ID: abee098dc8ce
Revises: 291513b88fa3
Create Date: 2025-03-20 10:11:35.102719

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Session


# revision identifiers, used by Alembic.
revision = 'abee098dc8ce'
down_revision = '291513b88fa3'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'data_source_instance',
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('name', sa.String, nullable=False),
        sa.Column('builtin_name', sa.String, nullable=False)
    )
    op.create_table(
        'loader',
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('source_data_source_instance_id', sa.Integer, sa.ForeignKey('data_source_instance.id'), nullable=False),
        sa.Column('source_object_type', sa.String, nullable=False),
        sa.Column('destination_data_source_instance_id', sa.Integer, sa.ForeignKey('data_source_instance.id'), nullable=False),
        sa.Column('destination_object_type', sa.String, nullable=False),
        sa.Column('object_filters', JSONB, nullable=False, default={}),
        sa.Column('convert_class', sa.String, nullable=True, default=None),
        sa.Column('prefix', sa.String, nullable=False, default=''),
        sa.Column('candidate_key', sa.String, nullable=True, default=None),
        sa.Column('date_last_run', sa.DateTime, nullable=True)
    )
    bind = op.get_bind()
    session = Session(bind=bind)

    result = session.execute(
        sa.text("INSERT INTO data_source_instance (name, builtin_name) VALUES ('elastic', 'elastic') RETURNING id")
    )
    elastic_data_source_instance_id = result.scalar()
    result = session.execute(
        sa.text("INSERT INTO data_source_instance (name, builtin_name) VALUES ('sts', 'sts') RETURNING id")
    )
    sts_data_source_instance_id = result.scalar()
    result = session.execute(
        sa.text("INSERT INTO data_source_instance (name, builtin_name) VALUES ('gap', 'gap') RETURNING id")
    )
    gap_data_source_instance_id = result.scalar()
    result = session.execute(
        sa.text("INSERT INTO data_source_instance (name, builtin_name) VALUES ('grit', 'grit') RETURNING id")
    )
    grit_data_source_instance_id = result.scalar()
    result = session.execute(
        sa.text("INSERT INTO data_source_instance (name, builtin_name) VALUES ('benchling_warehouse', 'benchling_warehouse') RETURNING id")
    )
    benchling_warehouse_data_source_instance_id = result.scalar()
    result = session.execute(
        sa.text("INSERT INTO data_source_instance (name, builtin_name) VALUES ('mlwh', 'mlwh') RETURNING id")
    )
    mlwh_data_source_instance_id = result.scalar()
    result = session.execute(
        sa.text("INSERT INTO data_source_instance (name, builtin_name) VALUES ('portaldb', 'portaldb') RETURNING id")
    )
    portaldb_data_source_instance_id = result.scalar()
    result = session.execute(
        sa.text("INSERT INTO data_source_instance (name, builtin_name) VALUES ('genome_notes', 'genome_notes') RETURNING id")
    )
    gn_data_source_instance_id = result.scalar()
    result = session.execute(
        sa.text("INSERT INTO data_source_instance (name, builtin_name) VALUES ('tolqc', 'tolqc') RETURNING id")
    )
    tolqc_data_source_instance_id = result.scalar()
    result = session.execute(
        sa.text("INSERT INTO data_source_instance (name, builtin_name) VALUES ('bioscan_extra', 'bioscan_extra') RETURNING id")
    )
    bioscan_extra_data_source_instance_id = result.scalar()
    result = session.execute(
        sa.text("INSERT INTO data_source_instance (name, builtin_name) VALUES ('tolid', 'tolid') RETURNING id")
    )
    tolid_data_source_instance_id = result.scalar()

    result = session.execute(
        sa.text("INSERT INTO data_source_instance (name, builtin_name) VALUES ('tolqc_legacy', 'tolqc_legacy') RETURNING id")
    )
    tolqclegacy_data_source_instance_id = result.scalar()

    result = session.execute(
        sa.text("INSERT INTO data_source_instance (name, builtin_name) VALUES ('informatics', 'informatics') RETURNING id")
    )
    informatics_data_source_instance_id = result.scalar()

    # elastic_assembly_gap
    op.execute('INSERT INTO loader (source_data_source_instance_id, source_object_type, destination_data_source_instance_id, destination_object_type, object_filters, convert_class, prefix) '
               f'VALUES ({gap_data_source_instance_id}, \'assembly\', {elastic_data_source_instance_id}, \'assembly\', \'{{}}\', \'GapAssemblyToElasticAssemblyConverter\', \'gap\')')

    # elastic_banked_sample_sts
    op.execute('INSERT INTO loader (source_data_source_instance_id, source_object_type, destination_data_source_instance_id, destination_object_type, object_filters, convert_class, prefix) '
               f'VALUES ({sts_data_source_instance_id}, \'banked_sample\', {elastic_data_source_instance_id}, \'sample\', \'{{}}\', \'StsBankedSampleToElasticSampleConverter\', \'sts\')')

    # elastic_curation_grit
    op.execute('INSERT INTO loader (source_data_source_instance_id, source_object_type, destination_data_source_instance_id, destination_object_type, object_filters, convert_class, prefix) '
               f'VALUES ({grit_data_source_instance_id}, \'issue\', {elastic_data_source_instance_id}, \'curation\', \'{{"project": {{"in_list": {{"value": ["RC", "GRIT"]}}}}}}\', \'GritIssueToElasticCurationConverter\', \'grit\')')

    # elastic_extraction_benchling
    op.execute('INSERT INTO loader (source_data_source_instance_id, source_object_type, destination_data_source_instance_id, destination_object_type, object_filters, convert_class, prefix) '
               f'VALUES ({benchling_warehouse_data_source_instance_id}, \'extraction\', {elastic_data_source_instance_id}, \'extraction\', \'{{"extraction_type": {{"in_list": {{"value": ["dna", "pooled_dna", "lres", "rna"]}}}}}}\', \'BenchlingExtractionToElasticExtractionConverter\', \'benchling\')')
    op.execute('INSERT INTO loader (source_data_source_instance_id, source_object_type, destination_data_source_instance_id, destination_object_type, object_filters, convert_class, prefix) '
               f'VALUES ({benchling_warehouse_data_source_instance_id}, \'extraction\', {elastic_data_source_instance_id}, \'sequencing_request\', \'{{"extraction_type": {{"eq": {{"value": "lres"}}}}}}\', \'BenchlingExtractionToElasticSequencingRequestConverter\', \'benchling\')')

    # elastic_extraction_mlwh
    op.execute('INSERT INTO loader (source_data_source_instance_id, source_object_type, destination_data_source_instance_id, destination_object_type, object_filters, convert_class, prefix) '
               f'VALUES ({mlwh_data_source_instance_id}, \'long_read_qc_result\', {elastic_data_source_instance_id}, \'extraction\', \'{{}}\', \'MlwhExtractionToElasticExtractionConverter\', \'mlwh\')')

    # elastic_extraction_portaldb
    op.execute('INSERT INTO loader (source_data_source_instance_id, source_object_type, destination_data_source_instance_id, destination_object_type, object_filters, convert_class, prefix) '
               f'VALUES ({portaldb_data_source_instance_id}, \'extraction_event\', {elastic_data_source_instance_id}, \'extraction\', \'{{}}\', null, \'portaldb\')')

    # elastic_genome_note_genome_notes
    op.execute('INSERT INTO loader (source_data_source_instance_id, source_object_type, destination_data_source_instance_id, destination_object_type, object_filters, convert_class, prefix) '
               f'VALUES ({gn_data_source_instance_id}, \'genome_note\', {elastic_data_source_instance_id}, \'genome_note\', \'{{}}\', \'GenomeNotesGenomeNoteToElasticGenomeNoteConverter\', \'gn\')')

    # elastic_manifest_sts
    op.execute('INSERT INTO loader (source_data_source_instance_id, source_object_type, destination_data_source_instance_id, destination_object_type, object_filters, convert_class, prefix) '
               f'VALUES ({sts_data_source_instance_id}, \'manifest\', {elastic_data_source_instance_id}, \'manifest\', \'{{"project.programme": {{"eq": {{"value": "ToL"}}}}}}\', \'StsManifestToElasticManifestConverter\', \'\')')

    # elastic_run_data_tolqc
    op.execute('INSERT INTO loader (source_data_source_instance_id, source_object_type, destination_data_source_instance_id, destination_object_type, object_filters, convert_class, prefix) '
               f'VALUES ({tolqc_data_source_instance_id}, \'data\', {elastic_data_source_instance_id}, \'run_data\', \'{{}}\', \'TolqcDataToElasticRunDataConverter\', \'tolqc\')')

    # elastic_sample_benchling
    op.execute('INSERT INTO loader (source_data_source_instance_id, source_object_type, destination_data_source_instance_id, destination_object_type, object_filters, convert_class, prefix) '
               f'VALUES ({benchling_warehouse_data_source_instance_id}, \'sample\', {elastic_data_source_instance_id}, \'sample\', \'{{}}\', \'BenchlingSampleToElasticSampleConverter\', \'\')')

    # elastic_sample_bioscan_extra
    op.execute('INSERT INTO loader (source_data_source_instance_id, source_object_type, destination_data_source_instance_id, destination_object_type, object_filters, convert_class, prefix, candidate_key) '
               f'VALUES ({bioscan_extra_data_source_instance_id}, \'species\', {elastic_data_source_instance_id}, \'sample\', \'{{}}\', \'BioscanExtraSpeciesToElasticSampleUpdateConverter\', \'bioscan_extra\', \'["bold_species"]\')')

    # elastic_sample_portaldb
    op.execute('INSERT INTO loader (source_data_source_instance_id, source_object_type, destination_data_source_instance_id, destination_object_type, object_filters, convert_class, prefix) '
               f'VALUES ({portaldb_data_source_instance_id}, \'sample_event\', {elastic_data_source_instance_id}, \'sample\', \'{{}}\', null, \'portaldb\')')

    # elastic_sample_project_sts
    op.execute('INSERT INTO loader (source_data_source_instance_id, source_object_type, destination_data_source_instance_id, destination_object_type, object_filters, convert_class, prefix) '
               f'VALUES ({sts_data_source_instance_id}, \'sample_project\', {elastic_data_source_instance_id}, \'sample\', \'{{"project.programme": {{"eq": {{"value": "ToL"}}}}}}\', \'StsSampleProjectToElasticSampleConverter\', \'sts\')')

    # elastic_sample_species_sts
    op.execute('INSERT INTO loader (source_data_source_instance_id, source_object_type, destination_data_source_instance_id, destination_object_type, object_filters, convert_class, prefix) '
               f'VALUES ({sts_data_source_instance_id}, \'sample_species\', {elastic_data_source_instance_id}, \'sample\', \'{{}}\', \'StsSampleSpeciesToElasticSampleConverter\', \'sts\')')

    # elastic_sampleset_sts
    op.execute('INSERT INTO loader (source_data_source_instance_id, source_object_type, destination_data_source_instance_id, destination_object_type, object_filters, convert_class, prefix) '
               f'VALUES ({sts_data_source_instance_id}, \'sampleset\', {elastic_data_source_instance_id}, \'sampleset\', \'{{"project.programme": {{"eq": {{"value": "ToL"}}}}}}\', \'StsSamplesetToElasticSamplesetConverter\', \'sts\')')

    # elastic_sequencing_request_benchling
    op.execute('INSERT INTO loader (source_data_source_instance_id, source_object_type, destination_data_source_instance_id, destination_object_type, object_filters, convert_class, prefix) '
               f'VALUES ({benchling_warehouse_data_source_instance_id}, \'sequencing_request\', {elastic_data_source_instance_id}, \'sequencing_request\', \'{{"sequencing_platform": {{"in_list": {{"value": ["pacbio", "hic", "rnaseq", "wgs"]}}}}}}\', \'BenchlingSequencingRequestToElasticSequencingRequestConverter\', \'benchling\')')

    # elastic_sequencing_request_portaldb
    op.execute('INSERT INTO loader (source_data_source_instance_id, source_object_type, destination_data_source_instance_id, destination_object_type, object_filters, convert_class, prefix) '
               f'VALUES ({portaldb_data_source_instance_id}, \'sequencing_request_event\', {elastic_data_source_instance_id}, \'sequencing_request\', \'{{}}\', null, \'portaldb\')')

    # elastic_sequencing_request_tolqc
    op.execute('INSERT INTO loader (source_data_source_instance_id, source_object_type, destination_data_source_instance_id, destination_object_type, object_filters, convert_class, prefix) '
               f'VALUES ({tolqc_data_source_instance_id}, \'sample\', {elastic_data_source_instance_id}, \'sequencing_request\', \'{{}}\', \'TolqcSampleToElasticSequencingRequestConverter\', \'tolqc\')')

    # elastic_species_portaldb
    op.execute('INSERT INTO loader (source_data_source_instance_id, source_object_type, destination_data_source_instance_id, destination_object_type, object_filters, convert_class, prefix) '
               f'VALUES ({portaldb_data_source_instance_id}, \'species_event\', {elastic_data_source_instance_id}, \'species\', \'{{}}\', null, \'portaldb\')')

    # elastic_species_sts
    op.execute('INSERT INTO loader (source_data_source_instance_id, source_object_type, destination_data_source_instance_id, destination_object_type, object_filters, convert_class, prefix) '
               f'VALUES ({sts_data_source_instance_id}, \'species\', {elastic_data_source_instance_id}, \'species\', \'{{}}\', \'StsSpeciesToElasticSpeciesConverter\', \'sts\')')

    # elastic_species_tolid
    op.execute('INSERT INTO loader (source_data_source_instance_id, source_object_type, destination_data_source_instance_id, destination_object_type, object_filters, convert_class, prefix) '
               f'VALUES ({tolid_data_source_instance_id}, \'species\', {elastic_data_source_instance_id}, \'species\', \'{{"id": {{"gt": {{"value": 0}}}}}}\', null, \'tolid\')')

    # elastic_species_tolqc
    op.execute('INSERT INTO loader (source_data_source_instance_id, source_object_type, destination_data_source_instance_id, destination_object_type, object_filters, convert_class, prefix) '
               f'VALUES ({tolqc_data_source_instance_id}, \'species\', {elastic_data_source_instance_id}, \'species\', \'{{}}\', \'TolqcSpeciesToElasticSpeciesConverter\', \'tolqc\')')

    # elastic_species_tolqclegacy
    op.execute('INSERT INTO loader (source_data_source_instance_id, source_object_type, destination_data_source_instance_id, destination_object_type, object_filters, convert_class, prefix) '
               f'VALUES ({tolqclegacy_data_source_instance_id}, \'species\', {elastic_data_source_instance_id}, \'species\', \'{{}}\', null, \'tolqclegacy\')')

    # elastic_specimen_sts
    op.execute('INSERT INTO loader (source_data_source_instance_id, source_object_type, destination_data_source_instance_id, destination_object_type, object_filters, convert_class, prefix) '
               f'VALUES ({sts_data_source_instance_id}, \'specimen\', {elastic_data_source_instance_id}, \'specimen\', \'{{}}\', null, \'sts\')')

    # elastic_tissue_prep_benchling
    op.execute('INSERT INTO loader (source_data_source_instance_id, source_object_type, destination_data_source_instance_id, destination_object_type, object_filters, convert_class, prefix) '
               f'VALUES ({benchling_warehouse_data_source_instance_id}, \'tissue_prep\', {elastic_data_source_instance_id}, \'tissue_prep\', \'{{}}\', \'BenchlingTissuePrepToElasticTissuePrepConverter\', \'benchling\')')

    # elastic_tissue_prep_portaldb
    op.execute('INSERT INTO loader (source_data_source_instance_id, source_object_type, destination_data_source_instance_id, destination_object_type, object_filters, convert_class, prefix) '
               f'VALUES ({portaldb_data_source_instance_id}, \'tissue_prep_event\', {elastic_data_source_instance_id}, \'tissue_prep\', \'{{}}\', null, \'portaldb\')')

    # elastic_tolid_informatics
    op.execute('INSERT INTO loader (source_data_source_instance_id, source_object_type, destination_data_source_instance_id, destination_object_type, object_filters, convert_class, prefix) '
               f'VALUES ({informatics_data_source_instance_id}, \'tolid\', {elastic_data_source_instance_id}, \'tolid\', \'{{}}\', null, \'informatics\')')

    # elastic_tolid_portaldb
    op.execute('INSERT INTO loader (source_data_source_instance_id, source_object_type, destination_data_source_instance_id, destination_object_type, object_filters, convert_class, prefix) '
               f'VALUES ({portaldb_data_source_instance_id}, \'tolid_event\', {elastic_data_source_instance_id}, \'tolid\', \'{{}}\', null, \'portaldb\')')

    # elastic_tolid_tolid
    op.execute('INSERT INTO loader (source_data_source_instance_id, source_object_type, destination_data_source_instance_id, destination_object_type, object_filters, convert_class, prefix) '
               f'VALUES ({tolid_data_source_instance_id}, \'tolid\', {elastic_data_source_instance_id}, \'tolid\', \'{{}}\', \'TolidSpecimenToElasticTolidConverter\', \'\')')

    # elastic_tolid_tolqc
    op.execute('INSERT INTO loader (source_data_source_instance_id, source_object_type, destination_data_source_instance_id, destination_object_type, object_filters, convert_class, prefix) '
               f'VALUES ({tolqc_data_source_instance_id}, \'specimen\', {elastic_data_source_instance_id}, \'tolid\', \'{{}}\', null, \'tolqc\')')

    # HOURLY JOB
    # elastic_sample_benchling


def downgrade() -> None:
    op.drop_table('loader')
    op.drop_table('data_source_instance')
