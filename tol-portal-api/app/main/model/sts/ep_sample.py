# SPDX-FileCopyrightText: 2023 Genome Research Ltd.
#
# SPDX-License-Identifier: MIT

import datetime
from typing import List

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


class EPSample(Base):
    __tablename__ = 'ep_sample'

    ep_sample_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column()
    fluidx_id: Mapped[str] = mapped_column()
    rack_id: Mapped[str] = mapped_column()
    parent_fluidx_id: Mapped[str] = mapped_column()

    sample_id: Mapped[int] = mapped_column(
        ForeignKey('sample.sample_id'),
        nullable=False
    )
    sample: Mapped['Sample'] = relationship(back_populates='ep_samples')  # noqa F821

    store_type: Mapped[str] = mapped_column()
    # type_id = db.Column(db.Integer, db.ForeignKey('ep_sample_type.type_id'), nullable=False)
    extraction_date: Mapped[datetime.datetime] = mapped_column()
    # extraction_method_id = db.Column(db.Integer, db.ForeignKey('extraction_method.method_id'))
    initial_yield: Mapped[float] = mapped_column()
    initial_volume: Mapped[float] = mapped_column()
    current_volume: Mapped[float] = mapped_column()
    # femto_id = db.Column(db.Integer, db.ForeignKey('femto_profile.profile_id'))
    femto_date: Mapped[str] = mapped_column()
    # required_pmethod_id = db.Column(db.Integer, db.ForeignKey('dna_pmethod.method_id'))
    nanodrop260280: Mapped[float] = mapped_column()
    nanodrop260230: Mapped[float] = mapped_column()
    voucher_id: Mapped[str] = mapped_column()
    # voucher_dest_id = db.Column(db.Integer, db.ForeignKey('dna_voucher_dest.destination_id'))
    voucher_submit_date: Mapped[datetime.datetime] = mapped_column()
    repeat: Mapped[bool] = mapped_column()
    priority: Mapped[str] = mapped_column()
    notes: Mapped[str] = mapped_column()
    # created_by = db.Column(db.Integer, db.ForeignKey('user.user_id'))
    # updated_by = db.Column(db.Integer, db.ForeignKey('user.user_id'))
    created_on: Mapped[datetime.datetime] = mapped_column()
    updated_at: Mapped[datetime.datetime] = mapped_column()
    eln_id: Mapped[str] = mapped_column()
    eln_last_modified: Mapped[datetime.datetime] = mapped_column()
    eln_entity_id: Mapped[str] = mapped_column()
    tissue_remaining: Mapped[int] = mapped_column()
    archived: Mapped[bool] = mapped_column()
    extraction_kit: Mapped[str] = mapped_column()
    qubit_concentration: Mapped[float] = mapped_column()
    contact_person: Mapped[str] = mapped_column()
    # destination_sequencing_platfrom = db.Column(db.Integer(),
    #                                           db.ForeignKey('sequencing_platform.platform_id'))
    # disposal_id = db.Column(db.Integer, db.ForeignKey('storage_disposal.disposal_id'))
    pos_in_rack: Mapped[str] = mapped_column()
    stored_created_on: Mapped[datetime.datetime] = mapped_column()
    stored_updated_at: Mapped[datetime.datetime] = mapped_column()
    # stored_updated_by = db.Column(db.Integer, db.ForeignKey('user.user_id'))
    relocate_note: Mapped[str] = mapped_column()
    # returned_id = db.Column(db.Integer, db.ForeignKey('storage_returned.returned_id'),
    #                         nullable=True)

    sequencescape_study_id: Mapped[str] = mapped_column(nullable=True)
    cost_code: Mapped[str] = mapped_column(nullable=True)

    sequencing_requests: Mapped[List['SequencingRequest']] \
        = relationship(back_populates='ep_sample')  # noqa F821

    @classmethod
    def get_id_column_name(cls) -> str:
        return 'ep_sample_id'
