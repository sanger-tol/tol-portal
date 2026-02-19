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
revision = '1a0633f13421'
down_revision = '39e1d9d96f33'
branch_labels = None
depends_on = None


def upgrade() -> None:
    pipeline_table = table('pipeline',
                           column('id', Integer),
                           column('name', String),
                           column('config', JSON)
                           )

    pipeline_data = [
        {'id': 1, 'name': 'DTOL Manifest Validation', 'config': {'source': {
            'module': 'tol.excel',
            'factory': 's3_excel_datasource_factory',
            'object_type': 'upload',
            'kwargs': {'sheetname': 'Metadata Entry'}
        }}}
    ]

    op.bulk_insert(pipeline_table, pipeline_data)

    steps_table = table('pipeline_steps',
                        column('id', Integer),
                        column('pipeline_id', Integer),
                        column('step_name', String),
                        column('stage', Integer),
                        column('step_order', Integer),
                        column('is_visible', sa.Boolean),
                        column('config', JSON),
                        column('description', String),
                        )
    steps_data = [
        {
            'id': 1,
            'pipeline_id': 1,
            'step_name': 'Sanitise Incoming Manifest',
            'stage': 1,
            'step_order': 1,
            'is_visible': False,
            'config': {
                'module': 'tol.core',
                'class_name': 'SanitisingConverter',
                'is_validator': False
            },
            'description': ''
        },
        {
            'id': 2,
            'pipeline_id': 1,
            'step_name': 'Convert Pipes to Lists',
            'stage': 1,
            'step_order': 2,
            'is_visible': False,
            'config': {
                'config_details': {
                    'fields_to_convert': [
                        'COMMON_NAME',
                        'ORGANISM_PART',
                        'COLLECTED_BY',
                        'COLLECTOR_AFFILIATION',
                        'COLLECTOR_EMAIL',
                        'IDENTIFIED_BY',
                        'IDENTIFIER_AFFILIATION',
                        'IDENTIFIER_EMAIL',
                        'PRESERVED_BY',
                        'PRESERVER_AFFILIATION',
                        'PRESERVER_EMAIL'
                    ]},
                'module': 'tol.flows.converters',
                'class_name': 'IncomingSampleToIncomingSampleWithListsConverter',
                'is_validator': False
            },
            'description': ''
        },
        {
            'id': 18,
            'pipeline_id': 1,
            'step_name': 'Skip Null Fields Converter',
            'stage': 1,
            'step_order': 3,
            'is_visible': False,
            'config': {
                'module': 'tol.flows.converters',
                'class_name': 'SkipNullFieldsConverter',
                'is_validator': False,
                "config_details": {
                    "field_names": [
                        "SPECIMEN_ID",
                        "TUBE_OR_WELL_ID"
                    ]
                }
            },
            'description': ''
        },
        {
            'id': 3,
            'pipeline_id': 1,
            'step_name': 'Taxon ID/s submittable to ENA',
            'stage': 2,
            'step_order': 1,
            'is_visible': True,
            'config': {
                'config_details': {
                    'field_name': 'TAXON_ID'
                },
                'module': 'tol.validators',
                'class_name': 'EnaSubmittableValidator',
                'is_validator': True
            },
            'description': 'Checks that the given TAXON_IDs are suitable for submission to ENA. To qualify, the TAXON_ID must be ranked at species level (ENA “rank” : “species”), ENA accepts them as submittable (ENA “submittable” : “true”) and the species name qualifies as binomial (ENA “binomial” : “true”). This can be checked at https://www.ebi.ac.uk/ena/taxonomy/rest/scientific-name/1234 where 1234 = taxon ID.',
        },
        {
            'id': 4,
            'pipeline_id': 1,
            'step_name': 'Unique RACK_OR_PLATE_ID and TUBE_OR_WELL_ID combinations',
            'stage': 2,
            'step_order': 2,
            'is_visible': True,
            'config': {
                'config_details': {
                    'unique_keys': [['RACK_OR_PLATE_ID', 'TUBE_OR_WELL_ID']],
                    'detail': 'Must only be one target specimen id per rack/tube or plate/well combination.',
                    'is_error': True
                },
                'module': 'tol.validators',
                'class_name': 'UniqueValuesValidator',
                'is_validator': True
            },
            'description': 'Checks that, within the manifest, the concatenation of the RACK_OR_PLATE_ID and TUBE_OR_WELL_ID, is unique (i.e. no tubes entered twice).',

        },
        {
            'id': 5,
            'pipeline_id': 1,
            'step_name': 'ToLID Species Check',
            'stage': 2,
            'step_order': 3,
            'is_visible': True,
            'config': {
                'config_details': {
                    'species_id_field': 'TAXON_ID',
                    'specimen_id_field': 'SPECIMEN_ID',
                    'error_ignore_field': 'SYMBIONT',
                    'error_ignore_value': 'SYMBIONT',
                    'warning_detail': 'Species not known in the ToLID service.'
                },
                'module': 'tol.validators',
                'class_name': 'TolidValidator',
                'is_validator': True
            },
            'description': 'Checks that the TAXON_IDs are in the ToLID service. If the specimen_ID exists in the TOLID service, it must have the same TAXON_ID.',
        },
        {
            'id': 6,
            'pipeline_id': 1,
            'step_name': 'Rack/Plate ID or Tube/Well ID Present',
            'stage': 2,
            'step_order': 4,
            'is_visible': True,
            'config': {
                'config_details': {
                    'keys': ['RACK_OR_PLATE_ID', 'TUBE_OR_WELL_ID'],
                    'non_valid_values': ['NOT_COLLECTED', 'NOT_PROVIDED', 'NOT_APPLICABLE', 'NA']
                },
                'module': 'tol.validators',
                'class_name': 'MinOneValidValueValidator',
                'is_validator': True
            },
            'description': 'Checks that meaningful information is present in RACK_OR_PLATE_ID or TUBE_OR_WELL_ID. NOT_COLLECTED or NOT_PROVIDED can be present in RACK_OR_PLATE_ID, but not TUBE_OR_WELL_ID.\nIf providing a plate, you may use A1 - H12 in the TUBE_OR_WELL_ID and the RACK_OR_PLATE_ID must be meaningful.\nIf providing a tube, use FluidX barcode or other meaningful ID and the RACK_OR_PLATE_ID can be meaningful or NOT_PROVIDED.'
        },
        {
            'id': 7,
            'pipeline_id': 1,
            'step_name': 'Pattern Matching',
            'stage': 2,
            'step_order': 5,
            'is_visible': True,
            'config': {
                'config_details': {
                    'regexes': [
                        {
                            'key': 'RACK_OR_PLATE_ID',
                            'regex': '^[a-zA-Z]{2}\\d{8}$',
                            'is_error': False
                        },
                        {
                            'key': 'TIME_ELAPSED_FROM_COLLECTION_TO_PRESERVATION',
                            'regex': '^\\d+|NOT_COLLECTED|NOT_PROVIDED|NOT_APPLICABLE$',
                            'is_error': True
                        },
                        {
                            'key': 'SERIES',
                            'regex': '^\\d+$',
                            'is_error': True
                        },
                        {
                            'key': 'COLLECTION_LOCATION',
                            'regex': r'^.* \| .*$',
                            'is_error': False
                        }
                    ]
                },
                'module': 'tol.validators',
                'class_name': 'RegexValidator',
                'is_validator': True
            },
            'description': 'Gives a warning if TUBE_OR_WELL_ID is not in expected fluidX format (FB1234567), RACK_OR_PLATE_ID is not in expected fluidX format (FB1234567, Time elapsed is numerical, Series is numerical.',
        },
        {
            'id': 8,
            'pipeline_id': 1,
            'step_name': 'Type Checking',
            'stage': 2,
            'step_order': 6,
            'is_visible': True,
            'config': {
                'config_details': {
                    'allowed_types': {
                        'TIME_OF_COLLECTION': 'time',
                    },
                    'is_error': False
                },
                'module': 'tol.validators',
                'class_name': 'TypesValidator',
                'is_validator': True
            },
            'description': 'Checks that TIME_OF_COLLECTION is a time in the manifest.',
        }, {
            'id': 9,
            'pipeline_id': 1,
            'step_name': 'Specimens Have Same Taxon',
            'stage': 2,
            'step_order': 7,
            'is_visible': True,
            'config': {
                'config_details': {
                    'taxon_id_field': 'TAXON_ID',
                    'symbiont_field': 'SYMBIONT',
                    'specimen_id_field': 'SPECIMEN_ID'
                },
                'module': 'tol.validators',
                'class_name': 'SpecimensHaveSameTaxonValidator',
                'is_validator': True
            },
            'description': 'Within the manifest, checks that specimens that feature in more than one sample (row) on the manifest, the TAXON_ID matches.',
        },
        {
            'id': 11,
            'pipeline_id': 1,
            'step_name': 'Barcoding fields consistency',
            'stage': 2,
            'step_order': 9,
            'is_visible': True,
            'config': {
                'config_details': {
                    'condition': {
                        'field': 'TISSUE_REMOVED_FOR_BARCODING',
                        'operator': '!=',
                        'value': 'Y',
                        'is_error': True
                    },
                    'assertions': [
                        {
                            'field': 'PLATE_ID_FOR_BARCODING',
                            'operator': '==',
                            'value': 'NOT_APPLICABLE',
                            'is_error': True
                        },
                        {
                            'field': 'TUBE_OR_WELL_ID_FOR_BARCODING',
                            'operator': '==',
                            'value': 'NOT_APPLICABLE',
                            'is_error': True
                        },
                        {
                            'field': 'TISSUE_FOR_BARCODING',
                            'operator': '==',
                            'value': 'NOT_APPLICABLE',
                            'is_error': True
                        },
                        {
                            'field': 'BARCODE_PLATE_PRESERVATIVE',
                            'operator': '==',
                            'value': 'NOT_APPLICABLE',
                            'is_error': True
                        }
                    ]
                },
                'module': 'tol.validators',
                'class_name': 'AssertOnConditionValidator',
                'is_validator': True
            },
            'description': 'Where no tissue removed for barcoding, ensures that the rest of the barcoding fields contain NOT_APPLICABLE.',
        },
        {
            'id': 13,
            'pipeline_id': 1,
            'step_name': 'Specimen_ID format correct for GAL',
            'stage': 2,
            'step_order': 11,
            'is_visible': True,
            'config': {
                'config_details': {
                    'key_column': 'GAL',
                    'regexes': {

                        'UNIVERSITY OF OXFORD': [
                            {
                                'key': 'SPECIMEN_ID',
                                'regex': '^Ox\\d{6}$',
                                'detail': 'SPECIMEN_ID must start with "Ox" followed by 6 digits (e.g. Ox123456)',
                                'is_error': True
                            }
                        ],

                        'MARINE BIOLOGICAL ASSOCIATION': [
                            {
                                'key': 'SPECIMEN_ID',
                                'regex': '^MBA-\\d{6}-\\d{3}[A-Z]$',
                                'detail': 'SPECIMEN_ID must be MBA-######-###X (e.g. MBA-123456-001A)',
                                'is_error': True
                            }
                        ],

                        'ROYAL BOTANIC GARDENS KEW': [
                            {
                                'key': 'SPECIMEN_ID',
                                'regex': '^KDTOL\\d{5}$',
                                'detail': 'SPECIMEN_ID must start with KDTOL followed by 5 digits',
                                'is_error': True
                            }
                        ],

                        'ROYAL BOTANIC GARDEN EDINBURGH': [
                            {
                                'key': 'SPECIMEN_ID',
                                'regex': '^EDTOL\\d{5}$',
                                'detail': 'SPECIMEN_ID must start with EDTOL followed by 5 digits',
                                'is_error': True
                            }
                        ],

                        'EARLHAM INSTITUTE': [
                            {
                                'key': 'SPECIMEN_ID',
                                'regex': '^EI_\\d{5}$',
                                'detail': 'SPECIMEN_ID must start with EI_ followed by 5 digits',
                                'is_error': True
                            }
                        ],

                        'NATURAL HISTORY MUSEUM': [
                            {
                                'key': 'SPECIMEN_ID',
                                'regex': '^NHMUK\\d{9}$',
                                'detail': 'SPECIMEN_ID must start with NHMUK followed by 9 digits',
                                'is_error': True
                            }
                        ],

                        "SANGER INSTITUTE": [
                            {
                                "key": "SPECIMEN_ID",
                                "regex": "(^SAN\\d{8}$)|(^BLAX\\d{8}$)|(^ERGA_[A-Z]{2}_[A-Z]{2}\\d{3}$)",
                                "detail": "SPECIMEN_ID must start with SAN|BLAX followed by 7 digits or ERGA format: ERGA_XX_XX000",
                                "is_error": True
                            }
                        ],

                        'UNIVERSITY OF DERBY': [
                            {
                                'key': 'SPECIMEN_ID',
                                'regex': '^UDUK$',
                                'detail': 'SPECIMEN_ID must start with UDUK',
                                'is_error': True
                            }
                        ],

                        'DALHOUSIE UNIVERSITY': [
                            {
                                'key': 'SPECIMEN_ID',
                                'regex': '^DU$',
                                'detail': 'SPECIMEN_ID must start with DU',
                                'is_error': True
                            }
                        ],

                        'NOVA SOUTHEASTERN UNIVERSITY': [
                            {
                                'key': 'SPECIMEN_ID',
                                'regex': '^NSU$',
                                'detail': 'SPECIMEN_ID must start with NSU',
                                'is_error': True
                            }
                        ],

                        'GEOMAR HELMHOLTZ CENTRE': [
                            {
                                'key': 'SPECIMEN_ID',
                                'regex': '^GHC$',
                                'detail': 'SPECIMEN_ID must start with GHC',
                                'is_error': True
                            }
                        ],

                        'UNIVERSITY OF BRITISH COLUMBIA': [
                            {
                                'key': 'SPECIMEN_ID',
                                'regex': '^UOBC$',
                                'detail': 'SPECIMEN_ID must start with UOBC',
                                'is_error': True
                            }
                        ],

                        'UNIVERSITY OF VIENNA (MOLLUSC)': [
                            {
                                'key': 'SPECIMEN_ID',
                                'regex': '^VIEM$',
                                'detail': 'SPECIMEN_ID must start with VIEM',
                                'is_error': True
                            }
                        ],

                        'QUEEN MARY UNIVERSITY OF LONDON': [
                            {
                                'key': 'SPECIMEN_ID',
                                'regex': '^QMOUL$',
                                'detail': 'SPECIMEN_ID must start with QMOUL',
                                'is_error': True
                            }
                        ],

                        'THE SAINSBURY LABORATORY': [
                            {
                                'key': 'SPECIMEN_ID',
                                'regex': '^SL$',
                                'detail': 'SPECIMEN_ID must start with SL',
                                'is_error': True
                            }
                        ],

                        'PORTLAND STATE UNIVERSITY': [
                            {
                                'key': 'SPECIMEN_ID',
                                'regex': '^PORT$',
                                'detail': 'SPECIMEN_ID must start with PORT',
                                'is_error': True
                            }
                        ],

                        'UNIVERSITY OF RHODE ISLAND': [
                            {
                                'key': 'SPECIMEN_ID',
                                'regex': '^URI$',
                                'detail': 'SPECIMEN_ID must start with URI',
                                'is_error': True
                            }
                        ],

                        'UNIVERSITY OF CALIFORNIA': [
                            {
                                'key': 'SPECIMEN_ID',
                                'regex': '^UCALI$',
                                'detail': 'SPECIMEN_ID must start with UCALI',
                                'is_error': True
                            }
                        ],

                        'SENCKENBERG RESEARCH INSTITUTE': [
                            {
                                'key': 'SPECIMEN_ID',
                                'regex': '^SENCK$',
                                'detail': 'SPECIMEN_ID must start with SENCK',
                                'is_error': True
                            }
                        ],

                        'UNIVERSITY OF VIENNA (CEPHALOPOD)': [
                            {
                                'key': 'SPECIMEN_ID',
                                'regex': '^VIEC$',
                                'detail': 'SPECIMEN_ID must start with VIEC',
                                'is_error': True
                            }
                        ],

                        'UNIVERSITY OF ORGEON': [
                            {
                                'key': 'SPECIMEN_ID',
                                'regex': '^UOREG$',
                                'detail': 'SPECIMEN_ID must start with UOREG',
                                'is_error': True
                            }
                        ]
                    }
                },
                'module': 'tol.validators',
                'class_name': 'RegexByValueValidator',
                'is_validator': True
            },
            'description': 'Checks that the correct specimen_ID format is used for the selected GAL'
        },
        {
            'id': 14,
            'pipeline_id': 1,
            'step_name': 'Required STS Fields Present',
            'stage': 2,
            'step_order': 12,
            'is_visible': True,
            'config': {
                'config_details': {
                    'project_code': 'DTOL'
                },
                'module': 'tol.validators',
                'class_name': 'StsFieldsValidator',
                'is_validator': True
            },
            'description': 'Looks at allowed values specified in the manifest and ensures matches (e.g. min/max characters etc.)',
        },
        {
            'id': 15,
            'pipeline_id': 1,
            'step_name': 'Manifest Passes ENA Checklist',
            'stage': 2,
            'step_order': 13,
            'is_visible': True,
            'config': {
                'config_details': {
                    "converters": [
                        {
                            'config_details': {
                                'ena_checklist_id': 'ERC000053',
                                'project_name': 'ToL'
                            },
                            'module': 'tol.flows.converters',
                            'class_name': 'IncomingSampleToEnaSampleConverter',
                        }
                    ],
                    "validators": [
                        {
                            'config_details': {
                                'ena_checklist_id': 'ERC000053'
                            },
                            'module': 'tol.validators',
                            'class_name': 'EnaChecklistValidator'
                        }
                    ]
                },
                'module': 'tol.validators',
                'class_name': 'ConverterAndValidateValidator',
                'is_validator': True
            },
            'description': 'Manifest is converted to ENA requirements (e.g. case sensitivity, etc.). This checks that the converted fields do match ENA requirements.',
        },
        {
            'id': 16,
            'pipeline_id': 1,
            'step_name': 'Allowed Values (STS)',
            'stage': 2,
            'step_order': 14,
            'is_visible': True,
            'config': {
                'config_details': {
                    'converters': [],
                    'validators': [
                        {
                            'module': 'tol.validators',
                            'class_name': 'AllowedValuesFromDataSourceValidator',
                            'config_details': {
                                'datasource_instance_id': 'sts',
                                'datasource_object_type': 'lifestage',
                                'datasource_field_name': 'name',
                                'field_name': 'LIFESTAGE'
                            }},
                        {
                            'module': 'tol.validators',
                            'class_name': 'AllowedValuesFromDataSourceValidator',
                            'config_details': {
                                'datasource_instance_id': 'sts',
                                'datasource_object_type': 'sex',
                                'datasource_field_name': 'name',
                                'field_name': 'SEX'
                            }},
                        {
                            'module': 'tol.validators',
                            'class_name': 'AllowedValuesFromDataSourceValidator',
                            'config_details': {
                                'datasource_instance_id': 'sts',
                                'datasource_object_type': 'organism_part',
                                'datasource_field_name': 'name',
                                'field_name': 'ORGANISM_PART'
                            }},
                        {
                            'module': 'tol.validators',
                            'class_name': 'AllowedValuesFromDataSourceValidator',
                            'config_details': {
                                'datasource_instance_id': 'sts',
                                'datasource_object_type': 'gal',
                                'datasource_field_name': 'name',
                                'field_name': 'GAL'
                            }},
                        {
                            'module': 'tol.validators',
                            'class_name': 'AllowedValuesFromDataSourceValidator',
                            'config_details': {
                                'datasource_instance_id': 'sts',
                                'datasource_object_type': 'tissue_size',
                                'datasource_field_name': 'size',
                                'field_name': 'SIZE_OF_TISSUE_IN_TUBE'
                            }},
                        {
                            'module': 'tol.validators',
                            'class_name': 'AllowedValuesFromDataSourceValidator',
                            'config_details': {
                                'datasource_instance_id': 'sts',
                                'datasource_object_type': 'organism_part',
                                'datasource_field_name': 'name',
                                'field_name': 'TISSUE_FOR_BARCODING'
                            }},
                        {
                            'module': 'tol.validators',
                            'class_name': 'AllowedValuesFromDataSourceValidator',
                            'config_details': {
                                'datasource_instance_id': 'sts',
                                'datasource_object_type': 'hazard_group',
                                'datasource_field_name': 'level',
                                'field_name': 'HAZARD_GROUP'
                            }},
                        {
                            'module': 'tol.validators',
                            'class_name': 'AllowedValuesFromDataSourceValidator',
                            'config_details': {
                                'datasource_instance_id': 'sts',
                                'datasource_object_type': 'specimen_purpose',
                                'datasource_field_name': 'purpose',
                                'field_name': 'PURPOSE_OF_SPECIMEN'
                            }}
                    ]
                },
                'module': 'tol.validators',
                'class_name': 'ConverterAndValidateValidator',
                'is_validator': True
            },
            'description': 'Checks that where values in a field are controlled (e.g. LIFESTAGE, SEX, ORGANISM_PART), the entry matches the allowed values.',
        },
        {
            'id': 17,
            'pipeline_id': 1,
            'step_name': 'Allowed Values',
            'stage': 2,
            'step_order': 15,
            'is_visible': True,
            'config': {
                'config_details': {
                    'converters': [],
                    'validators': [
                        {'module': 'tol.validators', 'class_name': 'AllowedValuesValidator', 'config_details':
                         {'field': 'DIFFICULT_OR_HIGH_PRIORITY_SAMPLE',
                          'allowed_values': [
                              'HIGH_PRIORITY',
                              'DIFFICULT',
                              'NOT_APPLICABLE',
                              'NOT_PROVIDED',
                              'NOT_COLLECTED',
                              'FULL_CURATION'
                          ],
                          'is_error': True}},
                        {'module': 'tol.validators',
                         'class_name': 'AllowedValuesValidator', 'config_details': {
                             'field': 'TISSUE_REMOVED_FOR_BARCODING',
                             'allowed_values': ['Y', 'N', 'NOT_COLLECTED', 'NOT_APPLICABLE', 'NOT_PROVIDED'],
                             'is_error': True
                         }},
                        {'module': 'tol.validators',
                         'class_name': 'AllowedValuesValidator', 'config_details': {
                             'field': 'REGULATORY_COMPLIANCE',
                             'allowed_values': ['Y', 'N', 'NOT_APPLICABLE'],
                             'is_error': True
                         }},
                        {'module': 'tol.validators',
                         'class_name': 'AllowedValuesValidator', 'config_details': {
                             'field': 'SPECIMEN_ID_RISK',
                             'allowed_values': ['Y', 'N']
                         }},
                        {'module': 'tol.validators',
                         'class_name': 'AllowedValuesValidator', 'config_details': {
                             'field': 'BARCODING_HUB',
                             'allowed_values': [
                                 'UNIVERSITY OF OXFORD',
                                 'MARINE BIOLOGICAL ASSOCIATION',
                                 'ROYAL BOTANIC GARDEN EDINBURGH',
                                 'NATURAL HISTORY MUSEUM',
                                 'ROYAL BOTANIC GARDENS KEW/NATURAL HISTORY MUSEUM',
                                 'NOT_COLLECTED',
                                 'NOT_APPLICABLE',
                                 'NOT_PROVIDED'
                             ],
                             'is_error': True
                         }},
                        {'module': 'tol.validators',
                         'class_name': 'AllowedValuesValidator', 'config_details': {
                             'field': 'BARCODING_STATUS',
                             'allowed_values': [
                                 'DNA_BARCODING_COMPLETED',
                                 'DNA_BARCODE_EXEMPT',
                                 'DNA_BARCODING_FAILED',
                                 'DNA_BARCODING_VIA_WSI_PROCESS'
                             ],
                             'is_error': True
                         }},
                        {'module': 'tol.validators', 'class_name': 'AllowedValuesValidator', 'config_details': {
                            'field': 'SAMPLE_FORMAT',
                            'allowed_values': [
                                'live biological sample from infectious organism',
                                'inactivated biological sample from infectious organism',
                                'biological sample/tissue from non-infectious organism',
                                'DNA',
                                'RNA'
                            ],
                            'is_error': True
                        }}]
                },
                'module': 'tol.validators',
                'class_name': 'ConverterAndValidateValidator',
                'is_validator': True
            },
            'description': 'DIFFICULT or high priority, Tissue removed for barcoding, Regulatory compliance, specimenID risk, Barcoding Hub, Barcoding status, Sample format"',
        },
        {
            'id': 19,
            'pipeline_id': 1,
            'step_name': 'Correct GAL',
            'stage': 2,
            'step_order': 16,
            'is_visible': True,
            'config': {
                'config_details': {
                    'field': 'GAL'
                },
                'module': 'tol.validators',
                'class_name': 'UniqueValueCheckValidator',
                'is_validator': True
            },
            'description': 'Only 1 GAL listed in the manifest',
        },
        {
            'id': 20,
            'pipeline_id': 1,
            'step_name': 'Ensure SYMBIONT = TARGET',
            'stage': 2,
            'step_order': 17,
            'is_visible': True,
            'config': {
                'config_details': {
                    'field': 'SYMBIONT',
                    'value': 'TARGET'
                },
                'module': 'tol.validators',
                'class_name': 'ValueCheckValidator',
                'is_validator': True
            },
            'description': 'No SYMBIONTS',
        },
        {
            'id': 21,
            'pipeline_id': 1,
            'step_name': 'Unique Whole Organisms',
            'stage': 2,
            'step_order': 18,
            'is_visible': True,
            'config': {
                'config_details': {
                    'symbiont_field': 'SYMBIONT',
                    'organism_part_field': 'ORGANISM_PART',
                    'specimen_id_field': 'SPECIMEN_ID'
                },
                'module': 'tol.validators',
                'class_name': 'UniqueWholeOrganismsValidator',
                'is_validator': True
            },
            'description': 'Ensures no two whole organisms have the same SPECIMEN_ID and no part organism shares a SPECIMEN_ID with a whole organism.'
        },
        {
            'id': 22,
            'pipeline_id': 1,
            'step_name': 'Unique TUBE_OR_WELL_ID',
            'stage': 2,
            'step_order': 19,
            'is_visible': True,
            'config': {
                'config_details': {
                    'validations': [
                        {
                            'condition': {
                                'field': 'manifest_type',
                                'operator': '==',
                                'value': 'RACK_TUBE',
                                'is_error': True
                            },
                            'module': 'tol.validators',
                            'class_name': 'UniqueValuesValidator',
                            'config_details': {
                                'unique_keys': [
                                    'TUBE_OR_WELL_ID'
                                ],
                                'detail': 'TUBE_OR_WELL_ID must be a unique value across the whole manifest.',
                                'is_error': True
                            }
                        },
                    ],
                },
                'module': 'tol.validators',
                'class_name': 'BranchingValidator',
                'is_validator': True
            },
            'description': 'if the manifest type is rack/tube, then the values provided in the TUBE_OR_WELL_ID column must be unique (no duplicate values).'
        },
        {
            'id': 23,
            'pipeline_id': 1,
            'step_name': 'Pattern Matching for TUBE_OR_WELL_ID',
            'stage': 2,
            'step_order': 20,
            'is_visible': True,
            'config': {
                'config_details': {
                    'validations': [
                        {
                            'condition': {
                                'field': 'manifest_type',
                                'operator': '==',
                                'value': 'RACK_TUBE',
                                'is_error': False
                            },
                            'module': 'tol.validators',
                            'class_name': 'RegexValidator',
                            'config_details':
                            {
                                'key': 'TUBE_OR_WELL_ID',
                                'regex': '(^[a-zA-Z]{2}\\d{8}$)|(^NA$)',
                                'is_error': False
                            },
                        },
                    ],
                },
                'module': 'tol.validators',
                'class_name': 'BranchingValidator',
                'is_validator': True
            },
            'description': 'TUBE_OR_WELL_ID must match (2) letters, followed by (8) digits, i.e. FF12345678'
        },
        {
            'id': 25,
            'pipeline_id': 1,
            'step_name': 'Ensure taxon ranks match the values in GoaT',
            'stage': 2,
            'step_order': 21,
            'is_visible': True,
            'config': {
                'config_details': {
                    'species_field': 'SCIENTIFIC_NAME',
                    'genus_field': 'GENUS',
                    'family_field': 'FAMILY',
                },
                'module': 'tol.validators',
                'class_name': 'TaxonMatchesGoatValidator',
                'is_validator': True
            },
            'description': 'Taxon ranks match GoaT',
        },
        {
            'id': 24,
            'pipeline_id': 1,
            'step_name': 'Time string to time object Converter',
            'stage': 1,
            'step_order': 4,
            'is_visible': False,
            'config': {
                'module': 'tol.flows.converters',
                'class_name': 'TimeStringToTimeConverter',
                'is_validator': False,
                'config_details': {
                    'field_names': ['TIME_OF_COLLECTION']
                }
            },
            'description': ''
        },
    ]
    op.bulk_insert(steps_table, steps_data)


def downgrade() -> None:
    pass
