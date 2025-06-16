# SPDX-FileCopyrightText: 2025 Genome Research Ltd.
#
# SPDX-License-Identifier: MIT

from typing import Any

from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base


class Pipeline(Base):
    __tablename__ = 'pipeline'

    id: Mapped[str] = mapped_column(primary_key=True)

    validation_results: Mapped[list[dict[str, Any]]] = mapped_column(
        type_=JSONB,
        nullable=False,
        default=[],
    )
