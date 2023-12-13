/*
SPDX-FileCopyrightText: 2023 Genome Research Ltd.

SPDX-License-Identifier: MIT
*/

import React from 'react';
import ReactDOM from 'react-dom';
import { Home,
  Species,
  Specimens,
  ToLIDs,
  Samples,
  Extractions,
  SequencingRequests,
  SequencingRuns } from './pages';
import reportWebVitals from './reportWebVitals';
import { TolApp, Page } from '@tol/tol-ui';
import Logo from './assets/logo.png';
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

const extractions: Page = {
  name: "Extractions",
  uiElement: <Extractions />
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
      samples,
      extractions,
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
