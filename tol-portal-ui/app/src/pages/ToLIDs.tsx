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
      { id: 'tolid-table' }
    ]
  });

  const table = (
    <RemoteTable
      id="tolid-table"
      defaultSortByAttribute="tolid_species.sts_scientific_name"
      displaySource
      fields={{
        data: {
          "id": {
            rename: "ToLID"
          },
          "tolid_species.sts_scientific_name": {
            cellRenderer: {
              type: "relationship",
              props: {
                relationshipId: "${tolid_species.id}",
              }
            }
          },
          "tolid_specimen.id": {
            rename: "Specimen",
            cellRenderer: {
              type: "relationship"
            }
          },  
        },
        order: {
          active: [
            "id",
            "tolid_species.sts_scientific_name",
            "tolid_specimen.id",
            "informatics_status_summary",
            "informatics_status",
          ],
        },
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
