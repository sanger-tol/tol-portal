# SPDX-FileCopyrightText: 2023 Genome Research Ltd.
#
# SPDX-License-Identifier: MIT

from typing import List

from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


class Project(Base):
    __tablename__ = 'project'

    project_id: Mapped[str] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(nullable=False)
    project_code: Mapped[str] = mapped_column(unique=True, nullable=False)
    programme: Mapped[str] = mapped_column(nullable=False)

    sample_projects: Mapped[List['SampleProject']] \
        = relationship(back_populates='project')  # noqa F821

    @classmethod
    def get_id_column_name(cls) -> str:
        return 'project_code'
