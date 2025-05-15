"""add enricher flows

Revision ID: 847226e48309
Revises: a6742154c867
Create Date: 2025-05-13 09:02:01.342128

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.orm import Session

# revision identifiers, used by Alembic.
revision = '847226e48309'
down_revision = 'a6742154c867'
branch_labels = None
depends_on = None


def upgrade() -> None:

    bind = op.get_bind()
    session = Session(bind=bind)

    result = session.execute(
        sa.text("INSERT INTO data_source_instance (name, builtin_name) VALUES ('goat', 'goat') RETURNING id")
    )
    goat_data_source_instance_id = result.scalar()


    for project in ['DTOL', 'ASG', 'PSYCHE', 'VGP', 'ERGA-BGE', 'ERGA-PIL', 'BAT-1K']:
        # elastic_species_goat
        op.execute('INSERT INTO loader (source_data_source_instance_id, source_object_type, destination_data_source_instance_id, destination_object_type, object_filters, convert_class, prefix, frequency_daily, candidate_key) '
        f'VALUES ({goat_data_source_instance_id}, '
        f'\'taxon\', 1, \'species\', \'{{"and_": {{"long_list": {{"eq": {{"value": "{project}"}}}}, "taxon_rank": {{"eq": {{"value": "species"}}}}}}}}\', \'GoatTaxonToElasticSpeciesConverter\', \'goat\','
        'true, null)')

    # elastic_species_goat - non-projects
    op.execute('INSERT INTO loader (source_data_source_instance_id, source_object_type, destination_data_source_instance_id, destination_object_type, object_filters, convert_class, prefix, candidate_key, frequency_daily, ids_data_source_instance_id, ids_object_type, ids_attribute, ids_object_filters, ids_sort_by, ids_attribute_in_source) '
               f'VALUES ({goat_data_source_instance_id}, \'taxon\', 1, \'species\', null, \'GoatTaxonToElasticSpeciesConverter\', \'goat\',null,'
               'true, 1, \'species\', \'id\', \'{"and_":{"sts_species_id": {"exists": {}}}, "goat_scientific_name":{"exists":{"negate": true}}}\', null, null)')



    # elastic_genome_note_enricher
    op.execute('INSERT INTO loader (source_data_source_instance_id, source_object_type, destination_data_source_instance_id, destination_object_type, object_filters, convert_class, prefix, frequency_daily, candidate_key) '
       'VALUES (1, \'tolid\', 1, \'genome_note\', \'{"and_": {"tolid_species.id": {"exists": {}}}}\', \'ElasticTolidToElasticGenomeNoteUpdateConverter\', \'\','
       'true, \'["gn_tolid.id"]\')')

    # elastic_run_data_enricher
    op.execute('INSERT INTO loader (source_data_source_instance_id, source_object_type, destination_data_source_instance_id, destination_object_type, object_filters, convert_class, prefix, frequency_daily, candidate_key) '
       'VALUES (1, \'sequencing_request\', 1, \'run_data\', null, \'ElasticSequencingRequestToElasticRunDataUpdateConverter\', \'\','
       'true, \'["mlwh_sequencing_request.id"]\')')

    # elastic_sample_enricher - main
    op.execute('INSERT INTO loader (source_data_source_instance_id, source_object_type, destination_data_source_instance_id, destination_object_type, object_filters, convert_class, prefix, frequency_daily, candidate_key) '
       'VALUES (1, \'tolid\', 1, \'sample\', \'{"and_": {"tolid_species.id": {"exists": {}}}}\', \'ElasticTolidToElasticSampleUpdateConverter\', \'\','
       'true, \'["sts_species.id", "sts_specimen.id"]\')')

    # elastic_sample_enricher - subspecies
    op.execute('INSERT INTO loader (source_data_source_instance_id, source_object_type, destination_data_source_instance_id, destination_object_type, object_filters, convert_class, prefix, frequency_daily, candidate_key) '
       'VALUES (1, \'tolid\', 1, \'sample\', \'{"and_": {"tolid_requested_taxonomy_id": {"exists": {}}}}\', \'ElasticTolidToElasticSampleUpdateConverter\', \'\','
       'true, \'["sts_species.id", "sts_specimen.id"]\')')

    # elastic_sequencing_request_enricher
    op.execute('INSERT INTO loader (source_data_source_instance_id, source_object_type, destination_data_source_instance_id, destination_object_type, object_filters, convert_class, prefix, frequency_daily, candidate_key) '
       'VALUES (1, \'sample\', 1, \'sequencing_request\', \'{"and_": {"sts_project": {"eq": {"value": "BIOSCAN"}}}}\', \'ElasticSampleToElasticSequencingRequestUpdateConverter\', \'\','
       'true, \'["mlwh_specimen.id"]\')')

def downgrade() -> None:
    pass
