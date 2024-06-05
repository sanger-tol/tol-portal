# SPDX-FileCopyrightText: 2024 Genome Research Ltd.
#
# SPDX-License-Identifier: MIT

from typing import List

from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


class SamplesetStatus(Base):
    __tablename__ = 'sampleset_status'

    status_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    status: Mapped[str] = mapped_column(nullable=False)

    samplesets: Mapped[List['Sampleset']] = relationship(back_populates='sampleset_status')  # noqa F821

    @classmethod
    def get_id_column_name(cls) -> str:
        return 'status_id'
