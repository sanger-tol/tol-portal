/*
 * SPDX-FileCopyrightText: 2023 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import { RemoteTable, Widgets, useZone } from '@tol/tol-ui';
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
            "species_id": { exists: {} }
          }
        },
      }
    ]
  });

  const table = (
    <RemoteTable
      id="species-recollection-table"
      defaultSortByAttribute='scientific_name'
      displaySource
      fields={{
        data: {
          "scientific_name": {
            rename: "Scientific Name",
            cellRenderer: {
              type: "link",
              props: {
                url: "/species/${id}",
                text: "${scientific_name}"
              },
            },
          },
          "sample_calc_benchling_remaining_weight_sum": {
            rename: "Tissue Remaining"
          },
          "extraction_calc_benchling_volume_ul_dna_sum": {
            rename: "Volume of Extraction"
          },
          "tissue_prep_calc_benchling_weight_mg_sum": {
            rename: "Tissue Prep Remaining"
          },
          "sequencing_request_completion_date_hic_min": {
            rename: "HiC Request Complete"
          },
          "sequencing_request_completion_date_pacbio_min": {
            rename: "Pacbio Request Complete"
          },
          "sequencing_request_completion_date_rnaseq_min": {
            rename: "RNASeq Request Complete"
          },
          "run_data_run_complete_hic_min": {
            rename: "HiC Run Complete"
          },
          "run_data_run_complete_pacbio_min": {
            rename: "PacBio Run Complete"
          },
          "run_data_run_complete_rnaseq_min": {
            rename: "RNASeq Run Complete"
          },
          "sequencing_material_status": {
            rename: "Material Status"
          },
          "sequencing_material_status_updated_at": {
            rename: "Material Status Updated"
          },
        },
        order: {
          active: [
            "scientific_name",
            "sample_calc_benchling_remaining_weight_sum",
            "extraction_calc_benchling_volume_ul_dna_sum",
            "tissue_prep_calc_benchling_weight_mg_sum",
            "sequencing_request_completion_date_hic_min",
            "sequencing_request_completion_date_pacbio_min",
            "sequencing_request_completion_date_rnaseq_min",
            "run_data_run_complete_hic_min",
            "run_data_run_complete_pacbio_min",
            "run_data_run_complete_rnaseq_min",
            "sequencing_material_status",
            "sequencing_material_status_updated_at",
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