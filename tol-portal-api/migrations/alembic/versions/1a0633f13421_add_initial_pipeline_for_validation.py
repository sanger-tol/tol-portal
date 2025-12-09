"""Add initial pipeline for validation

Revision ID: 1a0633f13421
Revises: 39e1d9d96f33
Create Date: 2025-11-26 11:06:28.603036

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import table, column
from sqlalchemy import String, Integer, JSON


# revision identifiers, used by Alembic.
revision = "1a0633f13421"
down_revision = "39e1d9d96f33"
branch_labels = None
depends_on = None


def upgrade() -> None:
    pipeline_table = table("pipeline",
                           column("id", Integer),
                           column("name", String),
                           column("config", JSON)
                           )

    pipeline_data = [
        {"id": 1, "name": "DTOL Manifest Validation", "config": {"source": {
            "module": "tol.excel",
            "factory": "s3_excel_datasource_factory",
            "object_type": "upload",
            "kwargs": {"sheetname": "Metadata Entry"}
        }}}
    ]

    op.bulk_insert(pipeline_table, pipeline_data)

    steps_table = table("pipeline_steps",
                        column("id", Integer),
                        column("pipeline_id", Integer),
                        column("step_name", String),
                        column("stage", Integer),
                        column("step_order", Integer),
                        column("config", JSON)
                        )
    steps_data = [
        {
            "id": 1,
            "pipeline_id": 1,
            "step_name": "Can Submit to ENA",
            "stage": 1,
            "step_order": 1,
            "config": {
                "config_details": {
                    "field_name": "TAXON_ID"
                }
            },
            "module": "tol.validators",
            "class_name": "EnaSubmittableValidator",
            "is_validator": True
        },
        {
            "id": 2,
            "pipeline_id": 1,
            "step_name": "Unique rack/tube or plate/well IDs",
            "stage": 1,
            "step_order": 2,
            "config": {
                "config_details": {
                    "unique_keys": ["RACK_OR_PLATE_ID", "TUBE_OR_WELL_ID"],
                    "detail": "Must only be one target specimen id per rack/tube or plate/well combination.",
                    "is_error": True
                }
            },
            "module": "tol.validators",
            "class_name": "UniqueValuesValidator",
            "is_validator": True
        },
        {
            "id": 3,
            "pipeline_id": 1,
            "step_name": "ToLID Species Check",
            "stage": 1,
            "step_order": 3,
            "config": {
                "config_details": {
                    "species_id_field": "TAXON_ID",
                    "specimen_id_field": "SPECIMEN_ID",
                    "error_ignore_field": "SYMBIONT",
                    "error_ignore_value": "SYMBIONT",
                    "warning_detail": "Species not known in the ToLID service."
                }
            },
            "module": "tol.validators",
            "class_name": "TolidValidator",
            "is_validator": True
        },
        {
            "id": 4,
            "pipeline_id": 1,
            "step_name": "Rack/Plate ID or Tube/Well ID Present",
            "stage": 1,
            "step_order": 4,
            "config": {
                "config_details": {
                    "keys": ["RACK_OR_PLATE_ID", "TUBE_OR_WELL_ID"],
                    "non_valid_values": ["NOT_COLLECTED", "NOT_PROVIDED", "NOT_APPLICABLE", "NA"]
                }
            },
            "module": "tol.validators",
            "class_name": "MinOneValidValueValidator",
            "is_validator": True
        },
        {
            "id": 5,
            "pipeline_id": 1,
            "step_name": "Pattern Matching",
            "stage": 1,
            "step_order": 5,
            "config": {
                "config_details": {
                    "regexes": {
                        [
                            {
                                "key": "TUBE_OR_WELL_ID",
                                "regex": "^[a-zA-Z]{2}\\d{8}$",
                                "is_error": False
                            },
                            {
                                "key": "RACK_OR_PLATE_ID",
                                "regex": "^[a-zA-Z]{2}\\d{8}$",
                                "is_error": False
                            },
                            {
                                "key": "TIME_ELAPSED_FROM_COLLECTION_TO_PRESERVATION",
                                "regex": "^\\d+|NOT_COLLECTED|NOT_PROVIDED|NOT_APPLICABLE$",
                                "is_error": True
                            },
                            {
                                "key": "TIME_OF_COLLECTION",
                                "regex": "^([0-1][0-9]|2[0-4]):[0-5]\\d$|^$",
                                "is_error": True
                            },
                            {
                                "key": "SERIES",
                                "regex": "^\\d+$",
                                "is_error": True
                            }
                        ]
                    }
                }
            },
            "module": "tol.validators",
            "class_name": "RegexValidator",
            "is_validator": True
        },
        {
            "id": 6,
            "pipeline_id": 1,
            "step_name": "Specimens Have Same Taxon",
            "stage": 1,
            "step_order": 6,
            "config": {
                "config_details": {
                    "taxon_id_field": "TAXON_ID",
                    "symbiont_field": "SYMBIONT",
                    "specimen_id_field": "SPECIMEN_ID"
                }
            },
            "module": "tol.validators",
            "class_name": "SpecimensHaveSameTaxonValidator",
            "is_validator": True
        },
        {
            "id": 7,
            "pipeline_id": 1,
            "step_name": "Symbiont Target Consistency",
            "stage": 1,
            "step_order": 7,
            "config": {
                "config_details": {
                    "first_field_where": {
                        "field": "SYMBIONT",
                        "operator": "!=",
                        "value": "SYMBIONT",
                        "is_error": True
                    },
                    "second_field_where": {
                        "field": "SYMBIONT",
                        "operator": "==",
                        "value": "SYMBIONT",
                        "is_error": True
                    },
                    "target_fields": [
                        "RACK_OR_PLATE_ID",
                        "TUBE_OR_WELL_ID"
                    ],
                    "detail": "All symbionts must have a TARGET with same rack/plate and tube/well"
                }
            },
            "module": "tol.validators",
            "class_name": "MutuallyExclusiveValidator",
            "is_validator": True
        },
        {
            "id": 8,
            "pipeline_id": 1,
            "step_name": "Specimen Barcoding Consistency",
            "stage": 1,
            "step_order": 8,
            "config": {
                "config_details": {
                    "condition": {
                        "field": "TISSUE_REMOVED_FOR_BARCODING",
                        "operator": "!=",
                        "value": "Y",
                        "is_error": True
                    },
                    "assertions": [
                        {
                            "field": "PLATE_ID_FOR_BARCODING",
                            "operator": "==",
                            "value": "NOT_APPLICABLE",
                            "is_error": True
                        },
                        {
                            "field": "TUBE_OR_WELL_ID_FOR_BARCODING",
                            "operator": "==",
                            "value": "NOT_APPLICABLE",
                            "is_error": True
                        },
                        {
                            "field": "TISSUE_FOR_BARCODING",
                            "operator": "==",
                            "value": "NOT_APPLICABLE",
                            "is_error": True
                        },
                        {
                            "field": "BARCODE_PLATE_PRESERVATIVE",
                            "operator": "==",
                            "value": "NOT_APPLICABLE",
                            "is_error": True
                        }
                    ]
                },
            },
            "module": "tol.validators",
            "class_name": "AssertOnConditionValidator",
            "is_validator": True
        },
        {
            "id": 9,
            "pipeline_id": 1,
            "step_name": "GAL Pattern Matching",
            "stage": 1,
            "step_order": 9,
            "config": {
                "config_details": {
                    "key_column": "GAL",
                    "regexes": {
                        "GAL_1": [
                            {
                                "key": "SPECIMEN_ID",
                                "pattern": "^<PREFIX_REGEX_FOR_GAL_1>.*<SUFFIX_REGEX_FOR_GAL_1>$",
                                "detail": "SPECIMEN_ID does not match required pattern for GAL_1",
                                "is_error": True
                            }
                        ],
                        "GAL_2": [
                            {
                                "key": "SPECIMEN_ID",
                                "pattern": "^<PREFIX_REGEX_FOR_GAL_2>.*<SUFFIX_REGEX_FOR_GAL_2>$",
                                "detail": "SPECIMEN_ID does not match required pattern for GAL_2",
                                "is_error": True
                            }
                        ],
                        "GAL_3": [
                            {
                                "key": "SPECIMEN_ID",
                                "pattern": "^<PREFIX_REGEX_FOR_GAL_3>.*<SUFFIX_REGEX_FOR_GAL_3>$",
                                "detail": "SPECIMEN_ID does not match required pattern for GAL_3",
                                "is_error": True
                            }
                        ]
                    }
                }
            },
            "module": "tol.validators",
            "class_name": "RegexByValueValidator",
            "is_validator": True
        },
        {
            "id": 10,
            "pipeline_id": 1,
            "step_name": "Required STS Fields Present",
            "stage": 1,
            "step_order": 10,
            "config": {
                "config_details": {
                    "project_code": "DTOL",
                }
            },
            "module": "tol.validators",
            "class_name": "StsFieldsValidator",
            "is_validator": True
        },
        {
            "id": 11,
            "pipeline_id": 1,
            "step_name": "Manifest Passes ENA Checklist",
            "stage": 1,
            "step_order": 11,
            "config": {
                "config_details": {
                    "ena_checklist_id": "ERC000053",
                }
            },
            "module": "tol.validators",
            "class_name": "EnaChecklistValidator",
            "is_validator": True
        },
        {
            "id": 12,
            "pipeline_id": 1,
            "step_name": "Allowed Values (STS)",
            "stage": 1,
            "step_order": 12,
            "config": {
                "config_details": [
                    {
                        "datasource_instance_id": "sts",
                        "datasource_object_type": "lifestage",
                        "datasource_field_name": "name",
                        "field_name": "LIFESTAGE"
                    },
                    {
                        "datasource_instance_id": "sts",
                        "datasource_object_type": "sex",
                        "datasource_field_name": "name",
                        "field_name": "SEX"
                    },
                    {
                        "datasource_instance_id": "sts",
                        "datasource_object_type": "organism_part",
                        "datasource_field_name": "name",
                        "field_name": "ORGANISM_PART"
                    },
                    {
                        "datasource_instance_id": "sts",
                        "datasource_object_type": "gal",
                        "datasource_field_name": "name",
                        "field_name": "GAL"
                    },
                    {
                        "datasource_instance_id": "sts",
                        "datasource_object_type": "tissue_size",
                        "datasource_field_name": "size",
                        "field_name": "SIZE_OF_TISSUE_IN_TUBE"
                    },
                    {
                        "datasource_instance_id": "sts",
                        "datasource_object_type": "organism_part",
                        "datasource_field_name": "name",
                        "field_name": "TISSUE_FOR_BARCODING"
                    },
                    {
                        "datasource_instance_id": "sts",
                        "datasource_object_type": "hazard_group",
                        "datasource_field_name": "level",
                        "field_name": "HAZARD_GROUP"
                    },
                    # {
                    #     "datasource_instance_id": "sts",
                    #     "datasource_object_type": "specimen_purpose",
                    #     "datasource_field_name": "purpose",
                    #     "field_name": "PURPOSE_OF_SPECIMEN"
                    # },
                ]
            },
            "module": "tol.validators",
            "class_name": "AllowedValuesFromDataSourceValidator",
            "is_validator": True
        },
        {
            "id": 13,
            "pipeline_id": 1,
            "step_name": "Allowed Values",
            "stage": 1,
            "step_order": 13,
            "config": {
                "config_details": {
                    [
                        {
                            "field": "DIFFICULT_OR_HIGH_PRIORITY_SAMPLE",
                            "allowed_values": [
                                "HIGH_PRIORITY",
                                "DIFFICULT",
                                "NOT_APPLICABLE",
                                "NOT_PROVIDED",
                                "NOT_COLLECTED",
                                "FULL_CURATION"
                            ],
                            "is_error": True
                        },
                        {
                            "field": "TISSUE_REMOVED_FOR_BARCODING",
                            "allowed_values": ["Y", "N", "NOT_COLLECTED", "NOT_APPLICABLE", "NOT_PROVIDED"],
                            "is_error": True
                        },
                        {
                            "field": "REGULATORY_COMPLIANCE",
                            "allowed_values": ["Y", "N", "NOT_APPLICABLE"],
                            "is_error": True
                        },
                        {
                            "field": "SPECIMEN_ID_RISK",
                            "allowed_values": ["Y", "N"]
                        },
                        {
                            "field": "BARCODING_HUB",
                            "allowed_values": [
                                "UNIVERSITY OF OXFORD",
                                "MARINE BIOLOGICAL ASSOCIATION",
                                "ROYAL BOTANIC GARDEN EDINBURGH",
                                "NATURAL HISTORY MUSEUM",
                                "ROYAL BOTANIC GARDENS KEW/NATURAL HISTORY MUSEUM",
                                "NOT_COLLECTED",
                                "NOT_APPLICABLE",
                                "NOT_PROVIDED"
                            ],
                            "is_error": True
                        },
                        {
                            "field": "BARCODING_STATUS",
                            "allowed_values": [
                                "DNA_BARCODING_COMPLETED",
                                "DNA_BARCODE_EXEMPT",
                                "DNA_BARCODING_FAILED",
                                "DNA_BARCODING_VIA_WSI_PROCESS"
                            ],
                            "is_error": True
                        },
                        {
                            "field": "SAMPLE_FORMAT",
                            "allowed_values": [
                                "live biological sample from infectious organism",
                                "inactivated biological sample from infectious organism",
                                "biological sample/tissue from non-infectious organism",
                                "DNA",
                                "RNA"
                            ],
                            "is_error": True
                        }
                    ],
                }
            },
            "module": "tol.validators",
            "class_name": "AllowedValuesValidator",
            "is_validator": True
        },
    ]
    op.bulk_insert(steps_table, steps_data)


def downgrade() -> None:
    pass
