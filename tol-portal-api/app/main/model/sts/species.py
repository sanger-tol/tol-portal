# SPDX-FileCopyrightText: 2023 Genome Research Ltd.
#
# SPDX-License-Identifier: MIT

import datetime
from typing import List

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

# from .sample_species import SampleSpecies
from .base import Base


class Species(Base):
    __tablename__ = 'species'

    taxonid: Mapped[str] = mapped_column(primary_key=True)
    species_id: Mapped[int] = mapped_column()
    prefix: Mapped[str] = mapped_column()
    order_group: Mapped[str] = mapped_column()
    family: Mapped[str] = mapped_column()
    genus: Mapped[str] = mapped_column()
    scientific_name: Mapped[str] = mapped_column()
    common_name: Mapped[str] = mapped_column()
    taxon_group: Mapped[str] = mapped_column()
    genome_size: Mapped[str] = mapped_column()
    sequencing_material_status_updated_at: Mapped[datetime.datetime] = mapped_column()
    ready: Mapped[bool] = mapped_column(default=False, nullable=False)
    tissue_depleted: Mapped[str] = mapped_column()

    sequencing_material_status_id: Mapped[str] = mapped_column(
        ForeignKey('sequencing_material_status.status_id'),
        nullable=True
    )
    sequencing_material_status: Mapped['SequencingMaterialStatus'] \
        = relationship(back_populates='species') # noqa F821

    sample_species: Mapped[List['SampleSpecies']] = \
        relationship(back_populates='species')  # noqa F821

    species_lab_work_statuses: Mapped[List['SpeciesLabWorkStatus']] = \
        relationship(back_populates='species')  # noqa F821

    @classmethod
    def get_id_column_name(cls) -> str:
        return 'taxonid'
