/*
 * SPDX-FileCopyrightText: 2023 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import {
  RemoteTable,
  Widgets,
  useZone
} from '@tol/tol-ui';
import { ELASTIC_DS } from '..';


function Specimens() {
  const specimens = useZone({
    objectType:'specimen',
    dataSource: ELASTIC_DS,
    components: [
      { id:'specimen-table' }
    ]
  });

  const table = (
    <RemoteTable
      id="specimen-table"
      defaultSortByAttribute="sts_bio_specimen_id"
      displaySource
      fields={{
        data: {
          "id": {
            rename: "ID",
          },
        },
        order: {
          active: [
            "id",
            "sts_bio_specimen_id",
            "sts_dna_depleted",
            "sts_rna_depleted",
            "sts_tissue_depleted",
            "sts_is_complex",
            "sts_estimated_genome_size",
            "sts_updated_at",
            "sts_created_on",
          ],
        },
      }}
      {...specimens}
    />
  );

  const title = (
    <div>
      <h2>Specimens</h2>
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
  ];

  return (
    <div className="specimens">
      <Widgets
        components={components}
      />
    </div>
  );
}
export default Specimens;