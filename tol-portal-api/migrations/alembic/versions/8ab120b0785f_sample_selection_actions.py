"""sample selection actions

Revision ID: 8ab120b0785f
Revises: f6f142c1a7bb
Create Date: 2025-11-05 14:26:12.535167

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8ab120b0785f'
down_revision = 'f6f142c1a7bb'
branch_labels = None
depends_on = None


def upgrade() -> None:
    worklists_new = {
        'LRES - DNA extraction (NEW)': 'ROUTINE tissue to prep for LRES DNA extraction',
        'LRES - DNA extraction + HiC (NEW)': 'ROUTINE tissue to prep for LRES DNA extraction + HiC',
        'HiC (NEW)': 'ROUTINE tissue to prep for HiC',
        'HiC only (NEW)': 'ROUTINE Priority HiC only worklist (PB data available)',
        'HiC + RNA (NEW)': 'ROUTINE tissue to prep for HiC + RNA',
        'RNA (NEW)': 'ROUTINE tissue to prep for RNA',
        'PiMmS (NEW)': 'ROUTINE tissue for PiMmS',
    }
    worklists_existing = {
        'LRES - DNA extraction': 'ROUTINE tissue to prep for LRES DNA extraction',
        'LRES - DNA extraction + HiC': 'ROUTINE tissue to prep for LRES DNA extraction + HiC',
        'HiC': 'ROUTINE tissue to prep for HiC',
        'HiC only': 'ROUTINE Priority HiC only worklist (PB data available)',
        'HiC + RNA': 'ROUTINE tissue to prep for HiC + RNA',
        'RNA': 'ROUTINE tissue to prep for RNA',
        'PiMmS': 'ROUTINE tissue for PiMmS',
    }

    for name, worklist_name in (worklists_new | worklists_existing).items():
        op.execute(f"""
            INSERT INTO action (name, object_type, flow_name, params)
            VALUES
            ('{name}',
                'sample',
                'elastic_tum_benchling',
                '{{
                    "action": "tum",
                    "folder_name": "Core Lab Entities",
                    "requirements": {{
                        "sts_sex": {{
                        "exists": {{}}
                        }},
                        "sts_rackid": {{
                        "exists": {{}}
                        }},
                        "sts_tubeid": {{
                        "exists": {{}}
                        }},
                        "sts_project": {{
                        "exists": {{}}
                        }},
                        "sts_cost_code": {{
                        "exists": {{}}
                        }},
                        "sts_lifestage": {{
                        "exists": {{}}
                        }},
                        "sts_programme": {{
                        "exists": {{}}
                        }},
                        "sts_species.id": {{
                        "exists": {{}}
                        }},
                        "sts_pos_in_rack": {{
                        "exists": {{}}
                        }},
                        "sts_specimen.id": {{
                        "exists": {{}}
                        }},
                        "sts_submit_date": {{
                        "exists": {{}}
                        }},
                        "sts_tissue_size": {{
                        "exists": {{}}
                        }},
                        "sts_sampleset.id": {{
                        "exists": {{}}
                        }},
                        "sts_labwhere_name": {{
                        "exists": {{}}
                        }},
                        "sts_organism_part": {{
                        "exists": {{}}
                        }},
                        "calc_biospecimen_id": {{
                        "exists": {{}}
                        }},
                        "sts_labwhere_parentage": {{
                        "exists": {{}}
                        }},
                        "sts_biosample_accession": {{
                        "exists": {{}}
                        }},
                        "sts_preservation_approach": {{
                        "exists": {{}}
                        }},
                        "sts_sequencescape_study_id": {{
                        "exists": {{}}
                        }},
                        "sts_species.sts_genome_size": {{
                        "exists": {{}}
                        }},
                        "sts_species.sts_taxon_group": {{
                        "exists": {{}}
                        }},
                        "sts_species.sts_scientific_name": {{
                        "exists": {{}}
                        }}
                    }},
                    "worklist_name": "{worklist_name}"
                }}'
            )
        """)

    op.execute("""
        UPDATE action
        SET params = params || '{"requirements": {"benchling_eln_tissue_id": {"exists": {}}}}'
        WHERE name in ('""" + "','".join(worklists_existing.keys()) + """');
    """)
    op.execute("""
        UPDATE action
        SET params = params || '{"create_entity": true, "requirements": {"benchling_eln_tissue_id": {"exists": {"negate": true}}}}'
        WHERE name in ('""" + "','".join(worklists_new.keys()) + """');
    """)

    existing = [
        'Export into Benchling'
    ]
    op.execute("""
        UPDATE action
        SET params = params || '{"requirements": {"benchling_eln_tissue_id": {"exists": {"negate": true}}}}'
        WHERE name in ('""" + "','".join(existing) + """');
    """)


def downgrade() -> None:
    pass
