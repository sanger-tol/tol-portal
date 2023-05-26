/*
 * SPDX-FileCopyrightText: 2023 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import { CentreContents, AutoTable } from '@tol/tol-ui'


function Samples() {
  return (
    <div className="samples">
      <CentreContents>
        <AutoTable
          endpoint="sample"
          fields={{
            "id": {
              rename: "Sample ID"
            },
            "tolqc_taxon_id": {
              rename: "Taxonomy ID"
            }
          }}
        />
      </CentreContents>
    </div>
  );
}
export default Samples;