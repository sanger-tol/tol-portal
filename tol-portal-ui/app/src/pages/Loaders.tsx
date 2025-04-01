/*
 * SPDX-FileCopyrightText: 2023 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import { RemoteTable, Widgets, useZone } from '@tol/tol-ui';


function Loaders() {
  const loaders = useZone({
    endpoint: 'loader',
    baseUrl: '/api/v1/local',
    components: [
      {
        id: 'loaders-table-v1',
        filter: {
          and_: {
          }
        }
      }
    ]
  });

  const table = (
    <RemoteTable
      id="loaders-table-v1"
      defaultSort='-date_last_run'
      displaySource
      fields={{
        "source_data_source_instance.builtin_name": {
          rename: "Source"
        },
        "source_object_type": {
          rename: "Source Object Type"
        },
        "destination_data_source_instance.builtin_name": {
          rename: "Destination"
        },
        "destination_object_type": {
          rename: "Destination Object Type"
        },
        "date_last_run": {
          rename: "Date Last Run"
        },
      }}
      {...loaders}
    />
  );

  const title = (
    <div>
      <h2>Loaders</h2>
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
    <div className="tum">
      <Widgets
        components={components}
      />
    </div>
  );
}
export default Loaders;
