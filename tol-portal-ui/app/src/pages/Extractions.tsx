/*
 * SPDX-FileCopyrightText: 2023 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import { RemoteTable,
         RemoteMultipleSelectFilters,
         RemoteBarChart,
         Widgets } from '@tol/tol-ui';
import { useState } from 'react';


function Extractions() {
  const [globalFilters, setGlobalFilters] = useState<object>({in_list: {}});
  const [combinedFilters, setCombinedFilters] = useState<object>({});

  const filters = (
    <RemoteMultipleSelectFilters
      endpoint="extraction"
      fields={["benchling_extraction_type"]}
      renamedFields={{
        benchling_extraction_type: "Extraction Type"
      }}
      globalFilters={globalFilters}
      setGlobalFilters={setGlobalFilters}
    />
  );

  const chart = (
    <RemoteBarChart
      stacked
      title="Extractions"
      endpoint="extraction"
      breakDownBy="benchling_extraction_type"
      xAxis="benchling_completion_date"
      interval="M"
      filter={globalFilters}
      setCombinedFilters={setCombinedFilters}
      type='date'
      height={500}
    />
  );

  const table = (
    <RemoteTable
      id="extraction-table-v2"
      endpoint="extraction"
      filter={combinedFilters}
      defaultSort="benchling_species.sts_scientific_name"
      fields={{
        "uid": {
          rename: "Identifier"
        },
        "benchling_species.sts_scientific_name": {
          rename: "Species",
          cellRenderer: "relationshipDetail"
        },
        "benchling_tolid.id": {
          rename: "ToLID (Benchling)"
        },
        "benchling_completion_date": {
          rename: "Date Completed (Benchling)",
          sort: true
        }
      }}
      height={500}
    />
  );

  return (
    <div className="extractions">
      <Widgets
        title="Extractions"
        components={[filters]}
      />
      <Widgets
        components={[chart]}
      />
      <Widgets
        components={[table]}
      />
    </div>
  );
}

export default Extractions;
