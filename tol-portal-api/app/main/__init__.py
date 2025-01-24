#!/usr/bin/env python3

# SPDX-FileCopyrightText: 2023 Genome Research Ltd.
#
# SPDX-License-Identifier: MIT

import os

from flask import Flask

from flask_cors import CORS

from tol.api_base2 import (
    data_blueprint,
    system_blueprint
)
from tol.board import board_blueprint
from tol.core import core_data_object
from tol.sources.elastic import (
    elastic
)
from tol.sql import Model, create_sql_datasource
from tol.sql.auth import db_auth_blueprint
from tol.sql.board import create_board_models
from tol.status import StatusDataSource

from .auth import (
    get_auth_inspector
)
from .model import (
    Base,
    DataLoadEvent,
    SequencingRequestEvent,
)


def __get_board_models(
    base_model: type[Model]
) -> tuple[list[type[Model], type[Model]]]:
    board_models = create_board_models(base_model)

    return list(board_models), board_models._user_mixin


def application():
    app = Flask(__name__)
    CORS(app, resources={r'/api/*': {'origins': '*'}})
    app.config['CORS_HEADERS'] = 'Content-Type'

    board_models, user_mixin = __get_board_models(Base)

    # auth
    auth_bp = db_auth_blueprint(
        Base,
        os.environ['DB_URI'],
        url_prefix=os.environ['API_PATH'] + '/auth',
        user_mixin_class=user_mixin
    )
    app.register_blueprint(auth_bp)
    auth_bp.register_authenticator(app)

    # dashboards
    models = [
        *board_models,
        auth_bp.models.user_class,
    ]

    board_ds = create_sql_datasource(
        models=models,
        db_uri=os.environ['DB_URI']
    )
    core_data_object(board_ds)

    boards_bp = board_blueprint(board_ds)
    app.register_blueprint(
        boards_bp,
        url_prefix=os.getenv('API_PATH') + '/boards'
    )

    eds = elastic()
    # The main endpoints for the elastic data
    blueprint_data = data_blueprint(eds)
    app.register_blueprint(blueprint_data, url_prefix=os.getenv('API_PATH'))

    blueprint_board_data = data_blueprint(board_ds)
    app.register_blueprint(
        blueprint_board_data,
        name='board-data',
        url_prefix=os.getenv('API_PATH') + '/board-data')

    # The system endpoints
    blueprint_system = system_blueprint(eds)
    app.register_blueprint(blueprint_system, url_prefix=os.getenv('API_PATH') + '/system')

    # Endpoints targeting our local database
    sql_datasource = create_sql_datasource(
        models=[SequencingRequestEvent, DataLoadEvent],
        db_uri=os.getenv('DB_URI')
    )
    core_data_object(sql_datasource)
    blueprint_data_local = data_blueprint(sql_datasource)
    app.register_blueprint(blueprint_data_local, name='local',
                           url_prefix=os.getenv('API_PATH') + '/local')

    # status board
    status_ds = StatusDataSource({})
    core_data_object(status_ds)

    blueprint_data_status = data_blueprint(
        status_ds,
        auth_inspector=get_auth_inspector(os.getenv('API_TOKEN'))
    )
    app.register_blueprint(blueprint_data_status, name='status_ds',
                           url_prefix=os.getenv('API_PATH') + '/status')

    return app
