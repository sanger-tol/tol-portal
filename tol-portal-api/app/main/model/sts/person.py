# SPDX-FileCopyrightText: 2024 Genome Research Ltd.
#
# SPDX-License-Identifier: MIT

from typing import List

from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


class Person(Base):
    __tablename__ = 'person'

    person_id: Mapped[str] = mapped_column(primary_key=True, autoincrement=True)
    fullname: Mapped[str] = mapped_column(nullable=False)
    email: Mapped[str] = mapped_column()
    phone: Mapped[str] = mapped_column()

    sample_persons: Mapped[List['SamplePerson']] \
        = relationship(back_populates='person')  # noqa F821

    @classmethod
    def get_id_column_name(cls) -> str:
        return 'person_id'
