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
  auth: ["tol"],
};

const tolids: Page = {
  name: "ToLIDs",
  element: <ToLIDs />,
  auth: ["tol"],
};

const samplesets: Page = {
  name: "Sample Sets",
  element: <Samplesets />,
  auth: ["tol"],
};

const manifests: Page = {
  name: "Manifests",
  element: <Manifests />,
  auth: ["tol"],
};

const samples: Page = {
  name: "Samples",
  element: <Samples />,
  auth: ["tol"],
};

const extractions: Page = {
  name: "Extractions",
  element: <Extractions />,
  auth: ["tol"],
};

const sequencingRequests: Page = {
  name: "Requests",
  element: <SequencingRequests />,
  auth: ["tol"],
};

const sequencingRuns: Page = {
  name: "Runs",
  element: <SequencingRuns />,
  auth: ["tol"],
};

const curations: Page = {
  name: "Curations",
  element: <Curations />,
  auth: ["tol"],
};

const genomeNotes: Page = {
  name: "Genome Notes",
  element: <GenomeNotes />,
  auth: ["tol"],
};

const tum: Page = {
  name: "TUM",
  element: <TUM />,
  auth: ["tol"],
};

const speciesRecollection: Page = {
  name: "Recollection",
  element: <SpeciesRecollection/>,
  auth: ["tol"],
}

const samplesStuck: Page = {
  name: "Samples Stuck",
  element: <SamplesStuck/>,
  auth: ["tol"],
}

const projectManagement: Page = {
  name: "Project Management",
  element: <ProjectManagement/>,
}

const sampleSelection: Page = {
  name: "Sample Selection",
  element: <SampleSelection />,
  auth: ["tol"],
}

const tumSteps: Page = {
  name: "TUM Steps",
  element: <TUMSteps />,
  auth: ["tol"],
}

const araReview: Page = {
  name: "ARA Review",
  element: <ARAReview />,
  auth: ["tol"],
}

const loaders: Page = {
    name: "Loaders",
    element: <Loaders />,
    auth: ["tol"],
}

const attributes: Page = {
    name: "Attributes",
    element: <Attributes />,
  auth: ["tol"],
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
  auth: ["tol"],
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
  auth: ["tol"],
};

const additionalDropdown: Dropdown = {
  name: "Additional",
  pages: [speciesRecollection, sampleSelection, tum, tumSteps, araReview, samplesStuck,
    projectManagement, loaders, attributes],
  auth: ["tol"],
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
  auth: true,
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