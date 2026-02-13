/*
 * SPDX-FileCopyrightText: 2024 Genome Research Ltd.
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
  
  
function Curations() {
  const curations = useZone({
    objectType: 'curation',
    dataSource: ELASTIC_DS,
    components: [
      { id: 'curations-bar-chart' },
      { id: 'curations-table' }
    ]
  });

  const chart = (
    <RemoteBarChart
      id="curations-bar-chart"
      stacked
      utilityBarConfig={{
        title: {
          text: 'Curations',
        }
      }}
      breakDownBy="grit_assembly_type"
      xAxis="grit_done_date"
      type='M'
      {...curations}
    />
  );

  const table = (
    <RemoteTable
      id="curations-table"
      defaultSortByAttribute="grit_species.id"
      displaySource
      fields={{
        data: {
          "id": {
            rename: "Identifier"
          },
          "grit_tolid.id": {
            rename: "ToLID"
          },
          "grit_species.sts_scientific_name": {
            cellRenderer: {
              type: "relationship",
              props: {
                relationshipId: "${grit_species.id}",
              }
            }
          },
        },
        order: {
          active: [
            "id",
            "grit_tolid.id",
            "grit_species.sts_scientific_name",
            "grit_created",
            "grit_done_date",
          ],
        },
      }}
      {...curations}
    />
  );  

  const title = (
    <div>
      <h2>Curations</h2>
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
    <div className="curations">
      <Widgets
        components={components}
      />
    </div>
  );
}
export default Curations;