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
  RemoteStatistics,
  useZone,
  Filter,
  useTranslator
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
  // Species zone — drives the project filter widget and all species components
  const homeSpeciesZone = useZone({
    objectType: 'species',
    dataSource: ELASTIC_DS,
    filter: defaultFilter,
    components: [
      { id: 'home-project-filter' },
      { id: 'home-species-sunburst' },
      { id: 'home-species-table' },
      {
        id: 'home-species-count',
        filter: {
          and_: {
            goat_domain_name: { eq: { value: "Eukaryota" } },
            grit_curation_grit_done_date_min: { exists: {} },
            tolqc_run_data_count: { gt: { value: 0 } }
          }
        }
      },
      {
        id: 'home-species-collected-count',
        filter: {
          and_: {
            goat_domain_name: { eq: { value: "Eukaryota" } },
            sts_sample_sts_programme_union: { eq: { value: "ToL" } },
            sts_sample_sts_col_date_min: { exists: {} }
          }
        }
      }
    ]
  });

  // Run data zone — receives translated project filter from species zone
  const homeRunDataZone = useZone({
    objectType: 'run_data',
    dataSource: ELASTIC_DS,
    components: [
      { id: 'home-run-bar-chart' },
      { id: 'home-run-data-count' },
    ]
  });

  // Sample zone — receives translated project filter from species zone
  const homeSampleZone = useZone({
    objectType: 'sample',
    dataSource: ELASTIC_DS,
    components: [
      { id: 'home-sample-bar-chart' },
    ]
  });

  // Extraction zone — receives translated project filter from species zone
  const homeExtractionZone = useZone({
    objectType: 'extraction',
    dataSource: ELASTIC_DS,
    components: [
      { id: 'home-extractions-count' },
    ]
  });

  // Propagate the project filter selection to each non-species zone
  useTranslator({
    source: homeSpeciesZone,
    target: homeRunDataZone,
    translations: { 'sts_sample_sts_project_union': 'mlwh_tolid.sts_sample_sts_project_union' },
    excludeAfterId: 'home-project-filter',
  });

  useTranslator({
    source: homeSpeciesZone,
    target: homeSampleZone,
    translations: { 'sts_sample_sts_project_union': 'sts_project' },
    excludeAfterId: 'home-project-filter',
  });

  useTranslator({
    source: homeSpeciesZone,
    target: homeExtractionZone,
    translations: { 'sts_sample_sts_project_union': 'benchling_tolid.sts_sample_sts_project_union' },
    excludeAfterId: 'home-project-filter',
  });

  const projectFilter = (
    <Row className="home-filters">
      <Col>
        <Filter
          attribute='sts_sample_sts_project_union'
          rename="All Projects"
          type='multi'
          componentId="home-project-filter"
          {...homeSpeciesZone}
        />
      </Col>
    </Row>
  );

  const runChart = (
    <RemoteBarChart
      id="home-run-bar-chart"
      stacked
      utilityBarConfig={{
        title: {
          text: 'Run Complete Data',
        }
      }}
      breakDownBy="mlwh_instrument_model"
      xAxis="mlwh_run_complete"
      type='M'
      {...homeRunDataZone}
    />
  );

  const sampleChart = (
    <RemoteBarChart
      id="home-sample-bar-chart"
      stacked
      utilityBarConfig={{
        title: {
          text: 'Species Received',
        }
      }}
      breakDownBy="sts_ac_status"
      xAxis="benchling_date_sample_received_at_sanger"
      type='M'
      {...homeSampleZone}
    />
  );

  const speciesSunburst = (
    <RemoteSunburst
      id="home-species-sunburst"
      utilityBarConfig={{
        title: {
          text: 'Species',
        }
      }}
      sliceBy={["sts_order_group", "sts_family"]}
      legendPosition="left"
      {...homeSpeciesZone}
    />
  );

  const speciesTable = (
    <RemoteTable
      id="home-species-table"
      defaultSortByAttribute="sts_scientific_name"
      noConfigModal
      fields={{
        order: {
          active: [
            "sts_scientific_name",
            "sts_taxon_group",
            "sts_family",
            "sts_order_group",
            "tolid_prefix",
          ],
        },
      }}
      {...homeSpeciesZone}
    />
  );

  const SubmittedDescription = (
    <>
      The headline count for the programme:
      <ul>
        <li>Domain is Eukaryota</li>
        <li>Species has a curation marked as "Done"</li>
        <li>Species has been through the ToLQC process</li>
      </ul>
    </>
  )

  const speciesCount = (
    <RemoteStatistics
      id="home-species-count"
      utilityBarConfig={{
        title: {
          text: 'Species submitted',
        },
        description: SubmittedDescription
      }}
      {...homeSpeciesZone}
    />
  );

  const CollectedDescription = (
    <>
      The headline collection count for the programme:
      <ul>
        <li>Domain is Eukaryota</li>
        <li>Species has a sample in the ToL programme</li>
        <li>Species has a sample with a collection date</li>
      </ul>
    </>
  )

  const speciesCollectedCount = (
    <RemoteStatistics
      id="home-species-collected-count"
      utilityBarConfig={{
        title: {
          text: 'Species Collected',
        },
        description: CollectedDescription
      }}
      {...homeSpeciesZone}
    />
  );

  const extractionsCount = (
    <RemoteStatistics
      id="home-extractions-count"
      utilityBarConfig={{
        title: {
          text: 'Extractions',
        }
      }}
      {...homeExtractionZone}
    />
  );

  const runDataCount = (
    <RemoteStatistics
      id="home-run-data-count"
      utilityBarConfig={{
        title: {
          text: 'Runs',
        }
      }}
      {...homeRunDataZone}
    />
  );

  const components = [
    {
      component: intro,
      type: 'full'
    },
    {
      component: projectFilter,
      type: 'full'
    },
    {
      component: speciesCount,
      type: 'sm'
    },
    {
      component: speciesCollectedCount,
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