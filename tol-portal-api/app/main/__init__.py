#!/usr/bin/env python3

# SPDX-FileCopyrightText: 2023 Genome Research Ltd.
#
# SPDX-License-Identifier: MIT

import os

from flask import Flask, request

from flask_cors import CORS

from tol.api_base import (
    action_blueprint,
    data_blueprint,
    data_upload_blueprint,
    pipeline_steps_blueprint,
    system_blueprint
)
from tol.api_base.misc import default_ctx_getter
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
from tol.sql.pipeline_step import create_pipeline_step_models
from tol.sql.standard import create_standard_models
from tol.status import StatusDataSource

from .auth import (
    get_auth_inspector,
    get_local_auth_inspector,
    get_prefect_auth_inspector
)
from .model import (
    Base,
    MODELS,
)


def __get_standard_models(
    base_model: type[Model]
) -> tuple[list[type[Model]], type[Model]]:
    standard_models = create_standard_models(base_model)

    return list(standard_models), standard_models._user_mixin


def __get_pipeline_step_models(
    base_model: type[Model],
) -> tuple[list[type[Model], type[Model]]]:

    pipeline_models = create_pipeline_step_models(base_model)
    return list(pipeline_models), pipeline_models._user_mixin


def application() -> Flask:
    # TODO: Need to restrict CORS to just TOLP managed sites
    app = Flask(__name__)
    CORS(app, resources={r'/api/*': {'origins': '*'}})
    app.config['CORS_HEADERS'] = 'Content-Type'

    # This is needed as Chrome treats requests to Portal as requests to a private
    # network resource which can block calls to the API (unless user opts in manually)
    @app.after_request
    def add_pna_header(response):
        if request.method == 'OPTIONS':
            response.headers['Access-Control-Allow-Private-Network'] = 'true'

        return response

    standard_models, _board_user_mixin = __get_standard_models(Base)
    action_models = create_action_models(Base)

    pipeline_models, _pipeline_user_mixin = __get_pipeline_step_models(Base)

    user_mixin = type(
        '',
        (
            action_models._user_mixin,
            _board_user_mixin,
            _pipeline_user_mixin
        ),
        {}
    )
    
    role_mixin = type(
        '',
        (action_models._role_mixin,),
        {}
    )

    # auth
    auth_bp = db_auth_blueprint(
        Base,
        os.environ['DB_URI'],
        url_prefix=os.environ['API_PATH'] + '/auth',
        user_mixin_class=user_mixin,
        role_mixin_class=role_mixin
    )
    app.register_blueprint(auth_bp)
    auth_bp.register_authenticator(app)

    # dashboards
    models = [
        *MODELS,
        *action_models,
        *standard_models,
        auth_bp.models.user_class,
        auth_bp.models.role_class,
        *pipeline_models,
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
            '/' + datasource_instance.id
        print(f'Registering data blueprint for {datasource_instance.id} at {api_path}')

        app.register_blueprint(
            blueprint_data,
            url_prefix=api_path,
            name=datasource_instance.id
        )

    # The system endpoints
    blueprint_system = system_blueprint()
    app.register_blueprint(blueprint_system, url_prefix=os.getenv('API_PATH') + '/system')
    
    # Define Prefect datasource here
    pds = prefect(insecure=True)

    # Endpoints targeting our local database
    core_data_object(sql_ds)
    blueprint_data_local = data_blueprint(
        sql_ds,
        auth_inspector=get_local_auth_inspector(),
        flow_ds=pds,
        action_ds=sql_ds
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

    # pipeline / validation
    pipeline_bp = pipeline_steps_blueprint(
        sql_ds,
        pds,
        ctx_getter=default_ctx_getter,
        url_prefix=os.environ['API_PATH'] + '/run-pipeline',
        role=None
    )
    app.register_blueprint(pipeline_bp)

    # data upload
    upload_bp = data_upload_blueprint(url_prefix=os.environ['API_PATH'] + '/data-upload')
    app.register_blueprint(upload_bp)

    return app
