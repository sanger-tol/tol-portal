/*
SPDX-FileCopyrightText: 2023 Genome Research Ltd.

SPDX-License-Identifier: MIT
*/

import ReactDOM from 'react-dom';
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
  TUMSteps
} from './pages';
import { CuratedSpecies } from './pages/curated_pages';
import reportWebVitals from './reportWebVitals';
import { TolApp, Page, Dropdown } from '@tol/tol-ui';
import Logo from './assets/logo.png';
import './scss/styling.scss';

const species: Page = {
  name: "Species",
  element: <CuratedSpecies />,
  detail: <SpeciesDetail />,
  authElement: <Species />,
};

const specimens: Page = {
  name: "Specimens",
  element: <Specimens />,
  auth: true
};

const tolids: Page = {
  name: "ToLIDs",
  element: <ToLIDs />,
  auth: true
};

const samplesets: Page = {
  name: "Sample Sets",
  element: <Samplesets />,
  auth: true
};

const manifests: Page = {
  name: "Manifests",
  element: <Manifests />,
  auth: true
};

const samples: Page = {
  name: "Samples",
  element: <Samples />,
  auth: true
};

const extractions: Page = {
  name: "Extractions",
  element: <Extractions />,
  auth: true
};

const sequencingRequests: Page = {
  name: "Requests",
  element: <SequencingRequests />,
  auth: true
};

const sequencingRuns: Page = {
  name: "Runs",
  element: <SequencingRuns />,
  auth: true
};

const curations: Page = {
  name: "Curations",
  element: <Curations />,
  auth: true
};

const genomeNotes: Page = {
  name: "Genome Notes",
  element: <GenomeNotes />,
  auth: true
};

const tum: Page = {
  name: "TUM",
  element: <TUM />,
  hidden: true,
  auth: true
};

const speciesRecollection: Page = {
  name: "Recollection",
  element: <SpeciesRecollection/>,
  hidden: true,
  auth: true
}

const samplesStuck: Page = {
  name: "Samples Stuck",
  element: <SamplesStuck/>,
  hidden: true,
  auth: true
}

const projectManagement: Page = {
  name: "Project Management",
  element: <ProjectManagement/>,
  hidden: true
}

const tumSteps: Page = {
  name: "TUM Steps",
  element: <TUMSteps />,
  hidden: true,
  auth: true
}

const otherDropdown: Dropdown = {
  name: "Other",
  pages: [speciesRecollection, tum, tumSteps, samplesStuck, projectManagement],
  hidden: false,
  auth: true
}

ReactDOM.render(
  <TolApp
    boards={{dataUrl: `/api/v1`}}
    brand={
      <img
        src={Logo}
        alt="ToL Portal Logo"
        style={{height: 30}}
      />
    }
    homePage={<Home />}
    pages={[
      species,
      specimens,
      tolids,
      samplesets,
      manifests,
      samples,
      extractions,
      sequencingRequests,
      sequencingRuns,
      curations,
      genomeNotes,
      tum,
      speciesRecollection,
      samplesStuck,
      otherDropdown
    ]}
    login={true}
  />,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
