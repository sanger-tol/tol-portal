/*
 * SPDX-FileCopyrightText: 2025 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import {
  FileValidation,
  Tabs,
  RemoteTable,
  Widgets,
  useZone,
  TsDataSource,
} from "@tol/tol-ui";

const VALIDATION_CONFIG = {
  s3_url: "lw23-scratch",
  pipeline_id: 1,
  destination: "portal",
};

function ManifestValidation() {
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
  const TabItems = (
    <Tabs defaultActiveKey="1">
      <Tabs.Tab eventKey="1" title="Manifest Validation">
        <FileValidation
          validationConfig={VALIDATION_CONFIG}
          pageTitle="Manifest Validation Portal"
        />
      </Tabs.Tab>
      <Tabs.Tab eventKey="2" title="Uploaded Manifests">
        <RemoteTable
          id="uploads-table"
          {...uploads}
          height={500}
          fields={{
            data: {
              id: { rename: "Manifest ID", width: 130 },
              "user.id": {
                rename: "User ID",
                width: 130,
                cellRenderer: "none",
              },
              s3_filename: { rename: "File Download", width: 200 },
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
                rename: "Completed",
                cellRenderer: { type: "boolean" },
                width: 130,
              },
              failure_message: { rename: "Failure Reason", width: 180 },
              flow_run_id: {
                rename: "Flow Run ID",
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
                "failure_message",
                "flow_run_id",
              ],
            },
          }}
        />
      </Tabs.Tab>
    </Tabs>
  );

  const components = [
    {
      component: TabItems,
      type: "full",
    },
  ];
  return (
    <>
      <Widgets components={components} />
    </>
  );
}

export default ManifestValidation;
