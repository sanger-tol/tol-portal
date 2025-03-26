/*
 * SPDX-FileCopyrightText: 2023 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

// temp fix - remove asap!
// @ts-nocheck 
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
import SpeciesLink from '../components/SpeciesLink';

function ProjectManagement() {

  const [cumulative, setCumulative] = useState(false); // Add state for cumulative toggle

  const handleToggleChange = () => {
    setCumulative(prevState => !prevState); // Toggle the cumulative state
  };

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

  const cumulativeCheckbox = (
    <div>
      <label>
        <span className='sub-header-text'>
          Cumulative Histogram
        </span>
        <input
          type="checkbox"
          checked={cumulative}
          onChange={(e) => setCumulative(e.target.checked)} // Toggle functionality
          style={{marginLeft: 5}}
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
          attribute='sts_sample_sts_project_union'
          rename="Project"
          type='multi'
          componentId="project-filters-v1"
          {...projectManagement}
        />
      </Col>
      <Col>
        <Filter
          attribute='sts_order_group'
          rename="Order"
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
      cumulative={cumulative} // Pass the cumulative state to RemoteBarChart
      {...projectManagement}
    />
  );

  const statusChart = (
    <RemoteBarChart
      title="Current Species Statuses"
      id="pm-status-bar-chart-v1"
      stacked
      breakDownBy="sts_sample_sts_project_union"
      xAxis="calc_pm_status"
      type='categorical'
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
        "sts_sample_sts_project_union": {
          rename: "Project"
        },
        "sts_sample_sts_tollab_assign_date_min":{
          rename: "Assigned To Lab Date"
        },
        "informatics_tolid_informatics_status_summary_min": {
          rename: "Informatics Status"
        },
        "tolqclegacy_assembly_stage": {
          rename: "Assembly Stage"
        },
        "mlwh_run_data_mlwh_run_complete_hic_min": {
          rename: "Latest HiC Run"
        },
        "mlwh_run_data_mlwh_run_complete_pacbio_min": {
          rename: "Latest PacBio Run"
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
    { component: cumulativeCheckbox, 
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
