/*
 * SPDX-FileCopyrightText: 2025 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import { useRef } from 'react';
import {
  RemoteTable,
  StaticMessage,
  Widgets,
  useZone
} from '@tol/tol-ui';
  
  
function CoreLabData() {
  const CORELAB_WARNING =
    "This view is still in development and will display more information soon";

  const title = (
    <div>
      <h2>ToL Core Lab Extraction Data</h2>
    </div>
  );

  const defaultFilter = {
    and_: {
      "benchling_extraction_type": {"in_list": {"negate": true, "value": ["rna"]}}
    }
  };

  const extractions = useZone({
    endpoint: 'extraction',
    filter: defaultFilter,
    components: [
      {
        id: 'extraction-table',
      }
    ]
  });


  //Visible fields
  const visibleFields = {
    "benchling_completion_date": {},
    "benchling_species.sts_scientific_name": {},
    "benchling_tolid.id": {},
    "benchling_sample.sts_organism_part": {},
    "benchling_sample.sts_lifestage": {},
    "benchling_sample.sts_sex": {},
    "benchling_sample.sts_preservation_approach": {},
    "benchling_species.sts_genome_size": {},
    "benchling_tolid.benchling_tissue_prep_benchling_weight_mg_max": {},
    "benchling_eln_file_registry_id": {},
    "mlwh_nanodrop_concentration_ngul_value": {},
    "mlwh_gqn_dnaex_value": {},
    "benchling_yield_ng": {},
    "benchling_femto_description": {},
    "benchling_species.sts_taxon_group": {},
    "benchling_species.sts_order_group": {},
    "benchling_species.sts_family": {},
    "benchling_species.sts_genus": {},
    "benchling_extraction_type": {},
    "benchling_extraction_qc_result": {}
  };
  
  // Hidden fields
  const hiddenFields = {};
  
  const fields = {
      ...visibleFields,
      ...hiddenFields,
  };
  
  const table = (
    <RemoteTable
    id="extraction-table"
    defaultSort="benchling_completion_date"
    fields={fields}
    height={500}
    {...extractions}
  />
);
  
  const components = [
    {
      component: title,
      type: 'full'
    },
    {
      component: table,
      type: 'full'
    }
  ];

  return (
    <div>
      <div style={{ padding: "0px 10px" }}>
        <StaticMessage message={CORELAB_WARNING} type={"warning"}/>
      </div>
      <Widgets
        components={components}
      />
    </div>
  );
}
  
export default CoreLabData;
