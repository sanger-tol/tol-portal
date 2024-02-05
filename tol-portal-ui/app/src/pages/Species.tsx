/*
 * SPDX-FileCopyrightText: 2023 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import { RemoteTable,
         RemoteSunburst,
         Widgets } from '@tol/tol-ui';
import SpeciesLink from '../components/SpeciesLink';
import { useState } from 'react';


function Species() {
  const [filter, setFilter] = useState({});

  const sunburst = (
    <RemoteSunburst
      title="Species"
      endpoint="species"
      sliceBy={["sts_order_group", "sts_family"]}
      height={600}
      legendPosition="left"
      setCombinedFilters={setFilter}
    />
  );
  
  const table = (
    <RemoteTable
      id="species-table-v2"
      endpoint="species"
      defaultSort="sts_scientific_name"
      height={600}
      filter={filter}
      fields={{
        "sts_scientific_name": {
          rename: "Scientific Name",
          cellRenderer: {
            element: SpeciesLink,
            propPointers: {
              id: 'uid',
              name: 'sts_scientific_name'
            }
          }
        },
        "sts_taxon_group": {
          rename: "Taxon Group"
        },
        "sts_family": {
          rename: "Family"
        },
        "sts_order_group": {
          rename: "Order"
        },
        "sts_prefix": {
          rename: "ToLID Prefix"
        },
      }}
    />
  );

  return (
    <div className="species">
      <Widgets
        title="Species"
        components={[sunburst]}
      />
      <Widgets
        components={[table]}
      />
    </div>
  );
}
export default Species;