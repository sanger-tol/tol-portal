/*
 * SPDX-FileCopyrightText: 2023 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import { RemoteTable,
         Widgets } from '@tol/tol-ui';


function Specimens() {
  const table = (
    <RemoteTable
      id="specimen-table-v2"
      endpoint="specimen"
      defaultSort='sts_bio_specimen_id'
      height={600}
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
    />
  );

  return (
    <div className="specimens">
      <Widgets
        title="Specimens"
        components={[table]}
      />
    </div>
  );
}
export default Specimens;