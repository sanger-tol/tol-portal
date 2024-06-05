# SPDX-FileCopyrightText: 2023 Genome Research Ltd.
#
# SPDX-License-Identifier: MIT

from typing import List

from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


class Gal(Base):
    __tablename__ = 'gal'
    gal_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(nullable=False)
    abbreviation: Mapped[str] = mapped_column(unique=True, nullable=False)
    desc: Mapped[str] = mapped_column()
    gal_type: Mapped[str] = mapped_column('type', nullable=False)

    samples: Mapped[List['Sample']] = \
        relationship(back_populates='gal')  # noqa F821

    samplesets: Mapped[List['Sampleset']] = \
        relationship(back_populates='gal')  # noqa F821

    @classmethod
    def get_id_column_name(cls) -> str:
        return 'gal_id'
