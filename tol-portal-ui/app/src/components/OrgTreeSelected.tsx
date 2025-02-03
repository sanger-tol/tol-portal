/*
 * SPDX-FileCopyrightText: 2023 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

import React from 'react';

import { OrgTreeNode } from '../models';

interface UnderSelected {
  id: Number
  name: string
  under: boolean
}

interface Props {
    rootNode: OrgTreeNode | null
    selected: Set<Number>
}

export default function OrgTreeSelected(props: Props) {
    const {selected, rootNode} = props;

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

    return (
        <div></div>
    )
}
