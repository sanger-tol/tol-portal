/*
SPDX-FileCopyrightText: 2023 Genome Research Ltd.

SPDX-License-Identifier: MIT
*/

import { createRoot } from "react-dom/client";
import {
  Home,
  SpeciesDetail,
  PublicSpeciesDetail,
  SpeciesRecollection,
  SamplesStuck,
  ProjectManagement,
  TUMSteps,
  ARAReview,
  SampleSelection,
  ManifestValidation,
} from "./pages";
import { portalValidationModule } from "./pages/ManifestValidation";
import { CuratedSpecies } from "./pages/curated_pages";
import reportWebVitals from "./reportWebVitals";
import {
  SmartApp,
  TPageElements,
  TsDataSource,
  env,
  PAGE_ACCESS,
  ValidationModuleProvider,
  URL_PATHS,
  API_PATHS,
} from "@tol/tol-ui";
import Logo from "./assets/logo.png";
import "./scss/styling.scss";

export const ELASTIC_DS = new TsDataSource(env.TOL_DATA);
export const LOCAL_DS = new TsDataSource({
  ...env.TOL_DATA,
  apiDataPath: API_PATHS.API_DATA_PATH,
  dataspace: "",
});

export const PAGE_ELEMENTS: TPageElements = {
  // Home
  home: <Home />,

  // Taxa
  "species-detail": <SpeciesDetail />,

  // Additional
  recollection: <SpeciesRecollection />,
  "sample-selection": <SampleSelection />,
  "tum-steps": <TUMSteps />,
  "ara-review": <ARAReview />,
  "samples-stuck": <SamplesStuck />,
  "project-management": <ProjectManagement />,

  // Tools
  "manifest-validation": <ManifestValidation />,

  // Public
  "public-species": <CuratedSpecies />,
  "public-species-detail": <PublicSpeciesDetail />,
};

const LOCAL_NAVIGATION = {
  data: {
    "Public Species Detail": {
      access: PAGE_ACCESS.PUBLIC,
      path: {
        pageElementReference: "public-species-detail",
        route: "/public/species/:id",
      },
    },
  },
  order: [],
};

const root = createRoot(document.getElementById("root")!);
root.render(
  // Use a provider for validation statuses and policies.
  // It needs to be here, because /file-validation/results/<id>
  // is a separate route inside of <SmartApp />
  <ValidationModuleProvider module={portalValidationModule}>
    <SmartApp
      id="tol_portal"
      brand={<img src={Logo} alt="ToL Portal Logo" style={{ height: 35 }} />}
      pageElements={PAGE_ELEMENTS}
      navigation={LOCAL_NAVIGATION}
      configurableBoards
      register
      customCallbackUrl={URL_PATHS.PROFILE}
    />
  </ValidationModuleProvider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
