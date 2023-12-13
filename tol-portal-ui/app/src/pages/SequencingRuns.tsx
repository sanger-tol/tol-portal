/*
 * SPDX-FileCopyrightText: 2023 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import React from 'react';
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
      xAxis="mlwh_complete_date"
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
      filter={combinedFilters}
      height={500}
      fields={{
        "tolqc_run_id": {
          rename: "Run ID"
        },
        "tolqc_species.sts_scientific_name": {
          rename: "Species",
          relationshipBox: true
        },
        "tolqc_sequencing_request.id": {
          rename: "Sequencing Request",
          relationshipBox: true
        },
        "mlwh_complete_date": {
          rename: "Complete Date"
        },
        "mlwh_platform_type": {
          rename: "Platform"
        },
        "mlwh_instrument_model": {
          rename: "Instrument"
        },
        "tolqc_position": {
          rename: "Position"
        },
        "tolqc_tag_index": {
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
