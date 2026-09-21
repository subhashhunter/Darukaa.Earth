"""
Darukaa.Earth AI Biodiversity Intelligence System
Spatial & Geo-Context Resolver
Translates geographic coordinates and global ecoregions into baseline climate,
Köppen classifications, precipitation patterns, and soil archetypes.
"""

from typing import Dict, Any, Optional, List

KNOWN_ECOREGIONS = [
    {
        "region_id": "DECCAN_SEMI_ARID",
        "name": "Deccan Plateau Semi-Arid Drylands",
        "bounds": {"min_lat": 12.0, "max_lat": 22.0, "min_lon": 74.0, "max_lon": 80.0},
        "climate_zone": "semi-arid (BSh)",
        "annual_precipitation_avg": "400 - 650 mm/yr (Highly Monsoonal / 8-month dry season)",
        "typical_soc_pct": 0.35,
        "typical_soil_ph": 7.8,
        "soil_order": "Vertisols / Alfisols (Black cotton / Red sandy loams)",
        "limiting_factors": ["High potential evapotranspiration", "Topsoil organic matter depletion", "Monoculture cotton/wheat"]
    },
    {
        "region_id": "SAHEL_SAVANNAH",
        "name": "Sahelian Semi-Arid Agro-Pastoral Belt",
        "bounds": {"min_lat": 11.0, "max_lat": 17.0, "min_lon": -16.0, "max_lon": 30.0},
        "climate_zone": "arid / semi-arid (BWh / BSh)",
        "annual_precipitation_avg": "250 - 500 mm/yr (Unimodal short wet season)",
        "typical_soc_pct": 0.25,
        "typical_soil_ph": 6.5,
        "soil_order": "Arenosols / Regosols (Sandy, highly permeable)",
        "limiting_factors": ["Wind erosion", "Extreme vapor pressure deficit", "Nitrogen/Phosphorus deficiency"]
    },
    {
        "region_id": "MEDITERRANEAN_BASIN",
        "name": "Mediterranean Basin Dryland Basin",
        "bounds": {"min_lat": 34.0, "max_lat": 44.0, "min_lon": -10.0, "max_lon": 36.0},
        "climate_zone": "mediterranean (Csa / Csb)",
        "annual_precipitation_avg": "350 - 600 mm/yr (Winter rain, hot arid summer)",
        "typical_soc_pct": 0.65,
        "typical_soil_ph": 7.5,
        "soil_order": "Cambisols / Calcisols",
        "limiting_factors": ["Summer drought stress", "Sheet erosion on slopes", "Soil crusting"]
    },
    {
        "region_id": "US_GREAT_PLAINS",
        "name": "North American Great Plains (Semi-Arid Steppe)",
        "bounds": {"min_lat": 32.0, "max_lat": 48.0, "min_lon": -104.0, "max_lon": -96.0},
        "climate_zone": "semi-arid continental (BSk)",
        "annual_precipitation_avg": "350 - 550 mm/yr",
        "typical_soc_pct": 0.80,
        "typical_soil_ph": 6.8,
        "soil_order": "Mollisols (Degraded through intensive tillage)",
        "limiting_factors": ["Intense wind erosion", "Deep percolation loss", "Continuous wheat-fallow cycle"]
    },
    {
        "region_id": "AUSTRALIAN_WHEATBELT",
        "name": "Western / Southern Australian Wheatbelt",
        "bounds": {"min_lat": -35.0, "max_lat": -28.0, "min_lon": 115.0, "max_lon": 140.0},
        "climate_zone": "semi-arid mediterranean (BSh / Csa)",
        "annual_precipitation_avg": "300 - 450 mm/yr",
        "typical_soc_pct": 0.40,
        "typical_soil_ph": 5.2,
        "soil_order": "Ancient weathered Duplex soils / Sandplain",
        "limiting_factors": ["Subsoil acidity", "Dryland salinity", "Low microbial biomass"]
    }
]

class GeoSpatialResolver:
    def __init__(self):
        self.ecoregions = KNOWN_ECOREGIONS

    def resolve(self, lat: float, lon: float) -> Optional[Dict[str, Any]]:
        for region in self.ecoregions:
            b = region["bounds"]
            if b["min_lat"] <= lat <= b["max_lat"] and b["min_lon"] <= lon <= b["max_lon"]:
                return region
        
        # Generic fallback based on latitude
        abs_lat = abs(lat)
        if abs_lat < 15:
            return {
                "region_id": "EQUATORIAL_TROPICAL",
                "name": "Tropical Wet / Dry Ecoregion",
                "climate_zone": "tropical (Aw / Af)",
                "annual_precipitation_avg": "1200 - 1800 mm/yr",
                "typical_soc_pct": 0.90,
                "typical_soil_ph": 5.4,
                "soil_order": "Oxisols / Ultisols",
                "limiting_factors": ["Nutrient leaching", "Phosphorus fixation"]
            }
        elif 15 <= abs_lat <= 35:
            return {
                "region_id": "SUBTROPICAL_SEMI_ARID",
                "name": "Subtropical Dryland / Semi-Arid Zone",
                "climate_zone": "semi-arid (BSh)",
                "annual_precipitation_avg": "350 - 600 mm/yr",
                "typical_soc_pct": 0.40,
                "typical_soil_ph": 7.2,
                "soil_order": "Aridisols / Alfisols",
                "limiting_factors": ["Water deficit", "Low organic matter"]
            }
        else:
            return {
                "region_id": "TEMPERATE_ZONE",
                "name": "Temperate Agricultural Zone",
                "climate_zone": "temperate (Cfb / Dfb)",
                "annual_precipitation_avg": "650 - 950 mm/yr",
                "typical_soc_pct": 1.20,
                "typical_soil_ph": 6.5,
                "soil_order": "Luvisols / Mollisols",
                "limiting_factors": ["Compaction from machinery", "Seasonal frost"]
            }

    def list_known_regions(self) -> List[Dict[str, Any]]:
        return self.ecoregions

# Global Singleton instance
geo_resolver = GeoSpatialResolver()
