/*
 * SPDX-FileCopyrightText: 2023 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import { CentreContents, RemoteDateChartTable } from '@tol/tol-ui'


function SequencingRuns() {
  return (
    <div className="sequencingRuns">
      <CentreContents>
        <RemoteDateChartTable
          stacked
          title="Run Complete Data"
          endpoint="run_data"
          buckets="mlwh_platform_type"
          xKey="mlwh_complete_date"
          interval="M"
          fields={{
            "id": {
              rename: "Run/Well/Tag"
            },
            "tolqc_public_name": {
              rename: "ToLID"
            },
            "tolqc_common_name": {
              rename: "Scientific Name"
            },
            "tolqc_sample_ref": {
              rename: "Sanger Sample ID"
            },
            "tolqc_start_date": {
              rename: "Start Date"
            }
          }}
        />
      </CentreContents>
    </div>
  );
}

export default SequencingRuns;
