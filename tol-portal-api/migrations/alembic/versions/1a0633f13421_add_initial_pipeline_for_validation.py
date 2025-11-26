"""Add initial pipeline for validation

Revision ID: 1a0633f13421
Revises: 39e1d9d96f33
Create Date: 2025-11-26 11:06:28.603036

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import table, column
from sqlalchemy import String, Integer, JSON


# revision identifiers, used by Alembic.
revision = '1a0633f13421'
down_revision = '39e1d9d96f33'
branch_labels = None
depends_on = None


def upgrade() -> None:
    pipeline_table = table('pipeline',
                           column('id', Integer),
                           column('name', String),
                           column('config', JSON)
                           )

    pipeline_data = [
        {'id': 1, 'name': 'Portal Test Validation', 'config': {'source': {
            'module': 'tol.excel',
            'factory': 's3_excel_datasource_factory',
            'object_type': 'upload',
            'kwargs': {'sheetname': 'MetaData Entry'}
        }}}
    ]

    op.bulk_insert(pipeline_table, pipeline_data)

    steps_table = table('pipeline_steps',
                        column('id', Integer),
                        column('pipeline_id', Integer),
                        column('step_name', String),
                        column('stage', Integer),
                        column('step_order', Integer),
                        column('config', JSON)
                        )
    step_data = [
        {'id': 1,
         'pipeline_id': 1,
         'step_name': 'Regex Match',
         'stage': 1,
         'step_order': 1,
         'config': {
             "args": [
                 {
                     "key": "DECIMAL_LONGITUDE",
                     "regex": r"(^[+-]?[0-9]+.?[0-9]{0,8}$)|(^not collected$)|(^not provided$)|(^restricted access$)"
                 }
             ],
             "module": "tol.validators",
             "factory": "RegexValidator",
             "is_validator": True
         }
         }]

    op.bulk_insert(steps_table, step_data)


def downgrade() -> None:
    pass
