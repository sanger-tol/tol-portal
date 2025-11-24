/*
 * SPDX-FileCopyrightText: 2025 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import { useState } from 'react';
import { RemoteTable, Widgets, useZone, useTranslator, Button, Modal, IconTooltip } from '@tol/tol-ui';
import { ELASTIC_DS } from '..';

// Table 1
function SampleSelection() {
  const [showModal, setShowModal] = useState(false);

  const species = useZone({
    objectType: 'species',
    dataSource: ELASTIC_DS,
    components: [
      {
        id: 'species',
        filter: {
          and_: {
          }
        }
      }
    ]
  });

  const speciesTable = (
    <RemoteTable
      //noConfigModal
      id="species"
      displaySource
      defaultSortByAttribute="sts_sample_sts_priority_min"
      fields={{
        data: {
          "goat_scientific_name": {
            cellRenderer: {
              type: "link",
              props: {
                url: "/species/${id}",
                text: "${goat_scientific_name}"
              }
            }
          },
        },
        order: {
          active: [
            "calc_is_novel",
            "sts_sample_sts_project_union",
            "sts_sample_sts_priority_min",
            "tolid_prefix",
            "sts_scientific_name",
            "sts_sample_sts_banked_sample_category_union",
            "goat_family_name",
            "sts_sample_sts_receive_date_min"
          ],
        },
      }}
      actions={[]}
      rowSelection={true}
      {...species}
    />
  );

  // Table 2
  const sample = useZone({
    objectType: 'sample',
    dataSource: ELASTIC_DS,
    components: [
      {
        id: 'sample',
        filter: {
          and_: {
          }
        }
      }
    ]
  });

  useTranslator({
    source: species,
    target: sample,
    translations: {
      "id": "sts_species.id",
      "sts_sample_sts_project_union": "sts_project",
      "tolid_prefix": "sts_species.tolid_prefix",
      "sts_scientific_name": "sts_species.sts_scientific_name",
      "goat_family_name": "sts_species.goat_family_name",
    }
  })


  const sampleTable = (
    <RemoteTable
      //noConfigModal
      id="sample"
      displaySource
      defaultSortByAttribute="sts_priority"
      fields={{
        data: {
          "sts_tubeid": {
            cellRenderer: {
              type: "trafficLightStatus",
              props: {
                danger: {and_: {
                  "benchling_eln_tissue_id": {"exists": {}},
                }}
              }
            }
          },
        },
        order: {
          active: [
            "sts_project",
            "sts_priority",
            "sts_tolid.id",
            "sts_scientific_name",
            "sts_tubeid",
            "sts_sampleset.id",
            "benchling_remaining_weight",
            "calc_sts_export_eligible",
            "sts_species.goat_family_name",
            "sts_rackid",
            "sts_sex",
            "sts_tissue_size",
            "sts_organism_part",
            "sts_receive_date",
            // Need date released to lab
            "sts_banked_sample_category",
            "sts_other_info",
          ],
        },
      }}
      actions={['LRES - DNA extraction (NEW)',
        'LRES - DNA extraction',
        'LRES - DNA extraction + HiC (NEW)',
        'LRES - DNA extraction + HiC',
        'HiC (NEW)',
        'HiC',
        'HiC only (NEW)',
        'HiC only',
        'HiC + RNA (NEW)',
        'HiC + RNA',
        'RNA (NEW)',
        'RNA',
        'PiMmS (NEW)',
        'PiMmS',
        'Export into Benchling',
        'Mark as Not Valid']}
      rowSelection={true}
      {...sample}
    />
  );

  const ModalContent = (
    <div className="help-documentation" style={{ maxWidth: '95%' }}>
      <h6>Overview</h6>
      <p>
        The Sample Selection process .....
      </p>
      </div>
  );


  const HelpModal = (
    <Modal header={<h6></h6>}
      open={showModal}
      setOpen={setShowModal}
      children={ModalContent}
    />
  )

  const title = (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h2>Sample Selection</h2>
      <Button type='primary' text='Help' onClick={() => setShowModal(true)} />
    </div>
  );

  const tableTitle = (text: string, tooltipContent: string) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h6 style={{ marginBottom: '0px' }}>{text}</h6>
      <IconTooltip contents={tooltipContent} />
    </div>
  );

  const components = [
    {
      component: title,
      type: 'full'
    },
    {
      component: tableTitle('Species',
        'Starting point showing all Species marked as novel'),
      type: 'full'
    },
    {
      component: speciesTable,
      type: 'xl'
    },
    {
      component: tableTitle('Samples',
        'Samples for the species'),
      type: 'full'
    },
    {
      component: sampleTable,
      type: 'xl'
    },
  ];

  return (
    <div className="sampleSelection">
      {HelpModal}
      <Widgets
        components={components}
      />
    </div>
  );
}
export default SampleSelection;
