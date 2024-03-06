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

  const title = (
    <div>
      <h2 className="tol-widget">ToLIDs</h2>
    </div>
  );

  const components = [
    {
      component: title,
      type: 'full'
    },
    {
      component: table,
      type: 'xl'
    }
  ];

  return (
    <div className="tolids">
      <Widgets
        components={components}
      />
    </div>
  );
}
export default ToLIDs;
