/*
 * SPDX-FileCopyrightText: 2025 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import { FileValidation } from "@tol/tol-ui";

const VALIDATION_CONFIG = {
  s3_url: "tol-tree-of-sex-uploads",
  pipeline_id: 1,
  destination: "still_not_sure",
};

function ManifestValidation() {
  return (
    <FileValidation
      objectType=""
      validationConfig={VALIDATION_CONFIG}
      pageTitle="Manifest Validation Portal"
      defaultFileTemplateName="tos_test_upload.xlsx"
    />
  );
}

export default ManifestValidation;
