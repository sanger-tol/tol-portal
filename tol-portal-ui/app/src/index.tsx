/*
SPDX-FileCopyrightText: 2023 Genome Research Ltd.

SPDX-License-Identifier: MIT
*/

import ReactDOM from 'react-dom';
import { Home, Samples, Species, SequencingRequests, SequencingRuns } from './pages';
import reportWebVitals from './reportWebVitals';
import { TolApp, Page } from '@tol/tol-ui'
import './scss/styling.scss';

const species: Page = {
  name: "Species",
  authRequired: false,
  adminOnly: false,
  uiElement: <Species />
};

const samples: Page = {
  name: "Samples",
  authRequired: false,
  adminOnly: false,
  uiElement: <Samples />
};

const sequencingRequests: Page = {
  name: "Sequencing",
  authRequired: false,
  adminOnly: false,
  uiElement: <SequencingRequests />
};

const sequencingRuns: Page = {
  name: "Runs",
  authRequired: false,
  adminOnly: false,
  uiElement: <SequencingRuns />
};

ReactDOM.render(
  <TolApp
    brand='ToL Portal'
    homePage={<Home />}
    pages={[species, samples, sequencingRequests, sequencingRuns]}
    login={false}
  />,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
