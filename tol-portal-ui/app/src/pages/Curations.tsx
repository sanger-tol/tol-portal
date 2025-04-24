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
  import Platform from '../components/Platform';
  
  
  function Curations() {

    const curations = useZone({
        endpoint: 'curation',
        components: [
          { id: 'curations-bar-chart-v1' },
          { id: 'curations-table-v1' }
        ]
      });

      const chart = (
        <RemoteBarChart
          id="curations-bar-chart-v1"
          stacked
          utilityBarConfig={{
            title: {
              title: 'Curations',
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
          id="curations-table-v1"
          defaultSort="grit_species.id"
          displaySource
          fields={{
            "uid": {
              rename: "Identifier"
            },
            "grit_tolid.id": {
              rename: "ToLID"
            },
            "grit_species.sts_scientific_name": {
              rename: "Species",
              cellRenderer: "relationshipDetail"
            },
            "grit_created": {
              rename: "Requested"
            },
            "grit_done_date": {
              rename: "Done"
            }
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
