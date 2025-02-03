/*
 * SPDX-FileCopyrightText: 2023 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import React, {useEffect, useState} from 'react';

import { Button, Widgets } from '@tol/tol-ui';

import OrgTree from '../components/OrgTree';
import { OrgTreeNode } from '../models';
import OrgTreeActive from '../components/OrgTreeSelected';


export default function Org() {

  const [rootNode, setRootNode] = useState<OrgTreeNode | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const resetSelected = (): void => setSelected(new Set());

  const addSelected = (updated: number): void => setSelected(
    new Set([...selected, updated])
  )

  useEffect(
    () => {
      fetch(
        // TODO use proper config with API_PATH
        '/api/v1/auth/org'
      ).then(
        res => res.json()
      ).then(
        data => {
          setRootNode(data)
        }
      );
    },
    []
  );

  if (rootNode === null) return (<h1>Loading....</h1>);

  const resetButton = (
    <Button
      text="Reset"
      onClick={resetSelected}
      position='right'
      icon='arrows-spin'
      size='lg'
    />
  );

  const tree = (
    <OrgTree
      rootNode={rootNode}
      selected={selected}
      addSelected={addSelected}
    />
  );

  const activeTable = (
    <OrgTreeActive
      rootNode={rootNode}
      selected={selected}
    />
  );

  const components = [
    {
      component: resetButton,
      type: 'full'
    },
    {
      component: tree,
      type: 'full'
    },
    {
      component: activeTable,
      type: 'full'
    }
  ];


  return (
    <div className="barcharts">
      <Widgets
        components={components}
      />
    </div>
  );
}
