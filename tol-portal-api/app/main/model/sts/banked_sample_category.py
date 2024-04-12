# SPDX-FileCopyrightText: 2024 Genome Research Ltd.
#
# SPDX-License-Identifier: MIT

from typing import List

from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


class BankedSampleCategory(Base):
    __tablename__ = 'banked_sample_category'

    category_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(nullable=False)

    banked_samples: Mapped[List['BankedSample']] \
        = relationship(back_populates='category')  # noqa F821

    @classmethod
    def get_id_column_name(cls) -> str:
        return 'category_id'
