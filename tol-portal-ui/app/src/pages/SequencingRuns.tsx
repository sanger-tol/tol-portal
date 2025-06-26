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
import { ELASTIC_DS } from '..';


function SequencingRuns() {
  const runs = useZone({
    objectType: 'run_data',
    dataSource: ELASTIC_DS,
    components: [
      { id: 'sequencing-runs-bar-chart-v1' },
      { id: 'run-data-table-v3' }
    ]
  });

  const chart = (
    <RemoteBarChart
      id="sequencing-runs-bar-chart-v1"
      stacked
      utilityBarConfig={{
        title: {
          text: 'Run complete date',
        }
      }}
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
        },
        "mlwh_species.sts_scientific_name": {
          cellRenderer: "relationshipDetail"
        },
        "mlwh_tolid.id": {
          rename: "ToLID"
        },
        "mlwh_sequencing_request.id": {
          rename: "Sequencing Request"
        },
        "mlwh_run_complete": {
        },
        "tolqc_reporting_category": {
          cellRenderer: {
            element: Platform,
            propPointers: {
              platform: "tolqc_reporting_category"
            }
          }
        },
        "mlwh_platform_type": {
          cellRenderer: {
            element: Platform,
            propPointers: {
              platform: "mlwh_platform_type"
            }
          }
        },
        "mlwh_instrument_model": {
        },
        "mlwh_element": {
        },
        "mlwh_tag_index": {
        },
        "tolqc_bases": {
        },
        "tolqc_read_length_n50": {
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
