/*
 * SPDX-FileCopyrightText: 2025 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import { RemoteTable, Widgets, useZone, useTranslator } from '@tol/tol-ui';
import SpeciesLink from '../components/SpeciesLink';

// Table 1
function TUMSteps() {
  const tolid = useZone({
    endpoint: 'tolid',
    components: [
      {
        id: 'top-up-required-v3',
        filter: {
          and_: {
            'calc_topup_required': {'eq': {'value': true}},
            'calc_tolid_actionable': {'eq': {'value': true }},
          }
        }
      }
    ]
  });

  const topUpRequiredTable = (
    <RemoteTable
      //noConfigModal
      id="top-up-required-v3"
      displaySource
      defaultSort="uid"
      fields={{
        "uid": {
          rename: "ToLID",
        },
        "tolid_species.goat_scientific_name": {
          cellRenderer: {
            element: SpeciesLink,
            propPointers: {
              id: 'tolid_species.id',
              name: 'tolid_species.goat_scientific_name'
            }
          }
        },
        "sts_sample_sts_project_union": {},
        "informatics_status_summary": {},
        "calc_coverage_met": {},
        "calc_topup_required": {},
        "calc_tolid_actionable": {},
        "benchling_sequencing_request_mlwh_volume_remaining_max": {},
        "benchling_extraction_benchling_volume_ul_dna_max": {},
        "benchling_tissue_prep_benchling_weight_mg_max": {},
        "benchling_sample_benchling_remaining_weight_max": {},
        "benchling_sample_count": {},
        "sts_sample_count": {},
        "calc_individual_available": {},
        "tolid_species.calc_recollection_needed": {},
      }}
      {...tolid}
    />
  );

  // Table 2
  const sequencingRequest = useZone({
    endpoint: 'sequencing_request',
    components: [
      {
        id: 'library-remaining-v1',
        filter: {
          and_: {
            'calc_mlwh_volume_remaining': {'ne': {'value': 0}},

            'benchling_tolid.calc_topup_required': {'eq': {'value': true}},
            'benchling_tolid.calc_tolid_actionable': {'eq': {'value': true }},
            
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
      "uid": "benchling_tolid.id",
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
      id="library-remaining-v1"
      displaySource
      defaultSort="benchling_tolid.id"
      fields={{
        "benchling_tolid.id": {
          rename: "ToLID",
        },
        "benchling_species.goat_genome_size": {}, 
        "benchling_tolid.calc_coverage": {},
        "benchling_tolid.informatics_gscope_coverage": {},
        "benchling_species.sts_sample_sts_priority_min": {}, 
        "benchling_tolid.sts_sample_sts_project_union": {},
        "mlwh_volume_remaining": {},
        "benchling_species.goat_ploidy": {}, 
        "mlwh_run_data_mlwh_hifi_read_bases_sum": {},
        "benchling_tolid.informatics_status_summary": {},
        "uid": {
          rename: "Sequencing Request ID"
        },
        "mlwh_source_barcode": {},
        "benchling_sample.sts_labwhere_parentage": {}, 
        // Cherry Pick ID
        "benchling_extraction.benchling_sanger_sample_id": {}, 
        //"benchling_extraction.benchling_extraction_qc_result": {}, QC pass/fail
      }}
      actions={['Request Resequencing', 'Mark as Not Valid']}
      rowSelection={true}
      {...sequencingRequest}
    />
  );

  // Table 3
  const extraction = useZone({
    endpoint: 'extraction',
    components: [
      {
        id: 'dna-remaining-v1',
        filter: {
          and_: {
            'calc_benchling_volume_ul': {'ne': {'value': 0}},
            'benchling_extraction_type':{'in_list': {'value': ['dna']}},
            'calc_sequencing_request_calc_mlwh_volume_remaining_max': {'lte': {'value': 0}},

            'benchling_tolid.calc_topup_required': {'eq': {'value': true}},
            'benchling_tolid.calc_tolid_actionable': {'eq': {'value': true }},
          }
        }
      }
    ]
  });

  useTranslator({
    source: tolid,
    target: extraction,
    translations: {
      "benchling_pacbio_sequencing_request_count": "benchling_tolid.benchling_pacbio_sequencing_request_count",  
      "tolid_species.goat_scientific_name": "benchling_species.goat_scientific_name",
      "uid": "benchling_tolid.id",
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
      id="dna-remaining-v1"
      displaySource
      defaultSort="benchling_tolid.id"
      fields={{
        "benchling_tolid.id": {
          rename: "ToLID",
        },
        "benchling_species.goat_genome_size": {},
        "benchling_tolid.calc_coverage": {},
        "benchling_tolid.informatics_gscope_coverage": {},
        "benchling_species.sts_sample_sts_priority_min": {},
        "benchling_tolid.sts_sample_sts_project_union": {},
        "calc_dna_volume_remaining": {},
        "benchling_nanodrop_concentration_ngul": {},
        "benchling_yield_ng": {},
        "benchling_extraction_qc_result": {},
        "benchling_femto_description": {},
        "benchling_tolid.informatics_status_summary": {},
        "benchling_extraction_name": {
          rename: "Extraction Name"
        },
        "benchling_volume_ul": {},
        "benchling_fluidx_id":{},
        "benchling_extraction_type":{},
        "benchling_sample.sts_labwhere_parentage": {},
        "benchling_species.goat_ploidy": {},
        "benchling_qubit_concentration_ngul": {},
        "benchling_femto_date_code": {},
        "benchling_gqn_index": {},
        "benchling_tissue_prep.benchling_downstream_protocol": {},
        "benchling_next_step": {},
      }}
      actions={['Insert into LI Work List', 'Insert into ULI Work List', 'Mark as Not Valid']}
      rowSelection={true}
      {...extraction}
    />
  );

  // Table 4
  const tissuePrep = useZone({
    endpoint: 'tissue_prep',
    components: [
      {
        id: 'tissue-prep-remaining-v1',
        filter: {
          and_: {
            'calc_benchling_weight_mg': {'ne': {'value': 0}},
            'calc_sequencing_request_calc_mlwh_volume_remaining_max': {'lte': {'value': 0}}, 
            'calc_extraction_calc_benchling_volume_ul_dna_max': {'lte': {'value': 0}},

            'benchling_tolid.calc_topup_required': {'eq': {'value': true}},
            'benchling_tolid.calc_tolid_actionable': {'eq': {'value': true }},
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
      "uid": "benchling_tolid.id",
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
      id="tissue-prep-remaining-v1"
      displaySource
      defaultSort="benchling_tolid.id"
      fields={{
        "benchling_tolid.id": {
          rename: "ToLID",
        },
        "uid": {
          rename: "Tissue Prep ID"
        },
        "benchling_tolid.sts_sample_sts_project_union": {},
        "benchling_tissue_prep_fluidx_id":{},
        "benchling_weight_mg":{},
        "benchling_sample.sts_labwhere_parentage": {},
        "benchling_tolid.informatics_gscope_coverage": {},
        "benchling_species.goat_genome_size": {},
        "benchling_tolid.informatics_status_summary": {},
        "benchling_tolid.calc_coverage": {},
        "benchling_sampleprep_date": {},
        // Disruption Method (to be pulled from benchling)
        "benchling_species.goat_ploidy": {},
        "benchling_species.sts_sample_sts_priority_min": {},
        "benchling_sample.sts_preservation_approach": {},
      }}
      actions={['Insert into Tissue Prep Work List', 'Mark as Not Valid']}
      rowSelection={true}
      {...tissuePrep}
    />
  );

  // Table 5
  const tissueBenchling = useZone({
    endpoint: 'sample',
    components: [
      {
        id: 'sample-remaining-benchling-v1',
        filter: {
          and_: {
            'calc_benchling_remaining_weight': {'ne': {'value': 0}},
            'calc_sequencing_request_calc_mlwh_volume_remaining_max': {'lte': {'value': 0}}, 
            'calc_extraction_calc_benchling_volume_ul_dna_max': {'lte': {'value': 0}},
            'calc_tissue_prep_calc_benchling_weight_mg_max': {'lte': {'value': 0}},

            'benchling_tolid.calc_topup_required': {'eq': {'value': true}},
            'benchling_tolid.calc_tolid_actionable': {'eq': {'value': true }},
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
      "uid": "benchling_tolid.id",
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
      id="sample-remaining-benchling-v1"
      displaySource
      defaultSort="benchling_tolid.id"
      fields={{
        "benchling_tolid.id": {
          rename: "ToLID",
        },
        "uid": {
          rename: "Sample ID"
        },
        "benchling_tolid.sts_sample_sts_project_union": {},
        "sts_eln_id": {},
        "benchling_remaining_weight": {},
        "sts_labwhere_parentage": {},
        "benchling_tolid.informatics_gscope_coverage": {},
        "benchling_species.goat_genome_size": {},
        "benchling_tolid.informatics_status_summary": {},
        "benchling_tolid.calc_coverage": {},
        "benchling_species.goat_ploidy": {},
        "benchling_species.sts_sample_sts_priority_min": {},
        "sts_organism_part":{},
      }}
      actions={['Insert into Benchling Tissue Work List', 'Mark as Not Valid']}
      rowSelection={true}
      {...tissueBenchling}
    />
  );

  // Table 6
  const sampleSTS = useZone({
    endpoint: 'sample',
    components: [
      {
        id: 'sample-remaining-STS-v1',
        filter: {
          and_: {
            'sts_tissue_remaining': {'gt': {'value': 0}},
            'sts_eln_id': {'exists': {'negate': true }},
            'calc_sequencing_request_calc_mlwh_volume_remaining_max': {'lte': {'value': 0}}, 
            'calc_extraction_calc_benchling_volume_ul_dna_max': {'lte': {'value': 0}},
            'calc_tissue_prep_calc_benchling_weight_mg_max': {'lte': {'value': 0}},
            'calc_sample_calc_benchling_remaining_weight_max': {'lte': {'value': 0}},

            'sts_tolid.calc_topup_required': {'eq': {'value': true}},
            'sts_tolid.calc_tolid_actionable': {'eq': {'value': true }},
            'portaldb_date_abandoned': {'exists': {'negate': true}}, //STS sample not abandoned
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
      "uid": "benchling_tolid.id",
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
      id="sample-remaining-STS-v1"
      displaySource
      defaultSort="benchling_tolid.id"
      fields={{
        "benchling_tolid.id": {
          rename: "ToLID",
        },
        "uid": {
          rename: "Sample ID"
        },
        "benchling_tolid.sts_sample_sts_project_union": {},
        "benchling_remaining_weight": {},
        "sts_labwhere_parentage": {},
        "sts_tolid.informatics_gscope_coverage": {},
        "sts_species.goat_genome_size": {},
        "sts_tolid.informatics_status_summary": {},
        "sts_tolid.calc_coverage": {},
        "sts_organism_part":{},
        "sts_tissue_size": {},
        "sts_sex": {},
        "benchling_species.goat_ploidy": {},
        "benchling_species.sts_sample_sts_priority_min": {},
      }}
      actions={['Export into Benchling', 'Mark as Not Valid']}
      rowSelection={true}
      {...sampleSTS}
    />
  );

  //Table 7
  const individualExhausted = useZone({
    endpoint: 'tolid', 
    components: [
      {
        id: 'individual-exhausted-v1',
        filter: {
          and_: {
            'calc_individual_exhausted': {'eq': {'value': true}},
            'calc_topup_required': {'eq': {'value': true}},
          }
        }
      }
    ]
  });

  useTranslator({
    source: tolid,
    target: individualExhausted,
    translations: {
      "benchling_pacbio_sequencing_request_count": "benchling_tolid.benchling_pacbio_sequencing_request_count",  
      "tolid_species.goat_scientific_name": "benchling_species.goat_scientific_name",
      "uid": "benchling_tolid.id",
      "sts_sample_sts_project_union": "benchling_tolid.sts_sample_sts_project_union", 
      "calc_coverage": "benchling_tolid.calc_coverage",
      "sts_sample_sts_target_coverage_max": "benchling_tolid.sts_sample_sts_target_coverage_max",
      "calc_ongoing_submissions": "benchling_tolid.calc_ongoing_submissions",
      "informatics_status_summary": "benchling_tolid.informatics_status_summary",
      "calc_coverage_met": "benchling_tolid.calc_coverage_met",
    }
  })

  const individualExhaustedTable = (
   <RemoteTable
     //noConfigModal
     id="individual-exhausted-v1"
     displaySource
      defaultSort="uid"
     fields={{
        "uid": {
          rename: "ToLID",
        },
        "sts_sample_sts_project_union": {},
        "informatics_status_summary": {},
        "tolid_species.calc_tolid_calc_individual_exhausted_min": {},
        "benchling_pacbio_sequencing_request_count": {},
        "benchling_pacbio_completed_sequencing_request_count": {},
        "calc_ongoing_submissions": {},
        "tolid_species.goat_genome_size": {},
        "informatics_gscope_coverage": {},
        "calc_coverage": {},
        "sts_sample_sts_target_coverage_max": {},
        "calc_coverage_met": {},
        "tolid_species.goat_ploidy": {},
        "tolid_species.sts_sample_sts_priority_min": {},
      }}
      {...individualExhausted}
   />
  );

  //Table 8
  const individualExhaustedAvailable = useZone({
    endpoint: 'sample',
    components: [
      {
        id: 'individual-exhausted-available-v1',
        filter: {
          and_: {
            'sts_tolid.calc_individual_available': {'eq': {'value': true}},
            'sts_tissue_remaining': {'gt': {'value': 0}},
            'sts_eln_id': {'exists': {'negate': true }},
            
            'sts_tolid.calc_topup_required': {'eq': {'value': false}},
            'sts_tolid.calc_tolid_actionable': {'eq': {'value': true }},
          }
        }
      }
    ]
  });

  useTranslator({
    source: tolid,
    target: individualExhaustedAvailable,
    translations: {
      "benchling_pacbio_sequencing_request_count": "benchling_tolid.benchling_pacbio_sequencing_request_count",  
      "tolid_species.goat_scientific_name": "benchling_species.goat_scientific_name",
      "uid": "benchling_tolid.id",
      "sts_sample_sts_project_union": "benchling_tolid.sts_sample_sts_project_union", 
      "calc_coverage": "benchling_tolid.calc_coverage",
      "sts_sample_sts_target_coverage_max": "benchling_tolid.sts_sample_sts_target_coverage_max",
      "calc_ongoing_submissions": "benchling_tolid.calc_ongoing_submissions",
      "informatics_status_summary": "benchling_tolid.informatics_status_summary",
      "calc_coverage_met": "benchling_tolid.calc_coverage_met",
    }
  })

  const individualExhaustedAvailableTable = (
   <RemoteTable
     //noConfigModal
     id="individual-exhausted-available-v1"
     displaySource
     defaultSort="benchling_tolid.id"
     fields={{
        "benchling_tolid.id": {
          rename: "ToLID",
        },
        "uid": {
          rename: "Sample ID"
        },
        "benchling_tolid.sts_sample_sts_project_union": {},
        "benchling_remaining_weight": {},
        "sts_labwhere_parentage": {},
        "sts_tolid.informatics_gscope_coverage": {},
        "sts_species.goat_genome_size": {},
        "sts_tolid.informatics_status_summary": {},
        "sts_tolid.calc_coverage": {},
        "sts_organism_part":{},
        "sts_tissue_size": {},
        "sts_sex": {},
        "benchling_species.goat_ploidy": {},
        "benchling_species.sts_sample_sts_priority_min": {},
      }}
      actions={['Export into Benchling', 'Mark as Not Valid']}
      rowSelection={true}
      {...individualExhaustedAvailable}
   />
  );

  //Table 9
  const individualExhaustedRecollection = useZone({
    endpoint: 'species',
    components: [
      {
        id: 'individual-exhausted-recollection-v1',
        filter: {
          and_: {
            'calc_recollection_needed': {'eq': {'value': true}},   
            'calc_species_recollectable': {'eq': {'value': true}},
          }
        }
      }
    ]
  });

  useTranslator({
    source: tolid,
    target: individualExhaustedRecollection,
    translations: {
      "benchling_pacbio_sequencing_request_count": "benchling_tolid.benchling_pacbio_sequencing_request_count",  
      "tolid_species.goat_scientific_name": "benchling_species.goat_scientific_name",
      "uid": "benchling_tolid.id",
      "sts_sample_sts_project_union": "benchling_tolid.sts_sample_sts_project_union", 
      "calc_coverage": "benchling_tolid.calc_coverage",
      "sts_sample_sts_target_coverage_max": "benchling_tolid.sts_sample_sts_target_coverage_max",
      "calc_ongoing_submissions": "benchling_tolid.calc_ongoing_submissions",
      "informatics_status_summary": "benchling_tolid.informatics_status_summary",
      "calc_coverage_met": "benchling_tolid.calc_coverage_met",
    }
  })

  const individualExhaustedRecollectionTable = (
   <RemoteTable
     //noConfigModal
     id="individual-exhausted-recollection-v1"
     displaySource
     fields={{
        "sts_scientific_name": {},
        "uid": {
          rename: "Species ID"
        },
        "sts_sample_sts_project_union": {},
        "calc_sample_calc_benchling_remaining_weight_sum": {},
        "goat_genome_size": {},
        "informatics_tolid_informatics_status_summary_min": {},
        "goat_ploidy": {},
        "sts_sample_sts_priority_min": {},
     }}
    actions={['Mark for recollection']}
    rowSelection={true}
     {...individualExhaustedRecollection}
   />
  );

  const title = (
    <div>
      <h2>Top-Up Management</h2>
    </div>
  );

  const tableTitle = (text: string) => (
    <h6>{text}</h6>
  );

  const components = [
    {
      component: title,
      type: 'full'
    },
    {
      component: tableTitle('Top-Up Required'),
      type: 'full'
    },
    {
      component: topUpRequiredTable,
      type: 'xl'
    },
    {
      component: tableTitle('Library Remaining'),
      type: 'full'
    },
    {
      component: libraryRemainingTable,
      type: 'xl'
    },
    {
      component: tableTitle('DNA Remaining'),
      type: 'full'
    },
    {
      component: dnaRemainingTable,
      type: 'xl'
    },
    {
      component: tableTitle('Tissue Prep Remaining'),
      type: 'full'
    },
    {
      component: tissuePrepRemainingTable,
      type: 'xl'
    },
    {
      component: tableTitle('Tissue Remaining in Benchling'),
      type: 'full'
    },
    {
      component: tissueRemainingBenchlingTable,
      type: 'xl'
    },
    {
      component: tableTitle('Sample Remaining in STS'),
      type: 'full'
    },
    {
      component: sampleRemainingSTSTable,
      type: 'xl'
    },
    {
      component: tableTitle('Individual Exhausted'),
      type: 'full'
    },
    {
      component: individualExhaustedTable,
      type: 'xl'
    },
    {
      component: tableTitle('Sample from Other Individual Available'),
      type: 'full'
    },
    {
      component: individualExhaustedAvailableTable,
      type: 'xl'
    },
    {
      component: tableTitle('Species to be Marked for Recollection (All Individuals Exhausted)'),
      type: 'full'
    },
    {
      component: individualExhaustedRecollectionTable,
      type: 'xl'
    }
  ];
  
  return (
    <div className="tum">
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
