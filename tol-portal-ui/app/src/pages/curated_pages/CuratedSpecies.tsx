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
  id:{},
  sts_family: {},
  sts_genus: {},
  sts_scientific_name: {},
  sts_prefix: {},
  tolid_tolid_count: {},
  informatics_tolid_informatics_status_summary_min: {
    filter: "multi"
  },
  sts_sample_sts_gal_name_union: {
    filter: "multi"
  },
};

// Hidden fields
const hiddenFields = {
  calc_done_date: {
    hidden: true,
  },
  sts_sample_count: {
    hidden: true,
  },
  benchling_sequencing_request_benchling_completion_date_hic_min: {
    hidden: true,
  },
  benchling_sequencing_request_benchling_completion_date_pacbio_min: {
    hidden: true,
  },
  tolqclegacy_assembly_stage: {
    filter: "multi",
    hidden: true,
  },
  sts_taxon_group: {
    hidden: true,
  },
  sts_order_group: {
    hidden: true,
  },
  goat_chromosome_number: {
    hidden: true,
  },
  goat_ploidy: {
    hidden: true,
  },
  sts_sample_sts_col_date_max: {
    hidden: true,
  },
  benchling_sample_count: {
    hidden: true,
  },
  sts_genome_size: {
    hidden: true,
  },
  sts_tissue_depleted: {
    hidden: true,
  },
  sts_sequencing_material_status_updated_at: {
    hidden: true,
  },
  sts_sequencing_material_status: {
    hidden: true,
  },
  goat_long_list: {
    hidden: true,
  },
};

const fields = {
  ...visibleFields,
  ...hiddenFields,
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