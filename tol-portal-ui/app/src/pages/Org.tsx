/*
 * SPDX-FileCopyrightText: 2023 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import React, {useEffect, useState} from 'react';
import OrgTree from '../components/OrgTree';

import { OrgTreeNode } from '../models';
import OrgTreeSelected from '../components/OrgTreeSelected';


export default function Org() {

  const [rootNode, setRootNode] = useState<OrgTreeNode | null>(null);
  const [selected, setSelected] = useState<Set<Number>>(new Set());

  const resetSelected = (): void => setSelected(new Set());

  const addSelected = (updated: number): void => setSelected(
    new Set([...selected, updated])
  )

  useEffect(
    () => fetch(
      // TODO use proper config with API_PATH
      '/api/v1/auth/org'
    ).then(
      res => res.json()
    ).then(
      data => setRootNode(data)
    ),
    []
  );

  return (
    <div>
      <OrgTree
        rootNode={rootNode}
        selected={selected}
        resetSelected={resetSelected}
        addSelected={addSelected}
      >
      </OrgTree>

      <OrgTreeSelected
        rootNode={rootNode}
        selected={selected}
      >
      </OrgTreeSelected>
    </div>

  )
}
