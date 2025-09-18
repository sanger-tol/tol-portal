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

//Visible fields
const visibleFields = {
  uid: {},
  sts_family: {},
  sts_genus: {},
  sts_scientific_name: {},
  sts_prefix: {},
  tolid_tolid_count: {},
  informatics_tolid_informatics_status_summary_min: {
    filter: "multi",
  },
  sts_sample_sts_gal_name_union: {
    filter: "multi",
  },
};

// Hidden fields
const hiddenFields = {
  calc_done_date: {},
  sts_sample_count: {},
  benchling_sequencing_request_benchling_completion_date_hic_min: {},
  benchling_sequencing_request_benchling_completion_date_pacbio_min: {},
  tolqclegacy_assembly_stage: {
    filter: "multi",
  },
  sts_taxon_group: {},
  sts_order_group: {},
  goat_chromosome_number: {},
  goat_ploidy: {},
  sts_sample_sts_col_date_max: {},
  benchling_sample_count: {},
  sts_genome_size: {},
  sts_tissue_depleted: {},
  sts_sequencing_material_status_updated_at: {},
  sts_sequencing_material_status: {},
  goat_long_list: {},
};

const fields = {
  data: {
    ...visibleFields,
    ...hiddenFields,
  },
  order: {
    active: [
      Object.keys(visibleFields),
    ],
    inactive: [
      Object.keys(hiddenFields),
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