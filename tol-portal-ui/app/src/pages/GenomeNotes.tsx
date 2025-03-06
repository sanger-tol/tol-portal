/*
 * SPDX-FileCopyrightText: 2023 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import {
  RemoteTable,
  RemoteBarChart,
  Widgets,
  useZone
} from '@tol/tol-ui';
import Platform from '../components/Platform';


function GenomeNotes() {
  const notes = useZone({
    endpoint: 'genome_note',
    components: [
      { id: 'genome-notes-bar-chart-v1' },
      { id: 'genome-notes-table-v3' }
    ]
  });

  const table = (
    <RemoteTable
      id="genome-notes-table-v3"
      defaultSort="-gn_date_published"
      displaySource
      fields={{
        "uid": {
          rename: "DOI"
        },
        "gn_species.goat_scientific_name": {
          rename: "Species",
          cellRenderer: "relationshipDetail"
        },
        "gn_tolid.id": {
          rename: "ToLID"
        },
        "gn_date_published": {
          rename: "Date Published"
        }
      }}
      {...notes}
    />
  );

  const title = (
    <div>
      <h2>Genome Notes</h2>
    </div>
  );

  const components = [
    {
      component: title,
      type: 'full'
    },
    {
      component: table,
      type: 'lg'
    },
  ];

  return (
    <div className="genome-notes">
      <Widgets
        components={components}
      />
    </div>
  );
}
export default GenomeNotes;
