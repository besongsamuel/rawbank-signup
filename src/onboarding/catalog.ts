export const ONBOARDING_STEP_COUNT = 8;

export const AGENCIES = [
  { id: 'kinshasa_center', name: 'Agence Kinshasa Centre', address: 'Avenue du 30 Juin, Kinshasa' },
  { id: 'kinshasa_gombe', name: 'Agence Kinshasa Gombe', address: 'Boulevard du 30 Juin, Gombe' },
  { id: 'kinshasa_limete', name: 'Agence Kinshasa Limete', address: 'Avenue Kasa-Vubu, Limete' },
  { id: 'lubumbashi_center', name: 'Agence Lubumbashi Centre', address: 'Avenue Kasongo, Lubumbashi' },
  { id: 'lubumbashi_katanga', name: 'Agence Lubumbashi Katanga', address: 'Boulevard Kamalondo, Lubumbashi' },
  { id: 'goma_center', name: 'Agence Goma Centre', address: 'Avenue de la Paix, Goma' },
  { id: 'bukavu_center', name: 'Agence Bukavu Centre', address: "Avenue de l'Indépendance, Bukavu" },
  { id: 'matadi_center', name: 'Agence Matadi Centre', address: 'Avenue du Port, Matadi' },
] as const;

export const ACCOUNT_TYPES = [
  { value: 'individual', label: 'Compte individuel', description: 'Pour une personne' },
  { value: 'joint', label: 'Compte joint', description: 'Partagé entre deux personnes' },
  { value: 'business', label: 'Compte professionnel', description: 'Pour une activité ou une petite entreprise' },
  { value: 'corporate', label: 'Compte entreprise', description: 'Pour une société' },
] as const;

export const MARITAL_STATUSES = [
  { value: 'celibataire', label: 'Célibataire' },
  { value: 'marie', label: 'Marié(e)' },
  { value: 'divorce', label: 'Divorcé(e)' },
  { value: 'veuf', label: 'Veuf ou veuve' },
] as const;

export const MARITAL_REGIMES = [
  { value: 'separation_biens', label: 'Séparation des biens' },
  { value: 'communaute_universelle', label: 'Communauté universelle' },
  { value: 'communaute_reduite', label: 'Communauté réduite aux acquêts' },
] as const;

export const HOUSING_STATUSES = [
  { value: 'proprietaire', label: 'Propriétaire' },
  { value: 'locataire', label: 'Locataire' },
  { value: 'loge_gratuitement', label: 'Logé(e) gratuitement' },
  { value: 'colocation', label: 'Colocation' },
] as const;

export const INCOME_SOURCES = [
  { value: 'salaire', label: 'Salaire' },
  { value: 'honoraires', label: 'Honoraires' },
  { value: 'pension', label: 'Pension' },
  { value: 'commerce', label: 'Commerce' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'elevage', label: 'Élevage' },
  { value: 'transport', label: 'Transport' },
  { value: 'immobilier', label: 'Immobilier' },
  { value: 'investissement', label: 'Investissement' },
  { value: 'autre', label: 'Autre' },
] as const;

export const PEP_CATEGORIES = [
  { value: 'government_official', label: 'Responsable public' },
  { value: 'political_party_leader', label: 'Dirigeant de parti' },
  { value: 'military_officer', label: 'Officier militaire' },
  { value: 'judicial_official', label: 'Magistrat' },
  { value: 'state_enterprise_executive', label: "Dirigeant d'entreprise publique" },
  { value: 'family_member', label: "Membre de la famille d'une PPE" },
  { value: 'close_associate', label: "Proche d'une PPE" },
] as const;

export const CARD_OPTIONS = [
  { id: 'carte_fidelite_usd', name: 'Carte Fidélité USD', description: 'Retraits en RDC sur le réseau Multipay' },
  { id: 'carte_mosolo_cdf', name: 'Carte Mosolo CDF', description: 'Retraits en RDC sur le réseau Mosolo' },
  { id: 'visa_debit_cdf', name: 'Visa débit CDF', description: 'Paiements et retraits liés à un compte en francs' },
  { id: 'visa_infinite', name: 'Visa Infinite', description: 'Carte pour les clients Privilege' },
  { id: 'visa_academia', name: 'Visa Academia', description: 'Carte jeune, en RDC et à l’international' },
  { id: 'visa_debit_euro', name: 'Visa débit Euro', description: 'Carte liée à un compte en euros' },
  { id: 'mastercard_travelers', name: "Mastercard Traveler's", description: 'Carte prépayée internationale en USD' },
  { id: 'carte_virtuelle', name: 'Carte virtuelle', description: 'Pour les paiements en ligne' },
  { id: 'visa_debit_upi', name: 'Visa débit UPI', description: 'Carte internationale liée à un compte en dollars' },
] as const;

export function labelFor(options: readonly { value?: string; id?: string; label?: string; name?: string }[], value?: string | null) {
  if (!value) return '';
  const match = options.find((option) => option.value === value || option.id === value);
  return match?.label || match?.name || '';
}

export function agencyById(id?: string | null) {
  return AGENCIES.find((agency) => agency.id === id);
}
