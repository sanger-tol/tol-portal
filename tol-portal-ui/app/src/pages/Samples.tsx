/*
 * SPDX-FileCopyrightText: 2023 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import { RemoteBubbleMap,
  RemoteTable,
  RemoteBarChart,
  Widgets } from '@tol/tol-ui';
import { useState } from 'react';


function Samples() {
  const endpoint = "sample";
  const [filter, setFilter] = useState({});

  const chart = (
    <RemoteBarChart
      stacked
      title="Samples Recieved"
      endpoint={endpoint}
      breakDownBy="sts_ac_status"
      xAxis="benchling_date_sample_received_at_sanger"
      interval="M"
      setCombinedFilters={setFilter}
      type='date'
    />
  );

  const map = (
    <RemoteBubbleMap
      endpoint={endpoint}
      longitudeKey="sts_longitude"
      latitudeKey="sts_latitude"
      filter={filter}
      attributeKeys="sts_public_name, sts_biosample_accession"
    />
  );

  const table = (
    <RemoteTable
      id={`${endpoint}-table-v2`}
      endpoint={endpoint}
      filter={filter}
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
    />
  );

  const title = (
    <div>
      <h2 className="tol-widget">Samples</h2>
    </div>
  );

  const components = [
    {
      component: title,
      type: 'full'
    },
    {
      component: chart,
      type: 'md'
    },
    {
      component: map,
      type: 'md'
    },
    {
      component: table,
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