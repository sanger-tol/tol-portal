/*
SPDX-FileCopyrightText: 2023 Genome Research Ltd.

SPDX-License-Identifier: MIT
*/

import { createRoot } from 'react-dom/client';
import { 
  Home,
  Species,
  SpeciesDetail,
  Specimens,
  ToLIDs,
  Samples,
  Samplesets,
  Manifests,
  Extractions,
  SequencingRequests,
  SequencingRuns,
  Curations,
  GenomeNotes,
  TUM,
  SpeciesRecollection,
  SamplesStuck,
  ProjectManagement,
  TUMSteps,
  ARAReview,
  SampleSelection,
  Loaders,
  Attributes,
  ManifestValidation
} from './pages';
import { CoreLabData, CuratedSpecies } from './pages/curated_pages';
import reportWebVitals from './reportWebVitals';
import { TolApp, Page, Dropdown, TsDataSource, env } from '@tol/tol-ui';
import Logo from './assets/logo.png';
import './scss/styling.scss';


export const ELASTIC_DS = new TsDataSource(env.TOL_DATA);
export const LOCAL_DS = new TsDataSource({
  ...env.TOL_DATA,
  apiDataPath: '/local',
  dataspace: '',
});

const species: Page = {
  name: "Species",
  element: <CuratedSpecies />,
  detail: <SpeciesDetail />,
  authElement: <Species />,
  detailAuth: true,
};

const specimens: Page = {
  name: "Specimens",
  element: <Specimens />,
  auth: true,
};

const tolids: Page = {
  name: "ToLIDs",
  element: <ToLIDs />,
  auth: true,
};

const samplesets: Page = {
  name: "Sample Sets",
  element: <Samplesets />,
  auth: true,
};

const manifests: Page = {
  name: "Manifests",
  element: <Manifests />,
  auth: true,
};

const samples: Page = {
  name: "Samples",
  element: <Samples />,
  auth: true,
};

const extractions: Page = {
  name: "Extractions",
  element: <Extractions />,
  auth: true,
};

const sequencingRequests: Page = {
  name: "Requests",
  element: <SequencingRequests />,
  auth: true,
};

const sequencingRuns: Page = {
  name: "Runs",
  element: <SequencingRuns />,
  auth: true,
};

const curations: Page = {
  name: "Curations",
  element: <Curations />,
  auth: true,
};

const genomeNotes: Page = {
  name: "Genome Notes",
  element: <GenomeNotes />,
  auth: true,
};

const tum: Page = {
  name: "TUM",
  element: <TUM />,
  auth: true,
};

const speciesRecollection: Page = {
  name: "Recollection",
  element: <SpeciesRecollection/>,
  auth: true,
}

const samplesStuck: Page = {
  name: "Samples Stuck",
  element: <SamplesStuck/>,
  auth: true,
}

const projectManagement: Page = {
  name: "Project Management",
  element: <ProjectManagement/>,
}

const sampleSelection: Page = {
  name: "Sample Selection",
  element: <SampleSelection />,
  auth: true,
}

const tumSteps: Page = {
  name: "TUM Steps",
  element: <TUMSteps />,
  auth: true,
}

const araReview: Page = {
  name: "ARA Review",
  element: <ARAReview />,
  auth: true,
}

const loaders: Page = {
    name: "Loaders",
    element: <Loaders />,
  auth: true,
}

const attributes: Page = {
    name: "Attributes",
    element: <Attributes />,
  auth: true,
}
const coreLabData: Page = {
  name: "Core Lab Data",
  element: <CoreLabData />,
}

const manifestValidation: Page = {
  name: "Manifest Validation",
  element: <ManifestValidation />,
}

const taxaDropdown: Dropdown = {
  name: "Taxa",
  pages: [
    species,
    specimens,
    tolids,
  ]
};

const samplesDropdown: Dropdown = {
  name: "Samples",
  pages: [
    samplesets,
    manifests,
    samples,
  ],
  auth: true,
};

const pipelineDropdown: Dropdown = {
  name: "Pipeline",
  pages: [
    extractions,
    sequencingRequests,
    sequencingRuns,
    curations,
    genomeNotes,
  ],
  auth: true,
};

const additionalDropdown: Dropdown = {
  name: "Additional",
  pages: [speciesRecollection, sampleSelection, tum, tumSteps, araReview, samplesStuck,
    projectManagement, loaders, attributes],
  auth: true,
}

const publicDropdown: Dropdown = {
  name: "Public",
  pages: [
    coreLabData,
  ],
}

const toolsDropdown: Dropdown = {
  name: "Tools",
  pages: [
    manifestValidation,
  ],
}

const root = createRoot(document.getElementById('root')!);
root.render(
  <TolApp
    boards={{dataSource: ELASTIC_DS}}
    brand={
      <img
        src={Logo}
        alt="ToL Portal Logo"
        style={{height: 30}}
      />
    }
    homePage={<Home />}
    pages={[
      taxaDropdown,
      samplesDropdown,
      pipelineDropdown,
      additionalDropdown,
      publicDropdown,
      toolsDropdown,
    ]}
    login={true}
  />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();