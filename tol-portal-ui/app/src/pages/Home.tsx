/*
 * SPDX-FileCopyrightText: 2023 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import { CentreContents } from '@tol/tol-ui'


function Home() {
	return (
		<div className="home">
			<CentreContents>
      <p>Please use the menu above to view data. This site is still being built,
          so please don't rely on anything just yet!
        </p>
				<p>This front page will probably become a dashboard.
        </p>
			</CentreContents>
		</div>
	);
}
export default Home;