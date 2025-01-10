/*
 * SPDX-FileCopyrightText: 2024 Genome Research Ltd.
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
            'benchling_pacbio_sequencing_request_count': {'gt': {'value': 0}},
            'calc_ongoing_submissions': {'eq': {'value': 0}},
            'informatics_status_summary': {'in_list': {'value': [
              '1 submitted', '2 curated', '3 curation', '4 data complete', '7 ignore'
            ], 'negate': true}},
            'calc_coverage_met': {'in_list': {'value': ['false']}}  // TODO: this should be a boolean 
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
      fields={{
        "uid": {
          rename: "ToLID"
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
            
            'benchling_tolid.benchling_pacbio_sequencing_request_count': {'gt': {'value': 0}}, 
            'benchling_tolid.calc_ongoing_submissions': {'eq': {'value': 0}},
            'benchling_tolid.informatics_status_summary': {'in_list': {'value': [
              '1 submitted', '2 curated', '3 curation', '4 data complete'
            ], 'negate': true}},
            'benchling_tolid.calc_coverage_met': {'in_list': {'value': ['false']}}
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
      fields={{
        "benchling_tolid.id": {
          rename: "ToLID"
        },
        "uid": {
          rename: "Sequencing Request ID"
        },
        "mlwh_source_barcode": {},
        "benchling_tolid.sts_sample_sts_project_union": {},
        "mlwh_volume_remaining": {},
        "benchling_sample.sts_labwhere_parentage": {}, 
        "benchling_tolid.informatics_gscope_coverage": {},
        "benchling_species.goat_genome_size": {}, 
        "benchling_tolid.informatics_status_summary": {},
        "benchling_tolid.calc_coverage": {},
        // Cherry Pick ID
        "benchling_species.goat_ploidy": {}, 
        "benchling_species.sts_sample_sts_priority_min": {}, 
        "benchling_extraction.benchling_sanger_sample_id": {}, 
        //"benchling_gb_yield_of_ccs_data_required": {}, //CCS
        //"benchling_extraction.benchling_extraction_qc_result": {}, QC pass/fail
      }}
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
            'benchling_tolid.benchling_sequencing_request_mlwh_volume_remaining_max': {'lte': {'value': 0}}, 
            'benchling_volume_ul': {'gt': {'value': 0}},
            
            'benchling_extraction_type': {'in_list': {'value': [ 'dna' ]}},
            'benchling_tolid.benchling_pacbio_sequencing_request_count': {'gt': {'value': 0}}, 
            'benchling_tolid.calc_ongoing_submissions': {'eq': {'value': 0}},
            'benchling_tolid.informatics_status_summary': {'in_list': {'value': [
              '1 submitted', '2 curated', '3 curation', '4 data complete'
            ], 'negate': true}},
            'benchling_tolid.calc_coverage_met': {'in_list': {'value': ['false']}}  // TODO: this should be a boolean 
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
      fields={{
        "benchling_tolid.id": {
          rename: "ToLID"
        },
        "uid": {
          rename: "Extraction ID"
        },
        "benchling_tolid.sts_sample_sts_project_union": {},
        "benchling_volume_ul": {},
        "benchling_fluidx_id":{},
        "benchling_extraction_type":{},
        "benchling_sample.sts_labwhere_parentage": {},
        "benchling_tolid.informatics_gscope_coverage": {},
        "benchling_species.goat_genome_size": {},
        "benchling_tolid.informatics_status_summary": {},
        "benchling_tolid.calc_coverage": {},
        "mlwh_nanodrop_concentration_ngul_value": {}, //value
        "benchling_species.goat_ploidy": {},
        "benchling_species.sts_sample_sts_priority_min": {},
        "benchling_extraction_qc_result": {},
        //"mlwh_qubit_concentration_ngul_value": {}, //value
        "benchling_yield_ng": {}, //value
        "benchling_femto_description": {}, 
        //"mlwh_sheared_femto_fragment_size_recorded_at": {}, //value
        //"mlwh_gqn_dnaex_value": {}, //value
        //"benchling_tissue_prep.benchling_downstream_protocol": {},//Downstream protocol, WAITING TO BE ENRICHED
        //Next steps
      }}
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
            'benchling_tolid.benchling_sequencing_request_mlwh_volume_remaining_max': {'lte': {'value': 0}}, 
            'benchling_tolid.benchling_extraction_benchling_volume_ul_max': {'lte': {'value': 0}},
            "benchling_weight_mg": {'gt': {'value': 0}},

            'benchling_tolid.benchling_pacbio_sequencing_request_count': {'gt': {'value': 0}},  
            'benchling_tolid.calc_ongoing_submissions': {'eq': {'value': 0}},
            'benchling_tolid.informatics_status_summary': {'in_list': {'value': [
              '1 submitted', '2 curated', '3 curation', '4 data complete'
            ], 'negate': true}},
            'benchling_tolid.calc_coverage_met': {'in_list': {'value': ['false']}}  // TODO: this should be a boolean 
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
      fields={{
        "benchling_tolid.id": {
          rename: "ToLID"
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
        "benchling_sampleprep_date": {}, //prep date
        // Disruption Method (to be pulled from benchling)
        "benchling_species.goat_ploidy": {},
        "benchling_species.sts_sample_sts_priority_min": {},
        "benchling_sample.sts_preservation_approach": {},
      }}
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
            'benchling_tolid.benchling_sequencing_request_mlwh_volume_remaining_max': {'lte': {'value': 0}}, 
            'benchling_tolid.benchling_extraction_benchling_volume_ul_max': {'lte': {'value': 0}},
            'benchling_tolid.benchling_tissue_prep_benchling_weight_mg_max': {'lte': {'value': 0}},
            'benchling_remaining_weight': {'gt': {'value': 0}},
            
            'benchling_tolid.benchling_pacbio_sequencing_request_count': {'gt': {'value': 0}},  
            'benchling_tolid.calc_ongoing_submissions': {'eq': {'value': 0}},
            'benchling_tolid.informatics_status_summary': {'in_list': {'value': [
              '1 submitted', '2 curated', '3 curation', '4 data complete'
            ], 'negate': true}},
            'benchling_tolid.calc_coverage_met': {'in_list': {'value': ['false']}}  // TODO: this should be a boolean 
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
      fields={{
        "benchling_tolid.id": {
          rename: "ToLID"
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
            
            'sts_eln_id': {'exists': {'negate': true }},
            'sts_tolid.benchling_pacbio_sequencing_request_count': {'gt': {'value': 0}},  
            'sts_tolid.calc_ongoing_submissions': {'eq': {'value': 0}},
            'sts_tolid.informatics_status_summary': {'in_list': {'value': [
              '1 submitted', '2 curated', '3 curation', '4 data complete'
            ], 'negate': true}},
            'sts_tolid.calc_coverage_met': {'in_list': {'value': ['false']}}  // TODO: this should be a boolean 
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

  const tissuePrepRemainingSTSTable = (
    <RemoteTable
      //noConfigModal
      id="sample-remaining-STS-v1"
      displaySource
      fields={{
        "benchling_tolid.id": {
          rename: "ToLID"
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
      {...sampleSTS}
    />
  );

  //Table 7
  const species = useZone({
    endpoint: 'species',
    components: [
      {
        id: 'individual-exhausted-v1',
        filter: {
          and_: {
            'species.calc_individual_exhausted_max': {'eq': {'value': 1}},
            
            'sts_eln_id': {'exists': {'negate': true }},
            'sts_tolid.benchling_pacbio_sequencing_request_count': {'gt': {'value': 0}},  
            'sts_tolid.calc_ongoing_submissions': {'eq': {'value': 0}},
            'sts_tolid.informatics_status_summary': {'in_list': {'value': [
              '1 submitted', '2 curated', '3 curation', '4 data complete'
            ], 'negate': true}},
            'sts_tolid.calc_coverage_met': {'in_list': {'value': ['false']}}  // TODO: this should be a boolean 
          }
        }
      }
    ]
  });

  useTranslator({
    source: tolid,
    target: 'species',
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
     fields={{
        "benchling_tolid.id": {
          rename: "ToLID"
        },
        "uid": {
          rename: "Sample ID"
        },
        //"benchling_tolid.sts_sample_sts_project_union": {},
        "calc_individual_exhausted_count": {
          rename: "Count Individual Exhausted"
        },
        //"sts_labwhere_parentage": {},
        //"sts_tolid.informatics_gscope_coverage": {},
        "goat_genome_size": {},
        "informatics_tolid_informatics_status_summary_min": {},
        "species.calc_coverage": {},
        "goat_ploidy": {},
        //"sts_sample_sts_priority_min": {},
      }}
      {...species}
   />
  );

  //const individualExhaustedAvailableTable = (
  //  <RemoteTable
  //    noConfigModal
  //    id="individual-exhausted-available-v1"
  //    displaySource
  //    fields={{
  // Location - (sts labwhere parentage)
  // Estimated Genome Coverage (Genome Scope)
  // Estimated Genome Size (GOAT)
  // Informatics Status 
  // Calculated Coverage (ToLID)
  // Ploidy (Goat)
  // Project
  // Priority
  //    }}
  //  />
  //);

  //const individualExhaustedRecollectionTable = (
  //  <RemoteTable
  //    noConfigModal
  //    id="individual-exhausted-recollection-v1"
  //    displaySource
  //    fields={{
  // Location - (sts labwhere parentage)
  // Estimated Genome Coverage (Genome Scope)
  // Estimated Genome Size (GOAT)
  // Informatics Status 
  // Calculated Coverage (ToLID)
  // Ploidy (Goat)
  // Project
  // Priority
  //    }}
  //  />
  //);

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
      component: tableTitle('Samples Requiring Top-Up'),
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
      component: tissuePrepRemainingSTSTable,
      type: 'xl'
    }
    /*
    {
      component: tableTitle('Individual Exhausted'),
      type: 'full'
    },
    {
      component: individualExhaustedTable,
      type: 'xl'
    },
    {
      component: tableTitle('Individual Exhausted (Available'),
      type: 'full'
    },
    {
      component: individualExhaustedAvailableTable,
      type: 'xl'
    },
    {
      component: tableTitle('Individual Exhausted (Recollection'),
      type: 'full'
    },
    {
      component: individualExhaustedRecollectionTable,
      type: 'xl'
    }
      */
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