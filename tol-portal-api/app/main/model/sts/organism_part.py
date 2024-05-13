# SPDX-FileCopyrightText: 2024 Genome Research Ltd.
#
# SPDX-License-Identifier: MIT

from typing import List

from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


class OrganismPart(Base):
    __tablename__ = 'organism_part'
    opart_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(nullable=False)

    sample_species_organism_parts: Mapped[List['SampleSpeciesOrganismPart']] = \
        relationship(back_populates='organism_part')  # noqa F821

    @classmethod
    def get_id_column_name(cls) -> str:
        return 'opart_id'
