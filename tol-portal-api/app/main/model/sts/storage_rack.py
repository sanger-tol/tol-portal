# SPDX-FileCopyrightText: 2021 Genome Research Ltd.
#
# SPDX-License-Identifier: MIT

from sqlalchemy.orm import Mapped, mapped_column

from .base import Base


class StorageRack(Base):
    __tablename__ = 'storage_rack'
    storage_rack_id: Mapped[str] = mapped_column(primary_key=True, autoincrement=False)
    labwhere_id: Mapped[str] = mapped_column('tray_id')
    note: Mapped[str] = mapped_column()

    @classmethod
    def get_id_column_name(cls) -> str:
        return 'storage_rack_id'
