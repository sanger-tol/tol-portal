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
from tol.core import core_data_object
from tol.sources.elastic import (
    elastic
)
from tol.sql import create_sql_datasource
from tol.sql.auth import db_auth_blueprint
from tol.status import StatusDataSource

from .auth import (
    get_auth_inspector
)
from .model import (
    Base,
    DataLoadEvent,
    SequencingRequestEvent
)
from .model.sts import (
    BankedSample,
    BankedSampleCategory,
    Cmethod,
    ComplianceStatus,
    EPSample,
    FreezerTray,
    Gal,
    Hook,
    Lifestage,
    Location,
    Manifest,
    ManifestStatus,
    OrganismPart,
    Papproach,
    Person,
    Project,
    Psolution,
    Sample,
    SamplePerson,
    SampleProject,
    SampleSpecies,
    SampleSpeciesOrganismPart,
    Sampleset,
    SamplesetLegal,
    SamplesetResearchGovernance,
    SamplesetStatus,
    SequencingMaterialStatus,
    SequencingRequest,
    SequencingRequestStatus,
    SequencingRun,
    Sex,
    ShipmentStatus,
    Species,
    SpeciesLabWorkStatus,
    Specimen,
    StorageRack,
    TissueSize
)
from .model.tolid import (
    Tolid,
    TolidSpecies
)


def application():
    app = Flask(__name__)
    CORS(app, resources={r'/api/*': {'origins': '*'}})
    app.config['CORS_HEADERS'] = 'Content-Type'

    # auth
    auth_bp = db_auth_blueprint(
        Base,
        os.environ['DB_URI'],
        url_prefix=os.environ['API_PATH'] + '/auth'
    )
    app.register_blueprint(auth_bp)
    auth_bp.register_authenticator(app)

    eds = elastic()
    # The main endpoints for the elastic data
    blueprint_data = data_blueprint(eds)
    app.register_blueprint(blueprint_data, url_prefix=os.getenv('API_PATH'))

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

    # TolID endpoints
    tolid = create_sql_datasource(
        models=[TolidSpecies, Tolid],
        db_uri=os.getenv('TOLID_DB_URI'),
        type_function=lambda m: 'tolid_species' if m.get_table_name() == 'species' else 'tolid'
    )
    blueprint_data_tolid = data_blueprint(
        tolid,
        auth_inspector=get_auth_inspector(os.getenv('API_TOKEN'))
    )
    app.register_blueprint(blueprint_data_tolid, name='tolid',
                           url_prefix=os.getenv('API_PATH') + '/external/tolid')

    # STS endpoints
    sts = create_sql_datasource(
        models=[BankedSample, BankedSampleCategory, Cmethod, ComplianceStatus, EPSample,
                FreezerTray, Gal, Hook, Lifestage, Location, Manifest, ManifestStatus,
                OrganismPart, Person, Papproach, Project, Psolution, Sample, SampleProject,
                Sampleset, SamplesetLegal, SamplesetResearchGovernance, SamplePerson,
                SamplesetStatus, SampleSpecies, SampleSpeciesOrganismPart, Sex,
                ShipmentStatus, Species, SpeciesLabWorkStatus, Specimen,
                SequencingMaterialStatus, SequencingRequest, SequencingRequestStatus,
                SequencingRun, StorageRack, TissueSize],
        db_uri=os.getenv('STS_DB_URI')
    )

    blueprint_data_sts = data_blueprint(
        sts,
        auth_inspector=get_auth_inspector(os.getenv('API_TOKEN'))
    )
    app.register_blueprint(blueprint_data_sts, name='sts',
                           url_prefix=os.getenv('API_PATH') + '/external/sts')

    # status board
    status_ds = StatusDataSource({})
    core_data_object(status_ds)

    blueprint_data_status = data_blueprint(
        status_ds,
        auth_inspector=get_auth_inspector(os.getenv('API_TOKEN'))
    )
    app.register_blueprint(blueprint_data_status, name='status_ds',
                           url_prefix=os.getenv('API_PATH') + '/status')

    core_data_object(tolid, sts)

    return app
