# SPDX-FileCopyrightText: 2024 Genome Research Ltd.
#
# SPDX-License-Identifier: MIT

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


class SamplePerson(Base):
    __tablename__ = 'sample_person'

    id: Mapped[int] = mapped_column()  # noqa A003
    sample_id: Mapped[int] = mapped_column(
        ForeignKey('sample.sample_id'),
        primary_key=True
    )
    sample: Mapped['Sample'] = relationship(back_populates='sample_persons')  # noqa F821

    person_id: Mapped[int] = mapped_column(
        ForeignKey('person.person_id'),
        primary_key=True
    )
    person: Mapped['Person'] = relationship(back_populates='sample_persons')  # noqa F821

    action: Mapped[str] = mapped_column(primary_key=True)  # noqa A003
