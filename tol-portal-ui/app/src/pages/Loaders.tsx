/*
 * SPDX-FileCopyrightText: 2023 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import { RemoteTable, Widgets, useZone, TsDataSource } from '@tol/tol-ui';


function Loaders() {
  const loaders = useZone({
    objectType: 'loader_instance',
    dataSource: new TsDataSource({
      apiPrefix: 'local',
    }),
    components: [
      {
        id: 'loaders-table',
      }
    ]
  });

  const table = (
    <RemoteTable
      id="loaders-table"
      defaultSort='-date_last_run'
      displaySource
      fields={{
        "source_data_source_instance.name": {
          rename: "Source"
        },
        "loader.source_object_type": {
          rename: "Source Object Type"
        },
        "destination_data_source_instance.name": {
          rename: "Destination"
        },
        "loader.destination_object_type": {
          rename: "Destination Object Type"
        },
        "date_last_run": {
          rename: "Date Last Run"
        },
        "ids_data_source_instance.name": {
          rename: "IDs Source"
        },
        "loader.ids_object_type": {
          rename: "IDs type"
        },
        "loader.ids_attribute": {
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
