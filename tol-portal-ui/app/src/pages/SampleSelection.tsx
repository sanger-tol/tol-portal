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
            'calc_is_novel': { 'eq': { 'value': true } },
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
            "tolid_prefix",
            "sts_scientific_name",
            "sts_sample_sts_project_union",
            "sts_sample_sts_priority_min",
            "goat_family_name",
            "sts_sample_sts_receive_date_min",
            "sts_sample_sts_banked_sample_category_union"
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
            'calc_mlwh_volume_remaining': { 'gt': { 'value': 0.0 } },
            'benchling_tolid.calc_topup_required': { 'eq': { 'value': true } },
            'benchling_tolid.calc_tolid_actionable': { 'eq': { 'value': true } },
            'benchling_sequencing_platform': { 'in_list': { 'value': ['pacbio'], 'negate': false } }
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
    }
  })


  const sampleTable = (
    <RemoteTable
      //noConfigModal
      id="sample"
      displaySource
      defaultSortByAttribute="benchling_tolid.id"
      fields={{
        order: {
          active: [
            "benchling_tolid.id",
            "benchling_species.goat_genome_size",
            "benchling_tolid.calc_coverage",
            "benchling_tolid.informatics_gscope_coverage",
            "benchling_species.sts_sample_sts_priority_min",
            "benchling_tolid.sts_sample_sts_project_union",
            "mlwh_volume_remaining",
            "benchling_species.goat_ploidy",
            "benchling_disruption_method",
            "tolqc_run_data_tolqc_bases_sum",
            "benchling_tolid.informatics_status_summary",
            "id",
            "mlwh_source_barcode",
            "mlwh_run_data_mlwh_pac_bio_library_tube_name_union",
            "benchling_extraction.benchling_extraction_type",
          ],
        },
      }}
      actions={['Request Resequencing', 'Mark as Not Valid']}
      rowSelection={true}
      {...sample}
    />
  );

  const ModalContent = (
    <div className="help-documentation" style={{ maxWidth: '95%' }}>
      <h6>Overview</h6>
      <p>
        The Top-Up Management system helps identify and process ToLIDs that need additional
        sequencing to meet their coverage targets. The tables are organized in order of processing
        priority, from most processed material (Library) to least processed (Sample in STS).
      </p>

      <h6>Key Fields</h6>
      <ul>
        <li><strong>Estimated Coverage Met</strong>: Determined based on the basis Cumulative Yield per Estimated Species Genome Size must be less than Target Coverage</li>
        <li><strong>Top-Up Required</strong>: First level of filtering, ensuring the ToLID has history of completed sequencing, are still in data generation stage, and has not met coverage</li>
        <li><strong>Max Volume/Weight Remaining</strong>: Amount of maximum material available at each processing stage for a particular ToLID</li>
        <li><strong>Individual Exhausted</strong>: Indicates all material for this ToLID is used up</li>
        <li><strong>Other Individual Available</strong>: Indicates alternative samples exist for the same species</li>
      </ul>

      <h6>Workflow Process</h6>
      <ol>
        <li>Start with the Top-Up Required table to identify ToLIDs needing additional sequencing.</li>
        <li>
          Check tables in order (Library → DNA → Tissue Prep → Tissue → Sample) to find the
          most processed material available.
        </li>
        <li>
          Take the appropriate action based on available material:
          <ul>
            <li>Library available → Request resequencing</li>
            <li>DNA available → Insert into LI/ULI work list</li>
            <li>Tissue prep available → Insert into Tissue Prep work list</li>
            <li>Tissue in Benchling available → Insert into Benchling Tissue work list</li>
            <li>Sample in STS available → Export to Benchling</li>
          </ul>
        </li>
        <li>
          If all materials for an individual are exhausted, check for samples from other individuals
          in the "Sample from Other Individual Available" table.
        </li>
        <li>
          If all individuals of a species are exhausted, mark the species for recollection.
        </li>
      </ol>

      <h6>Common Actions</h6>
      <p style={{ marginBottom: '8px' }}><strong><u>Requesting Resequencing</u></strong></p>
      <p>Use when library material is available and you want to request additional sequencing.</p>

      <p style={{ marginBottom: '8px' }}><strong><u>Inserting into Work Lists</u></strong></p>
      <ul>
        <li><strong>LI Work List</strong>: DNA extractions for library prep using LI protocol</li>
        <li><strong>ULI Work List</strong>: DNA extractions for library prep using ULI protocol</li>
        <li><strong>Tissue Prep Work List</strong>: Tissues ready for preparation</li>
        <li><strong>Benchling Tissue Work List</strong>: Tissue samples in Benchling</li>
      </ul>

      <p style={{ marginBottom: '8px' }}><strong><u>Exporting into Benchling</u></strong></p>
      <p>Exports samples from STS into Benchling for processing.</p>

      <p style={{ marginBottom: '8px' }}><strong><u>Marking as Not Valid</u></strong></p>
      <p>Marks a record as 'Not Valid' when it's not suitable for processing. This will cause it to be removed from the current table and repopulate another table for less processed material (if available).</p>

      <p style={{ marginBottom: '8px' }}><strong><u>Marking for Recollection</u></strong></p>
      <p>Used when all individuals of a species are exhausted and new specimens need to be collected.</p>

      <h6>Best Practices</h6>
      <ol>
        <li>
          Process materials in table order (Library → DNA → Tissue Prep → Benchling Tissue → STS Sample)
          to minimize processing steps.
        </li>
        <li>
          Use "Mark as Not Valid" for unsuitable entries to ensure accurate tracking.
        </li>
        <li>
          Actioning multiple items at once is possible, and preferable than actioning items individual.
        </li>
        <li>
          Wait for a few minutes after setting actions to ensure the system updates the tables correctly.
        </li>
        <li>
          If you encounter issues, please contact the TOLP team for assistance.
        </li>
      </ol>
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
      component: tableTitle('Library Remaining',
        'Sequencing requests with library material remaining (≥ 0 units). This is the preferred option as it requires the least processing.'),
      type: 'full'
    },
    {
      component: sampleTable,
      type: 'xl'
    },
  ];

  return (
    <div className="tum">
      {HelpModal}
      <Widgets
        components={components}
      />
    </div>
  );
}
export default SampleSelection;


// Volme Lib Rem = mlwh_volume_remaining
// DNA Rem = benchling_volume_ul
// Tissue Prep Rem = benchling_weight_mg
// Sample Rem = benchling_remaining_weight
