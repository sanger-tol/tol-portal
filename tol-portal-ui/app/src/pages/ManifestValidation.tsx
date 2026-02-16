/*
 * SPDX-FileCopyrightText: 2025 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import { FileValidationHome } from "@tol/tol-ui";

// Create the validation config object that will be passed as a prop to the component
const VALIDATION_CONFIG = {
  s3_bucket: "lw23-scratch", // TODO: change to correct bucket depending on pipeline_id
  pipeline_id: 1, // TODO: Allow users to select pipeline to run
  destination: "portal",
  project: "portal",
};

function ManifestValidation() {
  // Introductory SOP paragraph widget
  const SOPIntro = (
    <div>
      <p>
        Please review the{" "}
        <a
          href="https://example.com/sop"
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

  // TODO: Decide what to do with the modals...
  // TODO: Capture the upload ID when a manifest is selected
  // TODO: Double todo: make modals handle multiple upload IDs in case of multiple selection, or prevent multiple selection when modals are required (which is boring).

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
