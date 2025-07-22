# SPDX-FileCopyrightText: 2025 Genome Research Ltd.
#
# SPDX-License-Identifier: MIT

from unittest.mock import create_autospec

from main.auth import get_local_auth_inspector

import pytest

from tol.api_base.auth.error import ForbiddenError
from tol.api_base.misc.auth_context import AuthContext
from tol.core.operator import OperatorMethod


@pytest.fixture
def anonymous_context() -> AuthContext:
    ctx: AuthContext = create_autospec(
        AuthContext,
        spec_set=True,
    )

    ctx.authenticated = False

    return ctx


@pytest.fixture
def logged_in_context() -> AuthContext:
    ctx: AuthContext = create_autospec(
        AuthContext,
        spec_set=True,
    )

    ctx.authenticated = True

    return ctx


class TestAuthInspector:

    def test_unauthenticated_readonly(
        self,
        anonymous_context: AuthContext
    ) -> None:

        inspector = get_local_auth_inspector(
            ctx_getter=lambda: anonymous_context,
        )

        inspector('test', OperatorMethod.COUNT)

        with pytest.raises(ForbiddenError):
            inspector('test', OperatorMethod.DELETE)

    def test_logged_in_write(
        self,
        logged_in_context: AuthContext
    ) -> None:

        inspector = get_local_auth_inspector(
            ctx_getter=lambda: logged_in_context,
        )

        inspector('test', OperatorMethod.COUNT)

        inspector('test', OperatorMethod.UPDATE)