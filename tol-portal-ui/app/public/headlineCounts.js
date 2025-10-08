/*
 * SPDX-FileCopyrightText: 2025 Genome Research Ltd.
 *
 * SPDX-License-Identifier: MIT
 */

class TolApi {
  static ENDPOINT_PREFIX = "https://portal.tol.sanger.ac.uk/api/v1/data/tol_production";

  static async fetchWithRetry(url, options = {}, retries = 3, delay = 1000) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      if (retries > 0) {
        console.warn(`Retrying... attempts left: ${retries}`, error);
        await new Promise(res => setTimeout(res, delay));
        return TolApi.fetchWithRetry(url, options, retries - 1, delay * 2);
      } else {
        throw error;
      }
    }
  }

  static async fetchCount(object_type, filter = {}) {
    const endpoint = `${TolApi.ENDPOINT_PREFIX}/${object_type}:count`;
    const params = { filter: JSON.stringify(filter) };
    const queryString = new URLSearchParams(params).toString();
    const url = `${endpoint}?${queryString}`;

    try {
      const data = await TolApi.fetchWithRetry(url, { method: "GET" }, 3, 1000);
      return data?.meta?.total ?? null;
    } catch (error) {
      console.error("Failed to fetch species count:", error);
      return null;
    }
  }

  static async fetchStat(object_type, attributeName, stat, filter = {}) {
    const endpoint = `${TolApi.ENDPOINT_PREFIX}/${object_type}:stats`;
    const params = {
      stats_fields: attributeName,
      stats: stat,
      filter: JSON.stringify(filter),
    };
    const queryString = new URLSearchParams(params).toString();
    const url = `${endpoint}?${queryString}`;

    try {
      const data = await TolApi.fetchWithRetry(url, { method: "GET" }, 3, 1000);
      return data?.meta?.stats?.[attributeName]?.[stat] ?? null;
    } catch (error) {
      console.error("Failed to fetch stat:", error);
      return null;
    }
  }

  static async fetchTotalSpeciesSubmitted() {
    return await TolApi.fetchCount("species", {
      and_: {
        grit_curation_grit_done_date_min: { exists: {} },
        tolqc_run_data_count: { gt: { value: 0 } }
      }
    });
  }

  static async fetchTotalSpeciesCollected() {
    return await TolApi.fetchCount("species", {
      and_: {
        sts_sample_sts_col_date_min: { exists: {} }
      }
    });
  }

  static async fetchTotalBasesSequenced() {
    return await TolApi.fetchStat(
      "species",
      "tolqc_run_data_tolqc_bases_sum",
      "sum",
      {}
    );
  }
}
