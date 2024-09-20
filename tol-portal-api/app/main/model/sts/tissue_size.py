# SPDX-FileCopyrightText: 2023 Genome Research Ltd.
#
# SPDX-License-Identifier: MIT

from typing import List

from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


class TissueSize(Base):
    __tablename__ = 'tissue_size'
    size_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    size: Mapped[str] = mapped_column(nullable=False)

    samples: Mapped[List['Sample']] = \
        relationship(back_populates='tissue_size')  # noqa F821

    @classmethod
    def get_id_column_name(cls) -> str:
        return 'size_id'
