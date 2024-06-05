# SPDX-FileCopyrightText: 2024 Genome Research Ltd.
#
# SPDX-License-Identifier: MIT

import datetime

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


class SamplesetResearchGovernance(Base):
    __tablename__ = 'sampleset_research_governance'

    research_governance_id: Mapped[int] = mapped_column(
        primary_key=True
    )
    research_governance_type: Mapped[str] = mapped_column('type', nullable=False)
    updated_at: Mapped[datetime.datetime] = mapped_column()

    sampleset_id: Mapped[int] = mapped_column(
        ForeignKey('sampleset.sampleset_id')
    )
    sampleset: Mapped['Sampleset'] = relationship(  # noqa F821
        back_populates='sampleset_research_governances'
    )

    status_id: Mapped[int] = mapped_column(ForeignKey('compliance_status.status_id'),
                                           nullable=False)
    compliance_status: Mapped['ComplianceStatus'] \
        = relationship(back_populates='sampleset_research_governances')  # noqa F821

    @classmethod
    def get_id_column_name(cls) -> str:
        return 'research_governance_id'
