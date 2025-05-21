# SPDX-FileCopyrightText: 2025 Genome Research Ltd.
#
# SPDX-License-Identifier: MIT

import datetime

from sqlalchemy.orm import Mapped, mapped_column

from .base import Base


class SpeciesEvent(Base):
    __tablename__ = 'species_event'

    species_id: Mapped[str] = mapped_column(primary_key=True)
    date_marked_for_recollection: Mapped[datetime.datetime] = mapped_column()
    marked_for_recollection_by: Mapped[str] = mapped_column()
    marked_for_recollection_reason: Mapped[str] = mapped_column(nullable=False, default='PacBio')

    @classmethod
    def get_id_column_name(cls) -> str:
        return 'species_id'
