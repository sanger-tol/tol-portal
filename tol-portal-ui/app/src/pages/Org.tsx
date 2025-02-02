/*
 * SPDX-FileCopyrightText: 2023 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import React, {useEffect, useState} from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';

import { HoverOverlay } from '@tol/tol-ui';

interface OrgTreeNode {
  id: Number
  name: string
  children: OrgTreeNode[]
}

export default function Org() {

  const [rootNode, setRootNode] = useState<OrgTreeNode | null>(null);
  const [selected, setSelected] = useState<Number | null>(null);

  const getNodeClass = (isSelected: boolean, underSelected: boolean): string => {
    if (isSelected === true) return 'org-node org-node-selected'

    return (underSelected === true) ? 'org-node org-node-under': 'org-node';
  }
 
  const hoverNode = (nodeId: Number, children): HoverOverlay => (
    <HoverOverlay
      children={children}
      contents={<div>{nodeId}</div>}
    >
    </HoverOverlay>
  );

  const dumpNode = (orgNode: OrgTreeNode, underSelected: boolean = false): TreeNode => {
    const isSelected = selected === orgNode.id;
    const nodeClass = getNodeClass(isSelected, underSelected);
  
    const children = (
      <div className={nodeClass} onClick={() => updateSelected(orgNode.id)}>{orgNode.name}</div>
    )

    const label: HoverOverlay = hoverNode(orgNode.id, children)

    return (
      <TreeNode key={orgNode.id} label={label}>
        {
          orgNode.children.map(
            childNode => dumpNode(childNode, isSelected || underSelected)
          )
        }
      </TreeNode>
    );
  }

  const resetSelected = (): void => setSelected(null);

  const updateSelected = (updated: number): void => {
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

  const rootLabel = rootNode === null ? null : hoverNode(
    rootNode.id,
    (
      <div className="org-node org-node-root" onClick={resetSelected}>Sanger</div>
    )
  );

  return rootNode === null ? (<h1>Loading....</h1>) : (
    <Tree label={rootLabel} key={rootNode.id}>
      {
        rootNode.children.map(dumpNode)
      }
    </Tree>
  );
}
