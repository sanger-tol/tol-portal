# SPDX-FileCopyrightText: 2024 Genome Research Ltd.
#
# SPDX-License-Identifier: MIT

from typing import List

from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


class FreezerTray(Base):
    __tablename__ = 'freezer_tray'
    tray_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column('tray_name', nullable=False)
    parentage: Mapped[str] = mapped_column()
    # shelf_id - ignoring for now

    storage_racks: Mapped[List['StorageRack']] = \
        relationship(back_populates='freezer_tray')  # noqa F821

    @classmethod
    def get_id_column_name(cls) -> str:
        return 'tray_id'
