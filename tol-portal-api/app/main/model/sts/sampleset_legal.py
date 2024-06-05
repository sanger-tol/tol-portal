# SPDX-FileCopyrightText: 2024 Genome Research Ltd.
#
# SPDX-License-Identifier: MIT

import datetime

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


class SamplesetLegal(Base):
    __tablename__ = 'sampleset_legal'

    status: Mapped[str] = mapped_column(nullable=False)
    status_updated_at: Mapped[datetime.datetime] = mapped_column()

    sampleset_id: Mapped[int] = mapped_column(
        ForeignKey('sampleset.sampleset_id'),
        primary_key=True
    )
    sampleset: Mapped['Sampleset'] = relationship(  # noqa F821
        back_populates='sampleset_legals'
    )

    @classmethod
    def get_id_column_name(cls) -> str:
        return 'sampleset_id'
