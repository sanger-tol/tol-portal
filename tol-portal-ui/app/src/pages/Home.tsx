/*
 * SPDX-FileCopyrightText: 2023 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import {
  RemoteBarChart,
  RemoteSunburst,
  RemoteTable,
  Widgets,
  Row,
  Col,
  RemoteCount,
  useZone
} from '@tol/tol-ui';
import { ELASTIC_DS } from '..';


const defaultFilter = {
  and_: {
    "sts_sample_sts_programme_union": { eq: { value: "ToL" } }
  }
}

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
  </Row>
);

function Home() {
  const runChart = (
    <RemoteBarChart
      id="home-run-bar-chart"
      objectType="run_data"
      dataSource={ELASTIC_DS}
      stacked
      utilityBarConfig={{
        title: {
          text: 'Run Complete Data',
        }
      }}
      breakDownBy="mlwh_instrument_model"
      xAxis="mlwh_run_complete"
      type='M'
    />
  );

  const sampleChart = (
    <RemoteBarChart
      id="home-sample-bar-chart"
      objectType="sample"
      dataSource={ELASTIC_DS}
      stacked
      utilityBarConfig={{
        title: {
          text: 'Species Received',
        }
      }}
      breakDownBy="sts_ac_status"
      xAxis="benchling_date_sample_received_at_sanger"
      type='M'
    />
  );

  const speciesSunburst = (
    <RemoteSunburst
      id="home-species-sunburst"
      objectType="species"
      dataSource={ELASTIC_DS}
      utilityBarConfig={{
        title: {
          text: 'Species',
        }
      }}
      sliceBy={["sts_order_group", "sts_family"]}
      legendPosition="left"
    />
  );

  const defaultFilter = {
    and_: {
      "sts_sample_sts_programme_union": { eq: { value: "ToL" } }
    }
  }
  const speciesTable = (
    <RemoteTable
      id="home-species-table"
      defaultSort="sts_scientific_name"
      noConfigModal
      fields={{
        "sts_scientific_name": {
        },
        "sts_taxon_group": {
        },
        "sts_family": {
        },
        "sts_order_group": {
        },
        "tolid_prefix": {
        },
      }}
      {...useZone({
        objectType: 'species',
        dataSource: ELASTIC_DS,
        filter: defaultFilter,
        components: [{ id: 'home-species-table' }]
      })}
    />
  );

  const speciesCount = (
    <RemoteCount
      id="home-species-count"
      utilityBarConfig={{
        title: {
          text: 'Species',
        }
      }}
      {...useZone({
        objectType: 'species',
        dataSource: ELASTIC_DS,
        filter: defaultFilter,
        components: [{
          id: 'home-species-count',
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
      id="home-tolid-count"
      utilityBarConfig={{
        title: {
          text: 'TOLIDs Submitted',
        }
      }}
      {...useZone({
        objectType: 'tolid',
        dataSource: ELASTIC_DS,
        filter: defaultFilter,
        components: [{
          id: 'home-tolid-count',
          filter: {
            and_: {
              'informatics_status_summary': {
                eq: { value: '1 submitted' }
              }
            }
          }
        }]
      })}
    />
  );

  const extractionsCount = (
    <RemoteCount
      id="home-extractions-count"
      objectType='extraction'
      dataSource={ELASTIC_DS}
      utilityBarConfig={{
        title: {
          text: 'Extractions',
        }
      }}
    />
  );

  const runDataCount = (
    <RemoteCount
      id="home-run-data-count"
      objectType='run_data'
      dataSource={ELASTIC_DS}
      utilityBarConfig={{
        title: {
          text: 'Runs',
        }
      }}
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
      <Widgets components={components} />
    </div>
  );
}
export default Home;