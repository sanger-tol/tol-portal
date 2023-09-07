/*
 * SPDX-FileCopyrightText: 2023 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import { RemoteTable,
         RemoteMultipleSelectFilters,
         RemoteBarChart,
         Widgets } from '@tol/tol-ui'
import { useState } from 'react';


function SequencingRequests() {
  const [ globalFilters, setGlobalFilters ] = useState<object>({})
  const [ combinedFilters, setCombinedFilters ] = useState<object>({})

  const filters = (
    <RemoteMultipleSelectFilters
      endpoint="sequencing_request"
      fields={["benchling_source"]}
      globalFilters={globalFilters}
      setGlobalFilters={setGlobalFilters}
    />
  )

  const chart = (
    <RemoteBarChart
      stacked
      title="Submission from Benchling to SciOps"
      endpoint="sequencing_request"
      breakDownBy="benchling_source"
      xAxis="benchling_eln_submission_date"
      interval="M"
      filter={globalFilters}
      setCombinedFilters={setCombinedFilters}
      type='date'
      height={500}
    />
  )

  const table = (
    <RemoteTable
      endpoint="sequencing_request"
      filter={combinedFilters}
      defaultSort="benchling_source"
      fields={{
        "uid": {
          rename: "Sample Ref"
        },
        "benchling_sequencing_platform": {
          rename: "Platform (Benchling)"
        },
        "benchling_tolid": {
          rename: "ToLID (Benchling)"
        },
        "benchling_source": {
          rename: "Source (Benchling)"
        },
        "benchling_eln_submission_date": {
          rename: "Submission Date (Benchling)"
        },
        "portaldb_date_sent_to_sciops": {
          rename: "Date Sent To SciOps",
          sort: true
        }
      }}
      height={500}
    />
  )

  return (
    <div className="sequencing-runs">
      <Widgets
        title="Sequencing Requests"
        components={[filters]}
      />
      <Widgets
        components={[chart, table]}
      />
    </div>
  );
}
export default SequencingRequests;
