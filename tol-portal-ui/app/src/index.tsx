/*
SPDX-FileCopyrightText: 2023 Genome Research Ltd.

SPDX-License-Identifier: MIT
*/

import { createRoot } from "react-dom/client";
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
  ManifestValidation,
} from './pages';
import { CoreLabData, CuratedSpecies } from './pages/curated_pages';
import { NAV_CONFIG } from './config';
import reportWebVitals from './reportWebVitals';
import { SmartApp, TPageElements, TsDataSource, env } from '@tol/tol-ui';
import Logo from './assets/logo.png';
import './scss/styling.scss';

export const ELASTIC_DS = new TsDataSource(env.TOL_DATA);
export const LOCAL_DS = new TsDataSource({
  ...env.TOL_DATA,
  apiDataPath: '/local',
  dataspace: '',
});

export const PAGE_ELEMENTS: TPageElements = {
  // Home
  "home": <Home />,

  // Taxa
  "species": <Species />,
  "species-detail": <SpeciesDetail />,
  "specimen": <Specimens />,
  "tolids": <ToLIDs />,

  // Samples
  "sample-sets": <Samplesets />,
  "manifests": <Manifests />,
  "samples": <Samples />,

  // Pipeline
  "extractions": <Extractions />,
  "requests": <SequencingRequests />,
  "sequencing-runs": <SequencingRuns />,
  "curations": <Curations />,
  "genome-notes": <GenomeNotes />,

  // Additional
  "recollection": <SpeciesRecollection />,
  "sample-selection": <SampleSelection />,
  "tum": <TUM />,
  "tum-steps": <TUMSteps />,
  "ara-review": <ARAReview />,
  "samples-stuck": <SamplesStuck />,
  "project-management": <ProjectManagement />,
  "loaders": <Loaders />,
  "attributes": <Attributes />,
  // Tools
  "manifest-validation": <ManifestValidation />,
  // Public
  "public-species": <CuratedSpecies />,
  "core-lab-data": <CoreLabData />,
};

const root = createRoot(document.getElementById("root")!);
root.render(
  <SmartApp
    id="tol_portal"
    brand={
      <img
        src={Logo}
        alt="ToL Portal Logo"
        style={{ height: 35 }}
      />
    }
    pageElements={PAGE_ELEMENTS}
    configurableBoards
  />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();