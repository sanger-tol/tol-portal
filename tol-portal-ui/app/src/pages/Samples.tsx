/*
 * SPDX-FileCopyrightText: 2023 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import {
  RemoteMap,
  RemoteTable,
  RemoteBarChart,
  Widgets,
  useZone
} from '@tol/tol-ui';

function Samples() {
  const samples = useZone({
    endpoint: "sample",
    components: [
      { id: "samples-bar-chart-v2" },
      { id: "samples-table-v3" },
      { id: "samples-map-v1" }
    ]
  });

  const chart = (
    <RemoteBarChart
      id="samples-bar-chart-v2"
      stacked
      utilityBarConfig={{
        title: {
          title: 'Samples Recieved',
        }
      }}
      breakDownBy="sts_ac_status"
      xAxis="sts_receive_date"
      type='M'
      {...samples}
    />
  );

  const table = (
    <RemoteTable
      id="samples-table-v3"
      displaySource
      defaultSort="sts_species.sts_scientific_name"
      fields={{
        "uid": {
          rename: "ID"
        },
        "sts_tolid.id": {
          rename: "ToLID",
        },
        "sts_species.sts_scientific_name": {
          rename: "Species",
          cellRenderer: "relationshipDetail"
        },
        "sts_collection_locality": {
          rename: "Locality",
        },
        "sts_collection_country": {
          rename: "Country",
        },
        "sts_longitude": {
          rename: "Longitude",
        },
        "sts_latitude": {
          rename: "Latitude",
        }
      }}
      {...samples}
    />
  );

  const map = (
    <RemoteMap
      id="samples-map-v1"
      bubble
      longitudeKey="sts_longitude"
      latitudeKey="sts_latitude"
      attributeKeys="sts_tolid.id, sts_biosample_accession"
      {...samples}
    />
  );

  const title = (
    <div>
      <h2>Samples</h2>
    </div>
  );

  const components = [
    {
      component: title,
      type: 'full'
    },
    {
      component: chart,
      type: 'lg'
    },
    {
      component: table,
      type: 'lg'
    },
    {
      component: map,
      type: 'lg'
    }
  ];

  return (
    <div className="samples">
      <Widgets
        components={components}
      />
    </div>
  );
}
export default Samples;