# SPDX-FileCopyrightText: 2023 Genome Research Ltd.
#
# SPDX-License-Identifier: MIT

from typing import List

from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


class Lifestage(Base):
    __tablename__ = 'lifestage'
    lifestage_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(nullable=False)
    living: Mapped[str] = mapped_column()
    desc: Mapped[str] = mapped_column()

    sample_species: Mapped[List['SampleSpecies']] = \
        relationship(back_populates='lifestage')  # noqa F821

    @classmethod
    def get_id_column_name(cls) -> str:
        return 'lifestage_id'
