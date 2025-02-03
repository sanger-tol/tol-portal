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
    rootNode: OrgTreeNode
    selected: Set<number>
    addSelected: (nodeId: number) => void
}

export default function OrgTree(props: Props) {
    const {
        rootNode,
        selected,
        addSelected
    } = props;

  const rootIsSelected = selected.has(rootNode.id);

  const getNodeClass = (isSelected: boolean, underSelected: boolean): string => {
    if (isSelected === true) return 'org-node org-node-selected'

    return (underSelected === true) ? 'org-node org-node-under': 'org-node';
  }
 
  const hoverNode = (nodeId: number, children: any): HoverOverlay => (
    <HoverOverlay
      children={children}
      contents={<div>{nodeId}</div>}
    >
    </HoverOverlay>
  );

  const dumpNode = (orgNode: OrgTreeNode, underSelected: boolean) => {
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

  const rootClassName = getNodeClass(rootIsSelected, false);
  const selectRoot = () => addSelected(rootNode.id);

  const rootLabel = hoverNode(
    rootNode.id,
    (
      <div className={rootClassName} onClick={selectRoot}>{rootNode.name}</div>
    )
  );

  return (
    <Tree label={rootLabel} key={rootNode.id}>
      {
        rootNode.children.map(c => dumpNode(c, rootIsSelected))
      }
    </Tree>
  );
}
