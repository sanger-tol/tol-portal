/*
 * SPDX-FileCopyrightText: 2023 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import { RemoteTable,
         Widgets } from '@tol/tol-ui';


function ToLIDs() {
  const table = (
    <RemoteTable
      id="tolid-table-v1"
      endpoint="tolid"
      height={600}
      defaultSort="uid"
      fields={{
        "uid": {
          rename: "ToLID"
        },
        "informatics_specimen.id": {
          rename: "Specimen",
          relationshipBox: true
        },
        "informatics_status_summary": {
          rename: "Status Summary",
          relationshipBox: true
        },
        "informatics_status": {
          rename: "Status"
        }
      }}
    />
  )

  return (
    <div className="tolids">
      <Widgets
        title="ToLIDs"
        components={[table]}
      />
    </div>
  );
}
export default ToLIDs;
