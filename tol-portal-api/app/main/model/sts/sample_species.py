# SPDX-FileCopyrightText: 2023 Genome Research Ltd.
#
# SPDX-License-Identifier: MIT

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


class SampleSpecies(Base):
    __tablename__ = 'sample_species'

    id: Mapped[int] = mapped_column()  # noqa A003
    sample_id: Mapped[int] = mapped_column(
        ForeignKey('sample.sample_id'),
        primary_key=True
    )
    sample: Mapped['Sample'] = relationship(back_populates='sample_species')  # noqa F821

    species_id: Mapped[int] = mapped_column(
        ForeignKey('species.species_id'),
        primary_key=True
    )
    species: Mapped['Species'] = relationship(back_populates='sample_species')  # noqa F821

    type: Mapped[str] = mapped_column(nullable=False)  # noqa A003
    taxon_remark: Mapped[str] = mapped_column()
    copoid: Mapped[str] = mapped_column()
    # strain_id = db.Column(db.Integer, db.ForeignKey('strain.strain_id'))
    # strain = db.relationship("StsStrain", uselist=False, foreign_keys=[strain_id])
    species_existed: Mapped[bool] = mapped_column(nullable=True)
    # lifestage_id = db.Column(db.Integer, db.ForeignKey('lifestage.lifestage_id',
    #                          ondelete='SET NULL'))
    # lifestage = db.relationship("StsLifestage", uselist=False, foreign_keys=[lifestage_id])
    # sex_id = db.Column(db.Integer, db.ForeignKey('sex.sex_id', ondelete='SET NULL'))
    # sex = db.relationship("StsSex", uselist=False, lazy=False)
    has_family: Mapped[bool] = mapped_column()
