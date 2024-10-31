/*
 * SPDX-FileCopyrightText: 2023 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import { 
  Button,
  RemoteBarChart,
  RemoteSunburst,
	RemoteTable,
  Widgets,
	Row,
	Col,
  RemoteCount,
  useZone
// } from '@tol/tol-ui';
} from '../tol-ui/src';
import SpeciesLink from '../components/SpeciesLink';

const button = (
  <Button
    href="https://docs.google.com/forms/d/e/1FAIpQLSdNpKVAPXCZVkY0cnM94_r3jYQfBVFyEBimE_f-bZIUX-23ng/viewform?usp=sf_link"
    className="feedback-btn"
  >
		Provide Feedback
  </Button>
);

const title = (
  <div>
    <h2>Project Management</h2>
  </div>
);

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
  
  const pmTable = (
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
      {...useZone({
        endpoint: 'species',
        components: [{id: 'home-species-table-v1'}]
      })}
    />
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
      component: pmTable,
      type: 'lg'
    },
  ];

  return (
    <div className="species">
      <Widgets components={components}/>
    </div>
  );
}
export default ProjectManagement;