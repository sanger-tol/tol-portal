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
      { id: 'sequencing-runs-bar-chart' },
      { id: 'run-data-table' }
    ]
  });

  const chart = (
    <RemoteBarChart
      id="sequencing-runs-bar-chart"
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
      id="run-data-table"
      defaultSortByAttribute="mlwh_species.sts_scientific_name"
      displaySource
      cellRenderer={{
        "platform": Platform,
      }}
      fields={{
        data: {
          "tolqc_species.sts_scientific_name": {
            cellRenderer: {
              type: "relationship",
              props: {
                detailPageIdAttribute: "tolqc_species.id"
              }
            }
          },
          "tolqc_tolid.id": {
            rename: "ToLID"
          },
          "tolqc_sequencing_request.id": {
            rename: "Sequencing Request"
          },
          "tolqc_reporting_category": {
            cellRenderer: {
              type: "platform",
              props: {
                platform: "${tolqc_reporting_category}"
              }
            }
          },
          "mlwh_platform_type": {
            cellRenderer: {
              type: "platform",
              props: {
                platform: "${mlwh_platform_type}"
              }
            }
          },
        },
        order: {
          active: [
            "tolqc_run",
            "tolqc_species.sts_scientific_name",
            "tolqc_tolid.id",
            "tolqc_sequencing_request.id",
            "tolqc_run_complete",
            "tolqc_reporting_category",
            "mlwh_platform_type",
            "tolqc_instrument_model",
            "tolqc_position",
            "mlwh_tag_index",
            "tolqc_bases",
            "tolqc_read_length_n50",
          ],
        },
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
