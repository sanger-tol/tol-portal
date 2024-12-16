# SPDX-FileCopyrightText: 2024 Genome Research Ltd.
#
# SPDX-License-Identifier: MIT

import json
import logging
from datetime import datetime
from typing import Any, Iterable
# TODO remove
from unittest.mock import create_autospec

from flask import Blueprint, request

from tol.api_base2.auth import require_auth
from tol.api_base2.misc import (
    AuthContext,
    CtxGetter,
    default_ctx_getter
)
from tol.core import DataObject, DataSourceError
from tol.prefect import PrefectDataSource
from tol.sql import SqlDataSource


# TODO remove
def __mock_action(
    id_: str,
    flow_name: str,
    host: SqlDataSource
) -> DataObject:

    mock_obj: DataObject = create_autospec(DataObject)

    mock_obj.type = 'action'
    mock_obj.id = id_
    mock_obj.flow_name = flow_name
    mock_obj.deployment_name = flow_name
    mock_obj.params = {
        'hello_World': True
    }
    mock_obj.attributes = {
        'flow_name': flow_name,
        'deployment_name': flow_name,
        'params': {
            'hello_World': True
        }
    }
    mock_obj._to_one_objects = {}
    mock_obj._host = host

    return mock_obj


# TODO remove
def _mock_sql_ds() -> SqlDataSource:
    mock_ds: SqlDataSource = create_autospec(
        SqlDataSource,
        spec_set=True
    )

    mock_ds.supported_types = ['action', 'user_action']
    mock_ds.attribute_types = {}
    mock_ds.attribute_metadata = {}
    mock_ds.relationship_config = {}
    mock_ds.get_attribute_types.return_value = {}

    mock_actions = [
        __mock_action(
            str(i),
            f'Flow_{c.upper()}',
            mock_ds
        )
        for i, c in enumerate('abc')
    ]

    mock_ds.get_one.side_effect = lambda _, id_: mock_actions[int(id_)]

    mock_ds.get_list_page.return_value = (
        mock_actions,
        3
    )

    def __factory(
        type_: str,
        id_: str | None = None,
        attributes: dict[str, Any] = {},
        **__kwargs
    ) -> DataObject:

        obj: DataObject = create_autospec(DataObject)

        obj.type = type_
        obj.id = id_
        obj.attributes = attributes

        return obj

    mock_ds.data_object_factory = __factory

    return mock_ds


# TODO remove
def _mock_prefect_ds() -> PrefectDataSource:
    mock_ds: PrefectDataSource = create_autospec(
        PrefectDataSource,
        spec_set=True
    )

    def __insert(
        object_type: str,
        objs: Iterable[DataObject],
        **kwargs
    ) -> None:

        logging.error(object_type)
        for obj in objs:
            logging.error(json.dumps(obj.attributes, indent=2))

    mock_ds.insert.side_effect = __insert

    def __factory(
        type_: str,
        id_: str | None = None,
        attributes: dict[str, Any] = {},
        **__kwargs
    ) -> DataObject:

        obj: DataObject = create_autospec(DataObject)

        obj.type = type_
        obj.id = id_
        obj.attributes = attributes

        return obj

    mock_ds.data_object_factory = __factory

    return mock_ds


# TODO remove
def _mock_ctx(
    authenticated: bool = True,
    user_id: str = '1',
    roles: list[str] = ['exporter']
) -> CtxGetter:

    ctx: AuthContext = create_autospec(
        AuthContext,
        spec_set=True
    )

    ctx.authenticated = authenticated
    ctx.user_id = user_id
    ctx.roles = roles

    return ctx


def action_blueprint(
    sql_ds: SqlDataSource,
    prefect_ds: PrefectDataSource,
    url_prefix: str = '/run-action',
    role: str = 'exporter',

    ctx_getter: CtxGetter = default_ctx_getter
) -> Blueprint:
    """
    A flask `Blueprint` providing endpoints
    for applying actions on rows of a table.

    E.g. sending samples to a flow run using
    `PrefectDataSource`.
    """

    bp = Blueprint(
        'actions',
        __name__,
        url_prefix=url_prefix
    )

    check_role = require_auth(
        role=role,
        ctx_getter=ctx_getter
    )

    @bp.post('')
    @check_role
    def action():

        user_id = ctx_getter().user_id

        body: dict[str, Any] = request.json.get('data', {})

        if 'ids' not in body or 'action_id' not in body:
            raise DataSourceError(
                'Bad Request',
                'You must specify both `ids` and `action_id`.',
                400
            )

        ids: list[str] = body['ids']
        action_id: str = body['action_id']
        params: dict[str, Any] = body.get('params', {})

        action = sql_ds.get_one('action', action_id)
        if action is None:
            raise DataSourceError(
                'Not Found',
                'The specified action was not found',
                404
            )

        action_params = (
            action.params
            if action.params is not None
            else {}
        )

        user = sql_ds.get_one('user', user_id)

        user_action = sql_ds.data_object_factory(
            'user_action',
            attributes={
                'params': params,
                'date': datetime.now()
            },
            to_one={
                'user': user,
                'action': action
            }
        )
        sql_ds.upsert('user_action', [user_action])

        combined_params = {
            **params,
            **action_params,
            'user_id': user_id,
            'ids': ids,
        }

        flow_name = action.flow_name
        flow_run = prefect_ds.data_object_factory(
            'flow_run',
            attributes={
                'flow_name': flow_name,
                'deployment_name': flow_name,
                'parameters': combined_params,
                'tags': [
                    'app_name:portal',
                    f'user_id:{user_id}'
                ],
            }
        )

        prefect_ds.insert(
            'flow_run',
            [flow_run]
        )

        return {'success': True}, 200

    return bp
