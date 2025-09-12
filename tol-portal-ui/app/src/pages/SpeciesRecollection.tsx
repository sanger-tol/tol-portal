/*
 * SPDX-FileCopyrightText: 2023 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import { RemoteTable, Widgets, useZone } from '@tol/tol-ui';
import SpeciesLink from '../components/SpeciesLink';
import { ELASTIC_DS } from '..';


function SpeciesRecollection() {
  const speciesRecollection = useZone({
    objectType: 'species',
    dataSource: ELASTIC_DS,
    components: [
      {
        id: 'species-recollection-table',
        filter: {
          and_: {
            "sts_species_id": { exists: {} }
          }
        },
      }
    ]
  });

  const table = (
    <RemoteTable
      id="species-recollection-table"
      defaultSortByAttribute='sts_scientific_name'
      displaySource
      cellRenderer={{
        "speciesLink": SpeciesLink,
      }}
      fields={{
        data: {
          "sts_scientific_name": {
            rename: "Scientific Name",
            cellRenderer: {
              element: "speciesLink",
              props: {
                id: "${uid}",
                name: "${sts_scientific_name}"
              },
            },
          },
          "calc_sample_calc_benchling_remaining_weight_sum": {
            rename: "Tissue Remaining"
          },
          "calc_extraction_calc_benchling_volume_ul_sum": {
            rename: "Volume of Extraction"
          },
          "calc_tissue_prep_calc_benchling_weight_mg_sum": {
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
          "mlwh_run_data_mlwh_run_complete_hic_min": {
            rename: "HiC Run Complete"
          },
          "mlwh_run_data_mlwh_run_complete_pacbio_min": {
            rename: "PacBio Run Complete"
          },
          "mlwh_run_data_mlwh_run_complete_rnaseq_min": {
            rename: "RNASeq Run Complete"
          },
          "sts_sequencing_material_status": {
            rename: "Material Status"
          },
          "sts_sequencing_material_status_updated_at": {
            rename: "Material Status Updated"
          },
        },
        order: {
          active: [
            "sts_scientific_name",
            "calc_sample_calc_benchling_remaining_weight_sum",
            "calc_extraction_calc_benchling_volume_ul_sum",
            "calc_tissue_prep_calc_benchling_weight_mg_sum",
            "benchling_sequencing_request_lrpacbio_library_remaining_sum",
            "benchling_sequencing_request_benchling_completion_date_hic_min",
            "benchling_sequencing_request_benchling_completion_date_pacbio_min",
            "benchling_sequencing_request_benchling_completion_date_rnaseq_min",
            "mlwh_run_data_mlwh_run_complete_hic_min",
            "mlwh_run_data_mlwh_run_complete_pacbio_min",
            "mlwh_run_data_mlwh_run_complete_rnaseq_min",
            "sts_sequencing_material_status",
            "sts_sequencing_material_status_updated_at",
          ],
        },
      }}
      {...speciesRecollection}
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
