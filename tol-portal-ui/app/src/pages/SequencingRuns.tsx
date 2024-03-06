/*
 * SPDX-FileCopyrightText: 2023 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import { RemoteTable,
  RemoteMultipleSelectFilters,
  RemoteBarChart,
  Widgets } from '@tol/tol-ui';
import { useState } from 'react';
import Platform from '../components/Platform';


function SequencingRuns() {
  const [globalFilters, setGlobalFilters] = useState<object>({in_list: {}});
  const [combinedFilters, setCombinedFilters] = useState<object>({});

  const filters = (
    <RemoteMultipleSelectFilters
      endpoint="run_data"
      fields={["mlwh_platform_type"]}
      renamedFields={{
        mlwh_platform_type: "Platform Type"
      }}
      globalFilters={globalFilters}
      setGlobalFilters={setGlobalFilters}
    />
  );

  const chart = (
    <RemoteBarChart
      stacked
      title="Run Complete Data"
      endpoint="run_data"
      breakDownBy="mlwh_instrument_model"
      xAxis="mlwh_run_complete"
      interval="M"
      filter={globalFilters}
      setCombinedFilters={setCombinedFilters}
      type='date'
    />
  );

  const table = (
    <RemoteTable
      id="run-data-table-v2"
      endpoint="run_data"
      defaultSort="mlwh_species.sts_scientific_name"
      filter={combinedFilters}
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
      component: filters,
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
