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
from tol.api_base2.misc import (
    quick_and_dirty_auth
)
from tol.core import core_data_object
from tol.core.relationship import RelationshipConfig
from tol.elastic import ElasticDataSource
from tol.sql import create_sql_datasource

from .model import (
    DataLoadEvent,
    SequencingRequestEvent
)
from .model.sts import (
    EPSample,
    Gal,
    Location,
    Project,
    Sample,
    SampleProject,
    SampleSpecies,
    SequencingRequest,
    SequencingRun,
    Species as StsSpecies,
    SpeciesLabWorkStatus,
    Specimen as StsSpecimen
)
from .model.tolid import (
    Species as TolidSpecies,
    Specimen as TolidSpecimen
)


def application():
    app = Flask(__name__)
    CORS(app, resources={r'/api/*': {'origins': '*'}})
    app.config['CORS_HEADERS'] = 'Content-Type'

    rc_barcoding_run_data = RelationshipConfig()
    rc_barcoding_run_data.to_one = {
        'sts_sample': 'sample',
        'sts_specimen': 'specimen',
        'bioscan_specimen': 'specimen',
        'sts_species': 'species'
    }

    rc_run_data = RelationshipConfig()
    rc_run_data.to_one = {'mlwh_sequencing_request': 'sequencing_request',
                          'mlwh_specimen': 'specimen',
                          'mlwh_species': 'species',
                          'tolqc_sequencing_request': 'sequencing_request',
                          'tolqc_specimen': 'specimen',
                          'tolqc_species': 'species'}

    rc_sequencing_request = RelationshipConfig()
    rc_sequencing_request.to_one = {'benchling_sample': 'sample',
                                    'benchling_species': 'species'}
    rc_sequencing_request.to_many = {
        'mlwh_run_datas': 'run_data',
        'tolqc_run_datas': 'run_data'
    }
    rc_sequencing_request.foreign_keys = {
        'mlwh_run_datas': 'mlwh_sequencing_request.id',
        'tolqc_run_datas': 'tolqc_sequencing_request.id'
    }

    rc_sample = RelationshipConfig()
    rc_sample.to_one = {'sts_specimen': 'specimen',
                        'benchling_specimen': 'specimen',
                        'sts_species': 'species',
                        'benchling_species': 'species'}
    rc_sample.to_many = {
        'sts_barcoding_run_datas': 'barcoding_run_data',
        'benchling_sequencing_requests': 'sequencing_request'
    }
    rc_sample.foreign_keys = {
        'sts_barcoding_run_datas': 'sts_sample.id',
        'benchling_sequencing_requests': 'benchling_sample.id'
    }

    rc_tolid = RelationshipConfig()
    rc_tolid.to_one = {'informatics_specimen': 'specimen'}

    rc_specimen = RelationshipConfig()
    rc_specimen.to_many = {
        'benchling_samples': 'sample',
        'sts_samples': 'sample',
        'bioscan_barcoding_run_datas': 'barcoding_run_data',
        'sts_barcoding_run_datas': 'barcoding_run_data'
    }
    rc_specimen.foreign_keys = {
        'benchling_samples': 'benchling_specimen.id',
        'sts_samples': 'sts_specimen.id',
        'bioscan_barcoding_run_data': 'bioscan_specimen.id',
        'sts_barcoding_run_data': 'sts_specimen.id'
    }

    rc_species = RelationshipConfig()
    rc_species.to_many = {'sts_samples': 'sample',
                          'benchling_samples': 'sample',
                          'sts_barcoding_run_datas': 'barcoding_run_data'}
    rc_species.foreign_keys = {
        'sts_samples': 'sts_species.id',
        'benchling_samples': 'benchling_species.id',
        'sts_barcoding_run_datas': 'sts_species.id'
    }
    relationship_config = {'run_data': rc_run_data,
                           'sequencing_request': rc_sequencing_request,
                           'barcoding_run_data': rc_barcoding_run_data,
                           'sample': rc_sample,
                           'tolid': rc_tolid,
                           'specimen': rc_specimen,
                           'species': rc_species}

    eds = ElasticDataSource({'uri': os.getenv('ELASTIC_URI'),
                             'user': os.getenv('ELASTIC_USER'),
                             'password': os.getenv('ELASTIC_PASSWORD'),
                             'index_prefix': os.getenv('ELASTIC_INDEX_PREFIX'),
                             'relationship_cfg': relationship_config})
    # The main endpoints for the elastic data
    core_data_object(eds)
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

    authenticator = quick_and_dirty_auth(omnipotent_token='needToKnow43957')

    # TolID endpoints
    tolid = create_sql_datasource(
        models=[TolidSpecies, TolidSpecimen],
        db_uri=os.getenv('TOLID_DB_URI')
    )
    blueprint_data_tolid = data_blueprint(tolid, authenticator=authenticator)
    app.register_blueprint(blueprint_data_tolid, name='tolid',
                           url_prefix=os.getenv('API_PATH') + '/external/tolid')

    # STS endpoints
    sts = create_sql_datasource(
        models=[EPSample, Gal, Location, Project, Sample, SampleProject,
                SampleSpecies, StsSpecies, SpeciesLabWorkStatus, StsSpecimen,
                SequencingRequest, SequencingRun],
        db_uri=os.getenv('STS_DB_URI')
    )
    blueprint_data_sts = data_blueprint(sts, authenticator=authenticator)
    app.register_blueprint(blueprint_data_sts, name='sts',
                           url_prefix=os.getenv('API_PATH') + '/external/sts')

    core_data_object(tolid, sts)

    return app
