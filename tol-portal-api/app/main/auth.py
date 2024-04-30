# SPDX-FileCopyrightText: 2024 Genome Research Ltd.
#
# SPDX-License-Identifier: MIT

from flask import request

from tol.api_base2.auth import AuthInspector
from tol.api_base2.auth.error import ForbiddenError
from tol.api_base2.misc.auth_context import CtxGetter, default_ctx_getter
from tol.core.operator import OperatorMethod


def get_auth_inspector(
    expected_api_token: str,
    ctx_getter: CtxGetter = default_ctx_getter
) -> AuthInspector:
    """
    Returns a `AuthInspector` `Callable` that
    requires admin on fetching manifest_submissions
    """

    def auth_inspector(
        object_type: str,
        method: OperatorMethod
    ) -> None:
        given_api_token = request.headers.get('token')
        if expected_api_token is not None and expected_api_token == given_api_token:
            return
        raise ForbiddenError()

    return auth_inspector
