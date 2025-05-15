/*
SPDX-FileCopyrightText: 2025 Genome Research Ltd.

SPDX-License-Identifier: MIT
*/

interface Props {
  doi: string;
  displayName?: string; // Optional display name
}

function DOI({ doi, displayName }: Props) {
  if (!doi) {
    return null; // Return null if no DOI is provided
  }

  // Fallback to DOI if displayName is not provided
  const linkText = displayName || doi; 

  return (
    <a
      href={`https://doi.org/${doi}`}
      target="_blank"
      rel="noopener noreferrer"
      className="doi-link"
      aria-label={`DOI link to ${linkText}`}
    >
      {linkText}
    </a>
  );
}

export default DOI;
