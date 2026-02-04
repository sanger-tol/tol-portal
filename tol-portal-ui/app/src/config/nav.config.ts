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
        pageElementReference: "home",
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
              pageElementReference: "species",
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
              pageElementReference: "specimen",
            }
          },
          "ToLIDs": {
            access: PAGE_ACCESS.ROLE_REQUIRED,
            path: {
              pageElementReference: "tolids",
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
              pageElementReference: "sample-sets",
            }
          },
          "Manifests": {
            access: PAGE_ACCESS.ROLE_REQUIRED,
            path: {
              pageElementReference: "manifests",
            }
          },
          "Samples": {
            access: PAGE_ACCESS.ROLE_REQUIRED,
            path: {
              pageElementReference: "samples",
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
              pageElementReference: "extractions",
            }
          },
          "Requests": {
            access: PAGE_ACCESS.ROLE_REQUIRED,
            path: {
              pageElementReference: "requests",
            }
          },
          "Runs": {
            access: PAGE_ACCESS.ROLE_REQUIRED,
            path: {
              pageElementReference: "sequencing-runs",
            }
          },
          "Curations": {
            access: PAGE_ACCESS.ROLE_REQUIRED,
            path: {
              pageElementReference: "curations",
            }
          },
          "Genome Notes": {
            access: PAGE_ACCESS.ROLE_REQUIRED,
            path: {
              pageElementReference: "genome-notes",
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
              pageElementReference: "recollection",
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
              pageElementReference: "samples-stuck",
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
              pageElementReference: "loaders",
            },
          },
          "Attributes": {
            access: PAGE_ACCESS.ROLE_REQUIRED,
            path: {
              pageElementReference: "attributes",
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
              pageElementReference: "public-species",
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
