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
  useValidationPolicyModule,
} from "@tol/tol-ui";

import type { TFileValidationAction } from "@tol/tol-ui";

// Create the validation config object that will be passed as a prop to the component
const VALIDATION_CONFIG = {
  s3_bucket: "lw23-scratch", // TODO: change to correct bucket depending on pipeline_id
  pipeline_id: 1, // TODO: Allow users to select pipeline to run
  destination: "portal",
  project: "portal",
};

function ManifestValidation() {
  const history = useHistory();

  // Get status policy and all available actions
  const { actions, policies } = useValidationPolicyModule();

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

  // Download button that calls the s3 service to download the specified
  // file from the S3 bucket
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

  // Render table actions based on current validation status
  const baseValidationActions = Object.values(actions).map(
    (action: TFileValidationAction) => ({
      name: action.label,
      isVisibleAction: (selectedRows: any[] = []) =>
        selectedRows.length > 0 &&
        // Make sure the action can be completed by every selected row before rendering it
        selectedRows.every((row) => {
          // Get the validation status of the row
          const status = row?.validation_status?.props?.value;
          // Check against the allowed actions of that particular status
          const allowed = policies[status]?.allowedActions ?? [];
          // Return all allowed actions of that policy
          return allowed.includes(action.id);
        }),
    }),
  );

  // Fallback "no actions available" dropdown list
  const noActionsAvailableAction = {
    name: "No Actions Available for Selection",
    disabled: true,
    isVisibleAction: (selectedRows: any[] = []) =>
      selectedRows.length > 0 &&
      // If no valid actions are available, return true to show this placeholder action
      !baseValidationActions.some((action) =>
        action.isVisibleAction ? action.isVisibleAction(selectedRows) : true,
      ),
  };

  // build final actions array
  const validationActions = [
    ...baseValidationActions,
    noActionsAvailableAction,
  ];

  // Easy to read validation status component
  const ValidationStatus = ({ validationStatus }) => {
    return <p>{`${normaliseCaps(validationStatus)}`}</p>;
  };

  // Results button that goes directly to /file-validation/results/<id>
  const ViewResultsButton = ({ dataObject }) => {
    const id = dataObject?.id;

    const handleViewResults = () => {
      history.push(`/file-validation/results/${id}`);
    };

    return <Button text="View" onClick={handleViewResults} />;
  };

  // Table for viewing all previous validaitons, admins can see all
  // validation uploads, normal users can only see their own.
  const AllValidationUploadsTable = (
    <RemoteTable
      id="uploads-table"
      height={500}
      actions={validationActions}
      noConfigModal
      rowSelection
      cellRenderers={{
        downloadButton: ManifestDownloadButton,
        viewResults: ViewResultsButton,
        validationStatus: ValidationStatus,
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
              type: "downloadButton",
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
          failure_message: { rename: "System Failure Reason", width: 180 },
          flow_run_id: {
            rename: "Flow Run ID",
          },
          view_results: {
            rename: "View Results",
            custom: true,
            width: 150,
            cellRenderer: {
              type: "viewResults",
            },
          },
          validation_status: {
            rename: "Validation Status",
            width: 200,
            cellRenderer: {
              type: "validationStatus",
              props: { validationStatus: "${validation_status}" },
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
      {...useZone({
        objectType: "upload",
        dataSource: new TsDataSource({
          apiPath: "/api/v1/local",
        }),
        components: [
          {
            id: "uploads-table",
          },
        ],
      })}
    />
  );

  // Tabs to separate file uploader from previous validations table
  const PageTabs = (
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
            { component: AllValidationUploadsTable, type: "full" },
          ]}
        />
      </Tabs.Tab>
    </Tabs>
  );

  return <>{PageTabs}</>;
}

export default ManifestValidation;
