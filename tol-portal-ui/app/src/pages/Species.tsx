/*
 * SPDX-FileCopyrightText: 2023 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import {
  RemoteCount,
  RemoteTable,
  RemoteSunburst,
  Widgets
} from '@tol/tol-ui';
import SpeciesLink from '../components/SpeciesLink';
import { useState } from 'react';


function Species() {
  const defaultFilter = {and_: {"sts_scientific_name": {exists: {}}}};
  // @ts-ignore
  const [filter1, setFilter1] = useState(defaultFilter);
  const [filter2, setFilter2] = useState(defaultFilter);

  const sunburst = (
    <RemoteSunburst
      id="species-sunburst"
      title="Species"
      endpoint="species"
      sliceBy={["sts_order_group", "sts_family"]}
      height={450}
      legendPosition="right"
      setCombinedFilters={setFilter2}
      filter={filter1}
    />
  );
  
  const table = (
    <RemoteTable
      id="species-table-v2"
      endpoint="species"
      defaultSort="sts_scientific_name"
      filter={filter2}
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
          rename: "HiC submitted"
        },
        "benchling_sequencing_request_benchling_completion_date_pacbio_min": {
          rename: "PacBio submitted"
        },
        "benchling_sequencing_request_benchling_completion_date_rnaseq_min": {
          rename: "RNASeq submitted"
        },
        "mlwh_run_data_mlwh_run_complete_hic_min": {
          rename: "HiC complete"
        },
        "mlwh_run_data_mlwh_run_complete_pacbio_min": {
          rename: "PacBio complete"
        },
        "mlwh_run_data_mlwh_run_complete_rnaseq_min": {
          rename: "RNASeq complete"
        },
        "informatics_tolid_informatics_status_summary_min": {
          rename: "Informatics status"
        },
        "sts_taxon_group": {
          rename: "Taxon Group"
        },
        "sts_family": {
          rename: "Family"
        },
        "sts_order_group": {
          rename: "Order"
        },
        "sts_prefix": {
          rename: "ToLID Prefix"
        },
      }}
    />
  );

  const speciesReceivedCount = (
    <RemoteCount
      title='Species Received'
      endpoint='species'
      filter={
        {and_: {"sts_scientific_name": {exists: {}}}}
      }
    />
  );

  const speciesExtractedCount = (
    <RemoteCount
      title='Species Extracted'
      endpoint='species'
      filter={
        {and_: {"benchling_extraction_count": {'gt': {'value': 0}}}}
      }
    />
  );

  const speciesSubmittedCount = (
    <RemoteCount
      title='Species Submitted'
      endpoint='species'
      filter={
        {and_: {"informatics_tolid_informatics_status_summary_min":
          {'eq': {'value': '1 submitted'}}}}
      }
    />
  );

  const speciesDoneCount = (
    <RemoteCount
      title='Species Marked as Done'
      endpoint='species'
      filter={
        {and_: {"calc_done_date": {exists: {}}}}
      }
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
      type: 'lg'
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