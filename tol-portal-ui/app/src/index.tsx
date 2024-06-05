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
  TUM,
  SpeciesRecollection,
  SamplesStuck
} from './pages';
import reportWebVitals from './reportWebVitals';
import { TolApp, Page, Dropdown } from '@tol/tol-ui';
import Logo from './assets/logo.png';
import './scss/styling.scss';

const species: Page = {
  name: "Species",
  element: <Species />,
  detail: <SpeciesDetail />
};

const specimens: Page = {
  name: "Specimens",
  element: <Specimens />
};

const tolids: Page = {
  name: "ToLIDs",
  element: <ToLIDs />
};

const samplesets: Page = {
  name: "Sample Sets",
  element: <Samplesets />
};

const manifests: Page = {
  name: "Manifests",
  element: <Manifests />
};

const samples: Page = {
  name: "Samples",
  element: <Samples />
};

const extractions: Page = {
  name: "Extractions",
  element: <Extractions />
};

const sequencingRequests: Page = {
  name: "Requests",
  element: <SequencingRequests />
};

const sequencingRuns: Page = {
  name: "Runs",
  element: <SequencingRuns />
};

const tum: Page = {
  name: "TUM",
  element: <TUM />,
  hidden: true
};

const speciesRecollection: Page = {
  name: "Recollection",
  element: <SpeciesRecollection/>,
  hidden: true
}

const samplesStuck: Page = {
  name: "Samples Stuck",
  element: <SamplesStuck/>,
  hidden: true
}

const otherDropdown: Dropdown = {
  name: "Other",
  pages: [speciesRecollection, tum, samplesStuck],
  hidden: false
}

ReactDOM.render(
  <TolApp
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
