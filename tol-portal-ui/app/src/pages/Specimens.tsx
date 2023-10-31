/*
 * SPDX-FileCopyrightText: 2023 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import { RemoteTable,
         Widgets } from '@tol/tol-ui'
import BooleanStatus from '../components/BooleanStatus'


const booleanStatus = (statusName: string) => {
  return {
    element: BooleanStatus,
    propPointers: {
      status: statusName
    }
  }
}

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
        rename: "DNA Depleted",
        cellRenderer: booleanStatus("sts_dna_depleted")
      },
      "sts_rna_depleted": {
        rename: "RNA Depleted",
        cellRenderer: booleanStatus("sts_rna_depleted")
      },
      "sts_tissue_depleted": {
        rename: "Tissue Depleted",
        cellRenderer: booleanStatus("sts_tissue_depleted")
      },
      "sts_is_complex": {
        rename: "Is Complex",
        cellRenderer: booleanStatus("sts_is_complex")
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
)

function Specimens() {
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