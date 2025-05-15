/*
SPDX-FileCopyrightText: 2025 Genome Research Ltd.

SPDX-License-Identifier: MIT
*/

interface Props {
  doi: string
}

function DOI(props: Props) {
  const { doi, displayName } = props;
  if (doi === null || doi === "") {
    return <></>;
  }

  return (
    <a
      href={`https://doi.org/${doi}`}
      target="_blank"
      rel="noopener noreferrer"
      className="doi-link"
    >
      {displayName}
    </a>
  );
}

export default DOI;
