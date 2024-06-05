# SPDX-FileCopyrightText: 2023 Genome Research Ltd.
#
# SPDX-License-Identifier: MIT

import datetime
from typing import List

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


class Sampleset(Base):
    __tablename__ = 'sampleset'

    sampleset_id: Mapped[str] = mapped_column(
        primary_key=True,
        autoincrement=True
    )
    name: Mapped[str] = mapped_column(nullable=False, unique=True)
    submit_date: Mapped[datetime.datetime] = mapped_column()
    expected_manifest_date: Mapped[datetime.datetime] = mapped_column()
    shipping_date: Mapped[datetime.datetime] = mapped_column()
    status_updated_at: Mapped[datetime.datetime] = mapped_column()
    num_expected_species: Mapped[int] = mapped_column()
    num_expected_samples: Mapped[int] = mapped_column()
    released_to_lab: Mapped[bool] = mapped_column()

    gal_id: Mapped[str] = mapped_column(
        ForeignKey('gal.gal_id'),
        nullable=False
    )
    gal: Mapped['Gal'] \
        = relationship(back_populates='samplesets') # noqa F821

    project_id: Mapped[int] = mapped_column(
        ForeignKey('project.project_id'),
        primary_key=True
    )
    project: Mapped['Project'] = relationship(back_populates='samplesets')  # noqa F821

    status_id: Mapped[int] = mapped_column(ForeignKey('sampleset_status.status_id'),
                                           nullable=False)
    sampleset_status: Mapped['SamplesetStatus'] \
        = relationship(back_populates='samplesets')  # noqa F821

    sampleset_legals: Mapped[List['SamplesetLegal']] = relationship(  # noqa F821
        back_populates='sampleset'
    )

    sampleset_research_governances: Mapped[List['SamplesetResearchGovernance']] = relationship(  # noqa F821
        back_populates='sampleset'
    )

    samples: Mapped[List['Sample']] \
        = relationship(back_populates='sampleset')  # noqa F821

#    manifests: Mapped[List['Manifest']] = \
#        relationship(back_populates='sampleset')  # noqa F821

    @classmethod
    def get_id_column_name(cls) -> str:
        return 'name'
