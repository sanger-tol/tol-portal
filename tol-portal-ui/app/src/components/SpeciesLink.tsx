/*
SPDX-FileCopyrightText: 2023 Genome Research Ltd.

SPDX-License-Identifier: MIT
*/

import { Link } from "react-router-dom";

interface Props {
  id: string,
  name: string
}

function SpeciesLink(props: Props) {
  const { id, name } = props;
  if (id === null) {
    return <></>;
  }

  return (
    <Link to={'/species/' + id}>
      {name}
    </Link>
  );
}

export default SpeciesLink;
