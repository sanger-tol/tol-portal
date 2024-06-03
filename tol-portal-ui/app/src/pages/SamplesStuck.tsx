/*
 * SPDX-FileCopyrightText: 2023 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import { RemoteTable, Widgets, useZone } from '@tol/tol-ui';


function SamplesStuck() {
  const samplesStuck = useZone({
    endpoint: 'sample',
    components: [
      {
        id: 'samples-stuck-table-v1',
        filter: {
          and_: {
            "benchling_tissue_prep_count": { "gt": { "value": 0 }},
            "benchling_sequencing_request_count": { "exists": { "negate" : true }}
          }
        }
      }
    ]
  });

  const table = (
    <RemoteTable
      id="samples-stuck-table-v1"
      defaultSort='sts_tolid.id'
      fields={{
        "sts_tolid.id": {
          rename: "ToLID"
        },
        "sts_species.sts_genome_size": {
          rename: "Genome Size"
        },
        "benchling_tissue_prep_count": {
          rename: "Tissue Preps"
        },
        "benchling_tissue_prep_benchling_sampleprep_date_min": {
          rename: "First Tissue Prepped"
        },
        "benchling_sequencing_request_count": {
          rename: "Sequencing Requests"
        },
        "benchling_sequencing_request_benchling_completion_date_hic_min": {
          rename: "HiC Request Complete"
        },
        "benchling_sequencing_request_benchling_completion_date_pacbio_min": {
          rename: "Pacbio Request Complete"
        },
        "benchling_sequencing_request_benchling_completion_date_rnaseq_min": {
          rename: "RNASeq Request Complete"
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
