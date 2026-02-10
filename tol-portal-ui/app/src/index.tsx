/*
SPDX-FileCopyrightText: 2023 Genome Research Ltd.

SPDX-License-Identifier: MIT
*/

import { createRoot } from "react-dom/client";
import {
  SpeciesDetail,
  TUM,
  ProjectManagement,
  TUMSteps,
  ARAReview,
  SampleSelection,
  ManifestValidation,
} from "./pages";
import { CoreLabData, CuratedSpecies } from "./pages/curated_pages";
import { NAV_CONFIG } from "./config";
import reportWebVitals from "./reportWebVitals";
import { SmartApp, TPageElements, TsDataSource, env } from "@tol/tol-ui";
import Logo from "./assets/logo.png";
import "./scss/styling.scss";

export const ELASTIC_DS = new TsDataSource(env.TOL_DATA);
export const LOCAL_DS = new TsDataSource({
  ...env.TOL_DATA,
  apiDataPath: "/local",
  dataspace: "",
});

export const PAGE_ELEMENTS: TPageElements = {
  // Taxa
  "species-detail": <SpeciesDetail />,
  // Additional
  "sample-selection": <SampleSelection />,
  tum: <TUM />,
  "tum-steps": <TUMSteps />,
  "ara-review": <ARAReview />,
  "project-management": <ProjectManagement />,
  // Tools
  "manifest-validation": <ManifestValidation />,
  // Public
  "public-species": <CuratedSpecies />,
  "core-lab-data": <CoreLabData />,
};

const root = createRoot(document.getElementById("root")!);
root.render(
  <SmartApp
    boards
    brand={<img src={Logo} alt="ToL Portal Logo" style={{ height: 30 }} />}
    navigation={NAV_CONFIG}
    pageElements={PAGE_ELEMENTS}
  />,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
