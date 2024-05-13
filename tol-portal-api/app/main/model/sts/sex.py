# SPDX-FileCopyrightText: 2024 Genome Research Ltd.
#
# SPDX-License-Identifier: MIT

from typing import List

from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


class Sex(Base):
    __tablename__ = 'sex'
    sex_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(nullable=False)

    sample_species: Mapped[List['SampleSpecies']] = \
        relationship(back_populates='sex')  # noqa F821

    @classmethod
    def get_id_column_name(cls) -> str:
        return 'sex_id'
