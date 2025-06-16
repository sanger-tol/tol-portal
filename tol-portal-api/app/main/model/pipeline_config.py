# SPDX-FileCopyrightText: 2025 Genome Research Ltd.
#
# SPDX-License-Identifier: MIT

from typing import Any

from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base


class Pipeline(Base):
    __tablename__ = 'pipeline_config'

    id: Mapped[str] = mapped_column(primary_key=True)

    steps: Mapped[dict[str, Any]] = mapped_column(
        type_=JSONB,
        nullable=False,
        default_factory=lambda: {},
    )
