/*
 * SPDX-FileCopyrightText: 2023 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import { RemoteTable, Widgets, useZone } from '@tol/tol-ui';
import { ELASTIC_DS } from '..';


function TUM() {
  const tum = useZone({
    objectType: 'sequencing_request',
    dataSource: ELASTIC_DS,
    components: [
      {
        id: 'tum-table',
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
      id="tum-table"
      defaultSortByAttribute="benchling_species.sts_scientific_name"
      displaySource
      fields={{
        data: {
          "id": {
            rename: "Sanger Sample ID"
          },
          "benchling_tolid.id": {
            rename: "ToL ID"
          },
          "benchling_species.sts_scientific_name": {
            rename: "Benchling Species",
            cellRenderer: {
              type: "link",
              props: {
                url: "/species/${id}",
                text: "${sts_scientific_name}"
              }
            }
          },
          "mlwh_species.sts_scientific_name": {
            rename: "MLWH Species",
            cellRenderer: {
              type: "link",
              props: {
                url: "/species/${id}",
                text: "${sts_scientific_name}"
              }
            }
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
        },
        order: {
          active: [
            "id",
            "benchling_tolid.id",
            "benchling_species.sts_scientific_name",
            "mlwh_species.sts_scientific_name",
            "benchling_completion_date",
            "portaldb_date_sent_to_sciops",
            "tolqc_run_data_tolqc_bases_pacbio_sum",
            "benchling_tolid.tolqc_run_data_tolqc_bases_pacbio_sum",
            "mlwh_tolid.tolqc_run_data_tolqc_bases_pacbio_sum",
            "mlwh_species.tolqc_run_data_tolqc_bases_pacbio_sum",
            "mlwh_species.sts_genome_size",
            "benchling_tolid.informatics_status",
            "benchling_tolid.informatics_gscope_coverage",
            "benchling_library_type",
            "benchling_sample.sts_project",
            "benchling_sample.sts_priority",
            "benchling_species.sts_taxon_group",
            "benchling_tolid.calc_coverage",
            "benchling_specimen.sts_estimated_genome_size",
            "benchling_specimen.calc_coverage_post_run",
            "mlwh_specimen.sts_estimated_genome_size",
          ],
        },
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
