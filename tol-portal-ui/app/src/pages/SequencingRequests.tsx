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
import { ELASTIC_DS } from '..';


function SequencingRequests() {
  const sequencingRequests = useZone({
    objectType: 'sequencing_request',
    dataSource: ELASTIC_DS,
    components: [
      { id: 'sequencing-requests-bar-chart' },
      { id: 'sequencing-request-table' }
    ]
  });

  const chart = (
    <RemoteBarChart
      id="sequencing-requests-bar-chart"
      stacked
      utilityBarConfig={{
        title: {
          text: 'Submission from Benchling to SciOps',
        }
      }}
      breakDownBy="benchling_sequencing_platform"
      xAxis="benchling_completion_date"
      type='M'
      {...sequencingRequests}
    />
  );

  const table = (
    <RemoteTable
      id="sequencing-request-table"
      displaySource
      defaultSortByAttribute="benchling_species.goat_scientific_name"
      cellRenderer={{
        "platform": Platform,
      }}
      fields={{
        data: {
          "id": {
            rename: "Sample Ref"
          },
          "benchling_sequencing_platform": {
            rename: "Platform (Benchling)",
            cellRenderer: {
              type: "platform",
              props: {
                platform: "${benchling_sequencing_platform}"
              }
            }
          },
          "benchling_species.goat_scientific_name": {
            rename: "Species",
            cellRenderer: {
              type: "link",
              props: {
                url: "/species/${id}",
                text: "${goat_scientific_name}"
              }
            }
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
        },
        order: {
          active: [
            "id",
            "benchling_sequencing_platform",
            "benchling_species.goat_scientific_name",
            "benchling_tolid.id",
            "benchling_source",
            "benchling_completion_date",
            "portaldb_date_sent_to_sciops",
          ],
        },
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
