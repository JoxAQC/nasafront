// --- 1. CONSTANTES FÍSICAS ---
const DENSITY_SILICEOUS = 2700; // kg/m³
const V_IMPACT_ASSUMED = 20000; // m/s
const ALBEDO_ASSUMED = 0.15;
const JOULES_TO_MEGATONS = 4.184e15;

// --- 2. FUNCIONES DE CÁLCULO ---

/**
 * Calcula el diámetro (km) a partir de la magnitud absoluta (H)
 * Fórmula: log10(D) = 3.13 - 0.2H - 0.5*log10(pv)
 */
function calculateDiameter(H: number, pv = ALBEDO_ASSUMED) {
  const logD = 3.13 - 0.2 * H - 0.5 * Math.log10(pv);
  return Math.pow(10, logD); // en km
}

/**
 * Calcula masa, energía, radio de daño y diámetro del cráter
 */
export function calculateImpactMetrics(H: number) {
  const D_km = calculateDiameter(H);
  const D_m = D_km * 1000;
  const radius = D_m / 2;
  const volume = (4 / 3) * Math.PI * Math.pow(radius, 3);
  const mass = volume * DENSITY_SILICEOUS;

  // Energía cinética
  const Ek_joules = 0.5 * mass * Math.pow(V_IMPACT_ASSUMED, 2);
  const Ek_megatons = Ek_joules / JOULES_TO_MEGATONS;

  // Radio de destrucción (km)
  const R_blast_km = 1.5 * Math.cbrt(Ek_megatons);

  // Diámetro del cráter (km)
  const D_crater_km = 15 * D_km;

  return {
    D_diameter_m: D_m.toFixed(2),
    M_mass_kg: mass.toExponential(2),
    Ek_megatons: Ek_megatons.toFixed(2),
    R_blast_km: R_blast_km.toFixed(2),
    D_crater_km: D_crater_km.toFixed(3)
  };
}

/**
 * Simula un impacto a partir del asteroide seleccionado y coordenadas
 */
export function simulateImpact(asteroidName: string, H: number, lat: number, lng: number) {
  const results = calculateImpactMetrics(H);
  return {
    asteroid_name: asteroidName,
    impact_coords: { lat, lng },
    H_magnitude: H,
    V_impact_assumed_km_s: V_IMPACT_ASSUMED / 1000,
    density_assumed_kg_m3: DENSITY_SILICEOUS,
    results
  };
}
