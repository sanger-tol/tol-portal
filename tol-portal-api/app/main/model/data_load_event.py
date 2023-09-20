# SPDX-FileCopyrightText: 2023 Genome Research Ltd.
#
# SPDX-License-Identifier: MIT

import datetime

from sqlalchemy.orm import Mapped, mapped_column

from .base import Base


class DataLoadEvent(Base):
    __tablename__ = 'data_load_event'

    loader_name: Mapped[str] = mapped_column(primary_key=True)
    start_time: Mapped[datetime.datetime] = mapped_column(nullable=True)
    end_time: Mapped[datetime.datetime] = mapped_column(nullable=True)
    source_object_type: Mapped[str] = mapped_column()
    destination_object_type: Mapped[str] = mapped_column()

    @classmethod
    def get_id_column_name(cls) -> str:
        return 'loader_name'
