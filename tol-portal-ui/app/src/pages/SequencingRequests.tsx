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
            "benchling_sequencing_platform": {
              rename: "Platform (Benchling)"
            },
            "benchling_tolid": {
              rename: "ToLID (Benchling)"
            },
            "benchling_source": {
              rename: "Source (Benchling)"
            },
            "benchling_eln_submission_date": {
              rename: "Submission date (Benchling)"
            },
            "portaldb_date_sent_to_sciops": {
              rename: "Date sent to SciOps"
            }
          }}
        />
      </CentreContents>
    </div>
  );
}
export default SequencingRequests;