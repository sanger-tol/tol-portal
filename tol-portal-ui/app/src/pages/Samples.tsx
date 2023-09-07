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
  const endpoint = "sample"
  const [ combinedFilters, setCombinedFilters ] = useState<object>({})

  const chart = (
    <RemoteBarChart
      stacked
      title="Samples Recieved"
      endpoint={endpoint}
      breakDownBy="sts_ac_status"
      xAxis="benchling_date_sample_received_at_sanger"
      interval="M"
      setCombinedFilters={setCombinedFilters}
      type='date'
      height={500}
    />
  )

  const map = (
    <RemoteBubbleMap
      endpoint={endpoint}
      longitudeKey="sts_latitude"
      latitudeKey="sts_longitude"
      filter={combinedFilters}
      height={500}
    />
  )

  const table = (
    <RemoteTable
      endpoint={endpoint}
      filter={combinedFilters}
      defaultSort="sts_collection_country"
      fields={{
        "uid": {
          rename: "ID"
        },
        "sts_public_name": {
          rename: "ToLID",
        },
        "sts_biosample_accession": {
          rename: "BioSample ID"
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
      height={500}
    />
  )

  return (
    <div className="samples">
      <Widgets
        title="Samples"
        components={[chart, map]} 
      />
      <Widgets components={[table]} />
    </div>
  );
}
export default Samples;