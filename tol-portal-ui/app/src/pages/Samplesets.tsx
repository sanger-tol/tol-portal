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
  
  
  function Samplesets() {
    const samplesets = useZone({
      objectType: 'sampleset',
      dataSource: ELASTIC_DS,
      components: [
        { id: 'sampleset-bar-chart' },
        { id: 'sampleset-table' }
      ]
    });
  
    const chart = (
      <RemoteBarChart
        id="sampleset-bar-chart"
        stacked
        utilityBarConfig={{
          title: {
            text: 'Compliance',
          }
        }}
        breakDownBy="sts_rg_status_non_human"
        xAxis="sts_rg_status_updated_at_non_human"
        type='M'
        {...samplesets}
      />
    );
  
    const table = (
      <RemoteTable
        id="sampleset-table"
        defaultSortByAttribute="id"
        displaySource
        fields={{
          data: {
            "id": {
              rename: "Sample Set ID",
            },
          },
          order: {
            active: [
              "id",
              "sts_project",
              "sts_submit_date",
              "sts_gal_abbreviation",
              "sts_affiliation",
              "sts_shipping_from",
              "sts_other_info",
              "sts_status",
              "sts_legal_status",
              "sts_rg_status_non_human",
              "sts_desc",
              "sts_legal_contract",
              "sts_legal_reference",
              "sts_legal_compliance_processors",
              "sts_legal_comment",
              "sts_research_governance_processors",
              "sts_managers",
              "sts_sample_sts_receive_date_max",
              "sts_sample_sts_submit_date_max",
            ],
          },
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