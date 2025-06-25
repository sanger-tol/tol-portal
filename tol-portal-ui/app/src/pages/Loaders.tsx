/*
 * SPDX-FileCopyrightText: 2023 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import { RemoteTable, Widgets, useZone, TsDataSource } from '@tol/tol-ui';


function Loaders() {
  const loaders = useZone({
    objectType: 'loader',
    dataSource: new TsDataSource({
      apiPrefix: 'local',
    }),
    components: [
      {
        id: 'loaders-table-v1',
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
        "ids_data_source_instance.builtin_name": {
          rename: "IDs Source"
        },
        "ids_object_type": {
          rename: "IDs type"
        },
        "ids_attribute": {
          rename: "IDs attribute"
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
