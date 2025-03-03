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
            'calc_tolid_actionable': {'exists': {'value': true }},
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
        "benchling_sequencing_request_mlwh_volume_remaining_max": {
          rename: "Maximum Library Remaining"
        },
        "benchling_extraction_benchling_volume_ul_max": {
          rename: "Maximum DNA Remaining"
        },
        "benchling_tissue_prep_benchling_weight_mg_max": {
          rename: "Maximum Tissue Prep Remaining"
        },
        "benchling_sample_benchling_remaining_weight_max": {
          rename: "Maximum Benchling Sample Remaining"
        },
        "benchling_sample_count": {},
        "sts_sample_count": {},
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
            'mlwh_volume_remaining': {'gt': {'value': 0}},
            'portaldb_date_abandoned': {'exists': {'negate': true}}, // sequencing request is not abandoned
            'benchling_tolid.calc_topup_required': {'eq': {'value': true}},
            //'benchling_tolid.calc_tolid_actionable': {'exists': {'value': true }}, //no action taken // WAITING FOR ENRICHMENT
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
        //"benchling_gb_yield_of_ccs_data_required": {}, //CCS
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
            'benchling_volume_ul': {'gt': {'value': 0}},
            'benchling_extraction_type':{'in_list': {'value': ['dna']}},
            or_: {
              'benchling_tolid.benchling_sequencing_request_mlwh_volume_remaining_max': {'lte': {'value': 0}}, //either no library remaining, or
            //  'benchling_sequencing_request.portaldb_date_abandoned': {'exists': true} //library abandoned // WAITING FOR ENRICHMENT
            },
            'portaldb_date_abandoned': {'exists': {'negate': true}}, //extraction not abandoned
            'benchling_tolid.calc_topup_required': {'eq': {'value': true}},
            //'benchling_tolid.calc_tolid_actionable': {'exists': {'value': true }}, // WAITING FOR ENRICHMENT
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
        // "mlwh_volume_remaining": {},
        "mlwh_nanodrop_concentration_ngul_value": {}, //value
        "benchling_yield_ng": {}, //value
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
        // "mlwh_qubit_concentration_ngul_value": {}, //value
        // "mlwh_sheared_femto_fragment_size_recorded_at": {}, //value
        // "mlwh_gqn_dnaex_value": {}, //value
        "benchling_tissue_prep.benchling_downstream_protocol": {},//Downstream protocol, WAITING TO BE ENRICHED
        //Next steps
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
            'benchling_weight_mg': {'gt': {'value': 0}},
            'benchling_tolid.benchling_sequencing_request_mlwh_volume_remaining_max': {'lte': {'value': 0}}, 
            or_:{
              'benchling_tolid.benchling_extraction_benchling_volume_ul_max': {'lte': {'value': 0}},
              //'benchling_extraction.portaldb_date_abandoned': {'exists': true}, // extraction abandoned //WAITING FOR ENRICHMENT
              },
            'portaldb_date_abandoned': {'exists': {'negate': true}}, //tissue prep not abandoned
            'benchling_tolid.calc_topup_required': {'eq': {'value': true}},
            //'benchling_tolid.calc_tolid_actionable': {'exists': {'value': true }}, //WAITING FOR ENRICHMENT
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
  const sampleBenchling = useZone({
    endpoint: 'sample',
    components: [
      {
        id: 'sample-remaining-benchling-v1',
        filter: {
          and_: {
            'benchling_remaining_weight': {'gt': {'value': 0}},
            'benchling_tolid.benchling_sequencing_request_mlwh_volume_remaining_max': {'lte': {'value': 0}}, 
            'benchling_tolid.benchling_extraction_benchling_volume_ul_max': {'lte': {'value': 0}},
            or_:{
              'benchling_tolid.benchling_tissue_prep_benchling_weight_mg_max': {'lte': {'value': 0}},
              //'benchling_tissue_prep.portaldb_date_abandoned': {'exists': true}, //tissue prep abandoned // WAITING FOR ENRICHMENT
              },
            'portaldb_date_abandoned': {'exists': {'negate': true}}, //samples not abandoned
            'benchling_tolid.calc_topup_required': {'eq': {'value': true}},
            //'benchling_tolid.calc_tolid_actionable': {'exists': {'value': true }}, // WAITING FOR ENRICHMENT
          }
        }
      }
    ]
  });

  useTranslator({
    source: tolid,
    target: sampleBenchling,
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

  const sampleRemainingBenchlingTable = (
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
      {...sampleBenchling}
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
            'sts_tolid.benchling_sequencing_request_mlwh_volume_remaining_max': {'lte': {'value': 0}}, 
            'sts_tolid.benchling_extraction_benchling_volume_ul_max': {'lte': {'value': 0}},
            'sts_tolid.benchling_tissue_prep_benchling_weight_mg_max': {'lte': {'value': 0}},
            'sts_tolid.benchling_sample_benchling_remaining_weight_max': {'lte': {'value': 0}},
            'sts_tissue_remaining': {'gt': {'value': 0}},
            'sts_eln_id': {'exists': {'negate': true }},

            'sts_tolid.calc_topup_required': {'eq': {'value': true}},
            //'sts_tolid.calc_tolid_actionable': {'exists': {'value': true }}, // WAITING FOR ENRICHMENT
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
            'sts_eln_id': {'exists': {'negate': true }},
            'sts_tolid.calc_individual_available': {'eq': {'value': true}},
            'sts_tolid.calc_topup_required': {'eq': {'value': false}},
            //'sts_tolid.calc_tolid_actionable': {'exists': {'value': true }}, // WAITING FOR ENRICHMENT
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
        "benchling_sample_benchling_remaining_weight_sum": {},
        "goat_genome_size": {},
        "informatics_tolid_informatics_status_summary_min": {},
        "goat_ploidy": {},
        "sts_sample_sts_priority_min": {},
     }}
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
      component: tableTitle('Sample Remaining (Benchling)'),
      type: 'full'
    },
    {
      component: sampleRemainingBenchlingTable,
      type: 'xl'
    },
    {
      component: tableTitle('Sample Remaining (STS)'),
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
      component: tableTitle('Species Marked For Recollection (All Individuals Exhausted)'),
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
