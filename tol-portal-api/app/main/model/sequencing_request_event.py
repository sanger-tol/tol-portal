# SPDX-FileCopyrightText: 2023 Genome Research Ltd.
#
# SPDX-License-Identifier: MIT

import datetime

from sqlalchemy.orm import Mapped, mapped_column

from .base import Base


class SequencingRequestEvent(Base):
    __tablename__ = 'sequencing_request_event'

    sample_ref: Mapped[str] = mapped_column(primary_key=True)  # noqa A003
    date_sent_to_sciops: Mapped[datetime.datetime] = mapped_column(nullable=False)

    @classmethod
    def get_id_column_name(cls) -> str:
        return 'sample_ref'
