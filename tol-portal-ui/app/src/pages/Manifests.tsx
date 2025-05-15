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
  
  
  function Manifests() {
    const manifests = useZone({
      endpoint: 'manifest',
      components: [
        { id: 'manifest-bar-chart-v1' },
        { id: 'manifest-table-v1' }
      ]
    });
  
    const chart = (
      <RemoteBarChart
        id="manifest-bar-chart-v1"
        stacked
        utilityBarConfig={{
          title: {
            title: 'Submitted',
          }
        }}
        breakDownBy="sts_status"
        xAxis="sts_submit_date"
        type='M'
        {...manifests}
      />
    );
  
    const table = (
      <RemoteTable
        id="manifest-table-v1"
        displaySource
        defaultSort="sts_copo_profile_title"
        fields={{
          "sts_copo_profile_title": {
          },
          "sts_project": {
          },
          "sts_status": {
          },
          "sts_shipment_status": {
          },
          "sts_compliance_status": {
          }
        }}
        {...manifests}
      />
    );
  
    const title = (
      <div>
        <h2>Manifests</h2>
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
      <div className="manifests">
        <Widgets
          components={components}
        />
      </div>
    );
  }
  export default Manifests;
  