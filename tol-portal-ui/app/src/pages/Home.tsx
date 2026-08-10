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
    "sample_programme_union": { eq: { value: "ToL" } }
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
    components: [
      { id: 'home-project-filter' },
      {
        id: 'home-species-count',
        filterPassThrough: true,
        filter: {
          and_: {
            domain_name: { eq: { value: "Eukaryota" } },
            curation_done_date_min: { exists: {} }
          }
        }
      },
      {
        id: 'home-species-collected-count',
        filterPassThrough: true,
        filter: {
          and_: {
            domain_name: { eq: { value: "Eukaryota" } },
            sampleprogramme_union: { eq: { value: "ToL" } },
            sample_col_date_min: { exists: {} }
          }
        }
      },
      { id: 'home-species-sunburst', 
        filterPassThrough: true,
        filter: {
          and_: {
            sample_programme_union: { eq: { value: "ToL" } },
          }
        }
      },
      { id: 'home-species-table', 
        filterPassThrough: true,
        filter: {
          and_: {
            sample_programme_union: { eq: { value: "ToL" } },
          }
        }
      },
    ]
  });

  // Run data zone — receives translated project filter from species zone
  const homeRunDataZone = useZone({
    objectType: 'run_data',
    dataSource: ELASTIC_DS,
    components: [
      { id: 'home-run-bar-chart', filterPassThrough: true },
      { id: 'home-run-data-count', filterPassThrough: true },
    ]
  });

  // Sample zone — receives translated project filter from species zone
  const homeSampleZone = useZone({
    objectType: 'sample',
    dataSource: ELASTIC_DS,
    components: [
      { id: 'home-sample-bar-chart', filterPassThrough: true },
    ]
  });

  // Extraction zone — receives translated project filter from species zone
  const homeExtractionZone = useZone({
    objectType: 'extraction',
    dataSource: ELASTIC_DS,
    components: [
      { id: 'home-extractions-count', filterPassThrough: true },
    ]
  });

  // Propagate the project filter selection to each non-species zone
  useTranslator({
    source: homeSpeciesZone,
    target: homeRunDataZone,
    translations: { 'sample_project_union': 'mlwh_tolid.sts_sample_sts_project_union' },
  });

  useTranslator({
    source: homeSpeciesZone,
    target: homeSampleZone,
    translations: { 'sample_project_union': 'sts_project' },
  });

  useTranslator({
    source: homeSpeciesZone,
    target: homeExtractionZone,
    translations: { 'sample_project_union': 'benchling_tolid.sts_sample_sts_project_union' },
  });

  const projectFilter = (
    <Row className="home-filters">
      <Col>
        <Filter
          attribute='sample_project_union'
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
      breakDownBy="instrument_model"
      xAxis="run_complete"
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
      breakDownBy="ac_status"
      xAxis="date_sample_received_at_sanger"
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
      sliceBy={["order_group", "family"]}
      legendPosition="left"
      {...homeSpeciesZone}
    />
  );

  const speciesTable = (
    <RemoteTable
      id="home-species-table"
      defaultSortByAttribute="scientific_name"
      noConfigModal
      fields={{
        order: {
          active: [
            "scientific_name",
            "taxon_group",
            "family",
            "order_group",
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