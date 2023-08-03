# SPDX-FileCopyrightText: 2023 Genome Research Ltd.
#
# SPDX-License-Identifier: MIT

import datetime
from typing import List

from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..base import Base


class Location(Base):
    __tablename__ = 'location'
    location_id: Mapped[str] = mapped_column(primary_key=True, autoincrement=True)
    # location: Mapped[str] = mapped_column(nullable=False)
    lat: Mapped[str] = mapped_column()
    long: Mapped[str] = mapped_column()
    grid_reference: Mapped[str] = mapped_column()
    habitat: Mapped[str] = mapped_column()
    depth: Mapped[str] = mapped_column()
    elevation: Mapped[str] = mapped_column()
    location_type: Mapped[str] = mapped_column('type')
    created_on: Mapped[datetime.datetime] = mapped_column()

    samples: Mapped[List['Sample']] = \
        relationship(back_populates='location')  # noqa F821

    @classmethod
    def get_id_column_name(cls) -> str:
        return 'location_id'
