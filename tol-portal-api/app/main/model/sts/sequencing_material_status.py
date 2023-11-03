# SPDX-FileCopyrightText: 2023 Genome Research Ltd.
#
# SPDX-License-Identifier: MIT

from typing import List

from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


class SequencingMaterialStatus(Base):
    __tablename__ = 'sequencing_material_status'

    status_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    status: Mapped[str] = mapped_column(nullable=False)

    species: Mapped[List['Species']] = relationship(back_populates='sequencing_material_status')  # noqa F821

    @classmethod
    def get_id_column_name(cls) -> str:
        return 'status_id'
