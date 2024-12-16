# SPDX-FileCopyrightText: 2024 Genome Research Ltd.
#
# SPDX-License-Identifier: MIT

from datetime import datetime
from typing import Any

from flask import Blueprint, request

from tol.api_base2.auth import require_auth
from tol.api_base2.misc import (
    CtxGetter,
    default_ctx_getter
)
from tol.core import DataSourceError
from tol.prefect import PrefectDataSource
from tol.sql import SqlDataSource


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

        user_action_params = {
            **params,
            'ids': ids,
        }

        combined_params = {
            **user_action_params,
            **action_params,
            'user_id': user_id
        }

        user_action = sql_ds.data_object_factory(
            'user_action',
            attributes={
                'params': user_action_params,
                'created_at': datetime.now()
            },
            to_one={
                'user': user,
                'action': action
            }
        )
        sql_ds.upsert('user_action', [user_action])

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
