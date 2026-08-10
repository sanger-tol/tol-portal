/*
 * SPDX-FileCopyrightText: 2023 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import { RemoteTable, Widgets, useZone } from '@tol/tol-ui';
import { ELASTIC_DS } from '..';


function SamplesStuck() {
  const samplesStuck = useZone({
    objectType: 'sample',
    dataSource: ELASTIC_DS,
    components: [
      {
        id: 'samples-stuck-table',
        filter: {
          and_: {
            "tissue_prep_count": { "gt": { "value": 0 }},
            "sequencing_request_count": { "exists": { "negate" : true }}
          }
        }
      }
    ]
  });

  const table = (
    <RemoteTable
      id="samples-stuck-table"
      defaultSortByAttribute="tolid.id"
      displaySource
      fields={{
        data: {
          "tolid.id": {
            rename: "ToLID"
          },
          "species.genome_size": {
            rename: "Genome Size"
          },
          "tissue_prep_count": {
            rename: "Tissue Preps"
          },
          "tissue_prep_sampleprep_date_min": {
            rename: "First Tissue Prepped"
          },
          "sequencing_request_count": {
            rename: "Sequencing Requests"
          },
          "sequencing_request_completion_date_hic_min": {
            rename: "HiC Request Complete"
          },
          "sequencing_request_completion_date_pacbio_min": {
            rename: "Pacbio Request Complete"
          },
          "sequencing_request_completion_date_rnaseq_min": {
            rename: "RNASeq Request Complete"
          },  
        },
        order: {
          active: [
            "tolid.id",
            "species.genome_size",
            "tissue_prep_count",
            "tissue_prep_sampleprep_date_min",
            "sequencing_request_count",
            "sequencing_request_completion_date_hic_min",
            "sequencing_request_completion_date_pacbio_min",
            "sequencing_request_completion_date_rnaseq_min",
          ],
        },
      }}
      {...samplesStuck}
    />
  );

  const title = (
    <div>
      <h2>Samples Stuck</h2>
    </div>
  );

  const components = [
    {
      component: title,
      type: 'full'
    },
    {
      component: table,
      type: 'xl'
    }
  ];

  return (
    <div className="tum">
      <Widgets
        components={components}
      />
    </div>
  );
}
export default SamplesStuck;