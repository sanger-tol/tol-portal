/*
 * SPDX-FileCopyrightText: 2023 Genome Research Ltd.
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
      noConfigModal
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
        "sts_sample_sts_project_union": {
        },
        "informatics_status_summary": {
        },
        "benchling_pacbio_sequencing_request_count": {
        },
        "benchling_pacbio_completed_sequencing_request_count": {
        },
        "calc_ongoing_submissions": {
        },
        "calc_coverage": {
        },
        "sts_sample_sts_target_coverage_max": {
        },
        "calc_coverage_met": {
        },
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
      noConfigModal
      id="library-remaining-v1"
      displaySource
      fields={{
        "benchling_tolid.id": {
          rename: "ToLID"
        },
        "uid": {
          rename: "Sequencing Request ID"
        },
        "mlwh_volume_remaining": {
        },
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
            'benchling_sequencing_request_mlwh_volume_remaining_max': {'lte': {'value': 0}},
            'benchling_volume_ul': {'gt': {'value': 0}},

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
      noConfigModal
      id="dna-remaining-v1"
      displaySource
      fields={{
        "benchling_tolid.id": {
          rename: "ToLID"
        },
        "uid": {
          rename: "Extraction ID"
        },
        "benchling_volume_ul": {
        },
        "benchling_fluidx_id":{
        },
        "benchling_extraction_type":{
        },
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
            'benchling_sequencing_request_mlwh_volume_remaining_max': {'lte': {'value': 0}}, 
            'benchling_extraction_benchling_volume_ul_max': {'lte': {'value': 0}}, 
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
      noConfigModal
      id="tissue-prep-remaining-v1"
      displaySource
      fields={{
        "benchling_tolid.id": {
          rename: "ToLID"
        },
        "uid": {
          rename: "Tissue Prep ID"
        },
        "benchling_tissue_prep_fluidx_id":{
        },
        "benchling_weight_mg":{
        }
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
            'benchling_sequencing_request_mlwh_volume_remaining_max': {'lte': {'value': 0}}, 
            'benchling_extraction_benchling_volume_ul_max': {'eq': {'value': 0}},
            'benchling_tissue_prep_benchling_weight_mg_max': {'lte': {'value': 0}},
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
      noConfigModal
      id="sample-remaining-benchling-v1"
      displaySource
      fields={{
        "benchling_tolid.id": {
          rename: "ToLID"
        },
        "uid": {
          rename: "Sample ID"
        },
        "sts_eln_id": {
        },
        "benchling_remaining_weight": {
        },
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
            'benchling_sequencing_request_mlwh_volume_remaining_max': {'exists': {'negate': true}}, 
            'benchling_extraction_benchling_volume_ul_max': {'eq': {'value': 0}},
            'benchling_tissue_prep_benchling_weight_mg_max': {'lte': {'value': 0}},
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
      noConfigModal
      id="sample-remaining-STS-v1"
      displaySource
      fields={{
        "benchling_tolid.id": {
          rename: "ToLID"
        },
        "uid": {
          rename: "Sample ID"
        },
        "sts_eln_id": {
        },
        "benchling_remaining_weight": {
        },
      }}
      {...sampleSTS}
    />
  );

  //const individualExhaustedTable = (
  //  <RemoteTable
  //    noConfigModal
  //    id="individual-exhausted-v1"
  //    displaySource
  //    fields={{
  //    }}
  //  />
  //);

  //const individualExhaustedAvailableTable = (
  //  <RemoteTable
  //    noConfigModal
  //    id="individual-exhausted-available-v1"
  //    displaySource
  //    fields={{
  //    }}
  //  />
  //);

  //const individualExhaustedRecollectionTable = (
  //  <RemoteTable
  //    noConfigModal
  //    id="individual-exhausted-recollection-v1"
  //    displaySource
  //    fields={{
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