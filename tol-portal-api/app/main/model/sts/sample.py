# SPDX-FileCopyrightText: 2023 Genome Research Ltd.
#
# SPDX-License-Identifier: MIT

import datetime
from typing import Any, List

from sqlalchemy import ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from tol.sql import ext

from .base import Base


@ext
class Sample(Base):
    __tablename__ = 'sample'

    copoid: Mapped[str] = mapped_column(unique=True, nullable=True)
    col_date: Mapped[str] = mapped_column()
    col_time: Mapped[str] = mapped_column()
    sample_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    # manifest_id = db.Column(db.Integer, db.ForeignKey('manifest.manifest_id'))
    # manifest = db.relationship("StsManifest", foreign_keys=[manifest_id])
    specimenid: Mapped[str] = mapped_column(
        ForeignKey('specimen.specimen_id'),
        nullable=False
    )
    specimen: Mapped['Specimen'] \
        = relationship(back_populates='samples') # noqa F821

    sampleset_id: Mapped[str] = mapped_column(
        ForeignKey('sampleset.sampleset_id'),
        nullable=False
    )
    sampleset: Mapped['Sampleset'] \
        = relationship(back_populates='samples') # noqa F821

    manifest_id: Mapped[str] = mapped_column(
        ForeignKey('manifest.manifest_id'),
        nullable=False
    )
    manifest: Mapped['Manifest'] \
        = relationship(back_populates='samples') # noqa F821

    sample_projects: Mapped[List['SampleProject']] \
        = relationship(back_populates='sample')  # noqa F821

    sample_species: Mapped[List['SampleSpecies']] \
        = relationship(back_populates='sample')  # noqa F821

    ep_samples: Mapped[List['EPSample']] \
        = relationship(back_populates='sample')  # noqa F821

    banked_samples: Mapped[List['BankedSample']] \
        = relationship(back_populates='sample')  # noqa F821

    series: Mapped[str] = mapped_column()
    rackid: Mapped[str] = mapped_column()
    tubeid: Mapped[str] = mapped_column()
    gal_id: Mapped[str] = mapped_column(
        ForeignKey('gal.gal_id'),
        nullable=False
    )
    gal: Mapped['Gal'] \
        = relationship(back_populates='samples') # noqa F821
    # cmethod_id = db.Column(db.Integer, db.ForeignKey('cmethod.method_id'))
    # collection_method = db.relationship("StsCmethod", uselist=False, foreign_keys=[cmethod_id])
    # col_ease_id = db.Column(db.Integer, db.ForeignKey('collection_ease.ease_id'))
    # collection_ease = db.relationship("StsCollectionEase", uselist=False,
    #                                   foreign_keys=[col_ease_id])
    loc_id: Mapped[str] = mapped_column(
        ForeignKey('location.location_id'),
        nullable=False
    )
    location: Mapped['Location'] \
        = relationship(back_populates='samples') # noqa F821
    # imethod_id = db.Column(db.Integer, db.ForeignKey('imethod.method_id'))
    # identification_method = db.relationship("StsImethod", uselist=False,
    #                                         foreign_keys=[imethod_id])
    specimen_risk: Mapped[str] = mapped_column()
    # papproach_id = db.Column(db.Integer, db.ForeignKey('papproach.approach_id'))
    # preservation_approach = db.relationship("StsPapproach", uselist=False,
    #                                         foreign_keys=[papproach_id])
    # psolution_id = db.Column(db.Integer, db.ForeignKey('psolution.solution_id'))
    # preservation_solution = db.relationship("StsPsolution", uselist=False,
    #                                         foreign_keys=[psolution_id])
    pre_date: Mapped[str] = mapped_column()
    pre_elapsed: Mapped[str] = mapped_column()
    # tsize_id = db.Column(db.Integer, db.ForeignKey('tissue_size.size_id'))
    # tissue_size = db.relationship("StsTissueSize", uselist=False, foreign_keys=[tsize_id])
    tremoved: Mapped[str] = mapped_column()
    bplateid: Mapped[str] = mapped_column()
    btubeid: Mapped[str] = mapped_column()
    # tissue_id = db.Column(db.Integer, db.ForeignKey('tissue.tissue_id'))
    # tissue = db.relationship("StsTissue", uselist=False, foreign_keys=[tissue_id])
    bplate_pre: Mapped[str] = mapped_column()
    # purpose_id = db.Column(db.Integer, db.ForeignKey('specimen_purpose.purpose_id'))
    # specimen_purpose = db.relationship("StsSpecimenPurpose", uselist=False,
    #                                    foreign_keys=[purpose_id])
    # hgroup_id = db.Column(db.Integer, db.ForeignKey('hazard_group.hgroup_id'))
    # hazard_group = db.relationship("StsHazardGroup", uselist=False, foreign_keys=[hgroup_id])
    reg_compliance: Mapped[str] = mapped_column()
    voucherid: Mapped[str] = mapped_column()
    other_info: Mapped[str] = mapped_column()
    triage_applied: Mapped[bool] = mapped_column(default=False)
    triage_ptier: Mapped[str] = mapped_column()
    triage_pnotes: Mapped[str] = mapped_column()
    riskscore: Mapped[float] = mapped_column()
    # rdoutcome_id = db.Column(db.Integer, db.ForeignKey('rd_outcome.outcome_id'))
    # rdoutcome = db.relationship("StsRdOutcome", uselist=False,
    #                             lazy=False, foreign_keys=[rdoutcome_id])
    # status_id = db.Column(db.Integer, db.ForeignKey('sample_status.status_id'))
    # sample_status = db.relationship("StsSampleStatus", uselist=False,
    #                                 lazy=False, foreign_keys=[status_id])
    # cc_status_id = db.Column(db.Integer, db.ForeignKey('compliance_status.status_id'))
    # compliance_status = db.relationship("StsComplianceStatus", uselist=False,
    #                                     lazy=False, foreign_keys=[cc_status_id])
    # sh_status_id = db.Column(db.Integer, db.ForeignKey('shipment_status.status_id'))
    relationship: Mapped[str] = mapped_column()

    hetero_sex: Mapped[str] = mapped_column()
    send_rd: Mapped[str] = mapped_column()
    ac_status: Mapped[str] = mapped_column()
    # cc_updated_by = db.Column(db.Integer, db.ForeignKey('user.user_id'))
    cc_updated_on: Mapped[datetime.datetime] = mapped_column()
    # cc_updated_by_user = db.relationship("StsUser", uselist=False,
    #                                      lazy=False, foreign_keys=[cc_updated_by])

    # ext_ids = db.relationship("StsExtId", lazy=False)
    # ext = db.Column(MutableDict.as_mutable(JSONB), nullable=True)
    symbiont: Mapped[str] = mapped_column()
    tissue_remaining: Mapped[float] = mapped_column()
    tissue_depleted: Mapped[bool] = mapped_column()

    collected_by = []
    identified_by = []
    preserved_by = []

    biospecimen_accession: Mapped[str] = mapped_column()
    submission_accession: Mapped[str] = mapped_column()
    # assigned_by = db.Column(db.Integer, db.ForeignKey('user.user_id'))
    # assigned_by_user = db.relationship("StsUser", uselist=False,
    #                                    lazy=False, foreign_keys=[assigned_by])

    submit_date: Mapped[datetime.datetime] = mapped_column()
    update_date: Mapped[datetime.datetime] = mapped_column()
    accept_date: Mapped[datetime.datetime] = mapped_column()
    reject_date: Mapped[datetime.datetime] = mapped_column()
    receive_date: Mapped[datetime.datetime] = mapped_column()
    tollab_assign_date: Mapped[datetime.datetime] = mapped_column()
    archive_date: Mapped[datetime.datetime] = mapped_column()

    pos_in_rack: Mapped[str] = mapped_column()
    miss_in_shipment: Mapped[bool] = mapped_column()
    ep_group: Mapped[str] = mapped_column()
    ep_synced: Mapped[bool] = mapped_column()
    ep_exported: Mapped[bool] = mapped_column()
    # export_hook_id = db.Column(db.Integer, db.ForeignKey('hook.hook_id'))
    ep_synced_date: Mapped[datetime.datetime] = mapped_column()
    ep_synced_errors: Mapped[int] = mapped_column()
    origin_rackid: Mapped[str] = mapped_column()

    created_on: Mapped[datetime.datetime] = mapped_column()
    updated_at: Mapped[datetime.datetime] = mapped_column()

    biosample_accession: Mapped[str] = mapped_column()
    sra_accession: Mapped[str] = mapped_column()
    public_name: Mapped[str] = mapped_column()

    sample_same_as: Mapped[str] = mapped_column()
    barcode_hub: Mapped[str] = mapped_column()
    original_collection_date: Mapped[str] = mapped_column()
    original_geographic_location: Mapped[str] = mapped_column()
    sample_symbiont_of: Mapped[str] = mapped_column()
    bold_accession: Mapped[str] = mapped_column()

    # storage_updated_by = db.Column(db.Integer, db.ForeignKey('user.user_id'))
    storage_updated_at: Mapped[datetime.datetime] = mapped_column()
    stored_at: Mapped[datetime.datetime] = mapped_column()
    submission_api_status: Mapped[str] = mapped_column()
    submission_api_sync_time: Mapped[datetime.datetime] = mapped_column()

    # disposal_id = db.Column(db.Integer, db.ForeignKey('storage_disposal.disposal_id'))
    # research_governance_status = db.Column(db.Integer,
    #                                        db.ForeignKey('compliance_status.status_id'))
    rg_action_required: Mapped[str] = mapped_column()
    rg_requirement: Mapped[str] = mapped_column()
    # collection_country_id = db.Column(db.Integer, db.ForeignKey('country.country_id'))
    eln_id: Mapped[str] = mapped_column()
    eln_instance: Mapped[str] = mapped_column()
    eln_updated_at: Mapped[datetime.datetime] = mapped_column()
    priority: Mapped[int] = mapped_column()

    sample_format: Mapped[str] = mapped_column()
    inactivation_method: Mapped[str] = mapped_column(nullable=True)
    risk_assessment: Mapped[str] = mapped_column(nullable=True)
    inactivation_approved: Mapped[str] = mapped_column(nullable=True)
    bio_safety_status: Mapped[str] = mapped_column(nullable=True)
    shipment_note: Mapped[str] = mapped_column(nullable=True)
    update_status_error: Mapped[str] = mapped_column(nullable=True)
    relocation_note: Mapped[str] = mapped_column(nullable=True)
    # returned_id = db.Column(db.Integer, db.ForeignKey('storage_returned.returned_id'),
    #                         nullable=True)

    sequencescape_study_id: Mapped[str] = mapped_column(nullable=True)
    cost_code: Mapped[str] = mapped_column(nullable=True)

    ext: Mapped[dict[str, Any]] = mapped_column(type_=JSON, nullable=True)

    @classmethod
    def get_id_column_name(cls) -> str:
        return 'sample_id'
