/*
 * SPDX-FileCopyrightText: 2023 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import {
  RemoteCount,
  RemoteTable,
  RemoteSunburst,
  Widgets,
  useZone
} from '@tol/tol-ui';
import SpeciesLink from '../components/SpeciesLink';


function Species() {

  const defaultFilter = {
    and_: {
      "sts_sample_sts_programme_union": { eq: { value: "ToL" } }
    }
  }

  const species = useZone({
    endpoint: 'species',
    filter: defaultFilter,
    components: [
      {
        id: 'species-received-count',
        filter: {
          and_: {
            "sts_species_id": {exists: {}}
          }
        },
        filterPassThrough: true
      },
      {
        id: 'species-extracted-count',
        filter: {
          and_: {
            "benchling_extraction_count": {
              'gt': {'value': 0}
            }
          }
        },
        filterPassThrough: true
      },
      {
        id: 'species-submitted-count',
        filter: {
          and_: {
            "informatics_tolid_informatics_status_summary_min": {
              'eq': {'value': '1 submitted'}
            }
          }
        },
        filterPassThrough: true
      },
      {
        id: 'species-done-count',
        filter: {
          and_: {
            "calc_done_date": {exists: {}}
          }
        },
        filterPassThrough: true
      },
      {
        id: 'species-sunburst',
        filter: {
          and_: {
            'sts_species_id': {
              exists: {}
            }
          }
        }
      },
      {
        id: 'species-table-v4'
      }
    ]
  });

  const speciesReceivedCount = (
    <RemoteCount
      id="species-received-count"
      title='Species Received'
      {...species}
    />
  );

  const speciesExtractedCount = (
    <RemoteCount
      id="species-extracted-count"
      title='Species Extracted'
      {...species}
    />
  );

  const speciesSubmittedCount = (
    <RemoteCount
      id="species-submitted-count"
      title='Species Submitted'
      {...species}
    />
  );

  const speciesDoneCount = (
    <RemoteCount
      id="species-done-count"
      title='Species Marked as Done'
      {...species}
    />
  );

  const sunburst = (
    <RemoteSunburst
      id="species-sunburst"
      title="Species"
      sliceBy={["sts_order_group", "sts_family"]}
      height={450}
      legendPosition="right"
      {...species}
    />
  );
  
  const table = (
    <RemoteTable
      id="species-table-v4"
      defaultSort="sts_scientific_name"
      displaySource
      fields={{
        "sts_scientific_name": {
          rename: "Scientific Name",
          cellRenderer: {
            element: SpeciesLink,
            propPointers: {
              id: 'uid',
              name: 'sts_scientific_name'
            }
          }
        },
        "calc_done_date": {
          rename: "Done date"
        },
        "sts_sample_count": {
          rename: "No of samples"
        },
        "sts_sample_sts_accept_date_min": {
          rename: "Accepted"
        },
        "sts_sample_benchling_date_assigned_to_lab_min": {
          rename: "Assigned to lab"
        },
        "benchling_sequencing_request_benchling_completion_date_hic_min": {
          rename: "Latest HiC Request"
        },
        "benchling_sequencing_request_benchling_completion_date_pacbio_min": {
          rename: "Latest PacBio Request"
        },
        "benchling_sequencing_request_benchling_completion_date_rnaseq_min": {
          rename: "Latest RNASeq Request"
        },
        "mlwh_run_data_mlwh_run_complete_hic_min": {
          rename: "Latest HiC Run"
        },
        "mlwh_run_data_mlwh_run_complete_pacbio_min": {
          rename: "Latest PacBio Run"
        },
        "mlwh_run_data_mlwh_run_complete_rnaseq_min": {
          rename: "Latest RNASeq Run"
        },
        "grit_curation_grit_done_date_min": {
          rename: "Curation complete"
        },
        "informatics_tolid_informatics_status_summary_min": {
          rename: "Informatics status"
        },
        "tolqclegacy_assembly_stage": {
          rename: "Assembly Stage"
        },
        "sts_taxon_group": {
          rename: "Taxon Group"
        },
        "sts_order_group": {
          rename: "Order"
        },
        "sts_family": {
          rename: "Family"
        },
        "sts_prefix": {
          rename: "ToLID Prefix"
        },
      }}
      {...species}
    />
  );

  const title = (
    <div>
      <h2>Species</h2>
    </div>
  );

  const components = [
    {
      component: title,
      type: 'full'
    },
    {
      component: speciesReceivedCount,
      type: 'sm'
    },
    {
      component: speciesExtractedCount,
      type: 'sm'
    },
    {
      component: speciesSubmittedCount,
      type: 'sm'
    },
    {
      component: speciesDoneCount,
      type: 'sm'
    },
    {
      component: sunburst,
      type: 'full'
    },
    {
      component: table,
      type: 'xl'
    },
  ];

  return (
    <div className="species">
      <Widgets
        components={components}
      />
    </div>
  );
}
export default Species;
