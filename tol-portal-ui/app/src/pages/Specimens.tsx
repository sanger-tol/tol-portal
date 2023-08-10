/*
 * SPDX-FileCopyrightText: 2023 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import { CentreContents, AutoTable } from '@tol/tol-ui'


function Specimens() {
  return (
    <div className="specimen">
      <CentreContents>
        <AutoTable
          endpoint="specimen"
          fields={{
            "id": {
              rename: "ToLID"
            },
            "informatics_status_summary": {
              rename: "Assembly summary"
            },
            "informatics_status": {
              rename: "Assembly status"
            }
          }}
        />
      </CentreContents>
    </div>
  );
}
export default Specimens;