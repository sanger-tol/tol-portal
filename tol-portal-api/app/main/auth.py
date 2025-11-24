# SPDX-FileCopyrightText: 2024 Genome Research Ltd.
#
# SPDX-License-Identifier: MIT

from flask import request

from tol.api_base.auth import AuthInspector, CompositeAuthInspector
from tol.api_base.auth.error import ForbiddenError
from tol.api_base.misc.auth_context import CtxGetter, default_ctx_getter
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
        method: OperatorMethod,
        *args,
        **kwargs
    ) -> None:
        given_api_token = request.headers.get('token')
        if expected_api_token is not None and expected_api_token == given_api_token:
            return
        raise ForbiddenError()

    return auth_inspector


def get_prefect_auth_inspector(
    ctx_getter: CtxGetter = default_ctx_getter
) -> AuthInspector:
    """
    Returns a `AuthInspector` `Callable` that
    required authentication on prefect queries
    """

    def auth_inspector(
        object_type: str,
        method: OperatorMethod,
        *args,
        **kwargs
    ) -> None:
        if not ctx_getter().authenticated:
            raise ForbiddenError()

    return auth_inspector


def get_local_auth_inspector(
    ctx_getter: CtxGetter = default_ctx_getter
) -> AuthInspector:

    WRITE_METHODS = (  # noqa N806
        OperatorMethod.DELETE,
        OperatorMethod.INSERT,
        OperatorMethod.UPDATE,
        OperatorMethod.UPSERT,
    )

    def auth_inspector(
        object_type: str,
        method: OperatorMethod,
        *args,
        **kwargs
    ) -> None:

        if method not in WRITE_METHODS:
            return

        if not ctx_getter().authenticated:
            raise ForbiddenError()

    return auth_inspector


def get_pipeline_auth_inspector(
    ctx_getter: CtxGetter = default_ctx_getter
) -> AuthInspector:
    """
    Returns a `AuthInspector` `Callable` that
    does not require authentication on pipeline step operations
    """

    ALLOWED_METHODS = (
        OperatorMethod.DETAIL,
        OperatorMethod.UPSERT,
        OperatorMethod.INSERT,
    )

    def auth_inspector(
        object_type: str = 'run-pipeline',
        method: list[OperatorMethod] = [OperatorMethod.DETAIL,
                                        OperatorMethod.UPSERT,
                                        OperatorMethod.INSERT],
        *args,
        **kwargs
    ) -> None:
        composite = CompositeAuthInspector(admin_role='admin', ctx_getter=ctx_getter)

        @composite.always
        def allow_upload(
            object_type: str,
            method: OperatorMethod,
            *args,
            **kwargs
        ) -> None:
            if object_type == 'run-pipeline' and method in ALLOWED_METHODS:
                return
            raise ForbiddenError()

    return auth_inspector
