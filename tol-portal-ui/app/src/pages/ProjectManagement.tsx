/*
 * SPDX-FileCopyrightText: 2023 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import { useState } from 'react';
import {
  RemoteTable,
  RemoteBarChart,
  Filter,
  Widgets,
  Row,
  Col,
  useZone
} from '@tol/tol-ui';
import { ELASTIC_DS } from '..';


function ProjectManagement() {
  const [cumulative, setCumulative] = useState(false);

  const projectManagement = useZone({
    objectType: 'species',
    dataSource: ELASTIC_DS,
    components: [
      {
        id: 'project-filters',
        filter: {
          and_: {
            "sample_programme_union": { eq: { value: "ToL" } },
            "tolid_status_min": { neq: { value: "71_abandoned" } }
          }
        }
      },
      { id: 'pm-submitted-bar-chart' },
      { id: 'pm-status-bar-chart' },
      { id: 'pm-species-table' }
    ]
  });

  const cumulativeCheckbox = (
    <div>
      <label>
        <span className='sub-header-text'>
          Cumulative Histogram
        </span>
        <input
          type="checkbox"
          checked={cumulative}
          onChange={(e) => setCumulative(e.target.checked)}
          style={{ marginLeft: 5 }}
        />
      </label>
      <div>
        <span>For displaying cumulative histogram only. Uncheck this box to resume clickable filtration on the graph.</span>
      </div>
    </div>
  );

  const filters = (
    <Row className="mobile-filters">
      <Col>
        <Filter
          attribute='sample_project_union'
          rename="Project"
          type='multi'
          componentId="project-filters"
          {...projectManagement}
        />
      </Col>
      <Col>
        <Filter
          attribute='order_group'
          rename="Order"
          type='multi'
          componentId="project-filters"
          {...projectManagement}
        />
      </Col>
    </Row>
  );

  const submittedChart = (
    <RemoteBarChart
      id="pm-submitted-bar-chart"
      utilityBarConfig={{
        title: {
          text: 'Species Submitted to ENA',
        }
      }}
      stacked
      shortDate={true}
      breakDownBy="sample_project_union"
      xAxis="curation_done_date_min"
      type='M'
      cumulative={cumulative} // Pass the cumulative state to RemoteBarChart
      {...projectManagement}
    />
  );

  const statusChart = (
    <RemoteBarChart
      utilityBarConfig={{
        title: {
          text: 'Current Species Statuses',
        }
      }}
      id="pm-status-bar-chart"
      stacked
      breakDownBy="sample_project_union"
      xAxis="calc_pm_status"
      type='categorical'
      {...projectManagement}
    />
  );

  const table = (
    <RemoteTable
      id="pm-species-table"
      defaultSortByAttribute="sts_scientific_name"
      fields={{
        data: {
          "scientific_name": {
            rename: "Species Name",
            cellRenderer: {
              type: "link",
              props: {
                url: "/species/${id}",
                text: "${scientific_name}"
              }
            }
          },
          "sample_project_union": {
            rename: "Project"
          },
          "sample_tollab_assign_date_min": {
            rename: "Assigned To Lab Date"
          },
          "tolid_status_summary_min": {
            rename: "Informatics Status"
          },
          "assembly_stage": {
            rename: "Assembly Stage"
          },
          "run_data_run_complete_hic_min": {
            rename: "Latest HiC Run"
          },
          "run_data_run_complete_pacbio_min": {
            rename: "Latest PacBio Run"
          }
        },
        order: {
          active: [
            "scientific_name",
            "sample_project_union",
            "sample_tollab_assign_date_min",
            "tolid_status_summary_min",
            "assembly_stage",
            "run_data_run_complete_hic_min",
            "run_data_run_complete_pacbio_min",
          ],
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
      component: filters,
      type: 'full'
    },
    {
      component: cumulativeCheckbox,
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
      <Widgets components={components} />
    </div>
  );
}
export default ProjectManagement;
