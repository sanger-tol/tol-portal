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
          rename: "BioSpecimen ID"
        },
        "sts_dna_depleted": {
          rename: "DNA Depleted"
        },
        "sts_rna_depleted": {
          rename: "RNA Depleted"
        },
        "sts_tissue_depleted": {
          rename: "Tissue Depleted"
        },
        "sts_is_complex": {
          rename: "Is Complex"
        },
        "sts_estimated_genome_size": {
          rename: "Estimated Genome Size"
        },
        "sts_tol_updated_at": {
          rename: "Portal Last Updated"
        },
        "sts_updated_at": {
          rename: "STS Last Updated"
        },
        "sts_created_on": {
          rename: "STS Created On"
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