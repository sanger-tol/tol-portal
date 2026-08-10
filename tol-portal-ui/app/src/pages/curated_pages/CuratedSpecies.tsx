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
      "sample_programme_union": { eq: { value: "ToL" } }
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
      scientific_name: {
        cellRenderer: {
          type: "link",
          props: {
            url: "/public/species/${id}",
            text: "${scientific_name}",
          },
        },
      },
      sample_priority_status: {
        filter: "multi",
      },
      tolid_status_summary_min: {
        filter: "multi",
      },
      sample_gal_name_union: {
        filter: "multi",
      },
      assembly_stage: {
        filter: "multi",
      },
    },
    order: {
      active: [
        "scientific_name",
        "prefix",
        "sample_count",
        "tolid_status_summary_min",
        "calc_recollection_needed",
        "taxon_group",
        "family",
        "order_group",
        "run_data_run_complete_hic_min",
        "run_data_run_complete_pacbio_min",
        "run_data_run_complete_rnaseq_min",
        "sample_priority_status",
      ],
      inactive: [
        "sample_count",
        "tolid_status_summary_min",
        "calc_recollection_needed",
        "taxon_group",
        "family",
        "order_group",
        "run_data_run_complete_hic_min",
        "run_data_run_complete_pacbio_min",
        "run_data_run_complete_rnaseq_min",
        "sample_priority_status",
        "calc_done_date",
        "sequencing_request_completion_date_hic_min",
        "sequencing_request_completion_date_pacbio_min",
        "assembly_stage",
        "chromosome_number",
        "ploidy",
        "sample_col_date_max",
        "sample_count",
        "genome_size",
        "tissue_depleted",
        "sequencing_material_status_updated_at",
        "sequencing_material_status",
        "long_list",
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