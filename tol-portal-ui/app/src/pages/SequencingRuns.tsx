/*
 * SPDX-FileCopyrightText: 2023 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import { CentreContents, AutoTable } from '@tol/tol-ui'


function SequencingRuns() {
  return (
    <div className="sequencingRuns">
      <CentreContents>
        <AutoTable
          endpoint="run_data"
          fields={{
            "id": {
              rename: "Run/well/tag"
            },
            "tolqc_public_name": {
              rename: "ToLID"
            },
            "tolqc_common_name": {
              rename: "Scientific name"
            },
            "tolqc_sample_ref": {
              rename: "Sanger Sample ID"
            },
            "tolqc_start_date": {
              rename: "Date"
            }
          }}
        />
      </CentreContents>
    </div>
  );
}
export default SequencingRuns;