/*
 * SPDX-FileCopyrightText: 2025 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import { RemoteTable, Widgets, useZone, IconTooltip } from '@tol/tol-ui';
import { ELASTIC_DS } from '..';

function ARAReview() {

  const tolid = useZone({
    objectType: 'tolid',
    dataSource: ELASTIC_DS,
    components: [
      {
        id: 'top-up-required',
        filter: {
          and_: {
            'calc_tolid_actionable': { 'eq': { 'value': true } },
            'status_summary': { 'in_list': { 'value': ['7 ignore'], 'negate': true } },
            'in_review': { 'eq': { 'value': true } },
          }
        }
      }
    ]
  });

  const topUpRequiredTable = (
    <RemoteTable
      id="top-up-required"
      displaySource
      defaultSortByAttribute="id"
      fields={{
        data: {
          "species.scientific_name": {
            cellRenderer: {
              type: "link",
              props: {
                url: "/species/${id}",
                text: "${scientific_name}"
              }
            },
          },
        },
        order: {
          active: [
            "id",
            "species.scientific_name",
            "sample_project_union",
            "species.tolid_status_summary_min",
            "calc_coverage_met",
            "calc_topup_required",
            "calc_tolid_actionable",
            "sequencing_request_volume_remaining_max",
            "extraction_volume_ul_dna_max",
            "tissue_prep_weight_mg_max",
            "sample_remaining_weight_max",
            "sample_count",
            "sample_count",
            "calc_individual_exhausted",
            "calc_individual_available",
            "species.calc_recollection_needed",
            "calc_extraction_dna_count",
          ]
        },
      }}
      actions={['Remove from ARA Review']}
      rowSelection
      {...tolid}
    />
  );

  

  const tableTitle = (text: string, tooltipContent: string) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h6 style={{ marginBottom: '0px' }}>{text}</h6>
      <IconTooltip contents={tooltipContent} />
    </div>
  );

  const components = [
    {
      component: tableTitle('Marked for Review',
        'Starting point showing all ToLIDs that need additional sequencing to meet their target coverage.'),
      type: 'full'
    },
    {
      component: topUpRequiredTable,
      type: 'xl'
    },
  ];

  return (
    <div className="tum">
      <Widgets
        components={components}
      />
    </div>
  );
}
export default ARAReview;

