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
  goat_genus_name: {
    rename: 'Genus',
    width: 180
  },
  goat_scientific_name: {
    rename: 'Species',
    width: 180
  },
  tolid_prefix: {
    rename: 'ToL ID Prefix',
    width: 180
  },
  tolid_tolid_count: {
    rename: 'Specimen Number',
    width: 180
  },
  informatics_tolid_informatics_status_summary_min: {
    rename: 'Genome Status',
    filter: 'multi',  
    width: 180
  },
  sts_sample_sts_gal_name_union: {
    rename: 'Hub Name',
    filter: 'multi',
    width: 180
  },
  goat_genome_size: {
    rename: "Goat Genome Size",
    hidden: true
  },
  goat_chromosome_number: {
    rename: "Goat Chromosome Number",
    hidden: true
  },
  grit_curation_grit_created_min: {
    rename: "Grit Curation Grit Created Min",
    hidden: true
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