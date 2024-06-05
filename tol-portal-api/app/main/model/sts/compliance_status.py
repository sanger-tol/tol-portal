# SPDX-FileCopyrightText: 2024 Genome Research Ltd.
#
# SPDX-License-Identifier: MIT

from typing import List

from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


class ComplianceStatus(Base):
    __tablename__ = 'compliance_status'

    status_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    status: Mapped[str] = mapped_column(nullable=False)
    process: Mapped[str] = mapped_column()

    sampleset_research_governances: Mapped[List['SamplesetResearchGovernance']] = relationship(  # noqa F821
        back_populates='compliance_status'
    )

    manifests: Mapped[List['Manifest']] = relationship(  # noqa F821
        back_populates='compliance_status'
    )

    @classmethod
    def get_id_column_name(cls) -> str:
        return 'status_id'
