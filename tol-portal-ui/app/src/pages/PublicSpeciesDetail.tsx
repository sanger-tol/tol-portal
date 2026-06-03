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
import DOI from "../components/DOI";
import Platform from "../components/Platform";

function generateDetail(id: string, attributes: any) {
  return (
    <div>
      <h1 className="mb-3">{attributes["sts_scientific_name"]}</h1>
      <ObjectDetail
        data={{
          "Taxonomy ID": id,
          "Common name": attributes["sts_common_name"],
          "Lineage": (attributes["goat_lineage"] ?? []).join(" / "),
          "Genome Size": attributes["goat_genome_size"],
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
        title={`Timeline of events for ${attributes["sts_scientific_name"]}`}
        data={{
          "Compliance in Progress": { date: attributes["sts_sample_sts_submit_date_min"] },
          "Approved to Ship": { date: attributes["sts_sample_sts_accept_date_min"] },
          "Arrived at Sanger": { date: attributes["sts_sample_sts_receive_date_min"] },
          "Released to Lab": { date: attributes["sts_sample_benchling_date_assigned_to_lab_min"] },
          "Assembly Complete": { date: attributes["grit_curation_grit_open_date_min"] },
          "Curation": { date: attributes["grit_curation_grit_done_date_min"] },
          "ToLA / Grit Submission": { date: attributes["grit_curation_grit_in_submission_date_min"] },
          "Genome Note Published": { date: attributes["gn_genome_note_gn_date_published_min"] },
          "PacBio Submission": { date: attributes["benchling_sequencing_request_benchling_completion_date_pacbio_min"] },
          "PacBio Sequenced": { date: attributes["mlwh_run_data_mlwh_run_complete_pacbio_min"] },
          "RNASeq Submission": { date: attributes["benchling_sequencing_request_benchling_completion_date_rnaseq_min"] },
          "RNASeq Sequenced": { date: attributes["mlwh_run_data_mlwh_run_complete_rnaseq_min"] },
          "HiC Submission": { date: attributes["benchling_sequencing_request_benchling_completion_date_hic_min"] },
          "HiC Sequenced": { date: attributes["mlwh_run_data_mlwh_run_complete_hic_min"] },
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
            "sts_project": {
              rename: "Project",
            },
          },
          order: {
            active: [
              "sts_tolid.id",
              "sts_specimen.id",
              "sts_gal_name",
              "sts_sex",
              "sts_organism_part",
              "sts_biosample_accession",
              "sts_biospecimen_accession",
            ],
            inactive: [
              "sts_project",
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
                  "sts_species.id": { eq: { value: id } },
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
            "benchling_sample.sts_project": {
              rename: "Project",
            },
            "benchling_tolid.id": {
              rename: "ToLID",
            },
            "benchling_extraction_type": {
              rename: "Extraction type",
              description:
                "The type of genetic material extracted from the source sample.",
            },
            "benchling_completion_date": {
              rename: "Extraction date",
            },
            "benchling_sample.sts_lifestage": {
              rename: "Lifestage",
            },
          },
          order: {
            active: [
              "benchling_extraction_type",
              "benchling_tolid.id",
              "benchling_completion_date",
            ],
            inactive: [
              "benchling_sample.sts_project",
              "benchling_sample.sts_lifestage",
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
                  "benchling_species.id": { eq: { value: id } },
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
        defaultSortByAttribute="mlwh_tolid.id"
        height={500}
        cellRenderer={{
          platform: Platform,
        }}
        fields={{
          data: {
            "benchling_sample.sts_project": {
              rename: "Project",
            },
            "benchling_sample.sts_specimen.id": {
              rename: "Specimen ID",
            },
            "benchling_sample.sts_gal_name": {
              rename: "GAL/Partner name",
            },
            "benchling_sample.sts_sex": {
              rename: "Sex",
            },
            "benchling_sample.sts_organism_part": {
              rename: "Organism Part",
            },
            "benchling_sample.sts_biospecimen_accession": {
              rename: "Biospecimen ID (part-organisms only)",
            },
            "tolqc_reporting_category": {
              cellRenderer: {
                type: "platform",
                props: {
                  platform: "${tolqc_reporting_category}",
                },
              },
              description:
                "The assembly data type being reported on for this sample, such as the sequencing platform or method (e.g. PacBio, HiC).",
            },
            "mlwh_tolid.id": {
              rename: "ToLID",
            },
            "tolqc_bases": {
              description:
                "Total yield of genetic material in an extraction based on the number of bases counted",
            },
          },
          order: {
            active: [
              "tolqc_reporting_category",
              "mlwh_pipeline_id_lims",
              "mlwh_tolid.id",
              "mlwh_run_complete",
              "mlwh_lims_run_id",
              "mlwh_run_id",
              "mlwh_element",
              "mlwh_tag_index",
              "mlwh_biosample_accession",
              "tolqc_bases",
            ],
            inactive: [
              "benchling_sample.sts_project",
              "benchling_sample.sts_specimen.id",
              "benchling_sample.sts_gal_name",
              "benchling_sample.sts_sex",
              "benchling_sample.sts_organism_part",
              "benchling_sample.sts_biospecimen_accession",
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
                  "mlwh_species.id": { eq: { value: id } },
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
        defaultSortByAttribute="grit_created"
        height={500}
        fields={{
          data: {
            "grit_issue_type": {
              rename: "Project",
            },
            "grit_tolid.id": {
              rename: "ToLID",
            },
            "TOLP-9703": {
              rename: "Priority",
            },
            "grit_species_name": {
              rename: "Species Name",
            },
            "grit_expected_karyotype": {
              rename: "Expected Karyotype",
            },
            "grit_contamination": {
              rename: "Contamination",
            },
            "grit_higlass_entry": {
              rename: "Analysis",
            },
            "grit_treeval_data": {
              rename: "Links",
            },
          },
          order: {
            active: [
              "grit_assembly_type",
              "grit_created",
              "grit_done_date",
            ],
            inactive: [
              "grit_issue_type",
              "grit_tolid.id",
              "TOLP-9703",
              "grit_species_name",
              "grit_expected_karyotype",
              "grit_contamination",
              "grit_higlass_entry",
              "grit_treeval_data",
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
                  "grit_species.id": { eq: { value: id } },
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
        defaultSortByAttribute="gap_assembly.id"
        height={500}
        fields={{
          data: {
            "gap_assembly.id": {
              rename: "Assembly",
            },
            "gap_results": {
              rename: "Gap Results",
            },
            "gap_lustre_path_analysis": {
              rename: "Gap Lustre Path Analysis",
            },
          },
          order: {
            active: [
              "gap_assembly.id",
              "gap_results",
              "gap_lustre_path_analysis",
            ],
            inactive: [],
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
                  "gap_species.id": { eq: { value: id } },
                },
              },
            },
          ],
        })}
      />
    </div>
  );

  const genomeNotesTable = (
    <div>
      <h5>Genome Notes</h5>
      <p className="mb-3">Genome Notes for this species.</p>
      <RemoteTable
        id="public-gn-table-detail"
        height={500}
        cellRenderer={{
          doi: DOI,
        }}
        fields={{
          data: {
            "gn_tolid.id": {
              rename: "ToLID",
            },
            "gn_assembly.id": {
              rename: "Assembly Accession",
            },
            id: {
              rename: "Note",
              cellRenderer: {
                type: "doi",
                props: {
                  doi: "${id}",
                  displayName: "View Genome Note",
                },
              },
            },
          },
          order: {
            active: ["gn_tolid.id", "gn_assembly.id", "gn_date_published", "gn_passed_pr", "id"],
          },
        }}
        {...useZone({
          objectType: "genome_note",
          dataSource: ELASTIC_DS,
          components: [
            {
              id: "public-gn-table-detail",
              filter: {
                and_: {
                  "gn_species.id": { eq: { value: id } },
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
                {
                  component: genomeNotesTable,
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
