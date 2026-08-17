"""update roles and permissions in Portal

Revision ID: 76b4b918b8a4
Revises: 9f558102d9ac
Create Date: 2026-08-12 14:30:20.282326

"""
from alembic import op


# revision identifiers, used by Alembic.
revision = '76b4b918b8a4'
down_revision = '9f558102d9ac'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Delete old roles and permissions
    op.execute("""
        DO $$
        BEGIN
        DELETE FROM role_action WHERE role_id IN (SELECT id FROM role WHERE name IN ('exporter', 'topup'));
        DELETE FROM role_binding WHERE role_id IN (SELECT id FROM role WHERE name IN ('exporter', 'topup'));
        DELETE FROM role WHERE name IN ('exporter', 'topup');
        END
        $$;
    """)

    # Add new roles and permissions
    op.execute("""
        INSERT INTO role (name)
        VALUES
            ('core lab top up'),
            ('core lab sample export')
        ON CONFLICT (name) DO NOTHING;

        WITH mapping(action_name, role_names) AS (
            VALUES
            ('DNA Extraction', ARRAY['admin', 'warden', 'core lab top up']),
            ('Request Resequencing', ARRAY['admin', 'warden', 'core lab top up']),
            ('Insert into LI Work List', ARRAY['admin', 'warden', 'core lab top up']),
            ('Insert into ULI Work List', ARRAY['admin', 'warden', 'core lab top up']),
            ('Insert into Tissue Prep Work List', ARRAY['admin', 'warden', 'core lab top up']),
            ('Insert into Benchling Tissue Work List', ARRAY['admin', 'warden', 'core lab top up']),
            ('Mark as Not Valid', ARRAY['admin', 'warden', 'core lab top up']),
            ('Mark for recollection', ARRAY['admin', 'warden', 'core lab top up']),
            ('Export into Benchling', ARRAY['admin', 'warden', 'core lab top up']),
            ('Send for ARA Review', ARRAY['admin', 'warden', 'core lab top up']),
            ('Remove from ARA Review', ARRAY['admin', 'warden', 'core lab top up']),
            ('LRES - DNA extraction (NEW)', ARRAY['core lab sample export']),
            ('LRES - DNA extraction + HiC (NEW)', ARRAY['core lab sample export']),
            ('HiC (NEW)', ARRAY['core lab sample export']),
            ('HiC only (NEW)', ARRAY['core lab sample export']),
            ('HiC + RNA (NEW)', ARRAY['core lab sample export']),
            ('RNA (NEW)', ARRAY['core lab sample export']),
            ('PiMmS (NEW)', ARRAY['core lab sample export']),
            ('LRES - DNA extraction', ARRAY['core lab sample export']),
            ('LRES - DNA extraction + HiC', ARRAY['core lab sample export']),
            ('HiC', ARRAY['core lab sample export']),
            ('HiC only', ARRAY['core lab sample export']),
            ('HiC + RNA', ARRAY['core lab sample export']),
            ('RNA', ARRAY['core lab sample export']),
            ('PiMmS', ARRAY['core lab sample export']),
            ('TEST ACTION - DO NOT USE', ARRAY['warden'])
        ), expanded AS (
            SELECT m.action_name, rn.role_name
            FROM mapping m
            CROSS JOIN LATERAL unnest(m.role_names) AS rn(role_name)
        )
        INSERT INTO role_action (role_id, action_id)
        SELECT r.id, a.id
        FROM expanded e
        JOIN role r ON r.name = e.role_name
        JOIN action a ON a.name = e.action_name
        LEFT JOIN role_action ra
            ON ra.role_id = r.id
            AND ra.action_id = a.id
        WHERE ra.id IS NULL;
    """)

    # Restore role bindings for existing users
    op.execute("""
        INSERT INTO role_binding (user_id, role_id)
        VALUES
            ('26', (SELECT id FROM role WHERE name = 'core lab top up')),
            ('26', (SELECT id FROM role WHERE name = 'core lab sample export')),
            ('8', (SELECT id FROM role WHERE name = 'core lab top up')),
            ('8', (SELECT id FROM role WHERE name = 'core lab sample export')),
            ('139', (SELECT id FROM role WHERE name = 'core lab top up')),
            ('139', (SELECT id FROM role WHERE name = 'core lab sample export'))
        """)


def downgrade() -> None:
    pass
