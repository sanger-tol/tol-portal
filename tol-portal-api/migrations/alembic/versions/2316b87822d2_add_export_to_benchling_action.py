"""add export to benchling action

Revision ID: 2316b87822d2
Revises: 51c4f6492a16
Create Date: 2025-07-21 09:29:44.106666

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.orm import Session


# revision identifiers, used by Alembic.
revision = '2316b87822d2'
down_revision = '51c4f6492a16'
branch_labels = None
depends_on = None


def upgrade() -> None:
    connection = op.get_bind()
    session = Session(bind=connection)
    session.execute(
            sa.text(
                """
                INSERT INTO action ("name", object_type, flow_name, params)
                VALUES (
                    'Export into Benchling',
                    'sample',
                    'elastic_tum_benchling',
                    '{
                        "action": "tum",
                        "create_entity": true,
                        "folder_name": "Core Lab Entities",
                        "requirements": {
                            "calc_biospecimen_id": {"exists": {}},
                            "sts_tubeid": {"exists": {}},
                            "sts_species.sts_scientific_name": {"exists": {}},
                            "sts_species.id": {"exists": {}},
                            "sts_specimen.id": {"exists": {}},
                            "sts_organism_part": {"exists": {}},
                            "sts_lifestage": {"exists": {}},
                            "sts_preservation_approach": {"exists": {}},
                            "sts_sex": {"exists": {}},
                            "sts_tissue_size": {"exists": {}},
                            "sts_programme": {"exists": {}},
                            "sts_biosample_accession": {"exists": {}},
                            "sts_submit_date": {"exists": {}},
                            "sts_sampleset.id": {"exists": {}},
                            "sts_project": {"exists": {}},
                            "sts_species.sts_taxon_group": {"exists": {}},
                            "sts_species.sts_genome_size": {"exists": {}},
                            "sts_rackid": {"exists": {}},
                            "sts_pos_in_rack": {"exists": {}},
                            "sts_labwhere_parentage": {"exists": {}},
                            "sts_labwhere_name": {"exists": {}},
                            "sts_cost_code": {"exists": {}},
                            "sts_sequencescape_study_id": {"exists": {}}
                        }
                    }'::JSONB
                );
                """
            )
        )


def downgrade() -> None:
    pass
