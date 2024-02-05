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
      id="tolid-table-v3"
      endpoint="tolid"
      defaultSort="tolid_species.sts_scientific_name"
      height={600}
      fields={{
        "uid": {
          rename: "ToLID"
        },
        "tolid_species.sts_scientific_name": {
          rename: "Species",
          cellRenderer: "relationshipDetail"
        },
        "tolid_specimen.id": {
          rename: "Specimen",
          cellRenderer: "relationship"
        },
        "informatics_status_summary": {
          rename: "Status Summary",
        },
        "informatics_status": {
          rename: "Status"
        }
      }}
    />
  );

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
