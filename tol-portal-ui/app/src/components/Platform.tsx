/*
SPDX-FileCopyrightText: 2023 Genome Research Ltd.

SPDX-License-Identifier: MIT
*/

function platformToCss(platform: string) {
  platform = platform.toLowerCase();
  switch(platform) {
  case "hic":
    return {backgroundColor: "rgba(255,0,0,0.4)", borderColor: "rgba(255,0,0,0.6)"};
  case "pacbio":
    return {backgroundColor: "rgba(217,23,139,0.4)", borderColor: "rgba(217,23,139,0.6)"};
  case "rnaseq":
    return {backgroundColor: "rgba(62,207,182,0.4)", borderColor: "rgba(62,207,182,0.6)"};
  case "illumina":
    return {backgroundColor: "rgba(190,150,0,0.4)", borderColor: "rgba(190,150,0,0.6)"};
  default:
    return {};
  }
}

interface Props {
  platform: string
}

function Platform(props: Props) {
  const { platform } = props;
  if (platform === null || platform === "") {
    return <></>;
  }

  return (
    <div
      className="enum-box"
      style={platformToCss(platform) as object}
    >
      {platform}
    </div>
  );
}

export default Platform;
