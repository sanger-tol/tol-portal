# SPDX-FileCopyrightText: 2023 Genome Research Ltd.
#
# SPDX-License-Identifier: MIT

import datetime
from typing import List

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


class Manifest(Base):
    __tablename__ = 'manifest'

    manifest_id: Mapped[str] = mapped_column(
        primary_key=True,
        autoincrement=True
    )
    copoid: Mapped[str] = mapped_column(nullable=False, unique=True)
    copo_profile_title: Mapped[str] = mapped_column()
    submit_date: Mapped[datetime.datetime] = mapped_column()
    update_date: Mapped[datetime.datetime] = mapped_column()
    accept_date: Mapped[datetime.datetime] = mapped_column()
    receive_date: Mapped[datetime.datetime] = mapped_column()
    reject_date: Mapped[datetime.datetime] = mapped_column()
    archive_date: Mapped[datetime.datetime] = mapped_column()
    status_updated_at: Mapped[datetime.datetime] = mapped_column()
    shipment_status_updated_at: Mapped[datetime.datetime] = mapped_column()
    research_governance_status: Mapped[str] = mapped_column()
    rg_status_updated_at: Mapped[datetime.datetime] = mapped_column()
    wildlife_and_env_status: Mapped[str] = mapped_column()
    wildlife_status_updated_at: Mapped[datetime.datetime] = mapped_column()
    bio_safety_overall_status: Mapped[str] = mapped_column()
    bio_safety_overall_status_updated_at: Mapped[datetime.datetime] = mapped_column()
#    released_to_lab: Mapped[bool] = mapped_column()

    project_id: Mapped[int] = mapped_column(
        ForeignKey('project.project_id'),
        primary_key=True
    )
    project: Mapped['Project'] = relationship(back_populates='manifests')  # noqa F821

    status_id: Mapped[int] = mapped_column(ForeignKey('manifest_status.status_id'),
                                           nullable=False)
    manifest_status: Mapped['ManifestStatus'] \
        = relationship(back_populates='manifests')  # noqa F821

    cc_status_id: Mapped[int] = mapped_column(ForeignKey('compliance_status.status_id'))
    compliance_status: Mapped['ComplianceStatus'] \
        = relationship(back_populates='manifests')  # noqa F821

    sh_status_id: Mapped[int] = mapped_column(ForeignKey('shipment_status.status_id'))
    shipment_status: Mapped['ShipmentStatus'] \
        = relationship(back_populates='manifests')  # noqa F821

#    sampleset_id: Mapped[int] = mapped_column(ForeignKey('sampleset.sampleset_id'))
#    sampleset: Mapped['Sampleset'] \
#        = relationship(back_populates='manifests')  # noqa F821

    samples: Mapped[List['Sample']] \
        = relationship(back_populates='manifest')  # noqa F821

    @classmethod
    def get_id_column_name(cls) -> str:
        return 'copoid'
