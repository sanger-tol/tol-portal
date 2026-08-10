/*
 * SPDX-FileCopyrightText: 2026 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import {
  Header,
  ObjectDetail,
  RemoteGet,
  RemoteTable,
  Widgets,
  useZone,
  Timeline,
  Tabs,
} from "@tol/tol-ui";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { ELASTIC_DS } from "..";
import Platform from "../components/Platform";

function generateDetail(id: string, attributes: any) {
  return (
    <div>
      <h1 className="mb-3">{attributes["scientific_name"]}</h1>
      <ObjectDetail
        data={{
          "Taxonomy ID": id,
          "Common name": attributes["common_name"],
          "Lineage": (attributes["lineage"] ?? []).join(" / "),
          "Genome Size": attributes["genome_size"],
          "ToLID Prefix": attributes["tolid_prefix"],
        }}
      />
    </div>
  );
}

const generateTimeline = (id: string, attributes: any) => {
  return (
    <div>
      <Timeline
        id={id}
        title={`Timeline of events for ${attributes["scientific_name"]}`}
        data={{
          "Compliance in Progress": { date: attributes["sample_submit_date_min"] },
          "Approved to Ship": { date: attributes["sample_accept_date_min"] },
          "Arrived at Sanger": { date: attributes["sample_receive_date_min"] },
          "Released to Lab": { date: attributes["sample_date_assigned_to_lab_min"] },
          "Assembly Complete": { date: attributes["curation_open_date_min"] },
          "Curation": { date: attributes["curation_done_date_min"] },
          "ToLA / Grit Submission": { date: attributes["curation_grit_in_submission_date_min"] },
          "Genome Note Published": { date: attributes["genome_note_date_published_min"] },
          "PacBio Submission": { date: attributes["sequencing_request_completion_date_pacbio_min"] },
          "PacBio Sequenced": { date: attributes["run_data_run_complete_pacbio_min"] },
          "RNASeq Submission": { date: attributes["sequencing_request_completion_date_rnaseq_min"] },
          "RNASeq Sequenced": { date: attributes["run_data_run_complete_rnaseq_min"] },
          "HiC Submission": { date: attributes["sequencing_request_completion_date_hic_min"] },
          "HiC Sequenced": { date: attributes["run_data_run_complete_hic_min"] },
        }}
        defaultIcon
      />
    </div>
  );
};

function PublicSpeciesDetail() {
  const { id } = useParams<{ id: string }>();
  const [response, setResponse] = useState<any>();

  const sampleTable = (
    <div>
      <h5>Sample</h5>
      <p className="mb-3">Sample information collected for this species.</p>
      <RemoteTable
        id="public-sample-table-detail"
        defaultSortByAttribute="sts_tolid.id"
        height={500}
        fields={{
          data: {
            "tolid.id": {
              rename: "ToLID",
            },
          },
          order: {
            active: [
              "project",
              "tolid.id",
              "specimen.id",
              "gal_name",
              "sex",
              "organism_part",
              "biosample_accession",
              "biospecimen_accession",
            ],
            inactive: [
              "project",
              "tolid.id",
              "specimen.id",
              "gal_name",
              "sex",
              "organism_part",
              "biosample_accession",
              "biospecimen_accession",
            ],
          },
        }}
        {...useZone({
          objectType: "sample",
          dataSource: ELASTIC_DS,
          components: [
            {
              id: "public-sample-table-detail",
              filter: {
                and_: {
                  "species.id": { eq: { value: id } },
                },
              },
            },
          ],
        })}
      />
    </div>
  );

  const extractionTable = (
    <div>
      <h5>Extractions</h5>
      <p className="mb-3">Extractions for this species.</p>
      <RemoteTable
        id="public-extraction-table-detail"
        defaultSortByAttribute="benchling_tolid.id"
        height={500}
        fields={{
          data: {
            "sample.sts_project": {
              rename: "Project",
            },
            "tolid.id": {
              rename: "ToLID",
            },
          },
          order: {
            active: [
              "sample.sts_project",
              "tolid.id",
              "extraction_type",
              "sample.sts_lifestage",
            ],
            inactive: [
              "sample.sts_project",
              "tolid.id",
              "extraction_type",
              "sample.lifestage",
            ],
          },
        }}
        {...useZone({
          objectType: "extraction",
          dataSource: ELASTIC_DS,
          components: [
            {
              id: "public-extraction-table-detail",
              filter: {
                and_: {
                  "species.id": { eq: { value: id } },
                },
              },
            },
          ],
        })}
      />
    </div>
  );

  const runDataTable = (
    <div>
      <h5>Run Data</h5>
      <p className="mb-3">Information for each sequencing run collected for this species</p>
      <RemoteTable
        id="public-run-data-table-detail-v2"
        height={500}
        cellRenderer={{
          platform: Platform,
        }}
        fields={{
          data: {
            "sample.project": {
              rename: "Project",
            },
            "tolid.id": {
              rename: "ToLID",
            },
            "sample.specimen.id": {
              rename: "Specimen ID",
            },
            "reporting_category": {
              cellRenderer: {
                type: "platform",
                props: {
                  platform: "${reporting_category}",
                },
              },
            },
          },
          order: {
            active: [
              "sample.project",
              "tolid.id",
              "sample.specimen.id",
              "reporting_category",
              "sample.gal_name",
              "sample.sex",
              "sample.organism_part",
              "biosample_accession",
              "biospecimen_accession",
              "bases",
            ],
            inactive: [
              "sample.project",
              "tolid.id",
              "sample.specimen.id",
              "reporting_category",
              "sample.gal_name",
              "sample.sex",
              "sample.organism_part",
              "biosample_accession",
              "biospecimen_accession",
              "bases",
            ],
          },
        }}
        {...useZone({
          objectType: "run_data",
          dataSource: ELASTIC_DS,
          components: [
            {
              id: "public-run-data-table-detail-v2",
              filter: {
                and_: {
                  "species.id": { eq: { value: id } },
                },
              },
            },
          ],
        })}
      />
    </div>
  );

  const curationTable = (
    <div>
      <h5>Curation Data</h5>
      <p className="mb-3">Curations for this species.</p>
      <RemoteTable
        id="public-curation-table-detail"
        height={500}
        fields={{
          data: {
            "issue_type": {
              rename: "Project",
            },
            "tolid.id": {
              rename: "ToLID",
            },
            "higlass_entry": {
              rename: "Analysis",
            },
          },
          order: {
            active: [
              "issue_type",
              "tolid.id",
              "species.sample_priority_status",
              "species_name",
              "created",
              "curation_date",
              "expected_karyotype",
              "contamination",
              "higlass_entry",
            ],
            inactive: [
              "issue_type",
              "tolid.id",
              "species.sample_priority_status",
              "species_name",
              "created",
              "curation_date",
              "expected_karyotype",
              "contamination",
              "higlass_entry",
            ],
          },
        }}
        {...useZone({
          objectType: "curation",
          dataSource: ELASTIC_DS,
          components: [
            {
              id: "public-curation-table-detail",
              filter: {
                and_: {
                  "species.id": { eq: { value: id } },
                },
              },
            },
          ],
        })}
      />
    </div>
  );

  const assemblyAnalysisTable = (
    <div>
      <h5>Assembly Analysis</h5>
      <p className="mb-3">Analysis performed on the assemblies for this species .</p>
      <RemoteTable
        id="public-assembly-analysis-table-detail-v2"
        height={500}
        fields={{
          data: {
            "species.long_list": {
              rename: "Project",
            },
            "species.tolid_prefix": {
              rename: "ToLID Prefix",
            },
            "assembly.id": {
              rename: "Assembly",
            },
            "species.scientific_name": {
              rename: "Scientific Name",
            },
          },
          order: {
            active: [
              "species.goat_long_list",
              "species.tolid_prefix",
              "assembly.id",
              "analysis",
              "species.scientific_name",
            ],
            inactive: [
              "species.long_list",
              "species.tolid_prefix",
              "assembly.id",
              "analysis",
              "species.scientific_name",
            ],
          },
        }}
        {...useZone({
          objectType: "assembly_analysis",
          dataSource: ELASTIC_DS,
          components: [
            {
              id: "public-assembly-analysis-table-detail-v2",
              filter: {
                and_: {
                  "species.id": { eq: { value: id } },
                },
              },
            },
          ],
        })}
      />
    </div>
  );

  if (response === null) {
    return <Header title="Species not found." pageEmpty />;
  }

  if (response === undefined) {
    return (
      <RemoteGet
        dataSource={ELASTIC_DS}
        resource={"species/" + id}
        response={response}
        setResponse={setResponse}
      />
    );
  }

  const speciesId = response["data"]["data"]["id"];
  const attributes = response["data"]["data"]["attributes"];
  const detail = generateDetail(speciesId, attributes);
  const timeline = generateTimeline(speciesId, attributes);

  return (
    <div className="species-detail public-species-detail">
      <Tabs defaultActiveKey="1" appearance="pills">
        <Tabs.Tab eventKey="1" title="Details">
          <div className="species-detail-details">
            <Widgets
              components={[
                {
                  component: detail,
                  type: "full",
                },
                {
                  component: timeline,
                  type: "full",
                },
              ]}
            />
          </div>
        </Tabs.Tab>

        <Tabs.Tab eventKey="2" title="Labs">
          <div className="species-detail-lab">
            <Widgets
              components={[
                {
                  component: sampleTable,
                  type: "full",
                },
                {
                  component: extractionTable,
                  type: "full",
                },
              ]}
            />
          </div>
        </Tabs.Tab>

        <Tabs.Tab eventKey="3" title="Assembly">
          <div className="species-detail-assembly">
            <Widgets
              components={[
                {
                  component: runDataTable,
                  type: "full",
                },
              ]}
            />
          </div>
        </Tabs.Tab>

        <Tabs.Tab eventKey="4" title="Curation">
          <div className="species-detail-curation">
            <Widgets
              components={[
                {
                  component: curationTable,
                  type: "full",
                },
              ]}
            />
          </div>
        </Tabs.Tab>

        <Tabs.Tab eventKey="5" title="After-Party">
          <div className="species-detail-after-party">
            <Widgets
              components={[
                {
                  component: assemblyAnalysisTable,
                  type: "full",
                },
              ]}
            />
          </div>
        </Tabs.Tab>
      </Tabs>
    </div>
  );
}

export default PublicSpeciesDetail;
