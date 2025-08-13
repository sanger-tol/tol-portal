/*
 * SPDX-FileCopyrightText: 2025 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import { RemoteTable, Widgets, useZone, InfoTooltip } from '@tol/tol-ui';
import SpeciesLink from '../components/SpeciesLink';
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
            'calc_extraction_dna_count': { 'gt': { 'value': 0 } }, //once benchling_pacbio_completed_seq_req_count is correct, this can be removed
            'informatics_status_summary': { 'in_list': { 'value': ['7 ignore'], 'negate': true } },
            'portaldb_in_review': { 'eq': { 'value': true } },
          }
        }
      }
    ]
  });

  const topUpRequiredTable = (
    <RemoteTable
      //noConfigModal
      id="top-up-required"
      displaySource
      defaultSort="id"
      fields={{
        "id": {
          rename: "ToLID",
        },
        "tolid_species.goat_scientific_name": {
          cellRenderer: {
            element: SpeciesLink,
            propPointers: {
              id: 'tolid_species.id',
              name: 'tolid_species.goat_scientific_name'
            }
          }
        },
        "sts_sample_sts_project_union": {},
        "tolid_species.informatics_tolid_informatics_status_summary_min": {},
        "calc_coverage_met": {},
        "calc_topup_required": {},
        "calc_tolid_actionable": {},
        "mlwh_sequencing_request_mlwh_volume_remaining_max": {},
        "benchling_extraction_benchling_volume_ul_dna_max": {},
        "benchling_tissue_prep_benchling_weight_mg_max": {},
        "benchling_sample_benchling_remaining_weight_max": {},
        "benchling_sample_count": {},
        "sts_sample_count": {},
        "calc_individual_exhausted": {},
        "calc_individual_available": {},
        "tolid_species.calc_recollection_needed": {},
        "calc_extraction_dna_count": {},
      }}
      actions={['Remove from ARA Review']}
      rowSelection
      {...tolid}
    />
  );

  

  const tableTitle = (text: string, tooltipContent: string) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h6 style={{ marginBottom: '0px' }}>{text}</h6>
      <InfoTooltip contents={tooltipContent} />
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

