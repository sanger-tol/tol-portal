/*
 * SPDX-FileCopyrightText: 2023 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import React from 'react';

import { OrgTreeNode } from '../models';


interface ActiveStatus {
  id: Number
  name: string
  active: boolean
}

interface Props {
    rootNode: OrgTreeNode
    selected: Set<Number>
}

export default function OrgTreeActive(props: Props) {
    const {selected, rootNode} = props;

    const getActiveStatus = (): ActiveStatus[] => {

        const _getActive = (currentNode: OrgTreeNode, isAlreadyActive: boolean): ActiveStatus[] => {
            const isInSelected = selected.has(currentNode.id);
            const isNowActive = isAlreadyActive || isInSelected
            const childrenReturns = currentNode.children.map(
                (childNode: OrgTreeNode) => _getActive(childNode, isNowActive)
            );
            const mergedReturn = childrenReturns.reduce(
                (acc, childReturn) => [...acc, ...childReturn],
                []
            );


            return [
                {
                    id: currentNode.id,
                    name: currentNode.name,
                    active: isNowActive
                },
                ...mergedReturn
            ];
        }

        const allStatuses = _getActive(rootNode, selected.has(rootNode.id));

        return allStatuses.filter(a => a.active).sort((a, b) => a.id - b.id);
    };

    const active = getActiveStatus();

    return (
        <div className="org-tree-active">
            <h2>Active memberships</h2>

            <table className="org-tree-active-table">
                <tr className="org-tree-active-table-header">
                    <th>Name</th>
                    <th>Membership ID</th>
                </tr>
                {
                    active.map(
                        a => (
                            <tr>
                                <th>{a.name}</th>
                                <th>{a.id}</th>
                            </tr>
                        )
                    )
                }
            </table>
        </div>
    )
}
