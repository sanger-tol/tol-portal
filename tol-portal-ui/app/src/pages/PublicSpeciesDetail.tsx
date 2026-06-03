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
              "sts_project",
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
              "sts_tolid.id",
              "sts_specimen.id",
              "sts_gal_name",
              "sts_sex",
              "sts_organism_part",
              "sts_biosample_accession",
              "sts_biospecimen_accession",
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
            "benchling_sample.sts_lifestage": {
              rename: "Lifestage",
            },
          },
          order: {
            active: [
              "benchling_sample.sts_project",
              "benchling_tolid.id",
              "benchling_extraction_type",
              "benchling_sample.sts_lifestage",
            ],
            inactive: [
              "benchling_sample.sts_project",
              "benchling_tolid.id",
              "benchling_extraction_type",
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
            "tolqc_tolid.id": {
              rename: "ToLID",
            },
            "benchling_sample.sts_specimen.id": {
              rename: "Specimen ID",
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
            "benchling_sample.sts_gal_name": {
              rename: "GAL/Partner name",
            },
            "benchling_sample.sts_sex": {
              rename: "Sex",
            },
            "benchling_sample.sts_organism_part": {
              rename: "Organism Part",
            },
            "mlwh_biosample_accession": {
              rename: "Biosample ID",
            },
            "mlwh_biospecimen_accession": {
              rename: "Biospecimen ID",
            },
            "tolqc_bases": {
              description:
                "Total yield of genetic material in an extraction based on the number of bases counted",
            },
          },
          order: {
            active: [
              "benchling_sample.sts_project",
              "tolqc_tolid.id",
              "benchling_sample.sts_specimen.id",
              "tolqc_reporting_category",
              "benchling_sample.sts_gal_name",
              "benchling_sample.sts_sex",
              "benchling_sample.sts_organism_part",
              "mlwh_biosample_accession",
              "mlwh_biospecimen_accession",
              "tolqc_bases",
            ],
            inactive: [
              "benchling_sample.sts_project",
              "tolqc_tolid.id",
              "benchling_sample.sts_specimen.id",
              "tolqc_reporting_category",
              "benchling_sample.sts_gal_name",
              "benchling_sample.sts_sex",
              "benchling_sample.sts_organism_part",
              "mlwh_biosample_accession",
              "mlwh_biospecimen_accession",
              "tolqc_bases",
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
        height={500}
        fields={{
          data: {
            "grit_issue_type": {
              rename: "Project",
              description: "The project that this sample belongs to",
            },
            "grit_tolid.id": {
              rename: "ToLID",
            },
            "grit_priority": {
              rename: "Priority",
            },
            "grit_species_name": {
              rename: "Species Name",
            },
            "grit_created": {
              rename: "Created",
            },
            "grit_done_date": {
              rename: "Curation Date",
            },
            "grit_expected_karyotype": {
              rename: "Expected Karyotype",
              description: "The expected number of chromosomes to be present for this sample",
            },
            "grit_contamination": {
              rename: "Contamination",
              description: "This field contains the contamination report generated by FCS-GX for the assembly. It includes the total length and number of scaffolds removed, the largest scaffold removed, and a breakdown of identified contaminant species or sequences (e.g. plastid, mitochondrion, insect species) with their scaffold counts and total lengths.",
            },
            "grit_telomere_motif":{
                rename: "HiC Map",
            },
            "grit_telomere_motif_k-mer_length": {
                rename: "K-mer Spectra",
            },
            "grit_higlass_entry": {
              rename: "Analysis",
            },
            "grit_treeval_data": {
              rename: "Links",
            },
            "grit_labels": {
                rename: "Labels",
            }
          },
          order: {
            active: [
              "grit_issue_type",
              "grit_tolid.id",
              "grit_priority",
              "grit_species_name",
              "grit_created",
              "grit_done_date",
              "grit_expected_karyotype",
              "grit_contamination",
              "grit_telomere_motif",
              "grit_telomere_motif_k-mer_length",
              "grit_higlass_entry",
              "grit_treeval_data",
              "grit_labels",
            ],
            inactive: [
              "grit_issue_type",
              "grit_tolid.id",
              "grit_priority",
              "grit_species_name",
              "grit_created",
              "grit_done_date",
              "grit_expected_karyotype",
              "grit_contamination",
              "grit_higlass_entry",
              "grit_treeval_data",
              "grit_labels",
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
            "gap_species.goat_long_list": {
              rename: "Project",
            },
            "gap_assembly.id": {
              rename: "Accession",
            },
            "gap_analysis": {
              rename: "Analysis",
              description: "Genome After Party analysis type performed on the sample",
            },
            "gap_species.goat_scientific_name": {
              rename: "Species",
            },
          },
          order: {
            active: [
              "gap_species.goat_long_list",
              "gap_species.goat_scientific_name",
              "gap_assembly.id",
              "gap_analysis",
            ],
            inactive: [
              "gap_species.goat_long_list",
              "gap_species.goat_scientific_name",
              "gap_assembly.id",
              "gap_analysis",
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
                  "gap_species.id": { eq: { value: id } },
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
