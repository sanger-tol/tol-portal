/*
 * SPDX-FileCopyrightText: 2025 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import {
  FileValidationHome,
  FILE_VALIDATION_STATUS,
  createValidationModule,
  setValidationStatusAction,
} from "@tol/tol-ui";

// Create the validation config object that will be passed as a prop to the component
const VALIDATION_CONFIG = {
  s3_bucket: "tol-sample-manifests",
  pipeline_id: 1,
  destination: "portal",
};

// Create app specific status constants
export const PORTAL_FILE_VALIDATION_STATUS = {
  SENT_TO_STS: "sent_to_sts",
} as const;

// Create the app specific status types
export type TPortalFileValidationStatus =
  (typeof PORTAL_FILE_VALIDATION_STATUS)[keyof typeof PORTAL_FILE_VALIDATION_STATUS];

// Create app specific policies and actions using new statuses and types
// And override any attributes to be more specific to this particular app
export const portalValidationModule =
  createValidationModule<TPortalFileValidationStatus>({
    // New Policies
    policies: {
      [PORTAL_FILE_VALIDATION_STATUS.SENT_TO_STS]: {
        status: PORTAL_FILE_VALIDATION_STATUS.SENT_TO_STS,
        rename: "Sent to STS",
        summary: "This manifest has now been sent to STS.",
        textColor: "var(--tol-royal)",
        isFailureStatus: false,
        allowedActions: ["viewReport", "downloadReport", "downloadFile"],
      },
      [FILE_VALIDATION_STATUS.TIMEOUT]: {
        summary:
          "The validation status has timed out, if this persists, please contact: 'treeoflifesamples@sanger.ac.uk' for further assistance.",
      },
      [FILE_VALIDATION_STATUS.SYSTEM_ERROR]: {
        summary:
          "The validation status has timed out, if this persists, please contact: 'treeoflifesamples@sanger.ac.uk' for further assistance.",
      },
    },
    // New Actions
    actions: {
      sentToSts: {
        ...setValidationStatusAction(
          { id: "sentToSts", label: "Item(s) Sent to STS" },
          "sent_to_sts",
        ),
        isAvailable: ({ user }) => user?.roles.includes("admin") ?? false,
      },
    },
    // Pass existing policies any new actions that can be used with that status
    extendAllowedActions: {
      [FILE_VALIDATION_STATUS.MARKED_AS_READY]: ["sentToSts"],
    },
  });

function ManifestValidation() {
  // Introductory SOP paragraph widget
  const SOPIntro = (
    <div>
      <p>
        Please review the{" "}
        <a
          href="https://tinyurl.com/treeoflifesamplesubmission"
          target="_blank"
          rel="noopener noreferrer"
        >
          Standard Operating Procedure (SOP)
        </a>{" "}
        for manifest validation before submitting your file. This SOP outlines
        the required steps and best practices for successful validation.
      </p>
    </div>
  );

  return (
    <FileValidationHome
      validationConfig={VALIDATION_CONFIG}
      intro={SOPIntro}
      additionalTableConfig={{
        cellRenderers: {},
        fields: {
          rejection_reason: { rename: "Reason for Rejection", width: 200 },
        },
        order: ["rejection_reason"],
      }}
    />
  );
}

export default ManifestValidation;
