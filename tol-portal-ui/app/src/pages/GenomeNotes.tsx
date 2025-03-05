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
    endpoint: 'genome_notes',
    components: [
      { id: 'genome-notes-bar-chart-v1' },
      { id: 'genome-notes-table-v3' }
    ]
  });

  const chart = (
    <RemoteBarChart
      id="genome-notes-bar-chart-v1"
      stacked
      title="Genome Notes"
      breakDownBy="gn-passed_pr"
      xAxis="gn_date_published"
      type='M'
      {...notes}
    />
  );


  const table = (
    <RemoteTable
      id="genome-notes-table-v3"
      defaultSort="-gn_date_published"
      displaySource
      fields={{
        "id": {
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
        },
        "mlwh_run_complete": {
          rename: "Complete Date"
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
      component: chart,
      type: 'lg'
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
