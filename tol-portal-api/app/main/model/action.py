# SPDX-FileCopyrightText: 2023 Genome Research Ltd.
#
# SPDX-License-Identifier: MIT

from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


class Action(Base):
    __tablename__ = 'action'

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)  # noqa A003

    object_type: Mapped[str] = mapped_column(nullable=False)
    flow_name: Mapped[str] = mapped_column(nullable=False)

    user_actions: Mapped[list['UserAction']] = relationship(  # noqa F821
        back_populates='action'
    )
