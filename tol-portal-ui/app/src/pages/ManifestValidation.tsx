/*
 * SPDX-FileCopyrightText: 2025 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import { FileValidation } from "@tol/tol-ui";

const VALIDATION_CONFIG = {
  s3_bucket: "tol-sample-manifests",
  pipeline_id: 1,
  destination: "portal",
};

function ManifestValidation() {
  return (
    <FileValidation
      validationConfig={VALIDATION_CONFIG}
      pageTitle="Manifest Validation Portal"
    />
  );
}

export default ManifestValidation;
