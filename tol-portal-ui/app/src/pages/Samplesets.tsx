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
  
  
  function Samplesets() {
    const samplesets = useZone({
      endpoint: 'sampleset',
      components: [
        { id: 'sampleset-bar-chart-v1' },
        { id: 'sampleset-table-v1' }
      ]
    });
  
    const chart = (
      <RemoteBarChart
        id="sampleset-bar-chart-v1"
        stacked
        title="Compliance"
        breakDownBy="sts_rg_status_non_human"
        xAxis="sts_rg_status_updated_at_non_human"
        type='M'
        {...samplesets}
      />
    );
  
    const table = (
      <RemoteTable
        id="sampleset-table-v1"
        defaultSort="uid"
        fields={{
          "uid": {
            rename: "Sample Set ID"
          },
          "sts_project": {
            rename: "Project",
          },
          "sts_status": {
            rename: "Status"
          },
          "sts_legal_status": {
            rename: "Legal Status"
          },
          "sts_rg_status_non_human": {
            rename: "Compliance (Non-Human)"
          }
        }}
        {...samplesets}
      />
    );
  
    const title = (
      <div>
        <h2>Sample Sets</h2>
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
      <div className="samplesets">
        <Widgets
          components={components}
        />
      </div>
    );
  }
  export default Samplesets;
  