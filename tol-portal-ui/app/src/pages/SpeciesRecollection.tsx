/*
 * SPDX-FileCopyrightText: 2023 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import { RemoteTable, Widgets } from '@tol/tol-ui';
import SpeciesLink from '../components/SpeciesLink';


function SpeciesRecollection() {
  const table = (
    <RemoteTable
      id="species-recollection-table-v1-mvp"
      endpoint="species"
      defaultSort='sts_scientific_name'
      filter={{and_: {"sts_scientific_name": [{op: 'exists'}]}}}
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
        "benchling_sample_benchling_remaining_weight_sum": {
          rename: "Tissue Remaining"
        },
        "benchling_extraction_benchling_volume_ul_sum": {
          rename: "Volume of Extraction"
        },
        "benchling_tissue_prep_benchling_weight_mg_sum": {
          rename: "Tissue Prep Remaining"
        },
        "benchling_sequencing_request_lrpacbio_library_remaining_sum": {
          rename: "Long Read PacBio Library Remaining in SciOps"
        },
        "benchling_sequencing_request_benchling_completion_date_hic_min": {
          rename: "HiC Request Complete"
        },
        "benchling_sequencing_request_benchling_completion_date_pacbio_min": {
          rename: "Pacbio Request Complete"
        },
        "benchling_sequencing_request_benchling_completion_date_rnaseq_min": {
          rename: "RNASeq Request Complete"
        },
        "mlwh_run_data_mlwh_run_complete_pacbio_min": {
          rename: "PacBio Run Complete"
        },
        "mlwh_run_data_mlwh_run_complete_illumina_min": {
          rename: "Illumina Run Complete"
        },
      }}
    />
  );

  const title = (
    <div>
      <h2>Recollection</h2>
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
  ]

  return (
    <div className="recollection">
      <Widgets
        components={components}
      />
    </div>
  );
}

export default SpeciesRecollection;
