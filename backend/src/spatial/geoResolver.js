/**
 * Darukaa.Earth AI Biodiversity Intelligence System
 * Geo-Spatial & Biome Context Resolver (ES Modules)
 */

export const KNOWN_ECOREGIONS = [
  {
    region_id: "DECCAN_SEMI_ARID",
    name: "Deccan Plateau Semi-Arid Drylands",
    bounds: { min_lat: 12.0, max_lat: 22.0, min_lon: 74.0, max_lon: 80.0 },
    climate_zone: "semi-arid (BSh)",
    annual_precipitation_avg: "400 - 650 mm/yr (Highly Monsoonal / 8-month dry season)",
    typical_soc_pct: 0.35,
    typical_soil_ph: 7.8,
    soil_order: "Vertisols / Alfisols (Black cotton / Red sandy loams)",
    limiting_factors: ["High potential evapotranspiration", "Topsoil organic matter depletion", "Monoculture cotton/wheat"]
  },
  {
    region_id: "SAHEL_SAVANNAH",
    name: "Sahelian Semi-Arid Agro-Pastoral Belt",
    bounds: { min_lat: 11.0, max_lat: 17.0, min_lon: -16.0, max_lon: 30.0 },
    climate_zone: "arid / semi-arid (BWh / BSh)",
    annual_precipitation_avg: "250 - 500 mm/yr (Unimodal short wet season)",
    typical_soc_pct: 0.25,
    typical_soil_ph: 6.5,
    soil_order: "Arenosols / Regosols (Sandy, highly permeable)",
    limiting_factors: ["Wind erosion", "Extreme vapor pressure deficit", "Nitrogen/Phosphorus deficiency"]
  },
  {
    region_id: "MEDITERRANEAN_BASIN",
    name: "Mediterranean Basin Dryland Basin",
    bounds: { min_lat: 34.0, max_lat: 44.0, min_lon: -10.0, max_lon: 36.0 },
    climate_zone: "mediterranean (Csa / Csb)",
    annual_precipitation_avg: "350 - 600 mm/yr (Winter rain, hot arid summer)",
    typical_soc_pct: 0.65,
    typical_soil_ph: 7.5,
    soil_order: "Cambisols / Calcisols",
    limiting_factors: ["Summer drought stress", "Sheet erosion on slopes", "Soil crusting"]
  },
  {
    region_id: "US_GREAT_PLAINS",
    name: "North American Great Plains (Semi-Arid Steppe)",
    bounds: { min_lat: 32.0, max_lat: 48.0, min_lon: -104.0, max_lon: -96.0 },
    climate_zone: "semi-arid continental (BSk)",
    annual_precipitation_avg: "350 - 550 mm/yr",
    typical_soc_pct: 0.80,
    typical_soil_ph: 6.8,
    soil_order: "Mollisols (Degraded through intensive tillage)",
    limiting_factors: ["Intense wind erosion", "Deep percolation loss", "Continuous wheat-fallow cycle"]
  }
];

export class GeoSpatialResolver {
  constructor() {
    this.ecoregions = KNOWN_ECOREGIONS;
  }

  resolve(lat, lon) {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    for (const region of this.ecoregions) {
      const b = region.bounds;
      if (latitude >= b.min_lat && latitude <= b.max_lat && longitude >= b.min_lon && longitude <= b.max_lon) {
        return region;
      }
    }

    const absLat = Math.abs(latitude);
    if (absLat < 15) {
      return {
        region_id: "EQUATORIAL_TROPICAL",
        name: "Tropical Wet / Dry Ecoregion",
        climate_zone: "tropical (Aw / Af)",
        annual_precipitation_avg: "1200 - 1800 mm/yr",
        typical_soc_pct: 0.90,
        typical_soil_ph: 5.4,
        soil_order: "Oxisols / Ultisols",
        limiting_factors: ["Nutrient leaching", "Phosphorus fixation"]
      };
    } else if (absLat >= 15 && absLat <= 35) {
      return {
        region_id: "SUBTROPICAL_SEMI_ARID",
        name: "Subtropical Dryland / Semi-Arid Zone",
        climate_zone: "semi-arid (BSh)",
        annual_precipitation_avg: "350 - 600 mm/yr",
        typical_soc_pct: 0.40,
        typical_soil_ph: 7.2,
        soil_order: "Aridisols / Alfisols",
        limiting_factors: ["Water deficit", "Low organic matter"]
      };
    } else {
      return {
        region_id: "TEMPERATE_ZONE",
        name: "Temperate Agricultural Zone",
        climate_zone: "temperate (Cfb / Dfb)",
        annual_precipitation_avg: "650 - 950 mm/yr",
        typical_soc_pct: 1.20,
        typical_soil_ph: 6.5,
        soil_order: "Luvisols / Mollisols",
        limiting_factors: ["Compaction from machinery", "Seasonal frost"]
      };
    }
  }

  listKnownRegions() {
    return this.ecoregions;
  }
}

export const geoResolver = new GeoSpatialResolver();
