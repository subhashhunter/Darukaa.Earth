/**
 * Darukaa.Earth AI Biodiversity Intelligence System
 * Causal Graph & Biological Mechanistic Pathway Engine (ES Modules)
 */

export function generateCausalChains(scenarioType) {
  if (scenarioType === "semi_arid_agroforestry_wheat") {
    return [
      {
        chain_id: "CHAIN-01",
        name: "Soil Organic Carbon ↔ Soil Porosity ↔ Rhizosphere Biome ↔ Water Retention",
        nodes: [
          {
            stage: "1. Prescribed Intervention",
            title: "Reverse-Phenology Agroforestry & Leguminous Intercropping",
            description: "Establish Faidherbia albida (30 trees/ha) + Cajanus cajan (pigeon pea) inter-row planting in monoculture wheat acreage."
          },
          {
            stage: "2. Biochemical Transformation",
            title: "Biological N2 Fixation & Glomalin Secretion",
            description: "Rhizobia nodule symbiosis fixes 35–55 kg bioavailable N/ha; arbuscular mycorrhizal fungi (AMF) exude glomalin glycoprotein binding mineral particles into water-stable macro-aggregates."
          },
          {
            stage: "3. Hydrological Structural Response",
            title: "Capillary Pore Volume & Available Water Capacity (+32%)",
            description: "Enhances root-zone water storage by 28–38%, buffering crops against 40+ days of mid-season precipitation gaps in semi-arid drylands."
          },
          {
            stage: "4. Ecosystem Climax",
            title: "Microbial Biomass (+55%) & Shannon Biodiversity ($H'$ +0.85)",
            description: "Heterogeneous root exudates nourish diverse bacterial and fungal decomposers, suppressing soil-borne pathogens and stabilizing grain yields."
          }
        ]
      },
      {
        chain_id: "CHAIN-02",
        name: "Microclimate Canopy Buffering ↔ Vapor Pressure Deficit ↔ Photosynthetic Continuity",
        nodes: [
          {
            stage: "1. Prescribed Intervention",
            title: "Stratified Canopy Architecture (Evergreen Agriculture)",
            description: "Spaced perennial tree canopy providing filtered solar radiance and wind attenuation."
          },
          {
            stage: "2. Thermodynamic Response",
            title: "Vapor Pressure Deficit (VPD) Reduction & Transpirational Cooling",
            description: "Reduces peak mid-day canopy surface temperatures by 2.2–3.8°C and suppresses direct evaporative moisture loss from topsoil by 20–35% (IPCC AR6 WGII)."
          },
          {
            stage: "3. Climax Stabilization",
            title: "Crop Stomatal Conductance & Drought Resilience (+30%)",
            description: "Prevents midday stomatal closure and thermal shock in wheat, securing harvest viability during drought pulses."
          }
        ]
      }
    ];
  }

  return [
    {
      chain_id: "CHAIN-01",
      name: "Plant Diversity ↔ Underground Hyphal Networks ↔ Trophic Food Webs",
      nodes: [
        {
          stage: "1. Intervention",
          title: "Polyculture Diversification & Native Perennial Boundary Margins",
          description: "Transition continuous single-crop fields to 4-family polycultures with 8% flowering hedgerow corridors."
        },
        {
          stage: "2. Biological Cascade",
          title: "Multi-Tier Rhizodeposition & Continuous Nectar Provision",
          description: "Variable root depths exude diverse polysaccharides feeding mycorrhizae; nectar flora feeds hoverflies, parasitoid wasps, and wild bees."
        },
        {
          stage: "3. Systemic Metric Improvement",
          title: "Soil Carbon (+25%) & Wild Pollinator Richness (+65%)",
          description: "Simultaneously increases soil water capacity, drives natural biological pest suppression, and restores regional biodiversity index."
        }
      ]
    }
  ];
}
