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
  useZone
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

function SpeciesDetail() {
  const { id } = useParams<({ id: string })>();
  const [response, setResponse] = useState();

  const sampleTable = (
    <div>
      <h5>Sample</h5>
      <p className='mb-3'>Sample information collected for this species.</p>
      <RemoteTable
        id="sample-table-detail-v1"
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
          "benchling_sex": {
            rename: "Sex"
          },
          "benchling_organism_part": {
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
            id: 'sample-table-detail-v1',
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

    const components = [
      {
        component: detail,
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
