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

interface UnderSelected {
  id: Number
  name: string
  under: boolean
}

export default function Org() {

  const [rootNode, setRootNode] = useState<OrgTreeNode | null>(null);
  const [selected, setSelected] = useState<Set<Number>>(new Set());

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

  const getUnderSelected = (): UnderSelected[] => {

    const _getUnder = (currentNode: OrgTreeNode, isAlreadyUnder: boolean): UnderSelected[] => {
      const isInSelected = selected.has(currentNode.id);
      const isNowUnder = isAlreadyUnder || isInSelected
      const childrenReturns = currentNode.children.map(
        (childNode: OrgTreeNode) => _getUnder(childNode, isNowUnder)
      );
      const mergedReturn = childrenReturns.reduce(
        (acc, childReturn) => [...acc, ...childReturn],
        []
      );

      return [
        {
          id: currentNode.id,
          name: currentNode.name,
          under: isNowUnder
        },
        ...mergedReturn
      ];
    }

    return _getUnder(rootNode, selected.size === 0);
  };

  const underSelected = rootNode === null ? null : getUnderSelected();
  console.log(selected, underSelected);

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
