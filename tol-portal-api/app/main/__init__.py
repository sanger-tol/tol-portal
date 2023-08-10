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
from tol.core.relationship import RelationshipConfig
from tol.elastic import ElasticDataSource
from tol.sql import create_sql_datasource

from .model import SequencingRequestEvent
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

    rc_sequencing_request = RelationshipConfig()
    rc_sequencing_request.to_one = {'sample_linked_by_benchling_sts_id': 'sample',
                                    'species_linked_by_benchling_taxon_id': 'species'}
    rc_sequencing_request.foreign_keys = {
        'sample_linked_by_benchling_sts_id': 'benchling_sts_id',
        'species_linked_by_benchling_taxon_id': 'benchling_taxon_id'
    }
    rc_sample = RelationshipConfig()
    rc_sample.to_many = {
        'sequencing_requests_linked_by_benchling_sts_id': 'sequencing_request'
    }
    rc_sample.foreign_keys = {
        'sequencing_requests_linked_by_benchling_sts_id': 'benchling_sts_id'
    }
    rc_species = RelationshipConfig()
    rc_species.to_many = {'samples_linked_by_benchling_taxon_id': 'sample'}
    rc_species.foreign_keys = {
        'samples_linked_by_benchling_taxon_id': 'benchling_taxon_id'
    }
    relationship_config = {'sequencing_request': rc_sequencing_request,
                           'sample': rc_sample,
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
        models=[SequencingRequestEvent],
        db_uri=os.getenv('DB_URI')
    )
    core_data_object(sql_datasource)
    blueprint_data_local = data_blueprint(sql_datasource)
    app.register_blueprint(blueprint_data_local, name='local',
                           url_prefix=os.getenv('API_PATH') + '/local')

    # TolID endpoints
    tolid = create_sql_datasource(
        models=[TolidSpecies, TolidSpecimen],
        db_uri=os.getenv('TOLID_DB_URI')
    )
    blueprint_data_tolid = data_blueprint(tolid)
    app.register_blueprint(blueprint_data_tolid, name='tolid',
                           url_prefix=os.getenv('API_PATH') + '/external/tolid')

    # STS endpoints
    sts = create_sql_datasource(
        models=[EPSample, Gal, Location, Project, Sample, SampleProject,
                SampleSpecies, StsSpecies, SpeciesLabWorkStatus, StsSpecimen,
                SequencingRequest, SequencingRun],
        db_uri=os.getenv('STS_DB_URI')
    )
    blueprint_data_sts = data_blueprint(sts)
    app.register_blueprint(blueprint_data_sts, name='sts',
                           url_prefix=os.getenv('API_PATH') + '/external/sts')

    core_data_object(tolid, sts)

    return app
