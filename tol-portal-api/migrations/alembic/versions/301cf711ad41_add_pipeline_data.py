"""Add pipeline data

Revision ID: 301cf711ad41
Revises: f31f445c0f5d
Create Date: 2025-08-21 08:47:01.209011

"""
from alembic import op
from sqlalchemy.sql import table, column
from sqlalchemy import Integer, String
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = '301cf711ad41'
down_revision = 'f31f445c0f5d'
branch_labels = None
depends_on = None


def upgrade() -> None:
    pipeline_table = table(
        'pipeline',
        column('id', Integer),
        column('name', String),
        column('config', postgresql.JSONB())
    )

    pipeline_steps_table = table(
        'pipeline_steps',
        column('id', Integer),
        column('pipeline_id', Integer),
        column('step_name', String),
        column('stage', Integer),
        column('step_order', Integer),
        column('config', postgresql.JSONB())
    )

    pipeline_data = [
        {
            'id': 1,
            'name': 'test_tos_pipeline',
            'config': {
                    "source": {
                        "module": "tol.excel",
                        "factory": "s3_excel_datasource_factory",
                        "object_type": "test"
                    }
            }
        }
    ]

    pipeline_steps_data = [
        {
            'id': 1,
            'pipeline_id': 1,
            'step_name': 'test_step',
            'stage': 1,
            'step_order': 1,
            'config': {
                "args": [
                    [
                        "source",
                        "taxon_id"
                    ]
                ],
                "module": "tol.validators",
                "factory": "AllowedKeysValidator",
                "is_error": True,
                "is_validator": True
            }
        }
    ]

    op.bulk_insert(pipeline_table, pipeline_data)
    op.bulk_insert(pipeline_steps_table, pipeline_steps_data)


def downgrade() -> None:
    pass
