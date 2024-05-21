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
      id="home-run-bar-chart-v1"
      endpoint="run_data"
      stacked
      title="Run Complete Data"
      breakDownBy="mlwh_instrument_model"
      xAxis="mlwh_run_complete"
      type='M'
    />
  );
  
  const sampleChart = (
    <RemoteBarChart
      id="home-sample-bar-chart-v1"
      endpoint="sample"
      stacked
      title="Samples Recieved"
      breakDownBy="sts_ac_status"
      xAxis="benchling_date_sample_received_at_sanger"
      type='M'
    />
  );

  const speciesSunburst = (
    <RemoteSunburst
      id="home-species-sunburst-v1"
      endpoint="species"
      title="Species"
      sliceBy={["sts_order_group", "sts_family"]}
      legendPosition="left"
    />
  );
  
  const speciesTable = (
    <RemoteTable
      id="home-species-table-v1"
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
      {...useZone({
        endpoint: 'species',
        components: [{id: 'home-species-table-v1'}]
      })}
    />
  );

  const speciesCount = (
    <RemoteCount
      id="home-species-count-v1"
      title='Species'
      {...useZone({
        endpoint: 'species',
        components: [{
          id: 'home-species-count-v1',
          filter: {
            and_: {
              'sts_scientific_name': {
                exists: {},
              }
            }
          }
        }]
      })}
    />
  );

  const tolidCount = (
    <RemoteCount
      id="home-tolid-count-v1"
      title='ToLIDs Submitted'
      {...useZone({
        endpoint: 'tolid',
        components: [{
          id: 'home-tolid-count-v1',
          filter: {
            and_: {
              'informatics_status_summary': {
                eq: {value: '1 submitted'}
              }
            }
          }
        }]
      })}
    />
  );

  const extractionsCount = (
    <RemoteCount
      id="home-extractions-count-v1"
      endpoint='extraction'
      title='Extractions'
    />
  );

  const runDataCount = (
    <RemoteCount
      id="home-run-data-count-v1"
      endpoint='run_data'
      title='Runs'
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