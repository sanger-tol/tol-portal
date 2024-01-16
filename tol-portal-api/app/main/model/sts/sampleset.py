# SPDX-FileCopyrightText: 2023 Genome Research Ltd.
#
# SPDX-License-Identifier: MIT

from typing import List

from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


class Sampleset(Base):
    __tablename__ = 'sampleset'

    sampleset_id: Mapped[str] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(nullable=False, unique=True)

    samples: Mapped[List['Sample']] \
        = relationship(back_populates='sampleset')  # noqa F821

    @classmethod
    def get_id_column_name(cls) -> str:
        return 'name'
