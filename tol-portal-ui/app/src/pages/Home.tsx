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
  RemoteCount
} from '@tol/tol-ui';
import SpeciesLink from '../components/SpeciesLink';


const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) {
    return "Good morning - have a great day.";
  } else if (hour >= 17) {
    return "Good evening.";
  } else if (hour >= 12) {
    return "Good afternoon.";
  }
};

const button = (
  <Button
    href="https://docs.google.com/forms/d/e/1FAIpQLSdNpKVAPXCZVkY0cnM94_r3jYQfBVFyEBimE_f-bZIUX-23ng/viewform?usp=sf_link"
    className="feedback-btn"
  >
		Provide Feedback
  </Button>
);

const title = (
  <span>
    <h2>{getGreeting()}</h2>
    <p className='mt-2'>
			Welcome to ToL Portal, the home of Tree of Life data.
    </p>
  </span>
);

const intro = (
  <Row>
    <Col xs={12} sm={8}>{title}</Col>
    <Col xs={12} sm={4}>{button}</Col>
  </Row>
);

function Home() {
  const runChart = (
    <RemoteBarChart
      id="home-run-bar-chart"
      stacked
      title="Run Complete Data"
      endpoint="run_data"
      breakDownBy="mlwh_instrument_model"
      xAxis="mlwh_run_complete"
      interval="M"
      type='date'
    />
  );
  
  const sampleChart = (
    <RemoteBarChart
      id="home-sample-bar-chart"
      stacked
      title="Samples Recieved"
      endpoint="sample"
      breakDownBy="sts_ac_status"
      xAxis="benchling_date_sample_received_at_sanger"
      interval="M"
      type='date'
    />
  );
  
  const speciesSunburst = (
    <RemoteSunburst
      id="home-sunburst"
      title="Species"
      endpoint="species"
      sliceBy={["sts_order_group", "sts_family"]}
      legendPosition="left"
    />
  );

  const speciesTable = (
    <RemoteTable
      id="species-home-table-v2"
      endpoint="species"
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
    />
  );

  const speciesCount = (
    <RemoteCount
      title='Species'
      endpoint='species'
      filter={
        {and_: {"sts_scientific_name": {exists: {}}}}
      }
    />
  );

  const tolidCount = (
    <RemoteCount
      title='ToLIDs Submitted'
      endpoint='tolid'
      filter={
        {and_: {"informatics_status_summary": {eq: {value: '1 submitted'}}}}
      }
    />
  );

  const extractionsCount = (
    <RemoteCount
      title='Extractions'
      endpoint='extraction'
    />
  );

  const runDataCount = (
    <RemoteCount
      title='Runs'
      endpoint='run_data'
    />
  );

  const components = [
    {
      component: intro,
      type: 'full'
    },
    {
      component: speciesCount,
      type: 'sm'
    },
    {
      component: tolidCount,
      type: 'sm'
    },
    {
      component: extractionsCount,
      type: 'sm'
    },
    {
      component: runDataCount,
      type: 'sm'
    },
    {
      component: speciesSunburst,
      type: 'md'
    },
    {
      component: runChart,
      type: 'md'
    },
    {
      component: sampleChart,
      type: 'md'
    },
    {
      component: speciesTable,
      type: 'md'
    }
  ];

  return (
    <div className="species">
      <Widgets components={components}/>
    </div>
  );
}
export default Home;