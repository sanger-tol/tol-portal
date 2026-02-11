"""add_web_app_table

Revision ID: f0cf5e525b9e
Revises: c83d3dc6e323
Create Date: 2026-02-09 11:52:31.378119

"""

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Session


# revision identifiers, used by Alembic.
revision = 'f0cf5e525b9e'
down_revision = 'c83d3dc6e323'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "web_app",
        sa.Column("id", sa.String(), primary_key=True, nullable=False),
        sa.Column("navigation", JSONB, nullable=False, server_default=sa.text("'{}'::JSONB")),
        sa.Column("profile_navigation", JSONB, nullable=False, server_default=sa.text("'{}'::JSONB")),
    )

    connection = op.get_bind()
    session = Session(bind=connection)

    session.execute(
        sa.text(
            """
            INSERT INTO web_app (id, navigation, profile_navigation)
            VALUES (
                'tol_portal',
                '{
                  "data": {
                    "Home": {
                      "access": "public",
                      "path": {
                        "pageElementReference": "b_Crt4ZZEssGP0",
                        "route": "/"
                      }
                    },
                    "Taxa": {
                      "access": "role_required",
                      "pages": {
                        "data": {
                          "Species": {
                            "access": "role_required",
                            "path": {
                              "pageElementReference": "b_TZG77Ww4sJea"
                            }
                          },
                          "Species Detail": {
                            "access": "role_required",
                            "path": {
                              "pageElementReference": "species-detail",
                              "route": "/species/\\:id"
                            }
                          },
                          "Specimen": {
                            "access": "role_required",
                            "path": {
                              "pageElementReference": "b_YLymR9X6JnBL"
                            }
                          },
                          "ToLIDs": {
                            "access": "role_required",
                            "path": {
                              "pageElementReference": "b_nBFQFABaRVss"
                            }
                          }
                        },
                        "order": ["Species", "Specimen", "ToLIDs"]
                      }
                    },
                    "Samples": {
                      "access": "role_required",
                      "pages": {
                        "data": {
                          "Sample Sets": {
                            "access": "role_required",
                            "path": {
                              "pageElementReference": "b_GdykdLnDcZLF"
                            }
                          },
                          "Manifests": {
                            "access": "role_required",
                            "path": {
                              "pageElementReference": "b_X8SD2Q9R1SOZ"
                            }
                          },
                          "Samples": {
                            "access": "role_required",
                            "path": {
                              "pageElementReference": "b_pF6935aPXMpE"
                            }
                          }
                        },
                        "order": ["Sample Sets", "Manifests", "Samples"]
                      }
                    },
                    "Pipeline": {
                      "access": "role_required",
                      "pages": {
                        "data": {
                          "Extractions": {
                            "access": "role_required",
                            "path": {
                              "pageElementReference": "b_8IQkJw3bnOz8"
                            }
                          },
                          "Requests": {
                            "access": "role_required",
                            "path": {
                              "pageElementReference": "b_NZqOBUMH09zm"
                            }
                          },
                          "Runs": {
                            "access": "role_required",
                            "path": {
                              "pageElementReference": "b_P23qqk6w1L1a"
                            }
                          },
                          "Curations": {
                            "access": "role_required",
                            "path": {
                              "pageElementReference": "b_C3ytfvrNtdQS"
                            }
                          },
                          "Genome Notes": {
                            "access": "role_required",
                            "path": {
                              "pageElementReference": "b_7lZd0mVA8EQC"
                            }
                          }
                        },
                        "order": ["Extractions", "Requests", "Runs", "Curations", "Genome Notes"]
                      }
                    },
                    "Additional": {
                      "access": "role_required",
                      "pages": {
                        "data": {
                          "Recollection": {
                            "access": "role_required",
                            "path": {
                              "pageElementReference": "b_tZkO2SpA5miW"
                            }
                          },
                          "Sample Selection": {
                            "access": "role_required",
                            "path": {
                              "pageElementReference": "sample-selection"
                            }
                          },
                          "TUM": {
                            "access": "role_required",
                            "path": {
                              "pageElementReference": "tum"
                            }
                          },
                          "TUM Steps": {
                            "access": "role_required",
                            "path": {
                              "pageElementReference": "tum-steps"
                            }
                          },
                          "ARA Review": {
                            "access": "role_required",
                            "path": {
                              "pageElementReference": "ara-review"
                            }
                          },
                          "Samples Stuck": {
                            "access": "role_required",
                            "path": {
                              "pageElementReference": "b_8g6ZHtngq1fv"
                            }
                          },
                          "Project Management": {
                            "access": "role_required",
                            "path": {
                              "pageElementReference": "project-management"
                            }
                          },
                          "Loaders": {
                            "access": "role_required",
                            "path": {
                              "pageElementReference": "b_wPbyR6z3mwBs"
                            }
                          },
                          "Attributes": {
                            "access": "role_required",
                            "path": {
                              "pageElementReference": "b_YbMdsOMnwRRc"
                            }
                          }
                        },
                        "order": ["Recollection", "Sample Selection", "TUM", "TUM Steps", "ARA Review", "Samples Stuck", "Project Management", "Loaders", "Attributes"]
                      }
                    },
                    "Tools": {
                      "access": "authenticated",
                      "pages": {
                        "data": {
                          "Manifest Validation": {
                            "access": "authenticated",
                            "path": {
                              "pageElementReference": "manifest-validation"
                            }
                          }
                        },
                        "order": ["Manifest Validation"]
                      }
                    },
                    "Public": {
                      "access": "public",
                      "pages": {
                        "data": {
                          "Public Species": {
                            "access": "public",
                            "path": {
                              "pageElementReference": "b_abxAtD6Adf0c",
                              "route": "/public/species"
                            }
                          },
                          "Core Lab Data": {
                            "access": "public",
                            "path": {
                              "pageElementReference": "core-lab-data",
                              "route": "/public/core-lab-data"
                            }
                          }
                        },
                        "order": ["Public Species", "Core Lab Data"]
                      }
                    }
                  },
                  "order": ["Taxa", "Samples", "Pipeline", "Additional", "Tools", "Public"]
                }'::JSONB,
                '{}'::JSONB
            );
            """
        )
    )


def downgrade() -> None:
    op.drop_table("web_app")
