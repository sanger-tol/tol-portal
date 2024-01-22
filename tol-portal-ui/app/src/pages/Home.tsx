/*
 * SPDX-FileCopyrightText: 2023 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import { Button,
				 RemoteBarChart,
         RemoteSunburst,
				 RemoteTable,
         Widgets,
				 Row,
				 Col } from '@tol/tol-ui'


const getGreeting = () => {
	const hour = new Date().getHours()
	if (hour < 12) {
		return "Good morning - have a great day."
	} else if (hour >= 17) {
		return "Good evening."
	} else if (hour >= 12) {
		return "Good afternoon."
	}
}

const button = (
	<Button
		href="https://docs.google.com/forms/d/e/1FAIpQLSdNpKVAPXCZVkY0cnM94_r3jYQfBVFyEBimE_f-bZIUX-23ng/viewform?usp=sf_link"
		style={{float: "right"}}
	>
		Provide Feedback
	</Button>
)

const title = (
	<span>
		<h2>{getGreeting()}</h2>
		<p className='mt-2'>
			Welcome to ToL Portal, the home of Tree of Life data.
		</p>
	</span>
)

const intro = (
	<Row>
		<Col xs={12} sm={8}>{title}</Col>
		<Col xs={12} sm={4}>{button}</Col>
	</Row>
)

const runChart = (
	<RemoteBarChart
		stacked
		title="Run Complete Data"
		endpoint="run_data"
		breakDownBy="mlwh_instrument_model"
		xAxis="mlwh_run_complete"
		interval="M"
		type='date'
		height={500}
	/>
)

const sampleChart = (
	<RemoteBarChart
		stacked
		title="Samples Recieved"
		endpoint="sample"
		breakDownBy="sts_ac_status"
		xAxis="benchling_date_sample_received_at_sanger"
		interval="M"
		type='date'
		height={500}
	/>
)

const speciesSunburst = (
  <RemoteSunburst
    title="Species"
    endpoint="species"
    sliceBy={["sts_order_group", "sts_family"]}
    height={500}
		legendPosition="left"
  />
)

const speciesTable = (
  <RemoteTable
		id="species-home-table-v2"
    endpoint="species"
    height={500}
    fields={{
      "uid": {
        rename: "Taxonomy ID"
      },
      "sts_scientific_name": {
        rename: "Scientific Name"
      },
      "sts_family": {
        rename: "Family"
      },
      "sts_order_group": {
        rename: "Order"
      },
      "sts_prefix": {
        rename: "ToLID prefix"
      },
    }}
  />
)

function Home() {
  return (
    <div className="species">
			<Widgets components={[intro]}/>
      <Widgets components={[
				speciesSunburst,
				runChart,
				sampleChart,
				speciesTable
			]}/>
    </div>
  );
}
export default Home;