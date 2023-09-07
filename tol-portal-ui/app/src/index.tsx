/*
SPDX-FileCopyrightText: 2023 Genome Research Ltd.

SPDX-License-Identifier: MIT
*/

import ReactDOM from 'react-dom';
import { Home,
         Species,
         Specimens,
         ToLIDs,
         Samples,
         SequencingRequests,
         SequencingRuns } from './pages';
import reportWebVitals from './reportWebVitals';
import { TolApp, Page } from '@tol/tol-ui'
import './scss/styling.scss';

const species: Page = {
  name: "Species",
  uiElement: <Species />
};

const specimens: Page = {
  name: "Specimens",
  uiElement: <Specimens />
};

const tolids: Page = {
  name: "ToLIDs",
  uiElement: <ToLIDs />
};

const samples: Page = {
  name: "Samples",
  uiElement: <Samples />
};

const sequencingRequests: Page = {
  name: "Requests",
  uiElement: <SequencingRequests />
};

const sequencingRuns: Page = {
  name: "Runs",
  uiElement: <SequencingRuns />
};

ReactDOM.render(
  <TolApp
    brand='ToL Portal'
    homePage={<Home />}
    pages={[
      species,
      specimens,
      tolids,
      samples,
      sequencingRequests,
      sequencingRuns
    ]}
    login={false}
  />,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
