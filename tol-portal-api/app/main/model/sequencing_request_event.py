# SPDX-FileCopyrightText: 2023 Genome Research Ltd.
#
# SPDX-License-Identifier: MIT

import datetime

from sqlalchemy.orm import Mapped, mapped_column

from .base import Base


class SequencingRequestEvent(Base):
    __tablename__ = 'sequencing_request_event'

    sample_ref: Mapped[str] = mapped_column(primary_key=True)
    date_sent_to_sciops: Mapped[datetime.datetime] = mapped_column(nullable=False)
    plate_labware_uuid: Mapped[str] = mapped_column()
    sample_labware_uuid: Mapped[str] = mapped_column()
    date_abandoned: Mapped[datetime.datetime] = mapped_column()
    abandoned_by: Mapped[str] = mapped_column()
    date_topup_actioned: Mapped[datetime.datetime] = mapped_column(nullable=True)
    topup_actioned_by: Mapped[str] = mapped_column(nullable=True)
    date_sent_to_review: Mapped[datetime.datetime] = mapped_column(nullable=True)
    sent_to_review_by: Mapped[str] = mapped_column(nullable=True)
    in_review: Mapped[bool] = mapped_column(nullable=True)

    @classmethod
    def get_id_column_name(cls) -> str:
        return 'sample_ref'
