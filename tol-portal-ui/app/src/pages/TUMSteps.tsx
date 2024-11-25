/*
 * SPDX-FileCopyrightText: 2023 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import { RemoteTable, Widgets, useZone } from '@tol/tol-ui';
import SpeciesLink from '../components/SpeciesLink';


function TUMSteps() {
  const tum = useZone({
    endpoint: 'tolid',
    components: [
      {
        id: 'top-up-required-v3',
        filter: {
          and_: {
            'benchling_pacbio_sequencing_request_count': {'gt': {'value': 0}},
            'calc_ongoing_submissions': {'eq': {'value': 0}},
            'informatics_status_summary': {'in_list': {'value': [
              '1 submitted', '2 curated', '3 curation', '4 data complete'
            ], 'negate': true}},
            'calc_coverage_met': {'in_list': {'value': ['false']}}  // TODO: this should be a boolean 
          }
        }
      }
    ]
  });

  const table = (
    <RemoteTable
      id="top-up-required-v3"
      displaySource
      fields={{
        "uid": {
          rename: "ToLID"
        },
        "tolid_species.tolid_name": {
          cellRenderer: {
            element: SpeciesLink,
            propPointers: {
              id: 'tolid_species.id',
              name: 'tolid_species.tolid_name'
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
      {...tum}
    />
  );

  const title = (
    <div>
      <h2>Top-Up Management</h2>
    </div>
  );

  const components = [
    {
      component: title,
      type: 'full'
    },
    {
      component: table,
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
