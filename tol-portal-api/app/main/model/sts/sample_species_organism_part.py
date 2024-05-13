# SPDX-FileCopyrightText: 2024 Genome Research Ltd.
#
# SPDX-License-Identifier: MIT

from sqlalchemy import ForeignKey, ForeignKeyConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


class SampleSpeciesOrganismPart(Base):
    __tablename__ = 'sample_species_organism_part'

    id: Mapped[int] = mapped_column()  # noqa A003
    sample_id: Mapped[int] = mapped_column(
        ForeignKey('sample.sample_id'),
        primary_key=True
    )
    species_id: Mapped[int] = mapped_column(
        ForeignKey('species.species_id'),
        primary_key=True
    )

    sample_species: Mapped['SampleSpecies'] = relationship(  # noqa F821
        'SampleSpecies',
        back_populates='sample_species_organism_parts',
        uselist=False
    )

    organism_part_id: Mapped[int] = mapped_column(
        ForeignKey('organism_part.opart_id'),
        primary_key=True
    )
    organism_part: Mapped['OrganismPart'] = \
        relationship(back_populates='sample_species_organism_parts')  # noqa F821

    __table_args__ = (
        ForeignKeyConstraint(
            ['sample_id', 'species_id'],
            ['sample_species.sample_id', 'sample_species.species_id']
        ),
    )
