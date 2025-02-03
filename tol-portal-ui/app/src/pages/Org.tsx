/*
 * SPDX-FileCopyrightText: 2023 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import React, {useEffect, useState} from 'react';
import OrgTree from '../components/OrgTree';

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
    <OrgTree
      rootNode={rootNode}
      selected={selected}
      resetSelected={resetSelected}
      addSelected={addSelected}
    >
    </OrgTree>
  )
}
