/*
 * SPDX-FileCopyrightText: 2025 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import { useHistory } from "react-router-dom";
import {
  FileValidation,
  Tabs,
  RemoteTable,
  Widgets,
  useZone,
  TsDataSource,
  downloadFileFromS3,
  Button,
  truncateString,
  splitS3FilenameString,
  normaliseCaps,
} from "@tol/tol-ui";

const VALIDATION_CONFIG = {
  s3_bucket: "lw23-scratch", // TODO: change to correct bucket depending on pipeline_id
  pipeline_id: 1, // TODO: Allow users to select pipeline to run
  destination: "portal",
  project: "portal",
};

function ManifestValidation() {
  const history = useHistory();

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

  const uploads = useZone({
    objectType: "upload",
    dataSource: new TsDataSource({
      apiPath: "/api/v1/local",
    }),
    components: [
      {
        id: "uploads-table",
      },
    ],
  });

  const ManifestDownloadButton = ({ downloadName }) => {
    return (
      <Button
        icon={"download"}
        text={truncateString(splitS3FilenameString(downloadName), 25)}
        onClick={() =>
          downloadFileFromS3(
            new TsDataSource({
              apiPath: "/api/v1",
            }),
            VALIDATION_CONFIG.s3_bucket,
            downloadName,
          )
        }
      />
    );
  };

  const ValidationStatus = ({ validationStatus }) => {
    return <p>{`Validation ${normaliseCaps(validationStatus)}`}</p>;
  };

  const ViewResultsButton = ({ dataObject }) => {
    const id = dataObject?.id;

    const handleViewResults = () => {
      history.push(`/file-validation/results/${id}`);
    };

    return <Button text="View" onClick={handleViewResults} />;
  };

  const UploadTable = (
    <RemoteTable
      id="uploads-table"
      height={500}
      noConfigModal
      rowSelection
      cellRenderers={{
        download_button: ManifestDownloadButton,
        view_results: ViewResultsButton,
        validation_status: ValidationStatus,
      }}
      fields={{
        data: {
          id: { rename: "Manifest ID", width: 130 },
          "user.oidc_id": {
            rename: "User",
          },
          s3_filename: {
            rename: "File Download",
            cellRenderer: {
              type: "download_button",
              props: { downloadName: "${s3_filename}" },
            },
            width: 250,
          },
          "pipeline.id": {
            rename: "Pipeline ID",
            width: 130,
            cellRenderer: "none",
          },
          date_started: {
            rename: "Upload Date",
            cellRenderer: { type: "datetime" },
            width: 180,
          },
          completed: {
            rename: "Validation Complete",
            cellRenderer: { type: "boolean" },
            width: 200,
          },
          failure_message: { rename: "Failure Reason", width: 180 },
          flow_run_id: {
            rename: "Flow Run ID",
          },
          view_results: {
            rename: "View Results",
            custom: true,
            width: 150,
            cellRenderer: {
              type: "view_results",
            },
          },
          validation_status: {
            rename: "Status",
            width: 180,
            cellRenderer: {
              type: "list",
            },
          },
        },
        order: {
          active: [
            "id",
            "s3_filename",
            "user.oidc_id",
            "pipeline.id",
            "date_started",
            "validation_status",
            "completed",
            "flow_run_id",
            "failure_message",
            "view_results",
          ],
        },
      }}
      {...uploads}
    />
  );

  const TabItems = (
    <Tabs defaultActiveKey="1">
      <Tabs.Tab eventKey="1" title="Manifest Validation">
        <Widgets
          components={[
            { component: SOPIntro, type: "full" },
            {
              component: (
                <FileValidation
                  validationConfig={VALIDATION_CONFIG}
                  pageTitle="Manifest Validation Portal"
                />
              ),
              type: "full",
            },
          ]}
        />
      </Tabs.Tab>
      <Tabs.Tab eventKey="2" title="Uploaded Manifests">
        <Widgets
          components={[
            { component: <h2>Uploaded Manifests</h2>, type: "full" },
            { component: UploadTable, type: "full" },
          ]}
        />
      </Tabs.Tab>
    </Tabs>
  );

  return <>{TabItems}</>;
}

export default ManifestValidation;
