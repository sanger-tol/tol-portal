# SPDX-FileCopyrightText: 2025 Genome Research Ltd.
#
# SPDX-License-Identifier: MIT

import datetime

from sqlalchemy.orm import Mapped, mapped_column

from .base import Base


class TolidEvent(Base):
    __tablename__ = 'tolid_event'

    tolid: Mapped[str] = mapped_column(primary_key=True)
    date_topup_actioned: Mapped[datetime.datetime] = mapped_column(nullable=False)
    topup_actioned_by: Mapped[str] = mapped_column()
    date_abandoned: Mapped[datetime.datetime] = mapped_column()
    abandoned_by: Mapped[str] = mapped_column()
    tol_tum_action_count: Mapped[int] = mapped_column(nullable=True)
    date_sent_to_review: Mapped[datetime.datetime] = mapped_column(nullable=True)
    sent_to_review_by: Mapped[str] = mapped_column(nullable=True)
    in_review: Mapped[bool] = mapped_column(nullable=True)

    @classmethod
    def get_id_column_name(cls) -> str:
        return 'tolid'
