/*
 * SPDX-FileCopyrightText: 2023 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import { CentreContents, AutoTable } from '@tol/tol-ui'


function SequencingRequests() {
  return (
    <div className="sequencingRequests">
      <CentreContents>
        <AutoTable
          endpoint="sequencing_request"
          fields={{
            "id": {
              rename: "Sample Ref"
            },
            "tolqc_public_name": {
              rename: "ToLID (in ToLQC)"
            },
            "mlwh_public_name": {
              rename: "ToLID (in MLWH)"
            }
          }}
        />
      </CentreContents>
    </div>
  );
}
export default SequencingRequests;