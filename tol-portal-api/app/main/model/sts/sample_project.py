# SPDX-FileCopyrightText: 2023 Genome Research Ltd.
#
# SPDX-License-Identifier: MIT

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..base import Base


class SampleProject(Base):
    __tablename__ = 'sample_project'

    sample_id: Mapped[int] = mapped_column(
        ForeignKey('sample.sample_id'),
        primary_key=True
    )
    sample: Mapped['Sample'] = relationship(back_populates='sample_projects')  # noqa F821

    project_id: Mapped[int] = mapped_column(
        ForeignKey('project.project_id'),
        primary_key=True
    )
    project: Mapped['Project'] = relationship(back_populates='sample_projects')  # noqa F821
