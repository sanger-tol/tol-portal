# SPDX-FileCopyrightText: 2025 Genome Research Ltd.
#
# SPDX-License-Identifier: MIT

import datetime

from sqlalchemy.orm import Mapped, mapped_column

from .base import Base


class TissuePrepEvent(Base):
    __tablename__ = 'tissue_prep_event'

    tissue_prep_id: Mapped[str] = mapped_column(primary_key=True)
    date_abandoned: Mapped[datetime.datetime] = mapped_column()
    abandoned_by: Mapped[str] = mapped_column()
    date_topup_actioned: Mapped[datetime.datetime] = mapped_column(nullable=True)
    topup_actioned_by: Mapped[str] = mapped_column(nullable=True)

    @classmethod
    def get_id_column_name(cls) -> str:
        return 'tissue_prep_id'
