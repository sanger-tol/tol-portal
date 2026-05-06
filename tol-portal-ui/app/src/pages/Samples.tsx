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
import { ELASTIC_DS } from '..';


function Samples() {
  const samples = useZone({
    objectType: "sample",
    dataSource: ELASTIC_DS,
    components: [
      { id: "samples-bar-chart" },
      { id: "samples-table" },
      { id: "samples-map" }
    ]
  });

  const chart = (
    <RemoteBarChart
      id="samples-bar-chart"
      stacked
      utilityBarConfig={{
        title: {
          text: 'Samples Recieved',
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
      id="samples-table"
      displaySource
      defaultSortByAttribute="sts_species.sts_scientific_name"
      fields={{
        data: {
          "sts_tolid.id": {
            rename: "ToLID",
          },
          "sts_species.sts_scientific_name": {
            cellRenderer: {
              type: "link",
              props: {
                url: "/species/${id}",
                text: "${sts_scientific_name}"
              }
            }
          },
        },
        order: {
          active: [
            "id",
            "sts_tolid.id",
            "sts_species.sts_scientific_name",
            "sts_collection_locality",
            "sts_collection_country",
            "sts_sex",
            "sts_organism_part",
          ],
        },
      }}
      {...samples}
    />
  );

  const map = (
    <RemoteMap
      id="samples-map"
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