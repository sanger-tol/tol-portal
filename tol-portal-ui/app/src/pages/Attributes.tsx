/*
 * SPDX-FileCopyrightText: 2025 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import { RemoteTable, Widgets, useZone, TsDataSource } from '@tol/tol-ui';


function Attributes() {
  const attributes = useZone({
    objectType: 'data_source_config_attribute',
    dataSource: new TsDataSource({
      apiPrefix: 'local',
    }),
    components: [
      {
        id: 'attributes-table',
      }
    ]
  });

  const table = (
    <RemoteTable
      id="attributes-table"
      defaultSort='object_type'
      displaySource
      fields={{
        data: {},
        order: {
          active: [
            "data_source_config.name",
            "object_type",
            "name",
            "display_name",
            "source",
            "available_on_relationships",
            "description",
            "runtime_definition",
          ]
        }
      }}
      {...attributes}
    />
  );

  const title = (
    <div>
      <h2>Attributes</h2>
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
export default Attributes;
