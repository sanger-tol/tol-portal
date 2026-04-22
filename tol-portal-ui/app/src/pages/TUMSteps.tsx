/*
 * SPDX-FileCopyrightText: 2025 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import { useState } from 'react';
import { RemoteTable, Widgets, useZone, useTranslator, Button, Modal, IconTooltip } from '@tol/tol-ui';
import { ELASTIC_DS } from '..';

// Table 1
function TUMSteps() {
  const [showModal, setShowModal] = useState(false);

  const tolid = useZone({
    objectType: 'tolid',
    dataSource: ELASTIC_DS,
    components: [
      {
        id: 'top-up-required',
        filter: {
          and_: {
            'calc_topup_required': { 'eq': { 'value': true } },
            'calc_tolid_actionable': { 'eq': { 'value': true } },
          }
        }
      }
    ]
  });

  const topUpRequiredTable = (
    <RemoteTable
      //noConfigModal
      id="top-up-required"
      displaySource
      defaultSortByAttribute="id"
      fields={{
        data: {
          "tolid_species.goat_scientific_name": {
            cellRenderer: {
              type: "link",
              props: {
                url: "/species/${tolid_species.id}",
                text: "${tolid_species.goat_scientific_name}"
              }
            }
          },
        },
        order: {
          active: [
            "id",
            "tolid_species.goat_scientific_name",
            "sts_sample_sts_project_union",
            "tolid_species.informatics_tolid_informatics_status_summary_min",
            "calc_coverage_met",
            "calc_topup_required",
            "calc_tolid_actionable",
            "calc_ongoing_submissions",
            "sts_sample_sts_target_coverage_max",
            "calc_coverage",
            "informatics_gscope_coverage",
            "informatics_status",
            "informatics_status_summary",
            "mlwh_sequencing_request_mlwh_volume_remaining_max",
            "calc_extraction_container_calc_benchling_volume_ul_dna_max",
            "benchling_tissue_prep_benchling_weight_mg_max",
            "benchling_sample_benchling_remaining_weight_max",
            "benchling_sample_count",
            "sts_sample_count",
            "calc_individual_exhausted",
            "calc_individual_available",
            "tolid_species.calc_recollection_needed",
            "calc_extraction_container_dna_count",
          ],
        },
      }}
      actions={['Send for ARA Review']}
      rowSelection={true}
      {...tolid}
    />
  );

  // Table 2
  const sequencingRequest = useZone({
    objectType: 'sequencing_request',
    dataSource: ELASTIC_DS,
    components: [
      {
        id: 'library-remaining',
        filter: {
          and_: {
            'calc_mlwh_volume_remaining': { 'gt': { 'value': 0.0 } },
            'benchling_tolid.calc_topup_required': { 'eq': { 'value': true } },
            'benchling_tolid.calc_tolid_actionable': { 'eq': { 'value': true } },
            'benchling_sequencing_platform': { 'in_list': { 'value': ['pacbio'], 'negate': false } }
          }
        }
      }
    ]
  });

  useTranslator({
    source: tolid,
    target: sequencingRequest,
    translations: {
      "benchling_pacbio_sequencing_request_count": "benchling_tolid.benchling_pacbio_sequencing_request_count",
      "tolid_species.goat_scientific_name": "benchling_species.goat_scientific_name",
      "id": "benchling_tolid.id",
      "sts_sample_sts_project_union": "benchling_tolid.sts_sample_sts_project_union",
      "calc_coverage": "benchling_tolid.calc_coverage",
      "sts_sample_sts_target_coverage_max": "benchling_tolid.sts_sample_sts_target_coverage_max",
      "calc_ongoing_submissions": "benchling_tolid.calc_ongoing_submissions",
      "informatics_status_summary": "benchling_tolid.informatics_status_summary",
      "calc_coverage_met": "benchling_tolid.calc_coverage_met",
    }
  })


  const libraryRemainingTable = (
    <RemoteTable
      //noConfigModal
      id="library-remaining"
      displaySource
      defaultSortByAttribute="benchling_tolid.id"
      fields={{
        data: {
          "benchling_species.id": {
            cellRenderer: {
              type: "link",
              props: {
                url: "https://links.tol.sanger.ac.uk/species/${id}",
                text: "TOLQC"
              }
            }
          },
        },
        order: {
          active: [
            "benchling_tolid.id",
            "benchling_species.id",
            "benchling_species.goat_genome_size",
            "benchling_tolid.calc_coverage",
            "benchling_tolid.informatics_gscope_coverage",
            "benchling_species.sts_sample_sts_priority_min",
            "benchling_tolid.sts_sample_sts_project_union",
            "benchling_tolid.calc_ongoing_submissions",
            "benchling_tolid.sts_sample_sts_target_coverage_max",
            "benchling_tolid.informatics_status",
            "benchling_tolid.informatics_status_summary",
            "mlwh_volume_remaining",
            "benchling_species.goat_ploidy",
            "tolqc_run_data_tolqc_bases_pacbio_sum",
            "id",
            "mlwh_source_barcode",
            "mlwh_run_data_mlwh_pac_bio_library_tube_name_union",
            'tolqc_run_data_pacbio_count',
            "benchling_extraction.benchling_extraction_type",
          ],
        },
      }}
      actions={['Request Resequencing', 'Mark as Not Valid']}
      rowSelection={true}
      {...sequencingRequest}
    />
  );

  // Table 3
  const extraction_container = useZone({
    objectType: 'extraction_container',
    dataSource: ELASTIC_DS,
    components: [
      {
        id: 'dna-remaining',
        filter: {
          and_: {
            'calc_benchling_volume_ul': { 'gt': { 'value': 0.0 } },
            'benchling_extraction.benchling_extraction_type': { 'in_list': { 'value': ['dna'] } },
            'benchling_tolid.calc_sequencing_request_calc_mlwh_volume_remaining_pacbio_max': { 'lte': { 'value': 0.0 } },
            'benchling_tolid.calc_topup_required': { 'eq': { 'value': true } },
            'benchling_tolid.calc_tolid_actionable': { 'eq': { 'value': true } },
          }
        }
      }
    ]
  });

  useTranslator({
    source: tolid,
    target: extraction_container,
    translations: {
      "benchling_pacbio_sequencing_request_count": "benchling_tolid.benchling_pacbio_sequencing_request_count",
      "tolid_species.goat_scientific_name": "benchling_species.goat_scientific_name",
      "id": "benchling_tolid.id",
      "sts_sample_sts_project_union": "benchling_tolid.sts_sample_sts_project_union",
      "calc_coverage": "benchling_tolid.calc_coverage",
      "sts_sample_sts_target_coverage_max": "benchling_tolid.sts_sample_sts_target_coverage_max",
      "calc_ongoing_submissions": "benchling_tolid.calc_ongoing_submissions",
      "informatics_status_summary": "benchling_tolid.informatics_status_summary",
      "calc_coverage_met": "benchling_tolid.calc_coverage_met",
    }
  })

  const dnaRemainingTable = (
    <RemoteTable
      //noConfigModal
      id="dna-remaining"
      displaySource
      defaultSortByAttribute="benchling_tolid.id"
      fields={{
        order: {
          active: [
            "benchling_tolid.id",
            "benchling_fluidx_id",
            "benchling_extraction.benchling_extraction_name",
            "benchling_species.goat_genome_size",
            "benchling_tolid.calc_coverage",
            "benchling_tolid.informatics_gscope_coverage",
            "benchling_species.sts_sample_sts_priority_min",
            "benchling_tolid.sts_sample_sts_project_union",
            "benchling_tolid.calc_ongoing_submissions",
            "benchling_tolid.sts_sample_sts_target_coverage_max",
            "benchling_extraction.benchling_extraction_protocol",
            "benchling_tolid.informatics_status",
            "benchling_tolid.informatics_status_summary",
            "calc_benchling_volume_ul",
            "benchling_nanodrop_concentration_ngul",
            "benchling_yield_ng",
            "benchling_extraction_qc_result",
            "benchling_femto_description",
            "benchling_tube_type",
            "benchling_volume_ul",
            "benchling_extraction.benchling_extraction_type",
            "benchling_species.goat_ploidy",
            "benchling_qubit_concentration_ngul",
            "benchling_femto_date_code",
            "benchling_gqn_index",
            "benchling_tissue_prep.benchling_downstream_protocol",
            "benchling_next_step",
          ],
        },
      }}
      actions={['Insert into LI Work List', 'Insert into ULI Work List', 'Mark as Not Valid']}
      rowSelection={true}
      {...extraction_container}
    />
  );

  // Table 4
  const tissuePrep = useZone({
    objectType: 'tissue_prep',
    dataSource: ELASTIC_DS,
    components: [
      {
        id: 'tissue-prep-remaining',
        filter: {
          and_: {
            'calc_benchling_weight_mg': { 'gt': { 'value': 0.0 } },
            'benchling_tolid.calc_sequencing_request_calc_mlwh_volume_remaining_pacbio_max': { 'lte': { 'value': 0.0 } },
            'benchling_tolid.calc_extraction_container_calc_benchling_volume_ul_dna_max': { 'lte': { 'value': 0.0 } },
            'benchling_tolid.calc_topup_required': { 'eq': { 'value': true } },
            'benchling_tolid.calc_tolid_actionable': { 'eq': { 'value': true } },
          }
        }
      }
    ]
  });

  useTranslator({
    source: tolid,
    target: tissuePrep,
    translations: {
      "benchling_pacbio_sequencing_request_count": "benchling_tolid.benchling_pacbio_sequencing_request_count",
      "tolid_species.goat_scientific_name": "benchling_species.goat_scientific_name",
      "id": "benchling_tolid.id",
      "sts_sample_sts_project_union": "benchling_tolid.sts_sample_sts_project_union",
      "calc_coverage": "benchling_tolid.calc_coverage",
      "sts_sample_sts_target_coverage_max": "benchling_tolid.sts_sample_sts_target_coverage_max",
      "calc_ongoing_submissions": "benchling_tolid.calc_ongoing_submissions",
      "informatics_status_summary": "benchling_tolid.informatics_status_summary",
      "calc_coverage_met": "benchling_tolid.calc_coverage_met",
    }
  })

  const tissuePrepRemainingTable = (
    <RemoteTable
      //noConfigModal
      id="tissue-prep-remaining"
      displaySource
      defaultSortByAttribute="benchling_tolid.id"
      fields={{
        order: {
          active: [
            "benchling_tolid.id",
            "benchling_eln_tissue_prep_name",
            "benchling_tolid.sts_sample_sts_project_union",
            "benchling_tissue_prep_fluidx_id",
            "benchling_weight_mg",
            "benchling_tube_location",
            "benchling_tolid.informatics_gscope_coverage",
            "benchling_species.goat_genome_size",
            "benchling_tolid.calc_ongoing_submissions",
            "benchling_tolid.sts_sample_sts_target_coverage_max",
            "benchling_tolid.informatics_status",
            "benchling_tolid.informatics_status_summary",
            "benchling_tolid.calc_coverage",
            "benchling_sampleprep_date",
            "benchling_disruption_method",
            "benchling_species.goat_ploidy",
            "benchling_species.sts_sample_sts_priority_min",
            "benchling_sample.sts_preservation_approach",
          ],
        },
      }}
      actions={['Insert into Tissue Prep Work List', 'Mark as Not Valid']}
      rowSelection={true}
      {...tissuePrep}
    />
  );

  // Table 5
  const tissueBenchling = useZone({
    objectType: 'sample',
    dataSource: ELASTIC_DS,
    components: [
      {
        id: 'sample-remaining-benchling',
        filter: {
          and_: {
            'calc_benchling_remaining_weight': { 'gt': { 'value': 0.0 } },
            'sts_eln_id': { 'exists': { } },
            'benchling_tolid.calc_sequencing_request_calc_mlwh_volume_remaining_pacbio_max': { 'lte': { 'value': 0.0 } },
            'benchling_tolid.calc_extraction_container_calc_benchling_volume_ul_dna_max': { 'lte': { 'value': 0.0 } },
            'benchling_tolid.calc_tissue_prep_calc_benchling_weight_mg_max': { 'lte': { 'value': 0.0 } },
            'benchling_tolid.calc_topup_required': { 'eq': { 'value': true } },
            'benchling_tolid.calc_tolid_actionable': { 'eq': { 'value': true } },
          }
        }
      }
    ]
  });

  useTranslator({
    source: tolid,
    target: tissueBenchling,
    translations: {
      "benchling_pacbio_sequencing_request_count": "benchling_tolid.benchling_pacbio_sequencing_request_count",
      "tolid_species.goat_scientific_name": "benchling_species.goat_scientific_name",
      "id": "benchling_tolid.id",
      "sts_sample_sts_project_union": "benchling_tolid.sts_sample_sts_project_union",
      "calc_coverage": "benchling_tolid.calc_coverage",
      "sts_sample_sts_target_coverage_max": "benchling_tolid.sts_sample_sts_target_coverage_max",
      "calc_ongoing_submissions": "benchling_tolid.calc_ongoing_submissions",
      "informatics_status_summary": "benchling_tolid.informatics_status_summary",
      "calc_coverage_met": "benchling_tolid.calc_coverage_met",
    }
  })

  const tissueRemainingBenchlingTable = (
    <RemoteTable
      //noConfigModal
      id="sample-remaining-benchling"
      displaySource
      defaultSortByAttribute="benchling_tolid.id"
      fields={{
        order: {
          active: [
            "benchling_tolid.id",
            "id",
            "benchling_tolid.sts_sample_sts_project_union",
            "sts_eln_id",
            "benchling_remaining_weight",
            "sts_labwhere_parentage",
            "benchling_tolid.informatics_gscope_coverage",
            "benchling_species.goat_genome_size",
            "benchling_tolid.calc_ongoing_submissions",
            "benchling_tolid.sts_sample_sts_target_coverage_max",
            "benchling_tolid.informatics_status",
            "benchling_tolid.informatics_status_summary",
            "benchling_tolid.calc_coverage",
            "benchling_species.goat_ploidy",
            "benchling_species.sts_sample_sts_priority_min",
            "sts_organism_part",
          ],
        },
      }}
      actions={['Insert into Benchling Tissue Work List', 'Mark as Not Valid']}
      rowSelection={true}
      {...tissueBenchling}
    />
  );

  // Table 6
  const sampleSTS = useZone({
    objectType: 'sample',
    dataSource: ELASTIC_DS,
    components: [
      {
        id: 'sample-remaining-STS',
        filter: {
          and_: {
            'portaldb_date_abandoned': { 'exists': { 'negate': true } },
            'sts_eln_id': { 'exists': { 'negate': true } },
            'calc_sts_export_eligible': { 'eq': { 'value': true } },
            'sts_tolid.calc_sequencing_request_calc_mlwh_volume_remaining_pacbio_max': { 'lte': { 'value': 0.0 } },
            'sts_tolid.calc_extraction_container_calc_benchling_volume_ul_dna_max': { 'lte': { 'value': 0.0 } },
            'sts_tolid.calc_tissue_prep_calc_benchling_weight_mg_max': { 'lte': { 'value': 0.0 } },
            'sts_tolid.calc_sample_calc_benchling_remaining_weight_max': { 'lte': { 'value': 0.0 } },
            'sts_tolid.calc_topup_required': { 'eq': { 'value': true } },
            'sts_tolid.calc_tolid_actionable': { 'eq': { 'value': true } }
          }
        }
      }
    ]
  });

  useTranslator({
    source: tolid,
    target: sampleSTS,
    translations: {
      "benchling_pacbio_sequencing_request_count": "benchling_tolid.benchling_pacbio_sequencing_request_count",
      "tolid_species.goat_scientific_name": "benchling_species.goat_scientific_name",
      "id": "benchling_tolid.id",
      "sts_sample_sts_project_union": "benchling_tolid.sts_sample_sts_project_union",
      "calc_coverage": "benchling_tolid.calc_coverage",
      "sts_sample_sts_target_coverage_max": "benchling_tolid.sts_sample_sts_target_coverage_max",
      "calc_ongoing_submissions": "benchling_tolid.calc_ongoing_submissions",
      "informatics_status_summary": "benchling_tolid.informatics_status_summary",
      "calc_coverage_met": "benchling_tolid.calc_coverage_met",
    }
  })

  const sampleRemainingSTSTable = (
    <RemoteTable
      //noConfigModal
      id="sample-remaining-STS"
      displaySource
      defaultSortByAttribute="benchling_tolid.id"
      fields={{
        order: {
          active: [
            "sts_tolid.id",
            "id",
            "calc_sts_export_eligible",
            "sts_tolid.sts_sample_sts_project_union",
            "benchling_remaining_weight",
            "sts_labwhere_parentage",
            "sts_tolid.informatics_gscope_coverage",
            "sts_species.goat_genome_size",
            "sts_tolid.calc_ongoing_submissions",
            "sts_tolid.sts_sample_sts_target_coverage_max",
            "sts_tolid.informatics_status",
            "sts_tolid.informatics_status_summary",
            "sts_tolid.calc_coverage",
            "sts_organism_part",
            "sts_tissue_size",
            "sts_sex",
            "sts_species.goat_ploidy",
            "sts_species.sts_sample_sts_priority_min",
          ],
        },
      }}
      actions={['Export into Benchling', 'Mark as Not Valid']}
      rowSelection={true}
      {...sampleSTS}
    />
  );

  //Table 7
  const individualExhausted = useZone({
    objectType: 'tolid',
    dataSource: ELASTIC_DS,
    components: [
      {
        id: 'individual-exhausted',
        filter: {
          and_: {
            'calc_individual_exhausted': { 'eq': { 'value': true } },
            'calc_topup_required': { 'eq': { 'value': true } },
            'calc_tolid_actionable': { 'eq': { 'value': true } }
          }
        }
      }
    ]
  });

  useTranslator({
    source: tolid,
    target: individualExhausted,
    translations: {
      "benchling_pacbio_sequencing_request_count": "benchling_pacbio_sequencing_request_count",
      "tolid_species.goat_scientific_name": "tolid_species.goat_scientific_name",
      "id": "id",
      "sts_sample_sts_project_union": "sts_sample_sts_project_union",
      "calc_coverage": "calc_coverage",
      "sts_sample_sts_target_coverage_max": "sts_sample_sts_target_coverage_max",
      "calc_ongoing_submissions": "calc_ongoing_submissions",
      "informatics_status_summary": "informatics_status_summary",
      "calc_coverage_met": "calc_coverage_met",
    }
  })

  const individualExhaustedTable = (
    <RemoteTable
      //noConfigModal
      id="individual-exhausted"
      displaySource
      defaultSortByAttribute="id"
      fields={{
        order: {
          active: [
            "id",
            "sts_sample_sts_project_union",
            "informatics_status_summary",
            "tolid_species.calc_tolid_calc_individual_exhausted_min",
            "benchling_pacbio_sequencing_request_count",
            "benchling_pacbio_completed_sequencing_request_count",
            "calc_ongoing_submissions",
            "tolid_species.goat_genome_size",
            "informatics_gscope_coverage",
            "calc_coverage",
            "sts_sample_sts_target_coverage_max",
            "calc_coverage_met",
            "tolid_species.goat_ploidy",
            "tolid_species.sts_sample_sts_priority_min",
          ],
        },
      }}
      {...individualExhausted}
    />
  );

  //Table 8
  const individualExhaustedAvailable = useZone({
    objectType: 'sample',
    dataSource: ELASTIC_DS,
    components: [
      {
        id: 'individual-exhausted-available',
        filter: {
          and_: {
            // Its ToLID has not had any samples exported to Benchling 
            'sts_tolid.benchling_sample_count': { 'eq': { 'value': 0 } },
            // Its species has at least one individual exhausted
            // Number of ToLIDs started == number of ToLIDs exhausted
            // (a ToLID is started if it has had a sample exported to Benchling)
            'sts_species.calc_individual_exhausted_tolid_count': {
              'gt': { 'value': 0 },
              'eq': { 'field': 'benchling_tolid_count' }
            }
          }
        }
      }
    ]
  });

  useTranslator({
    source: tolid,
    target: individualExhaustedAvailable,
    translations: {
      "benchling_pacbio_sequencing_request_count": "sts_tolid.benchling_pacbio_sequencing_request_count",
      "tolid_species.goat_scientific_name": "sts_species.goat_scientific_name",
      "id": "sts_tolid.id",
      "sts_sample_sts_project_union": "sts_project_union",
      "calc_coverage": "sts_tolid.calc_coverage",
      "sts_sample_sts_target_coverage_max": "sts_tolid.sts_sample_sts_target_coverage_max",
      "calc_ongoing_submissions": "sts_tolid.calc_ongoing_submissions",
      "informatics_status_summary": "sts_tolid.informatics_status_summary",
      "calc_coverage_met": "sts_tolid.calc_coverage_met",
    }
  })

  const individualExhaustedAvailableTable = (
    <RemoteTable
      //noConfigModal
      id="individual-exhausted-available"
      displaySource
      defaultSortByAttribute="benchling_tolid.id"
      fields={{
        order: {
          active: [
            "sts_tolid.id",
            "id",
            "calc_sts_export_eligible",
            "benchling_tolid.sts_sample_sts_project_union",
            "benchling_remaining_weight",
            "sts_labwhere_parentage",
            "sts_tolid.informatics_gscope_coverage",
            "sts_species.goat_genome_size",
            "sts_tolid.informatics_status_summary",
            "sts_tolid.calc_coverage",
            "sts_organism_part",
            "sts_tissue_size",
            "sts_sex",
            "benchling_species.goat_ploidy",
            "benchling_species.sts_sample_sts_priority_min",
          ],
        },
      }}
      actions={['Export into Benchling', 'Mark as Not Valid']}
      rowSelection={true}
      {...individualExhaustedAvailable}
    />
  );

  //Table 9
  const individualExhaustedRecollection = useZone({
    objectType: 'species',
    dataSource: ELASTIC_DS,
    components: [
      {
        id: 'individual-exhausted-recollection',
        filter: {
          and_: {
            // Number of ToLIDs exhausted = Total number of ToLIDs within STS.
            'calc_individual_exhausted_tolid_count': {
              'gt': { 'value': 0 },
              'eq': { 'field': 'tolid_tolid_count' }
            },
            // Not already out for recollection
            'calc_species_out_for_recollection': { 'eq': { 'value': false } }
          }
        }
      }
    ]
  });

  // useTranslator({
  //   source: tolid,
  //   target: individualExhaustedRecollection,
  //   translations: {
  //     "benchling_pacbio_sequencing_request_count": "benchling_pacbio_sequencing_request_count",
  //     "tolid_species.goat_scientific_name": "tolid_species.goat_scientific_name",
  //     "id": "id",
  //     "sts_sample_sts_project_union": "sts_sample_sts_project_union",
  //     "calc_coverage": "calc_coverage",
  //     "sts_sample_sts_target_coverage_max": "sts_sample_sts_target_coverage_max",
  //     "calc_ongoing_submissions": "calc_ongoing_submissions",
  //     "informatics_status_summary": "informatics_status_summary",
  //     "calc_coverage_met": "calc_coverage_met",
  //   }
  // })

  const individualExhaustedRecollectionTable = (
    <RemoteTable
      //noConfigModal
      id="individual-exhausted-recollection"
      displaySource
      fields={{
        order: {
          active: [
            "sts_scientific_name",
            "id",
            "sts_sample_sts_project_union",
            "calc_sample_calc_benchling_remaining_weight_sum",
            "goat_genome_size",
            "informatics_tolid_informatics_status_summary_min",
            "goat_ploidy",
            "sts_sample_sts_priority_min",
          ],
        },
      }}
      actions={['Mark for recollection']}
      rowSelection={true}
      {...individualExhaustedRecollection}
    />
  );

  const ModalContent = (
    <div className="help-documentation" style={{ maxWidth: '95%' }}>
      <h6>Overview</h6>
      <p>
        The Top-Up Management system helps identify and process ToLIDs that need additional
        sequencing to meet their coverage targets. The tables are organized in order of processing
        priority, from most processed material (Library) to least processed (Sample in STS).
      </p>

      <h6>Key Fields</h6>
      <ul>
        <li><strong>Estimated Coverage Met</strong>: Determined based on the basis Cumulative Yield per Estimated Species Genome Size must be less than Target Coverage</li>
        <li><strong>Top-Up Required</strong>: First level of filtering, ensuring the ToLID has history of completed sequencing, are still in data generation stage, and has not met coverage</li>
        <li><strong>Max Volume/Weight Remaining</strong>: Amount of maximum material available at each processing stage for a particular ToLID</li>
        <li><strong>Individual Exhausted</strong>: Indicates all material for this ToLID is used up</li>
        <li><strong>Other Individual Available</strong>: Indicates alternative samples exist for the same species</li>
      </ul>

      <h6>Workflow Process</h6>
      <ol>
        <li>Start with the Top-Up Required table to identify ToLIDs needing additional sequencing.</li>
        <li>
          Check tables in order (Library → DNA → Tissue Prep → Tissue → Sample) to find the
          most processed material available.
        </li>
        <li>
          Take the appropriate action based on available material:
          <ul>
            <li>Library available → Request resequencing</li>
            <li>DNA available → Insert into LI/ULI work list</li>
            <li>Tissue prep available → Insert into Tissue Prep work list</li>
            <li>Tissue in Benchling available → Insert into Benchling Tissue work list</li>
            <li>Sample in STS available → Export to Benchling</li>
          </ul>
        </li>
        <li>
          If all materials for an individual are exhausted, check for samples from other individuals
          in the "Sample from Other Individual Available" table.
        </li>
        <li>
          If all individuals of a species are exhausted, mark the species for recollection.
        </li>
      </ol>

      <h6>Common Actions</h6>
      <p style={{ marginBottom: '8px' }}><strong><u>Requesting Resequencing</u></strong></p>
      <p>Use when library material is available and you want to request additional sequencing.</p>

      <p style={{ marginBottom: '8px' }}><strong><u>Inserting into Work Lists</u></strong></p>
      <ul>
        <li><strong>LI Work List</strong>: DNA extractions for library prep using LI protocol</li>
        <li><strong>ULI Work List</strong>: DNA extractions for library prep using ULI protocol</li>
        <li><strong>Tissue Prep Work List</strong>: Tissues ready for preparation</li>
        <li><strong>Benchling Tissue Work List</strong>: Tissue samples in Benchling</li>
      </ul>

      <p style={{ marginBottom: '8px' }}><strong><u>Exporting into Benchling</u></strong></p>
      <p>Exports samples from STS into Benchling for processing.</p>

      <p style={{ marginBottom: '8px' }}><strong><u>Marking as Not Valid</u></strong></p>
      <p>Marks a record as 'Not Valid' when it's not suitable for processing. This will cause it to be removed from the current table and repopulate another table for less processed material (if available).</p>

      <p style={{ marginBottom: '8px' }}><strong><u>Marking for Recollection</u></strong></p>
      <p>Used when all individuals of a species are exhausted and new specimens need to be collected.</p>

      <h6>Best Practices</h6>
      <ol>
        <li>
          Process materials in table order (Library → DNA → Tissue Prep → Benchling Tissue → STS Sample)
          to minimize processing steps.
        </li>
        <li>
          Use "Mark as Not Valid" for unsuitable entries to ensure accurate tracking.
        </li>
        <li>
          Actioning multiple items at once is possible, and preferable than actioning items individual.
        </li>
        <li>
          Wait for a few minutes after setting actions to ensure the system updates the tables correctly.
        </li>
        <li>
          If you encounter issues, please contact the TOLP team for assistance.
        </li>
      </ol>
    </div>
  );


  const HelpModal = (
    <Modal header={<h6></h6>}
      open={showModal}
      setOpen={setShowModal}
      children={ModalContent}
    />
  )

  const title = (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h2>Top-Up Management</h2>
      <Button type='primary' text='Help' onClick={() => setShowModal(true)} />
    </div>
  );

  const tableTitle = (text: string, tooltipContent: string) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h6 style={{ marginBottom: '0px' }}>{text}</h6>
      <IconTooltip contents={tooltipContent} />
    </div>
  );

  const components = [
    {
      component: title,
      type: 'full'
    },
    {
      component: tableTitle('Top-Up Required',
        'Starting point showing all ToLIDs that need additional sequencing to meet their target coverage.'),
      type: 'full'
    },
    {
      component: topUpRequiredTable,
      type: 'xl'
    },
    {
      component: tableTitle('Library Remaining',
        'Sequencing requests with library material remaining (≥ 0 units). This is the preferred option as it requires the least processing.'),
      type: 'full'
    },
    {
      component: libraryRemainingTable,
      type: 'xl'
    },
    {
      component: tableTitle('DNA Remaining',
        'DNA extraction containers with volume remaining (≥ 0 units) for ToLIDs with no library material. These DNA extraction containers require library preparation before sequencing.'),
      type: 'full'
    },
    {
      component: dnaRemainingTable,
      type: 'xl'
    },
    {
      component: tableTitle('Tissue Prep Remaining',
        'Tissue preparations with weight remaining (≥ 0 units) for ToLIDs with no library or DNA material. These tissue preps require DNA extraction and library preparation.'),
      type: 'full'
    },
    {
      component: tissuePrepRemainingTable,
      type: 'xl'
    },
    {
      component: tableTitle('Tissue Remaining in Benchling',
        'Tissue samples in Benchling with weight remaining (≥ 0 units) for ToLIDs with no other material. These tissues require tissue preparation, DNA extraction, and library preparation.'),
      type: 'full'
    },
    {
      component: tissueRemainingBenchlingTable,
      type: 'xl'
    },
    {
      component: tableTitle('Sample Remaining in STS',
        'Samples in STS that haven\'t been exported to Benchling yet, for ToLIDs with no other material. These samples need to be exported to Benchling before processing.'),
      type: 'full'
    },
    {
      component: sampleRemainingSTSTable,
      type: 'xl'
    },
    {
      component: tableTitle('Individual Exhausted',
        'ToLIDs where all materials are exhausted but additional sequencing is still needed. These individuals require alternative sources of material.'),
      type: 'full'
    },
    {
      component: individualExhaustedTable,
      type: 'xl'
    },
    {
      component: tableTitle('Sample from Other Individual Available',
        'Samples from other individuals of the same species, when the primary individual is exhausted. These STS samples provide alternative sources of material.'),
      type: 'full'
    },
    {
      component: individualExhaustedAvailableTable,
      type: 'xl'
    },
    {
      component: tableTitle('Species to be Marked for Recollection',
        'Species where all individuals are exhausted and new specimens need to be collected. These species require recollection of new specimens.'),
      type: 'full'
    },
    {
      component: individualExhaustedRecollectionTable,
      type: 'xl'
    }
  ];

  return (
    <div className="tum">
      {HelpModal}
      <Widgets
        components={components}
      />
    </div>
  );
}
export default TUMSteps;


// Volme Lib Rem = mlwh_volume_remaining
// DNA Rem = benchling_volume_ul
// Tissue Prep Rem = benchling_weight_mg
// Sample Rem = benchling_remaining_weight
