/*
 * SPDX-FileCopyrightText: 2023 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import { RemoteTable,
  Widgets, useZone } from '@tol/tol-ui';


function Specimens() {
  const specimens = useZone({
    endpoint:'specimen',
    components: [
      { id:'specimen-table-v2' }
    ]
  });

  const table = (
    <RemoteTable
      id="specimen-table-v2"
      defaultSort='sts_bio_specimen_id'
      displaySource
      fields={{
        "uid": {
          rename: "ID"
        },
        "sts_bio_specimen_id": {
        },
        "sts_dna_depleted": {
        },
        "sts_rna_depleted": {
        },
        "sts_tissue_depleted": {
        },
        "sts_is_complex": {
        },
        "sts_estimated_genome_size": {
        },
        "sts_updated_at": {
        },
        "sts_created_on": {
        }
      }}
      {...specimens}
    />
  );

  const title = (
    <div>
      <h2>Specimens</h2>
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
    <div className="specimens">
      <Widgets
        components={components}
      />
    </div>
  );
}
export default Specimens;