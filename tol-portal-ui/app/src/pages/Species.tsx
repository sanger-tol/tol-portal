/*
 * SPDX-FileCopyrightText: 2023 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import { CentreContents, AutoTable } from '@tol/tol-ui'


function Species() {
  return (
    <div className="species">
      <CentreContents>
        <AutoTable
          endpoint="species"
          fields={{
            "id": {
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
            "tolid_prefix": {
              rename: "ToLID prefix"
            },
          }}
        />
      </CentreContents>
    </div>
  );
}
export default Species;