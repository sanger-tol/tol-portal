/*
SPDX-FileCopyrightText: 2023 Genome Research Ltd.

SPDX-License-Identifier: MIT
*/

import React from 'react';

import { Status } from '@tol/tol-ui';


function setStatusType(status: boolean) {
  switch(status) {
    case true:
      return 'success';
    default:
      return 'danger';
  }
}

function setStatusText(status: boolean) {
  switch(status) {
    case true:
      return 'True';
    default:
      return 'False';
  }
}

interface Props {
  status: boolean
}

function BooleanStatus(props: Props) {
  const status = props.status
  if (status === null) {
    return <></>
  }

  console.log(status)

  return (
    <Status
      text={setStatusText(status)}
      status={setStatusType(status)}
    />
  );
}

export default BooleanStatus;
