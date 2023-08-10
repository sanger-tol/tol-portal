# SPDX-FileCopyrightText: 2023 Genome Research Ltd.
#
# SPDX-License-Identifier: MIT

import datetime

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


class SequencingRun(Base):
    __tablename__ = 'sequencing_run'

    sequencing_run_id: Mapped[int] = mapped_column(autoincrement=True, primary_key=True)
    run_id: Mapped[str] = mapped_column()

    sequencing_request_id: Mapped[int] = mapped_column(
        ForeignKey('sequencing_request.request_id'),
        nullable=False
    )
    sequencing_request: Mapped['SequencingRequest'] \
        = relationship(back_populates='sequencing_runs')  # noqa F821

    position: Mapped[str] = mapped_column()
    tag: Mapped[str] = mapped_column()
    # status_id = db.Column(db.Integer, db.ForeignKey('sequencing_run_status.status_id'),
    #                       nullable=False)
    start_date: Mapped[datetime.datetime] = mapped_column()
    complete_date: Mapped[datetime.datetime] = mapped_column()
    qc_date: Mapped[datetime.datetime] = mapped_column()
    created_on: Mapped[datetime.datetime] = mapped_column()
    updated_at: Mapped[datetime.datetime] = mapped_column()
    # created_by = db.Column(db.Integer, db.ForeignKey('user.user_id'))
    # updated_by = db.Column(db.Integer, db.ForeignKey('user.user_id'))
    # ext = db.Column(MutableDict.as_mutable(JSONB), nullable=True)

    @classmethod
    def get_id_column_name(cls) -> str:
        return 'sequencing_run_id'
