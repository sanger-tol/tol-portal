# SPDX-FileCopyrightText: 2021 Genome Research Ltd.
#
# SPDX-License-Identifier: MIT

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


class StorageRack(Base):
    __tablename__ = 'storage_rack'
    storage_rack_id: Mapped[str] = mapped_column(primary_key=True, autoincrement=False)
    note: Mapped[str] = mapped_column()

    labwhere_id: Mapped[str] = mapped_column(
        'tray_id',
        ForeignKey('freezer_tray.tray_id'),
        nullable=False
    )

    freezer_tray: Mapped['FreezerTray'] \
        = relationship(back_populates='storage_racks') # noqa F821

    @classmethod
    def get_id_column_name(cls) -> str:
        return 'storage_rack_id'
