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
import { ELASTIC_DS } from '..';


function Extractions() {
  const extractions = useZone({
    objectType: 'extraction',
    dataSource: ELASTIC_DS,
    components: [
      { id: 'extractions-bar-chart' },
      { id: 'extractions-table' }
    ]
  });

  const chart = (
    <RemoteBarChart
      id="extractions-bar-chart"
      stacked
      utilityBarConfig={{
        title: {
          text: 'Extractions',
        }
      }}
      breakDownBy="benchling_extraction_type"
      xAxis="benchling_completion_date"
      type='M'
      {...extractions}
    />
  );

  const table = (
    <RemoteTable
      id="extractions-table"
      defaultSortByAttribute="benchling_species.sts_scientific_name"
      displaySource
      fields={{
        data: {
          "id": {
            rename: "Identifier"
          },
          "benchling_species.sts_scientific_name": {
            cellRenderer: {
              type: "relationship",
              props: {
                relationshipId: "${benchling_species.id}",
              }
            }
          },
          "benchling_tolid.id": {
            rename: "ToLID (Benchling)"
          },
          "benchling_completion_date": {
            sort: true
          }
        },
        order: {
          active: [
            "id",
            "benchling_species.sts_scientific_name",
            "benchling_tolid.id",
            "benchling_completion_date",
          ],
        },
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