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
  useZone,
  } from '@/tol-ui';
import SpeciesLink from '../components/SpeciesLink';

function ProjectManagement() {
 
  const statusChart = (
    <RemoteBarChart
      id="pm-status-bar-v1"
      endpoint="species"
      stacked
      title="Breakdown of Project Stages"
      breakDownBy="sts_sample_sts_project_union" 
      xAxis= "calc_pm_status"
      type="categorical"
      
    />
  );
  
  const submittedChart = (
    <RemoteBarChart
      id="pm-submitted-bar-chart-v1"
      endpoint="species"
      stacked
      title="Species Submitted to ENA"
      breakDownBy="sts_sample_sts_project_union"
      xAxis="grit_curation_grit_done_date_min"
      type='M'
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
        "sts_sample_sts_project_union": {
          rename: "Project"
        },
        "calc_pm_status": {
          rename: "Project Status"
        },
        "grit_curation_grit_done_date_min": {
          rename: "Curation Completion Date"
        },
      }}
      {...useZone({
        endpoint: 'species',
        components: [{id: 'pm-species-table-v1'}]
      })}
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

  return (
    <div className="project-management">
      <Widgets components={components}/>
    </div>
  );
}
export default ProjectManagement;