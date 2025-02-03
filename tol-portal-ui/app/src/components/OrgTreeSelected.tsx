/*
 * SPDX-FileCopyrightText: 2023 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import React from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';

import { HoverOverlay } from '@tol/tol-ui';

import { OrgTreeNode } from '../models';


interface Props {
    rootNode: OrgTreeNode | null
    selected: Set<Number>
    resetSelected: () => void
    addSelected: (nodeId: Number) => void
}

export default function OrgTree(props: Props) {
    const {
        rootNode,
        selected,
        resetSelected,
        addSelected
    } = props;

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
    const isSelected = selected.has(orgNode.id);
    const nodeClass = getNodeClass(isSelected, underSelected);
  
    const children = (
      <div className={nodeClass} onClick={() => addSelected(orgNode.id)}>{orgNode.name}</div>
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
