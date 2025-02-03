/*
 * SPDX-FileCopyrightText: 2025 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */


interface OrgTreeNode {
id: number
name: string
children: OrgTreeNode[]
}

export type { OrgTreeNode };
