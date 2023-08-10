# SPDX-FileCopyrightText: 2023 Genome Research Ltd.
#
# SPDX-License-Identifier: MIT

import datetime

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

# from .sample import Sample
from .base import Base


class SpeciesLabWorkStatus(Base):
    __tablename__ = 'species_lab_work_status'

    id: Mapped[int] = mapped_column()  # noqa A003
    species_id: Mapped[int] = mapped_column(
        ForeignKey('species.species_id'),
        primary_key=True
    )
    species: Mapped['Species'] \
        = relationship(back_populates='species_lab_work_statuses')  # noqa F821
    status: Mapped[str] = mapped_column(primary_key=True)
    updated_at: Mapped[datetime.datetime] = mapped_column()
