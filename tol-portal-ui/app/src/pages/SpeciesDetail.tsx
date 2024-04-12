/*
 * SPDX-FileCopyrightText: 2023 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import { Header, ObjectDetail, RemoteGet, RemoteTable, Widgets } from '@tol/tol-ui';
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

function generateSampleTable(filter: object) {
  return (
    <div>
      <h5>Sample</h5>
      <p className='mb-3'>Sample information collected for this species.</p>
      <RemoteTable
        id="sample-table-detail"
        endpoint="sample"
        defaultSort="sts_tolid.id"
        filter={filter}
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
      />
    </div>
  );
}

function generateExtractionTable(filter: object) {
  return (
    <div>
      <h5>Extractions</h5>
      <p className='mb-3'>Extractions for this species.</p>
      <RemoteTable
        id="extraction-table-detail"
        endpoint="extraction"
        defaultSort="benchling_tolid.id"
        filter={filter}
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
      />
    </div>
  );
}

function generatePacbioTable(filter: object) {
  return (
    <div>
      <h5>PacBio Run Data</h5>
      <p className='mb-3'>Information for each PacBio sequencing run collected for this species.</p>
      <RemoteTable
        id="pacbio-detail-v2-table"
        endpoint="run_data"
        filter={filter}
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
            rename: "Run ID" // being formatted as a date?
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
          // "mlwh_yield": {
          //     rename: "Yield"
          // },
          // "": {
          //     rename: "N50" // different to the value of mlwh_insert_length in the portal
          // },
          "mlwh_biosample_accession": {
            rename: "Sample Accession"
          },
          // "": {
          //     rename: "Run Accession"
          // },
          // "": {
          //     rename: "Barcode"
          // }
        }}
      />
    </div>
  );
}

function generateIlluminaTable(filter: object) {
  return (
    <div>
      <h5>Illumina Run Data</h5>
      <p className='mb-3'>Information for each Illumina sequencing run collected for this species.</p>
      <RemoteTable
        id="illumina-run-detail-table"
        endpoint="run_data"
        filter={filter}
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
          "mlwh_run_id": {
            rename: "Run ID"
          },
          // "": {
          //     rename: "Read Pairs"
          // },
          // "": {
          //     rename: "Yield"
          // },
          "mlwh_biosample_accession": {
            rename: "Sample Accession"
          },
          // "": {
          //     rename: "Run Accession"
          // },
          // "mlwh_run_status": {
          //     rename: "Run Status"
          // },
          // "": {
          //     rename: "Barcode"
          // },
        }}
      />
    </div>
  );
}

function SpeciesDetail() {
  const { id } = useParams<({id: string})>();
  const [response, setResponse] = useState();
  const sampleFilter = {exact: {'sts_species.id': id }};
  const extractionFilter = {exact: {'benchling_species.id': id }};
  const pacbioRunFilter = {exact: {'mlwh_species.id': id, 'mlwh_platform_type': 'PacBio'}};
  const iseqRunFilter = {exact: {'mlwh_species.id': id, 'mlwh_platform_type': 'Illumina'}};

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
        component: generateSampleTable(sampleFilter),
        type: 'full'
      },
      {
        component: generateExtractionTable(extractionFilter),
        type: 'full'
      },
      {
        component: generatePacbioTable(pacbioRunFilter),
        type: 'full'
      },
      {
        component: generateIlluminaTable(iseqRunFilter),
        type: 'full'
      },
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
