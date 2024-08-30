# SPDX-FileCopyrightText: 2024 Genome Research Ltd.
#
# SPDX-License-Identifier: MIT

from typing import List

from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


class Psolution(Base):
    __tablename__ = 'psolution'
    solution_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    solution: Mapped[str] = mapped_column(nullable=False)
    desc: Mapped[str] = mapped_column()

    samples: Mapped[List['Sample']] = \
        relationship(back_populates='preservative_solution')  # noqa F821

    @classmethod
    def get_id_column_name(cls) -> str:
        return 'solution_id'
