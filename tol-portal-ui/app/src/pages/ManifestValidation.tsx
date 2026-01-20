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
} from "@tol/tol-ui";

const VALIDATION_CONFIG = {
  s3_bucket: "tol-sample-manifests", // TODO: change to correct bucket depending on pipeline_id
  pipeline_id: 1, // TODO: Allow users to select pipeline to run
  destination: "portal",
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
            downloadName
          )
        }
      />
    );
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
      cellRenderers={{
        download_button: ManifestDownloadButton,
        view_results: ViewResultsButton,
      }}
      fields={{
        data: {
          id: { rename: "Manifest ID", width: 130 },
          "user.id": {
            rename: "User ID",
            width: 130,
            cellRenderer: "none",
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
          destination: { rename: "Destination", width: 180 },
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
          is_ready: {
            rename: "Is Ready",
            width: 130,
          },
        },
        order: {
          active: [
            "id",
            "s3_filename",
            "user.id",
            "pipeline.id",
            "destination",
            "date_started",
            "completed",
            "is_ready",
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
