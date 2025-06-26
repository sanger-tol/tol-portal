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
  
  
  function Manifests() {
    const manifests = useZone({
      objectType: 'manifest',
      dataSource: ELASTIC_DS,
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
            text: 'Submitted',
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
          },
          "sts_sample_count": {
          },
          "sts_submit_date": {
          },
          "sts_receive_date": {
          },
          "sts_wildlife_compliance_processors": {
          },
          "sts_sampleset.sts_research_governance_processors": {
          },
          "sts_sampleset.sts_managers": {
          },
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
  