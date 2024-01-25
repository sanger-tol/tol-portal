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


function SequencingRuns() {
  const [globalFilters, setGlobalFilters] = useState<object>({in_list: {}});
  const [combinedFilters, setCombinedFilters] = useState<object>({});

  const filters = (
    <RemoteMultipleSelectFilters
      endpoint="run_data"
      fields={["mlwh_platform_type", "mlwh_study_id"]}
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
      height={500}
    />
  );

  const table = (
    <RemoteTable
      id="run-data-table-v2"
      endpoint="run_data"
      defaultSort="mlwh_species.sts_scientific_name"
      filter={combinedFilters}
      setFilter={setCombinedFilters}
      height={500}
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
          rename: "Platform"
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

  return (
    <div className="sequencing-runs">
      <Widgets
        title="Sequencing Runs"
        components={[filters]}
      />
      <Widgets
        components={[chart, table]}
      />
    </div>
  );
}
export default SequencingRuns;
