# SPDX-FileCopyrightText: 2024 Genome Research Ltd.
#
# SPDX-License-Identifier: MIT

from typing import List

from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


class ShipmentStatus(Base):
    __tablename__ = 'shipment_status'

    status_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    status: Mapped[str] = mapped_column(nullable=False)

    manifests: Mapped[List['Manifest']] = \
        relationship(back_populates='shipment_status')  # noqa F821

    @classmethod
    def get_id_column_name(cls) -> str:
        return 'status_id'
