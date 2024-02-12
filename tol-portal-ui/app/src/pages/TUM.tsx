/*
 * SPDX-FileCopyrightText: 2023 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import { RemoteTable, Widgets } from '@tol/tol-ui';


function TUM() {
  const filter = {
    exact: {
      benchling_sequencing_platform: "pacbio"
    }
  }

  const table = (
    <RemoteTable
      id="tum-table-v1"
      endpoint="sequencing_request"
      filter={filter}
      defaultSort='benchling_species.sts_scientific_name'
      height={600}
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
        "mlwh_run_data_mlwh_hifi_read_bases_sum": {
          rename: "Cumulative CCS Yield (Run)"
        },
        "benchling_tolid.mlwh_run_data_mlwh_hifi_read_bases_sum": {
          rename: "Bench Cumulative CCS Yield (ToL ID)"
        },
        "mlwh_tolid.mlwh_run_data_mlwh_hifi_read_bases_sum": {
          rename: "MLWH Cumulative CCS Yield (ToL ID)"
        },
        "mlwh_species.mlwh_run_data_mlwh_hifi_read_bases_sum": {
          rename: "MLWH Cumulative CCS Yield (Species)"
        },
        "mlwh_species.sts_genome_size": {
          rename: "Estimated Genome Size"
        },
        "benchling_tolid.informatics_status": {
          rename: "ToL Assembly Sequencing Status"
        },
        "lrpacbio_library_remaining": {
          rename: "Library Remaining"
        },
        "lrpacbio_library_remaining_oplc": {
          rename: "Estimated Maximum OPLC 75% Recovery"
        },
        "benchling_sample.sts_project": {
          rename: "ToL Project"
        },
        "benchling_sample.sts_priority": {
          rename: "ToL Priority"
        },
        "benchling_species.sts_taxon_group": {
          rename: "Taxon Group"
        }
      }}
    />
  );

  return (
    <div className="tum">
      <Widgets
        title="TUM"
        components={[table]}
      />
    </div>
  );
}
export default TUM;