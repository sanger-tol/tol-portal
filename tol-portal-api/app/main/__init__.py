#!/usr/bin/env python3

# SPDX-FileCopyrightText: 2023 Genome Research Ltd.
#
# SPDX-License-Identifier: MIT

import os

from flask import Flask

from flask_cors import CORS

from tol.api_base import (
    action_blueprint,
    data_blueprint,
    system_blueprint
)
from tol.board import board_blueprint
from tol.core import (
    DataSourceFilter,
    DataSourceUtils,
    core_data_object
)
from tol.sources.prefect import prefect
from tol.sql import Model, create_sql_datasource
from tol.sql.action import create_action_models
from tol.sql.auth import db_auth_blueprint
from tol.sql.board import create_board_models
from tol.sql.loader import create_loader_models
from tol.sql.summary import create_summary_models
from tol.status import StatusDataSource

from .auth import (
    get_auth_inspector,
    get_local_auth_inspector,
    get_prefect_auth_inspector,
)
from .model import (
    Base,
    MODELS,
)


def __get_board_models(
    base_model: type[Model]
) -> tuple[list[type[Model]], type[Model]]:
    board_models = create_board_models(base_model)

    return list(board_models), board_models._user_mixin


def application() -> Flask:
    app = Flask(__name__)
    CORS(app, resources={r'/api/*': {'origins': '*'}})
    app.config['CORS_HEADERS'] = 'Content-Type'

    board_models, _board_user_mixin = __get_board_models(Base)
    action_models = create_action_models(Base)
    summary_models = create_summary_models(Base)
    loader_models = create_loader_models(Base)

    user_mixin = type(
        '',
        (action_models._user_mixin, _board_user_mixin),
        {}
    )

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
        *MODELS,
        *action_models,
        *board_models,
        auth_bp.models.user_class,
        *summary_models,
        *loader_models
    ]

    sql_ds = create_sql_datasource(
        models=models,
        db_uri=os.environ['DB_URI']
    )
    core_data_object(sql_ds)

    # Endpoints for all the data sets we are serving up
    f = DataSourceFilter()
    f.and_ = {
        'publish': {'eq': {'value': True}}
    }
    datasource_instances = sql_ds.get_list('data_source_instance', object_filters=f)
    for datasource_instance in datasource_instances:
        ds = DataSourceUtils.get_datasource_by_datasource_instance(
            datasource_instance
        )
        blueprint_data = data_blueprint(ds)
        api_path = os.getenv('API_PATH') + os.getenv('API_DATA_PATH') + \
            '/' + datasource_instance.name
        print(f'Registering data blueprint for {datasource_instance.name} at {api_path}')

        app.register_blueprint(
            blueprint_data,
            url_prefix=api_path,
            name=datasource_instance.name
        )

    # The system endpoints
    blueprint_system = system_blueprint()
    app.register_blueprint(blueprint_system, url_prefix=os.getenv('API_PATH') + '/system')

    # Endpoints targeting our local database
    core_data_object(sql_ds)
    blueprint_data_local = data_blueprint(
        sql_ds,
        auth_inspector=get_local_auth_inspector(),
    )
    app.register_blueprint(
        blueprint_data_local,
        name='local',
        url_prefix=os.getenv('API_PATH') + '/local',
    )

    # status board
    status_ds = StatusDataSource({})
    core_data_object(status_ds)

    blueprint_data_status = data_blueprint(
        status_ds,
        auth_inspector=get_auth_inspector(os.getenv('API_TOKEN'))
    )
    app.register_blueprint(blueprint_data_status, name='status_ds',
                           url_prefix=os.getenv('API_PATH') + '/status')

    # actions
    pds = prefect(insecure=True)
    actions_bp = action_blueprint(
        sql_ds,
        pds,
        role=None
    )
    app.register_blueprint(
        actions_bp,
        url_prefix=os.getenv('API_PATH') + '/local/run-action'
    )
    blueprint_prefect_data = data_blueprint(
        pds,
        auth_inspector=get_prefect_auth_inspector()
    )
    app.register_blueprint(blueprint_prefect_data, name='pds',
                           url_prefix=os.getenv('API_PATH') + '/prefect')

    # dashboards
    boards_bp = board_blueprint(sql_ds)
    app.register_blueprint(
        boards_bp,
        name='custom_boards',
        url_prefix=os.environ['API_PATH'] + '/boards'
    )
    blueprint_board_data = data_blueprint(sql_ds)
    app.register_blueprint(
        blueprint_board_data,
        name='boards',
        url_prefix=os.getenv('API_PATH') + '/boards'
    )

    return app
