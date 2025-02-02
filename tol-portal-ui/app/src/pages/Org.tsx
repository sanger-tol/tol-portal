/*
 * SPDX-FileCopyrightText: 2023 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import React, {useEffect, useState} from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';

interface OrgTreeNode {
  id: Number
  name: string
  children: OrgTreeNode[]
}

export default function Org() {

  const [rootNode, setRootNode] = useState<OrgTreeNode | null>(null);
  const [selected, setSelected] = useState<Number | null>(null);
  
  const dumpNode = (orgNode: OrgTreeNode, underSelected: boolean = false): TreeNode => {
    const isSelected = selected === orgNode.id;

    return (
      <TreeNode key={orgNode.id} label={<div onClick={() => updateSelected(orgNode.id)}>{orgNode.name}</div>}>
        {
          orgNode.children.map(
            childNode => dumpNode(childNode, underSelected || isSelected)
          )
        }
      </TreeNode>
    );
  }

  const resetSelected = (): void => setSelected(null);

  const updateSelected = (updated: string): void => {
    console.log(updated);
    if (updated === selected) return resetSelected();
    setSelected(updated);
  };

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

  return rootNode === null ? (<h1>Loading....</h1>) : (
    <Tree label={<div onClick={resetSelected}>Sanger</div>} key={rootNode.id}>
      {
        rootNode.children.map(dumpNode)
      }
    </Tree>
  )
}
