# SPDX-FileCopyrightText: 2023 Genome Research Ltd.
#
# SPDX-License-Identifier: MIT

import datetime
from typing import List

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..base import Base


class SequencingRequest(Base):
    __tablename__ = 'sequencing_request'

    request_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    ep_sample_id: Mapped[int] = mapped_column(ForeignKey('ep_sample.ep_sample_id'),
                                              nullable=False)
    ep_sample: Mapped['EPSample'] \
        = relationship(back_populates='sequencing_requests')  # noqa F821

    # platform_id = db.Column(db.Integer, db.ForeignKey('sequencing_platform.platform_id'),
    #                         nullable=False)
    sample_ref: Mapped[str] = mapped_column(unique=True)
    submit_date: Mapped[datetime.datetime] = mapped_column()
    sheared_total: Mapped[float] = mapped_column()
    sheared_avglen: Mapped[float] = mapped_column()
    sheared_femto_date: Mapped[datetime.datetime] = mapped_column()
    pipeline: Mapped[str] = mapped_column()
    current_coverage: Mapped[float] = mapped_column()
    genome_size_pre_run: Mapped[float] = mapped_column()
    genome_size_post_run: Mapped[float] = mapped_column()
    # status_id = db.Column(db.Integer, db.ForeignKey('sequencing_request_status.status_id'),
    #                       nullable=False)
    # sequencing_status = db.relationship("StsSequencingRequestStatus", uselist=False, lazy=False,
    #                                     foreign_keys=[status_id])
    created_on: Mapped[datetime.datetime] = mapped_column()
    updated_at: Mapped[datetime.datetime] = mapped_column()
    # created_by = db.Column(db.Integer, db.ForeignKey('user.user_id'))
    # updated_by = db.Column(db.Integer, db.ForeignKey('user.user_id'))
    tissue_remaining: Mapped[int] = mapped_column()

    sequencing_runs: Mapped[List['SequencingRun']] \
        = relationship(back_populates='sequencing_request')  # noqa F821

    @classmethod
    def get_id_column_name(cls) -> str:
        return 'request_id'
