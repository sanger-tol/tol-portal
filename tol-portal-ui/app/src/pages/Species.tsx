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
      height={450}
      legendPosition="right"
      setCombinedFilters={setFilter}
    />
  );
  
  const table = (
    <RemoteTable
      id="species-table-v2"
      endpoint="species"
      defaultSort="sts_scientific_name"
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

  const title = (
    <div>
      <h2 className="tol-widget">Species</h2>
    </div>
  );

  const components = [
    {
      component: title,
      type: 'full'
    },
    {
      component: sunburst,
      type: 'full'
    },
    {
      component: table,
      type: 'lg'
    },
  ];

  return (
    <div className="species">
      <Widgets
        components={components}
      />
    </div>
  );
}
export default Species;