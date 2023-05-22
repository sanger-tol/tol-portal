/*
 * SPDX-FileCopyrightText: 2023 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import { CentreContents, AutoTable } from '@tol/tol-ui'


function Home() {
	return (
		<div className="home">
			<CentreContents>
				<AutoTable
					endpoint="species"
					fields={{
						"id": {
							rename: "Taxonomy ID"
						},
						"tolid_name": {
							rename: "Scientific Name"
						},
						"tolid_prefix": {
							rename: "ToLID Prefix"
						},

					}}
				/>
			</CentreContents>
		</div>
	);
}
export default Home;