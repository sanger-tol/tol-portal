/*
 * SPDX-FileCopyrightText: 2023 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import { useState } from 'react';
import { 
  RemoteBarChart,
	RemoteTable,
  Widgets,
  useZone
  //} from '@tol/tol-ui';
  } from '../tol-ui/src';
import SpeciesLink from '../components/SpeciesLink';

function ProjectManagement() {
  const projectManagement = useZone({
    endpoint: 'species',
    components: [
      { id: 'pm-status-bar-v1' },
      { id: 'pm-submitted-bar-chart-v1'},
      { id: 'project-management-table-v2' }
    ]
  });
  
  const [cumulative, setCumulative] = useState(false);
  const toggleCumulative = () => setCumulative(prev => !prev);

  const statusChart = (
    <RemoteBarChart
      id="pm-status-bar-v1"
      stacked
      title="Breakdown of Project Stages"
      breakDownBy="sts_sample_sts_project_union" 
      xAxis= "calc_pm_status"
      type="categorical"
      {...projectManagement}
    />
  );
  
  const submittedChart = (
    <RemoteBarChart
      id="pm-submitted-bar-chart-v1"
      stacked
      title="Species Submitted to ENA"
      breakDownBy="sts_sample_sts_project_union"
      xAxis="grit_curation_grit_done_date_min"
      type='M'
      cumulative={cumulative}
      {...projectManagement}
    />
  );
  
  const table = (
    <RemoteTable
      id="pm-species-table-v1"
      defaultSort="sts_scientific_name"
      fields={{
        "sts_scientific_name": {
          rename: "Species Name",
          cellRenderer: {
            element: SpeciesLink,
            propPointers: {
              id: 'uid',
              name: 'sts_scientific_name'
            }
          }
        },
        "informatics_tolid_informatics_status_summary_max": {
          rename: "Informatics Status Summary"
        },
        "sts_taxon_group": {
          rename: "Taxon Group"
        },
        "sts_family": {
          rename: "Family"
        },
        "sts_order_group": {
          rename: "Order"
        },
        "sts_prefix": {
          rename: "ToLID Prefix"
        },
      }}
      {...projectManagement}
    />
  );

  const title = (
    <div>
      <h2>Project Management</h2>
    </div>
  );

  const components = [
    {
      component: title,
      type: 'full'
    },
    {
      component: (
        <div>
          <label>
            <input
              type="checkbox"
              checked={cumulative}
              onChange={toggleCumulative}
            />
            Show Cumulative Histogram
          </label>
        </div>
      ),
      type: 'full'
    },
    {
      component: submittedChart,
      type: 'lg'
    },
    {
      component: statusChart,
      type: 'lg'
    },
    {
      component: table,
      type: 'lg'
    },
  ];

  console.log(projectManagement);

  return (
    <div className="project-management">
      <Widgets components={components}/>
    </div>
  );
}
export default ProjectManagement;