# SPDX-FileCopyrightText: 2024 Genome Research Ltd.
#
# SPDX-License-Identifier: MIT

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


class BankedSample(Base):
    __tablename__ = 'banked_sample'

    id: Mapped[int] = mapped_column()  # noqa A003
    sample_id: Mapped[int] = mapped_column(
        ForeignKey('sample.sample_id'),
        primary_key=True
    )
    sample: Mapped['Sample'] = relationship(back_populates='banked_samples')  # noqa F821

    category_id: Mapped[int] = mapped_column(
        ForeignKey('banked_sample_category.category_id'),
        primary_key=True
    )
    category: Mapped['BankedSampleCategory'] = relationship(back_populates='banked_samples')  # noqa F821
