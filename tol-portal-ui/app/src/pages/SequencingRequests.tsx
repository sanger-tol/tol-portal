/*
 * SPDX-FileCopyrightText: 2023 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import {
  RemoteTable,
  RemoteBarChart,
  Widgets,
  useZone
} from '@tol/tol-ui';
import Platform from '../components/Platform';


function SequencingRequests() {
  const sequencingRequests = useZone({
    endpoint: 'sequencing_request',
    components: [
      { id: 'sequencing-requests-bar-chart-v1' },
      { id: 'sequencing-request-table-v2' }
    ]
  });

  const chart = (
    <RemoteBarChart
      id="sequencing-requests-bar-chart-v1"
      stacked
      title="Submission from Benchling to SciOps"
      breakDownBy="benchling_source"
      xAxis="benchling_completion_date"
      type='M'
      {...sequencingRequests}
    />
  );

  const table = (
    <RemoteTable
      id="sequencing-request-table-v2"
      defaultSort="mlwh_species.sts_scientific_name"
      fields={{
        "uid": {
          rename: "Sample Ref"
        },
        "benchling_sequencing_platform": {
          rename: "Platform (Benchling)",
          cellRenderer: {
            element: Platform,
            propPointers: {
              platform: "benchling_sequencing_platform"
            }
          }
        },
        "mlwh_species.sts_scientific_name": {
          rename: "Species",
          cellRenderer: "relationshipDetail"
        },
        "benchling_tolid.id": {
          rename: "ToLID (Benchling)"
        },
        "benchling_source": {
          rename: "Source (Benchling)"
        },
        "benchling_completion_date": {
          rename: "Completion Date (Benchling)"
        },
        "portaldb_date_sent_to_sciops": {
          rename: "Date Sent To SciOps"
        }
      }}
      {...sequencingRequests}
    />
  );

  const title = (
    <div>
      <h2>Sequencing Requests</h2>
    </div>
  );

  const components = [
    {
      component: title,
      type: 'full'
    },
    {
      component: chart,
      type: 'lg'
    },
    {
      component: table,
      type: 'lg'
    },
  ];

  return (
    <div className="sequencing-requests">
      <Widgets
        components={components}
      />
    </div>
  );
}
export default SequencingRequests;
