/*
 * SPDX-FileCopyrightText: 2023 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import {
  RemoteTable,
  RemoteSunburst,
  Widgets,
  useZone
} from '@tol/tol-ui';
import Platform from '../components/Platform';


function GenomeNotes() {
  const notes = useZone({
    endpoint: 'genome_note',
    components: [
      {
        id: 'genome-notes-sunburst',
        filter: {
          and_: {
            'gn_species.id': {
              exists: {}
            }
          }
        }
      },
      { id: 'genome-notes-table-v3' }
    ]
  });

  const sunburst = (
    <RemoteSunburst
      id="genome-notes-sunburst"
      utilityBarConfig={{
        title: {
          title: 'Species',
        }
      }}
      sliceBy={["gn_species.sts_order_group", "gn_species.sts_family"]}
      height={450}
      legendPosition="right"
      {...notes}
    />
  );

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
      component: sunburst,
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
