/*
 * SPDX-FileCopyrightText: 2023 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import React from 'react';
import { RemoteTable,
  RemoteSunburst,
  Widgets } from '@tol/tol-ui';


const sunburst = (
  <RemoteSunburst
    title="Species"
    endpoint="species"
    sliceBy={["sts_order_group", "sts_family"]}
    height={600}
    legendPosition="left"
  />
);

const table = (
  <RemoteTable
    id="species-table-v2"
    endpoint="species"
    height={600}
    fields={{
      "uid": {
        rename: "Taxonomy ID"
      },
      "sts_scientific_name": {
        rename: "Scientific Name"
      },
      "sts_family": {
        rename: "Family"
      },
      "sts_order_group": {
        rename: "Order"
      },
      "sts_prefix": {
        rename: "ToLID prefix"
      },
    }}
  />
);

function Species() {
  return (
    <div className="species">
      <Widgets
        title="Species"
        components={[sunburst, table]}
      />
    </div>
  );
}
export default Species;