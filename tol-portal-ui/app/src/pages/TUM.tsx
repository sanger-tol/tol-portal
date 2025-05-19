/*
 * SPDX-FileCopyrightText: 2023 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import { RemoteTable, Widgets, useZone } from '@tol/tol-ui';


function TUM() {
  const tum = useZone({
    endpoint: 'sequencing_request',
    components: [
      {
        id: 'tum-table-v1',
        filter: {
          and_: {
            "benchling_sequencing_platform": {
              'eq': { 'value': 'pacbio' }
            }
          }
        }
      }
    ]
  });

  const table = (
    <RemoteTable
      id="tum-table-v1"
      defaultSort='benchling_species.sts_scientific_name'
      displaySource
      fields={{
        "uid": {
          rename: "Sanger Sample ID"
        },
        "benchling_tolid.id": {
          rename: "ToL ID"
        },
        "benchling_species.sts_scientific_name": {
          rename: "Benchling Species",
          cellRenderer: "relationshipDetail"
        },
        "mlwh_species.sts_scientific_name": {
          rename: "MLWH Species",
          cellRenderer: "relationshipDetail"
        },
        "benchling_completion_date": {
          rename: "ToL Core Submission Date"
        },
        "portaldb_date_sent_to_sciops": {
          rename: "Date Sent To SciOps"
        },
        "tolqc_run_data_tolqc_bases_sum": {
          rename: "Cumulative CCS Yield (Run)"
        },
        "benchling_tolid.tolqc_run_data_tolqc_bases_sum": {
          rename: "Bench Cumulative CCS Yield (ToL ID)"
        },
        "mlwh_tolid.tolqc_run_data_tolqc_bases_sum": {
          rename: "MLWH Cumulative CCS Yield (ToL ID)"
        },
        "mlwh_species.tolqc_run_data_tolqc_bases_sum": {
          rename: "MLWH Cumulative CCS Yield (Species)"
        },
        "mlwh_species.sts_genome_size": {
          rename: "Estimated Genome Size"
        },
        "benchling_tolid.informatics_status": {
          rename: "ToL Assembly Sequencing Status"
        },
        "benchling_tolid.informatics_gscope_coverage": {
          rename: "ToL Assembly Gscope Coverage"
        },
        "benchling_library_type": {
          rename: "Library Type"
        },
        "lrpacbio_library_remaining": {
          rename: "Library Remaining"
        },
        "lrpacbio_portion_of_cell": {
          rename: "Portion of Cell"
        },
        "lrpacbio_cell_status": {
          rename: "Cell Status"
        },
        "lrpacbio_library_remaining_oplc": {
          rename: "Library Remaining OPLC 75% Recovery"
        },
        "lrpacbio_estimated_max_oplc": {
          rename: "Estimated Maximum OPLC"
        },
        "benchling_sample.sts_project": {
          rename: "ToL Project"
        },
        "benchling_sample.sts_priority": {
          rename: "ToL Priority"
        },
        "benchling_species.sts_taxon_group": {
          rename: "Taxon Group"
        },
        "benchling_species.calc_coverage": {
          rename: "Calculated Coverage"
        },
        "benchling_specimen.sts_estimated_genome_size": {
          rename: "Bench Genome size (post-run)"
        },
        "benchling_specimen.calc_coverage_post_run": {
          rename: "Calculated Coverage Post Run"
        },
        "mlwh_specimen.sts_estimated_genome_size": {
          rename: "MLWH Genome size (post-run)",
          type: 'float'
        }
      }}
      {...tum}
    />
  );

  const title = (
    <div>
      <h2>Top-Up Management</h2>
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
export default TUM;
