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
import Platform from '../components/Platform';


function SequencingRuns() {
  const runs = useZone({
    endpoint: 'run_data',
    components: [
      { id: 'sequencing-runs-bar-chart-v1' },
      { id: 'run-data-table-v3' }
    ]
  });

  const chart = (
    <RemoteBarChart
      id="sequencing-runs-bar-chart-v1"
      stacked
      title="Run Complete Data"
      breakDownBy="mlwh_instrument_model"
      xAxis="mlwh_run_complete"
      type='M'
      {...runs}
    />
  );


  const table = (
    <RemoteTable
      id="run-data-table-v3"
      defaultSort="mlwh_species.sts_scientific_name"
      displaySource
      fields={{
        "mlwh_run_id": {
          rename: "Run ID"
        },
        "mlwh_species.sts_scientific_name": {
          rename: "Species",
          cellRenderer: "relationshipDetail"
        },
        "mlwh_tolid.id": {
          rename: "ToLID"
        },
        "mlwh_sequencing_request.id": {
          rename: "Sequencing Request"
        },
        "mlwh_run_complete": {
          rename: "Complete Date"
        },
        "tolqc_reporting_category": {
          rename: "Category",
          cellRenderer: {
            element: Platform,
            propPointers: {
              platform: "tolqc_reporting_category"
            }
          }
        },
        "mlwh_platform_type": {
          rename: "Platform",
          cellRenderer: {
            element: Platform,
            propPointers: {
              platform: "mlwh_platform_type"
            }
          }
        },
        "mlwh_instrument_model": {
          rename: "Instrument"
        },
        "mlwh_position": {
          rename: "Position"
        },
        "mlwh_tag_index": {
          rename: "Tag"
        }
      }}
      {...runs}
    />
  );

  const title = (
    <div>
      <h2>Sequencing Runs</h2>
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
    <div className="sequencing-runs">
      <Widgets
        components={components}
      />
    </div>
  );
}
export default SequencingRuns;
