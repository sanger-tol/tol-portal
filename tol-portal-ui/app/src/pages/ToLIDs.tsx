/*
 * SPDX-FileCopyrightText: 2023 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import {
  RemoteTable,
  Widgets, useZone
} from '@tol/tol-ui';
import { ELASTIC_DS } from '..';


function ToLIDs() {
  const tolid = useZone({
    objectType: 'tolid',
    dataSource: ELASTIC_DS,
    components: [
      { id: 'tolid-table-v3' }
    ]
  });

  const table = (
    <RemoteTable
      id="tolid-table-v3"
      defaultSort="tolid_species.sts_scientific_name"
      displaySource
      fields={{
        "uid": {
          rename: "ToLID"
        },
        "tolid_species.sts_scientific_name": {
          cellRenderer: "relationshipDetail"
        },
        "tolid_specimen.id": {
          rename: "Specimen",
          cellRenderer: "relationship"
        },
        "informatics_status_summary": {
        },
        "informatics_status": {
        }
      }}
      {...tolid}
    />
  );

  const title = (
    <div>
      <h2>ToLIDs</h2>
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
