/*
 * SPDX-FileCopyrightText: 2023 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import React from 'react';

import { OrgTreeNode } from '../models';


interface ActiveStatus {
  id: number
  name: string
  active: boolean
  level: number
}

interface Props {
    rootNode: OrgTreeNode
    selected: Set<number>
}

export default function OrgTreeActive(props: Props) {
    const {selected, rootNode} = props;

    const getActiveStatus = (): ActiveStatus[] => {

        const _getActive = (currentNode: OrgTreeNode, isAlreadyActive: boolean, level: number): ActiveStatus[] => {
            const isInSelected = selected.has(currentNode.id);
            const isNowActive = isAlreadyActive || isInSelected
            const childrenReturns = currentNode.children.map(
                (childNode: OrgTreeNode) => _getActive(childNode, isNowActive, level + 1)
            );
            const mergedReturn = childrenReturns.reduce(
                (acc, childReturn) => [...acc, ...childReturn],
                []
            );


            return [
                {
                    id: currentNode.id,
                    name: currentNode.name,
                    active: isNowActive,
                    level: level
                },
                ...mergedReturn
            ];
        }

        const allStatuses = _getActive(rootNode, selected.has(rootNode.id), 0);

        return allStatuses.filter(
            a => a.active
        ).sort(
            (a, b) => a.level - b.level || a.id - b.id
        );
    };

    const active = getActiveStatus();

    return (
        <div className="org-tree-active">
            <h2>You can access resources in:</h2>

            <table className="org-tree-active-table">
                <tr className="org-tree-active-table-header">
                    <th>Name</th>
                    <th>Level</th>
                    <th>Membership ID</th>
                </tr>
                {
                    active.map(
                        a => (
                            <tr>
                                <th>{a.name}</th>
                                <th>{a.level}</th>
                                <th>{a.id}</th>
                            </tr>
                        )
                    )
                }
            </table>
        </div>
    )
}
