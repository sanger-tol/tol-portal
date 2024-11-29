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
      rename: 'Species',
      width: 180
    },
  calc_done_date: {
    rename: 'Done Date',
    width: 180
  },
  sts_sample_count: {
    rename: 'No of Samples',
    width: 180
  },
  benchling_sequencing_request_benchling_completion_date_hic_min: {
    rename: 'HiC Submitted',
    width: 180
  },
  benchling_sequencing_request_benchling_completion_date_pacbio_min: {
    rename: 'PacBio Submitted',
    width: 180
  },
  informatics_tolid_informatics_status_summary_min: {
    rename: 'Informatics Status',
    filter: 'multi',  
    width: 180
  },
  tolqclegacy_assembly_stage: {
    rename: 'Assembly Stage',
    filter: 'multi',  
    width: 180
  },
  sts_taxon_group: {
    rename: 'Taxon Group',
    width: 180
  },
  sts_order_group: {
    rename: 'Order',
    width: 180
  },
  sts_family: {
    rename: 'Family',
    width: 180
  },
  sts_prefix: {
    rename: 'ToLID Prefix',
    width: 120
  },
  goat_chromosome_number: {
    rename: "GoaT Chromosome Number",
    width: 120
  },
  goat_ploidy: {
    rename: "GoaT Ploidy",
    width: 120
  },
  sts_sample_sts_col_date_max: {
    rename: "Latest Collection Date",
    width: 180
  },
  benchling_sample_count: {
    rename: "Number of Samples in Benchling",
    width: 120
  },
  sts_genome_size: {
    rename: "Species Genome Size",
    width: 180
  },
  uid: {
    rename: "ID",
    width: 120
  },
  sts_tissue_depleted: {
    rename: 'Tissue Depleted',
    width: 120
  },
  sts_sequencing_material_status_updated_at: {
    rename: 'STS Sequencing Material Status Updated At',
    width: 180
  },
  sts_sequencing_material_status: {
    rename: 'Sequencing Material Status',
    width: 180
  },
  tolid_prefix: {
    rename: 'ToL ID Prefix',
    width: 180
  },
  goat_long_list: {
    rename: 'Long list (GoaT)',
    width: 180
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