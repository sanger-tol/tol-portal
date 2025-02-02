/*
 * SPDX-FileCopyrightText: 2023 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import React, {useEffect, useState} from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';

interface OrgTreeNode {
  id: string
  name: string
  children: OrgTreeNode[]
}

export default function Org() {

  const [rootNode, setRootNode] = useState<OrgTreeNode | null>(null);
  
  const dumpNode = (orgNode: OrgTreeNode): TreeNode => {
    return (
      <TreeNode key={orgNode.id} label={<div>{orgNode.name}</div>}>
        {
          orgNode.children.map(
            childNode => dumpNode(childNode)
          )
        }
      </TreeNode>
    )
  }

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
    <Tree label={<div>Sanger</div>} key={rootNode.id}>
      {
        rootNode.children.map(dumpNode)
      }
    </Tree>
  )
}

