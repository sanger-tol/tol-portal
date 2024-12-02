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
    endpoint: 'species',
    filter: defaultFilter,
    components: [
      {
        id: 'species-table',
      }
    ]
  });

  const fields = {
  sts_scientific_name: {
      rename: 'Species'
    },
  calc_done_date: {
    rename: 'Done Date'
  },
  sts_sample_count: {
    rename: 'No of Samples'
  },
  benchling_sequencing_request_benchling_completion_date_hic_min: {
    rename: 'HiC Submitted'
  },
  benchling_sequencing_request_benchling_completion_date_pacbio_min: {
    rename: 'PacBio Submitted'
  },
  informatics_tolid_informatics_status_summary_min: {
    rename: 'Informatics Status',
    filter: 'multi'
  },
  tolqclegacy_assembly_stage: {
    rename: 'Assembly Stage',
    filter: 'multi'
  },
  sts_taxon_group: {
    rename: 'Taxon Group'
  },
  sts_order_group: {
    rename: 'Order'
  },
  sts_family: {
    rename: 'Family'
  },
  sts_prefix: {
    rename: 'ToLID Prefix'
  },
  goat_chromosome_number: {
    rename: "GoaT Chromosome Number"
  },
  goat_ploidy: {
    rename: "GoaT Ploidy"
  },
  sts_sample_sts_col_date_max: {
    rename: "Latest Collection Date"
  },
  benchling_sample_count: {
    rename: "Number of Samples in Benchling"
  },
  sts_genome_size: {
    rename: "Species Genome Size"
  },
  uid: {
    rename: "ID"
  },
  sts_tissue_depleted: {
    rename: 'Tissue Depleted'
  },
  sts_sequencing_material_status_updated_at: {
    rename: 'Sequencing Material Status Updated At'
  },
  sts_sequencing_material_status: {
    rename: 'Sequencing Material Status'
  },
  goat_long_list: {
    rename: 'Long list (GoaT)'
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