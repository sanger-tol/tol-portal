/*
 * SPDX-FileCopyrightText: 2024 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import {
  RemoteTable,
  Widgets,
  useZone
} from '@tol/tol-ui';
import { ELASTIC_DS } from '../..';


function CuratedSpecies() {

  const title = (
    <div>
      <h2>Species</h2>
    </div>
  );

  const defaultFilter = {
    and_: {
      "sts_sample_sts_programme_union": { eq: { value: "ToL" } }
    }
  }

  const species = useZone({
    objectType: 'species',
    dataSource: ELASTIC_DS,
    filter: defaultFilter,
    components: [
      {
        id: 'species-table',
      }
    ]
  });

  const fields = {
    data: {
      sts_scientific_name: {
        cellRenderer: {
          type: "link",
          props: {
            url: "/public/species/${id}",
            text: "${sts_scientific_name}",
          },
        },
      },
      sts_sample_sts_priority_status: {
        filter: "multi",
      },
      informatics_tolid_informatics_status_summary_min: {
        filter: "multi",
      },
      sts_sample_sts_gal_name_union: {
        filter: "multi",
      },
      tolqclegacy_assembly_stage: {
        filter: "multi",
      },
    },
    order: {
      active: [
        "sts_scientific_name",
        "sts_prefix",
        "sts_sample_count",
        "informatics_tolid_informatics_status_summary_min",
        "calc_recollection_needed",
        "sts_taxon_group",
        "sts_family",
        "sts_order_group",
        "mlwh_run_data_mlwh_run_complete_hic_min",
        "mlwh_run_data_mlwh_run_complete_pacbio_min",
        "mlwh_run_data_mlwh_run_complete_rnaseq_min",
        "sts_sample_sts_priority_status",
      ],
      inactive: [
        "sts_sample_count",
        "informatics_tolid_informatics_status_summary_min",
        "calc_recollection_needed",
        "sts_taxon_group",
        "sts_family",
        "sts_order_group",
        "mlwh_run_data_mlwh_run_complete_hic_min",
        "mlwh_run_data_mlwh_run_complete_pacbio_min",
        "mlwh_run_data_mlwh_run_complete_rnaseq_min",
        "sts_sample_sts_priority_status",
        "calc_done_date",
        "benchling_sequencing_request_benchling_completion_date_hic_min",
        "benchling_sequencing_request_benchling_completion_date_pacbio_min",
        "tolqclegacy_assembly_stage",
        "goat_chromosome_number",
        "goat_ploidy",
        "sts_sample_sts_col_date_max",
        "benchling_sample_count",
        "sts_genome_size",
        "sts_tissue_depleted",
        "sts_sequencing_material_status_updated_at",
        "sts_sequencing_material_status",
        "goat_long_list",
      ],
    },
  };

  const table = (
    <RemoteTable
      id="species-table"
      fields={fields}
      height={500}
      {...species}
    />
  );

  const components = [
    {
      component: title,
      type: 'full'
    },
    {
      component: table,
      type: 'full'
    }
  ];

  return (
    <div>
      <Widgets
        components={components}
      />
    </div>
  );
}


export default CuratedSpecies;