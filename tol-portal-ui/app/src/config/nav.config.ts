/*
SPDX-FileCopyrightText: 2026 Genome Research Ltd.

SPDX-License-Identifier: MIT
*/

import { TNavConfig, PAGE_ACCESS } from "@tol/tol-ui";


export const NAV_CONFIG: TNavConfig = {
  data: {
<<<<<<< HEAD
<<<<<<< HEAD

    "Home": {
      access: PAGE_ACCESS.PUBLIC,
      path: {
        pageElementReference: "b_Crt4ZZEssGP0",
        route: "/",
      }
    },

=======
=======

>>>>>>> 4cdf1da (spacing)
    "Home": {
      access: PAGE_ACCESS.PUBLIC,
      path: {
        pageElementReference: "home",
        route: "/",
      }
    },
<<<<<<< HEAD
>>>>>>> 447cd38 (nav updates and recollection table)
=======

>>>>>>> 4cdf1da (spacing)
    "Taxa": {
      access: PAGE_ACCESS.ROLE_REQUIRED,
      pages: {
        data: {
          "Species": {
            access: PAGE_ACCESS.ROLE_REQUIRED,
            path: {
<<<<<<< HEAD
              pageElementReference: "b_TZG77Ww4sJea",
=======
              pageElementReference: "species",
>>>>>>> 447cd38 (nav updates and recollection table)
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
<<<<<<< HEAD
              pageElementReference: "b_YLymR9X6JnBL",
=======
              pageElementReference: "specimen",
>>>>>>> 447cd38 (nav updates and recollection table)
            }
          },
          "ToLIDs": {
            access: PAGE_ACCESS.ROLE_REQUIRED,
            path: {
<<<<<<< HEAD
              pageElementReference: "b_nBFQFABaRVss",
=======
              pageElementReference: "tolids",
>>>>>>> 447cd38 (nav updates and recollection table)
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
<<<<<<< HEAD
<<<<<<< HEAD

=======
>>>>>>> 447cd38 (nav updates and recollection table)
=======

>>>>>>> 4cdf1da (spacing)
    "Samples": {
      access: PAGE_ACCESS.ROLE_REQUIRED,
      pages: {
        data: {
          "Sample Sets": {
            access: PAGE_ACCESS.ROLE_REQUIRED,
            path: {
<<<<<<< HEAD
              pageElementReference: "b_GdykdLnDcZLF",
=======
              pageElementReference: "sample-sets",
>>>>>>> 447cd38 (nav updates and recollection table)
            }
          },
          "Manifests": {
            access: PAGE_ACCESS.ROLE_REQUIRED,
            path: {
<<<<<<< HEAD
              pageElementReference: "b_X8SD2Q9R1SOZ",
=======
              pageElementReference: "manifests",
>>>>>>> 447cd38 (nav updates and recollection table)
            }
          },
          "Samples": {
            access: PAGE_ACCESS.ROLE_REQUIRED,
            path: {
<<<<<<< HEAD
              pageElementReference: "b_pF6935aPXMpE",
=======
              pageElementReference: "samples",
>>>>>>> 447cd38 (nav updates and recollection table)
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
<<<<<<< HEAD
<<<<<<< HEAD

=======
>>>>>>> 447cd38 (nav updates and recollection table)
=======

>>>>>>> 4cdf1da (spacing)
    "Pipeline": {
      access: PAGE_ACCESS.ROLE_REQUIRED,
      pages: {
        data: {
          "Extractions": {
            access: PAGE_ACCESS.ROLE_REQUIRED,
            path: {
<<<<<<< HEAD
              pageElementReference: "b_8IQkJw3bnOz8",
=======
              pageElementReference: "extractions",
>>>>>>> 447cd38 (nav updates and recollection table)
            }
          },
          "Requests": {
            access: PAGE_ACCESS.ROLE_REQUIRED,
            path: {
<<<<<<< HEAD
              pageElementReference: "b_NZqOBUMH09zm",
=======
              pageElementReference: "requests",
>>>>>>> 447cd38 (nav updates and recollection table)
            }
          },
          "Runs": {
            access: PAGE_ACCESS.ROLE_REQUIRED,
            path: {
<<<<<<< HEAD
              pageElementReference: "b_P23qqk6w1L1a",
=======
              pageElementReference: "sequencing-runs",
>>>>>>> 447cd38 (nav updates and recollection table)
            }
          },
          "Curations": {
            access: PAGE_ACCESS.ROLE_REQUIRED,
            path: {
<<<<<<< HEAD
              pageElementReference: "b_C3ytfvrNtdQS",
=======
              pageElementReference: "curations",
>>>>>>> 447cd38 (nav updates and recollection table)
            }
          },
          "Genome Notes": {
            access: PAGE_ACCESS.ROLE_REQUIRED,
            path: {
<<<<<<< HEAD
              pageElementReference: "b_7lZd0mVA8EQC",
=======
              pageElementReference: "genome-notes",
>>>>>>> 447cd38 (nav updates and recollection table)
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
<<<<<<< HEAD
<<<<<<< HEAD

=======
>>>>>>> 447cd38 (nav updates and recollection table)
=======

>>>>>>> 4cdf1da (spacing)
    "Additional": {
      access: PAGE_ACCESS.ROLE_REQUIRED,
      pages: {
        data: {
          "Recollection": {
            access: PAGE_ACCESS.ROLE_REQUIRED,
            path: {
<<<<<<< HEAD
              pageElementReference: "b_tZkO2SpA5miW",
=======
              pageElementReference: "recollection",
>>>>>>> 447cd38 (nav updates and recollection table)
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
<<<<<<< HEAD
              pageElementReference: "b_8g6ZHtngq1fv",
=======
              pageElementReference: "samples-stuck",
>>>>>>> 447cd38 (nav updates and recollection table)
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
<<<<<<< HEAD
              pageElementReference: "b_wPbyR6z3mwBs",
=======
              pageElementReference: "loaders",
>>>>>>> 447cd38 (nav updates and recollection table)
            },
          },
          "Attributes": {
            access: PAGE_ACCESS.ROLE_REQUIRED,
            path: {
<<<<<<< HEAD
              pageElementReference: "b_YbMdsOMnwRRc",
=======
              pageElementReference: "attributes",
>>>>>>> 447cd38 (nav updates and recollection table)
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
<<<<<<< HEAD
<<<<<<< HEAD

=======
>>>>>>> 447cd38 (nav updates and recollection table)
=======

>>>>>>> 4cdf1da (spacing)
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
<<<<<<< HEAD
<<<<<<< HEAD

=======
>>>>>>> 447cd38 (nav updates and recollection table)
=======

>>>>>>> 4cdf1da (spacing)
    "Public": {
      access: PAGE_ACCESS.PUBLIC,
      pages: {
        data: {
          "Public Species": {
            access: PAGE_ACCESS.PUBLIC,
            path: {
<<<<<<< HEAD
              pageElementReference: "b_abxAtD6Adf0c",
=======
              pageElementReference: "public-species",
>>>>>>> 447cd38 (nav updates and recollection table)
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
<<<<<<< HEAD

// Pages have been converted to board components for the following:
// Home, Species, Specimen, ToLIDs, Sample Sets, Manifests, Samples,
// Extractions, Requests, Runs, Curations, Genome Notes, Recollection,
// Samples Stuck, Loaders and Attributes.
=======
>>>>>>> 447cd38 (nav updates and recollection table)
