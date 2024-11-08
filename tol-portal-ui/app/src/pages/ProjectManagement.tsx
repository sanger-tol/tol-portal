/*
 * SPDX-FileCopyrightText: 2023 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import { useState } from 'react';
import { 
  RemoteTable,
  RemoteBarChart,
  RemoteMap,
  RemoteSunburst,
  Button,
  Filter,
  Widgets,
  Row,
  Col,
  env,
  useZone,
  resetZone
  } from '@tol/tol-ui';
import SpeciesLink from '../components/SpeciesLink';

function ProjectManagement() {

  const projectManagement = useZone({
    endpoint: 'species',
    components: [
      {
        id: 'project-filters-v1',
        filter: {
          and_: {
            "sts_sample_sts_programme_union": { eq: { value: "ToL" } },
            "informatics_tolid_informatics_status_min": { neq: { value: "71_abandoned" } }
          }
        }
      },
      { id: 'pm-submitted-bar-chart-v1'},
      { id: 'pm-status-bar-chart-v1' },
      { id: 'pm-species-table-v1'}
    ]
  });

  const filters = (
    <Row className="mobile-filters">
      <Col>
        <Filter
          attribute='sts_sample_sts_project_union'
          rename="Project"
          type='multi'
          componentId="project-filters-v1"
          {...projectManagement}
        />
      </Col>
    </Row>
  );

  const submittedChart = (
    <RemoteBarChart
      id="pm-submitted-bar-chart-v1"
      title="Species Submitted to ENA"
      stacked
      shortDate={true}
      breakDownBy="sts_sample_sts_project_union"
      xAxis="grit_curation_grit_done_date_min"
      type='M'
      {...projectManagement}
    />
  );

  const statusChart = (
    <RemoteBarChart
      title="Current Project Statuses"
      id="pm-status-bar-chart-v1"
      stacked
      breakDownBy="sts_sample_sts_project_union"
      xAxis="calc_pm_status"
      type='categorical'
      {...projectManagement}
    />
  );

 // const statusChart = (
    // <span>
    //   <h6>
    //     Current Project Statuses:
    //   </h6>
    //   <p className="mb-3">
    //     Number of species in various stages in the genomic pipeline. 
    //   </p>
  //     <RemoteSunburst
  //     id="pm-status-sunburst-chart-v1"
  //     title="Current Project Statuses"
  //     sliceBy={[
  //       "calc_pm_status",
  //       "informatics_tolid_informatics_status_min"
  //     ]}
  //     legendPosition="right"
  //     noLabel
  //     height={450}
  //     {...projectManagement}
  //   />
  //   // </span>
  // );
  
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
        "informatics_tolid_informatics_status_min": {
          rename: "Informatics Status"
        },
        "grit_curation_grit_done_date_min": {
          rename: "Curation Completion Date"
        },
        "grit_curation_grit_in_submission_date_min": {
          rename: "Curation Submission Date"
        },
        "grit_curation_grit_open_date_min": {
          rename: "Curation Created Date"
        },
        "sts_sample_sts_tollab_assign_date_min":{
          rename: "Assigned To Lab Date"
        }
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
      component: filters,
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
      type: 'xl'
    },
  ];

  return (
    <div className="project-management">
      <Widgets components={components}/>
    </div>
  );
}
export default ProjectManagement;