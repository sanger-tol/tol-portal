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
  Timeline,
  Tabs
} from '@tol/tol-ui';
import DOI from '../components/DOI';
import Platform from '../components/Platform';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { ELASTIC_DS } from '..';


function generateDetail(id: string, attributes: any) {
  return (
    <div>
      <h1 className='mb-3'>{(attributes as any)['scientific_name']}</h1>
      <ObjectDetail
        data={{
          "Taxonomy ID": id,
          "Common name": attributes['common_name'],
          "Lineage": (attributes['lineage'] ?? []).join(' / '),
          "Genome Size": attributes['genome_size'],
          "ToLID Prefix": attributes['tolid_prefix'],
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
        title={`Timeline of events for ${attributes['scientific_name']}`}
        data={{
          "Compliance in Progress": { date: attributes['sample_submit_date_min'] },
          "Approved to Ship": { date: attributes['sample_accept_date_min'] },
          "Arrived at Sanger": { date: attributes['sample_receive_date_min'] },
          "Released to Lab": { date: attributes['sample_date_assigned_to_lab_min'] },
          "Assembly Complete": { date: attributes['curation_open_date_min'] },
          "Curation": { date: attributes['curation_done_date_min'] },
          "ToLA / Grit Submission": { date: attributes['curation_in_submission_date_min'] },
          "Genome Note Published": { date: attributes['genome_note_date_published_min'] },
          "PacBio Submission": { date: attributes['sequencing_request_completion_date_pacbio_min'] },
          "PacBio Sequenced": { date: attributes['run_data_run_complete_pacbio_min'] },
          "RNASeq Submission": { date: attributes['sequencing_request_completion_date_rnaseq_min'] },
          "RNASeq Sequenced": { date: attributes['run_data_run_complete_rnaseq_min'] },
          "HiC Submission": { date: attributes['sequencing_request_completion_date_hic_min'] },
          "HiC Sequenced": { date: attributes['run_data_run_complete_hic_min'] },
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
        id="sample-table-detail"
        defaultSortByAttribute="sts_tolid.id"
        displaySource
        height={500}
        fields={{
          data: {
            "tolid.id": {
              rename: "ToLID"
            },
            "specimen.id": {
              rename: "Specimen ID"
            },
          },
          order: {
            active: [
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
          objectType: 'sample',
          dataSource: ELASTIC_DS,
          components: [{
            id: 'sample-table-detail',
            filter: {
              and_: {
                "species.id": { eq: { value: id } },
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
        id="extraction-table-detail"
        defaultSortByAttribute="tolid.id"
        height={500}
        fields={{
          data: {
            "tolid.id": {
              rename: "ToLID"
            },
          },
          order: {
            active: [
              "extraction_type",
              "tolid.id",
              "completion_date",
            ],
          },
        }}
        {...useZone({
          objectType: 'extraction',
          dataSource: ELASTIC_DS,
          components: [{
            id: 'extraction-table-detail',
            filter: {
              and_: {
                "species.id": { eq: { value: id } },
              }
            },
          }],
        })}
      />
    </div>
  );

  const runsTable = (
    <div>
      <h5>Run Data</h5>
      <p className='mb-3'>Information for each sequencing run collected for this species.</p>
      <RemoteTable
        id='pacbio-table-detail'
        height={300}
        cellRenderer={{
          "platform": Platform,
        }}
        fields={{
          data: {
            "reporting_category": {
              cellRenderer: {
                type: "platform",
                props: {
                  platform: "${reporting_category}"
                }
              }
            },
            "tolid.id": {
              rename: "ToLID"
            },
          },
          order: {
            active: [
              "reporting_category",
              "pipeline_id_lims",
              "tolid.id",
              "run_complete",
              "lims_run_id",
              "run_id",
              "element",
              "tag_index",
              "biosample_accession",
              "bases",
            ],
          },
        }}
        {...useZone({
          objectType: 'run_data',
          dataSource: ELASTIC_DS,
          components: [{
            id: 'pacbio-table-detail',
            filter: {
              and_: {
                "species.id": { eq: { value: id } },
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
        id='curation-table-detail'
        height={300}
        fields={{
          order: {
            active: [
              "assembly_type",
              "created",
              "done_date",
            ],
          },
        }}
        {...useZone({
          objectType: 'curation',
          dataSource: ELASTIC_DS,
          components: [{
            id: 'curation-table-detail',
            filter: {
              and_: {
                "species.id": { eq: { value: id } }
              }
            },
          }],
        })}
      />
    </div>
  )

  const assemblyAnalysisTable = (
    <div>
      <h5>Assembly Analysis</h5>
      <p className='mb-3'>Analysis performed on the assemblies for this species.</p>
      <RemoteTable
        id='assembly-analysis-table-detail'
        height={300}
        fields={{
          data: {
            "assembly.id": {
              rename: "Assembly",
            },
            "results": {
              "link": "gap_s3"
            },
          },
          order: {
            active: [
              "assembly.id",
              "results",
              "lustre_path_analysis",
            ],
          },
        }}
        {...useZone({
          objectType: 'assembly_analysis',
          dataSource: ELASTIC_DS,
          components: [{
            id: 'assembly-analysis-table-detail',
            filter: {
              and_: {
                "species.id": { eq: { value: id } }
              }
            },
          }],
        })}
      />
    </div>
  )

  const gnTable = (
    <div>
      <h5>Genome Notes</h5>
      <p className='mb-3'>Genome Notes for this species.</p>
      <RemoteTable
        id='gn-table-detail'
        height={300}
        cellRenderer={{
          "doi": DOI,
        }}
        fields={{
          data: {
            "tolid.id": {
              rename: "ToLID"
            },
            "assembly.id": {
              rename: "Assembly Accession"
            },
            "id": {
              rename: "Note",
              cellRenderer: {
                type: "doi",
                props: {
                  doi: "${id}",
                  displayName: "View Genome Note",
                },
              }
            },
          },
          order: {
            active: [
              "tolid.id",
              "assembly.id",
              "date_published",
              "passed_pr",
              "id",
            ],
          },
        }}
        {...useZone({
          objectType: 'genome_note',
          dataSource: ELASTIC_DS,
          components: [{
            id: 'gn-table-detail',
            filter: {
              and_: {
                "species.id": { eq: { value: id } }
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
        dataSource={ELASTIC_DS}
        resource={'species/' + id}
        response={response}
        setResponse={setResponse}
      />
    );
  } else {
    const id = response!['data']['data']['id'];
    const attributes = response!['data']['data']['attributes'];
    const detail = generateDetail(id, attributes);
    const timeline = generateTimeline(id, attributes);

    return (
      <div className="species-detail">
          <Tabs defaultActiveKey="1" appearance="pills">
            <Tabs.Tab eventKey="1" title="Details">
              <div className="species-detail-details">
                <Widgets
                  components={[
                      {
                        component: detail,
                        type: 'full'
                      },
                      {
                        component: timeline,
                        type: 'full'
                      }
                  ]}
                />
              </div>
            </Tabs.Tab>
            <Tabs.Tab eventKey="2" title="Lab">
              <div className="species-detail-lab">
                <Widgets
                    components={[
                      {
                        component: sampleTable,
                        type: 'full'
                      },
                      {
                        component: extractionTable,
                        type: 'full'
                      }
                  ]}
                />
              </div>
            </Tabs.Tab>
            <Tabs.Tab eventKey="3" title="Assembly">
              <div className="species-detail-assembly">
              <Widgets
                  components={[
                    {
                      component: runsTable,
                      type: 'full'
                    }
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
                        type: 'full'
                      }
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
                          type: 'full'
                        },
                        {
                          component: gnTable,
                          type: 'full'
                        }
                      ]}
                    />
                </div>
              </Tabs.Tab>
            </Tabs>
  
      </div>
    );
  }
}
export default SpeciesDetail;