/*
 * SPDX-FileCopyrightText: 2023 Genome Research Ltd.
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
  Timeline
} from '@tol/tol-ui';
import { useParams } from 'react-router-dom';
import { useState } from 'react';

function generateDetail(attributes: any) {
  return (
    <div>
      <h1 className='mb-3'>{(attributes as any)['sts_scientific_name']}</h1>
      <ObjectDetail
        data={{
          "Taxonomy ID": attributes['uid'],
          "Common name": attributes['sts_common_name'],
          "Lineage": (attributes['goat_lineage'] ?? []).join(' / '),
          "Genome Size": attributes['goat_genome_size'],
          "ToLID Prefix": attributes['tolid_prefix'],
        }}
      />
    </div>
  );
}

const generateTimeline = (attributes: any) => {
  return (
    <div>
      <Timeline
        id={attributes['uid']!}
        title={`Timeline of events for ${attributes['sts_scientific_name']}`}
        data={{
          "Compliance in Progress": { date: attributes['sts_sample_sts_submit_date_min'] },
          "Approved to Ship": { date: attributes['sts_sample_sts_accept_date_min'] },
          "Arrived at Sanger": { date: attributes['sts_sample_sts_receive_date_min'] },
          "Released to Lab": { date: attributes['sts_sample_benchling_date_assigned_to_lab_min'] },
          "Assembly Complete": { date: attributes['grit_curation_grit_open_date_min'] },
          "Curation": { date: attributes['grit_curation_grit_done_date_min'] },
          "ToLA / Grit Submission": { date: attributes['grit_curation_grit_in_submission_date_min'] },
          "PacBio Submission": { date: attributes['benchling_sequencing_request_benchling_completion_date_pacbio_min'] },
          "PacBio Sequenced": { date: attributes['mlwh_run_data_mlwh_run_complete_pacbio_min'] },
          "RNASeq Submission": { date: attributes['benchling_sequencing_request_benchling_completion_date_rnaseq_min'] },
          "RNASeq Sequenced": { date: attributes['mlwh_run_data_mlwh_run_complete_rnaseq_min'] },
          "HiC Submission": { date: attributes['benchling_sequencing_request_benchling_completion_date_hic_min'] },
          "HiC Sequenced": { date: attributes['mlwh_run_data_mlwh_run_complete_hic_min'] },
        }}
        defaultIcon
      />
    </div>
  )
};

function SpeciesDetail() {
  const { id } = useParams<({ id: string })>();
  const [response, setResponse] = useState();

  const sampleTable = (
    <div>
      <h5>Sample</h5>
      <p className='mb-3'>Sample information collected for this species.</p>
      <RemoteTable
        id="sample-table-detail-v2"
        defaultSort="sts_tolid.id"
        height={500}
        fields={{
          "sts_tolid.id": {
            rename: "ToLID"
          },
          "sts_specimen.id": {
            rename: "Specimen ID"
          },
          "sts_gal_name": {
            rename: "GAL"
          },
          "sts_sex": {
            rename: "Sex"
          },
          "sts_organism_part": {
            rename: "Organism Part"
          },
          "sts_biosample_accession": {
            rename: "Biosample"
          },
          "sts_biospecimen_accession": {
            rename: "Biospecimen"
          }
        }}
        {...useZone({
          endpoint: 'sample',
          components: [{
            id: 'sample-table-detail-v2',
            filter: {
              and_: {
                "sts_species.id": { eq: { value: id } },
              }
            },
          }],
        })}
      />
    </div>
  )

  const extractionTable = (
    <div>
      <h5>Extractions</h5>
      <p className='mb-3'>Extractions for this species.</p>
      <RemoteTable
        id="extraction-table-detail-v1"
        defaultSort="benchling_tolid.id"
        height={500}
        fields={{
          "benchling_extraction_type": {
            rename: "Type"
          },
          "benchling_tolid.id": {
            rename: "ToLID"
          },
          "benchling_species.id": {
            rename: "Species",
            cellRenderer: "relationshipDetail"
          },
          "benchling_completion_date": {
            rename: "Completion Date"
          }
        }}
        {...useZone({
          endpoint: 'extraction',
          components: [{
            id: 'extraction-table-detail-v1',
            filter: {
              and_: {
                "benchling_species.id": { eq: { value: id } },
              }
            },
          }],
        })}
      />
    </div>
  );

  const pacbioTable = (
    <div>
      <h5>PacBio Run Data</h5>
      <p className='mb-3'>Information for each PacBio sequencing run collected for this species.</p>
      <RemoteTable
        id='pacbio-table-detail-v1'
        height={300}
        fields={{
          "mlwh_pipeline_id_lims": {
            rename: "Pipeline"
          },
          "mlwh_tolid.id": {
            rename: "ToLID"
          },
          "mlwh_run_complete": {
            rename: "Run Complete Date"
          },
          "mlwh_lims_run_id": {
            rename: "Run ID"
          },
          "mlwh_run_id": {
            rename: "Movie"
          },
          "mlwh_well_label": {
            rename: "Well"
          },
          "mlwh_tag1_id": {
            rename: "Tag ID"
          },
          "mlwh_biosample_accession": {
            rename: "Sample Accession"
          },
        }}
        {...useZone({
          endpoint: 'run_data',
          components: [{
            id: 'pacbio-table-detail-v1',
            filter: {
              and_: {
                "mlwh_species.id": { eq: { value: id } },
                "mlwh_platform_type": { eq: { value: 'PacBio' } },
              }
            },
          }],
        })}
      />
    </div>
  )

  const illuminaTable = (
    <div>
      <h5>Illumina Run Data</h5>
      <p className='mb-3'>Information for each PacBio sequencing run collected for this species.</p>
      <RemoteTable
        id='illumina-table-detail-v1'
        height={300}
        fields={{
          "mlwh_pipeline_id_lims": {
            rename: "Pipeline"
          },
          "mlwh_tolid.id": {
            rename: "ToLID"
          },
          "mlwh_run_complete": {
            rename: "Run Complete Date"
          },
          "mlwh_lims_run_id": {
            rename: "Run ID"
          },
          "mlwh_run_id": {
            rename: "Movie"
          },
          "mlwh_well_label": {
            rename: "Well"
          },
          "mlwh_tag1_id": {
            rename: "Tag ID"
          },
          "mlwh_biosample_accession": {
            rename: "Sample Accession"
          },
        }}
        {...useZone({
          endpoint: 'run_data',
          components: [{
            id: 'illumina-table-detail-v1',
            filter: {
              and_: {
                "mlwh_species.id": { eq: { value: id } },
                "mlwh_platform_type": { eq: { value: 'Illumina' } },
              }
            },
          }],
        })}
      />
    </div>
  )

  const curationTable = (
    <div>
      <h5>Curation Data</h5>
      <p className='mb-3'>Curations for this species.</p>
      <RemoteTable
        id='curation-table-detail-v1'
        height={300}
        fields={{
          "grit_assembly_type": {
            rename: "Assembly Type"
          },
          "grit_created": {
            rename: "Requested Date"
          },
          "grit_done_date": {
            rename: "Done Date"
          },
        }}
        {...useZone({
          endpoint: 'curation',
          components: [{
            id: 'curation-table-detail-v1',
            filter: {
              and_: {
                "grit_species.id": { eq: { value: id } }
              }
            },
          }],
        })}
      />
    </div>
  )

  if (response === null) {
    return (
      <Header
        title="Species not found."
        pageEmpty
      />
    );
  }

  if (response === undefined) {
    return (
      <RemoteGet
        endpoint={'species/' + id}
        response={response}
        setResponse={setResponse}
      />
    );
  } else {
    const attributes = response!['data']['data']['attributes'];
    const detail = generateDetail(attributes);
    const timeline = generateTimeline(attributes);

    const components = [
      {
        component: detail,
        type: 'full'
      },
      {
        component: timeline,
        type: 'full'
      },
      {
        component: sampleTable,
        type: 'full'
      },
      {
        component: extractionTable,
        type: 'full'
      },
      {
        component: pacbioTable,
        type: 'full'
      },
      {
        component: illuminaTable,
        type: 'full'
      },
      {
        component: curationTable,
        type: 'full'
      }
    ];

    return (
      <div className="species-detail">
        <Widgets
          components={components}
        />
      </div>
    );
  }
}
export default SpeciesDetail;