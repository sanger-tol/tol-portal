# SPDX-FileCopyrightText: 2023 Genome Research Ltd.
#
# SPDX-License-Identifier: MIT

import datetime
from typing import List

import sqlalchemy as sa
from sqlalchemy.orm import Mapped, mapped_column, relationship

# from .sample import Sample
from .base import Base


class Specimen(Base):
    __tablename__ = 'specimen'

    specimen_id: Mapped[str] = mapped_column(primary_key=True)
    public_name: Mapped[str] = mapped_column()
    is_complex: Mapped[bool] = mapped_column()
    bio_specimen_id: Mapped[str] = mapped_column()
    created_on: Mapped[datetime.datetime] = mapped_column()
    updated_at: Mapped[datetime.datetime] = mapped_column()
    dna_depleted: Mapped[bool] = mapped_column()
    rna_depleted: Mapped[bool] = mapped_column()
    tissue_depleted: Mapped[bool] = mapped_column()
    ready: Mapped[bool] = mapped_column(nullable=False)
    estimated_genome_size: Mapped[int] = mapped_column(sa.BigInteger)

    samples: Mapped[List['Sample']] = relationship(back_populates='specimen')  # noqa F821

    @classmethod
    def get_id_column_name(cls) -> str:
        return 'specimen_id'
