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
import { ELASTIC_DS } from '..';


function GenomeNotes() {
  const notes = useZone({
    objectType: 'genome_note',
    dataSource: ELASTIC_DS,
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
      { id: 'genome-notes-table' }
    ]
  });

  const sunburst = (
    <RemoteSunburst
      id="genome-notes-sunburst"
      utilityBarConfig={{
        title: {
          text: 'Species',
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
      id="genome-notes-table"
      defaultSortByAttribute="gn_date_published"
      defaultSortByType="desc"
      displaySource
      fields={{
        data: {
          "id": {
            rename: "DOI"
          },
          "gn_species.goat_scientific_name": {
            rename: "Species",
            cellRenderer: {
              type: "relationship",
              props: {
                detailPageIdAttribute: "gn_species.id"
              }
            }
          },
          "gn_tolid.id": {
            rename: "ToLID"
          },
          "gn_date_published": {
            rename: "Date Published"
          }
        },
        order: {
          active: [
            "id",
            "gn_species.goat_scientific_name",
            "gn_tolid.id",
            "gn_date_published",
          ],
        },
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
