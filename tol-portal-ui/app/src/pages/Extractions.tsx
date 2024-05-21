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


function Extractions() {
  const extractions = useZone({
    endpoint: 'extraction',
    components: [
      { id: 'extractions-bar-chart-v1' },
      { id: 'extractions-table-v2' }
    ]
  });

  const chart = (
    <RemoteBarChart
      id="extractions-bar-chart-v1"
      stacked
      title="Extractions"
      breakDownBy="benchling_extraction_type"
      xAxis="benchling_completion_date"
      type='M'
      {...extractions}
    />
  );

  const table = (
    <RemoteTable
      id="extractions-table-v2"
      defaultSort="benchling_species.sts_scientific_name"
      fields={{
        "uid": {
          rename: "Identifier"
        },
        "benchling_species.sts_scientific_name": {
          rename: "Species",
          cellRenderer: "relationshipDetail"
        },
        "benchling_tolid.id": {
          rename: "ToLID (Benchling)"
        },
        "benchling_completion_date": {
          rename: "Date Completed (Benchling)",
          sort: true
        }
      }}
      {...extractions}
    />
  );

  const title = (
    <div>
      <h2>Extractions</h2>
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
    <div className="extractions">
      <Widgets
        components={components}
      />
    </div>
  );
}

export default Extractions;
