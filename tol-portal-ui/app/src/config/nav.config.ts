/*
SPDX-FileCopyrightText: 2026 Genome Research Ltd.

SPDX-License-Identifier: MIT
*/

import { TNavConfig, PAGE_ACCESS } from "@tol/tol-ui";


export const NAV_CONFIG: TNavConfig = {
  data: {

    "Home": {
      access: PAGE_ACCESS.PUBLIC,
      path: {
        pageElementReference: "b_Crt4ZZEssGP0",
        route: "/",
      }
    },

    "Taxa": {
      access: PAGE_ACCESS.ROLE_REQUIRED,
      pages: {
        data: {
          "Species": {
            access: PAGE_ACCESS.ROLE_REQUIRED,
            path: {
              pageElementReference: "b_TZG77Ww4sJea",
            }
          },
          "Species Detail": {
            access: PAGE_ACCESS.ROLE_REQUIRED,
            path: {
              pageElementReference: "species-detail",
              route: "/species/:id",
            }
          },
          "Specimen": {
            access: PAGE_ACCESS.ROLE_REQUIRED,
            path: {
              pageElementReference: "b_YLymR9X6JnBL",
            }
          },
          "ToLIDs": {
            access: PAGE_ACCESS.ROLE_REQUIRED,
            path: {
              pageElementReference: "b_nBFQFABaRVss",
            }
          }
        },
        order: [
          "Species",
          "Specimen",
          "ToLIDs"
        ],
      }
    },

    "Samples": {
      access: PAGE_ACCESS.ROLE_REQUIRED,
      pages: {
        data: {
          "Sample Sets": {
            access: PAGE_ACCESS.ROLE_REQUIRED,
            path: {
              pageElementReference: "b_GdykdLnDcZLF",
            }
          },
          "Manifests": {
            access: PAGE_ACCESS.ROLE_REQUIRED,
            path: {
              pageElementReference: "b_X8SD2Q9R1SOZ",
            }
          },
          "Samples": {
            access: PAGE_ACCESS.ROLE_REQUIRED,
            path: {
              pageElementReference: "b_pF6935aPXMpE",
            }
          }
        },
        order: [
          "Sample Sets",
          "Manifests",
          "Samples"
        ],
      }
    },

    "Pipeline": {
      access: PAGE_ACCESS.ROLE_REQUIRED,
      pages: {
        data: {
          "Extractions": {
            access: PAGE_ACCESS.ROLE_REQUIRED,
            path: {
              pageElementReference: "b_8IQkJw3bnOz8",
            }
          },
          "Requests": {
            access: PAGE_ACCESS.ROLE_REQUIRED,
            path: {
              pageElementReference: "b_NZqOBUMH09zm",
            }
          },
          "Runs": {
            access: PAGE_ACCESS.ROLE_REQUIRED,
            path: {
              pageElementReference: "b_P23qqk6w1L1a",
            }
          },
          "Curations": {
            access: PAGE_ACCESS.ROLE_REQUIRED,
            path: {
              pageElementReference: "b_C3ytfvrNtdQS",
            }
          },
          "Genome Notes": {
            access: PAGE_ACCESS.ROLE_REQUIRED,
            path: {
              pageElementReference: "b_7lZd0mVA8EQC",
            }
          }
        },
        order: [
          "Extractions",
          "Requests",
          "Runs",
          "Curations",
          "Genome Notes"
        ],
      }
    },

    "Additional": {
      access: PAGE_ACCESS.ROLE_REQUIRED,
      pages: {
        data: {
          "Recollection": {
            access: PAGE_ACCESS.ROLE_REQUIRED,
            path: {
              pageElementReference: "b_tZkO2SpA5miW",
            },
          },
          "Sample Selection": {
            access: PAGE_ACCESS.ROLE_REQUIRED,
            path: {
              pageElementReference: "sample-selection",
            },
          },
          "TUM": {
            access: PAGE_ACCESS.ROLE_REQUIRED,
            path: {
              pageElementReference: "tum",
            },
          },
          "TUM Steps": {
            access: PAGE_ACCESS.ROLE_REQUIRED,
            path: {
              pageElementReference: "tum-steps",
            },
          },
          "ARA Review": {
            access: PAGE_ACCESS.ROLE_REQUIRED,
            path: {
              pageElementReference: "ara-review",
            },
          },
          "Samples Stuck": {
            access: PAGE_ACCESS.ROLE_REQUIRED,
            path: {
              pageElementReference: "b_8g6ZHtngq1fv",
            },
          },
          "Project Management": {
            access: PAGE_ACCESS.ROLE_REQUIRED,
            path: {
              pageElementReference: "project-management",
            },
          },
          "Loaders": {
            access: PAGE_ACCESS.ROLE_REQUIRED,
            path: {
              pageElementReference: "b_wPbyR6z3mwBs",
            },
          },
          "Attributes": {
            access: PAGE_ACCESS.ROLE_REQUIRED,
            path: {
              pageElementReference: "b_YbMdsOMnwRRc",
            },
          },
        },
        order: [
          "Recollection",
          "Sample Selection",
          "TUM",
          "TUM Steps",
          "ARA Review",
          "Samples Stuck",
          "Project Management",
          "Loaders",
          "Attributes",
        ],
      }
    },

    "Tools": {
      access: PAGE_ACCESS.AUTHENTICATED,
      pages: {
        data: {
          "Manifest Validation": {
            access: PAGE_ACCESS.AUTHENTICATED,
            path: {
              pageElementReference: "manifest-validation",
            }
          }
        },
        order: [
          "Manifest Validation",
        ]
      }
    },

    "Public": {
      access: PAGE_ACCESS.PUBLIC,
      pages: {
        data: {
          "Public Species": {
            access: PAGE_ACCESS.PUBLIC,
            path: {
              pageElementReference: "b_abxAtD6Adf0c",
              route: "/public/species",
            }
          },
          "Core Lab Data": {
            access: PAGE_ACCESS.PUBLIC,
            path: {
              pageElementReference: "core-lab-data",
              route: "/public/core-lab-data",
            }
          }
        },
        order: [
          "Public Species",
          "Core Lab Data",
        ]
      }
    }
  },
  order: [
    "Taxa",
    "Samples",
    "Pipeline",
    "Additional",
    "Tools",
    "Public",
  ],
};

// Pages have been converted to board components for the following:
// Home, Species, Specimen, ToLIDs, Sample Sets, Manifests, Samples,
// Extractions, Requests, Runs, Curations, Genome Notes, Recollection,
// Samples Stuck, Loaders and Attributes.