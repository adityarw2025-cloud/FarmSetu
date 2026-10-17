import type { CropDiseaseDiagnosis } from '../types';

export interface SampleLeaf {
  id: string;
  crop: string;
  condition: string;
  image: string;
  tag: string;
}

export const SAMPLE_LEAVES: SampleLeaf[] = [
  {
    id: 'sample-tomato-blight',
    crop: 'Tomato',
    condition: 'Early Blight',
    tag: 'Fungal Leaf Infection',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sample-potato-blight',
    crop: 'Potato',
    condition: 'Late Blight',
    tag: 'Oomycete Lesions',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sample-wheat-rust',
    crop: 'Wheat',
    condition: 'Yellow Rust',
    tag: 'Stripe Rust Spores',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sample-healthy',
    crop: 'Bell Pepper / Capsicum',
    condition: 'Healthy Vigorous Leaf',
    tag: 'Optimal Chlorophyll',
    image: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=800&q=80'
  }
];

export const DISEASE_DATABASE: Record<string, Omit<CropDiseaseDiagnosis, 'id' | 'analyzedAt' | 'imageUrl'>> = {
  'Tomato Early Blight': {
    cropName: 'Tomato (Solanum lycopersicum)',
    diseaseName: 'Tomato Early Blight',
    scientificName: 'Alternaria solani',
    confidenceScore: 94,
    severity: 'High',
    symptoms: [
      'Concentric dark brown target spots on older foliage',
      'Chlorotic yellow halos surrounding necrotic lesions',
      'Premature defoliation starting from the lower canopy',
      'Collar rot around stem base in severe stages'
    ],
    organicTreatment: [
      'Spray Cold-Pressed Neem Oil (5ml per liter) with bio-soap emulsifier',
      'Foliar spray of Trichoderma harzianum bio-fungicide (2.5g/L)',
      'Baking soda & horticultural oil solution (1 tbsp baking soda + 2.5ml vegetable oil per gallon)'
    ],
    chemicalTreatment: [
      'Mancozeb 75% WP (2.5g per liter of water) applied during early morning',
      'Copper Oxychloride 50% WP (3g per liter) preventative spray'
    ],
    preventiveMeasures: [
      'Switch from overhead sprayers to drip irrigation to keep canopy dry',
      'Prune and safely burn infected leaves below 30cm off the soil line',
      'Practice strict 3-year crop rotation with non-solanaceous crops (e.g. Maize, Legumes)',
      'Mulch soil bed with clean straw to prevent rain-splash spore transmission'
    ],
    expertAdviceNeeded: false
  },
  'Potato Late Blight': {
    cropName: 'Potato (Solanum tuberosum)',
    diseaseName: 'Potato Late Blight',
    scientificName: 'Phytophthora infestans',
    confidenceScore: 89,
    severity: 'High',
    symptoms: [
      'Water-soaked dark lesions spreading rapidly across leaf tips',
      'White downy fungal growth on underside of leaves under high humidity',
      'Rapid wilting and brown rot odor in fields'
    ],
    organicTreatment: [
      'Apply Bordeaux mixture (1% solution) thoroughly across upper and lower canopy',
      'Bio-stimulant Bacillus subtilis bio-protection spray'
    ],
    chemicalTreatment: [
      'Metalaxyl + Mancozeb (Ridomil MZ @ 2.5g/L water)',
      'Cymoxanil 8% + Mancozeb 64% WP'
    ],
    preventiveMeasures: [
      'Destroy volunteer potato plants and cull piles from previous harvests',
      'Plant certified disease-resistant certified seed tubers',
      'Ensure wide row spacing (60-70cm) for optimal wind circulation'
    ],
    expertAdviceNeeded: false
  },
  'Wheat Yellow Rust': {
    cropName: 'Wheat (Triticum aestivum)',
    diseaseName: 'Yellow Stripe Rust',
    scientificName: 'Puccinia striiformis',
    confidenceScore: 92,
    severity: 'Moderate',
    symptoms: [
      'Linear stripes of bright yellow-orange uredinial pustules along leaf veins',
      'Powdery orange spores rubbing off on farmer hands upon contact',
      'Stunted grain development and shriveled kernels'
    ],
    organicTreatment: [
      'Bio-formulation of Pseudomonas fluorescens (5ml/L)',
      'Foliar bio-sulfur wettable powder application'
    ],
    chemicalTreatment: [
      'Propiconazole 25% EC (Tilt @ 1ml per liter of water)',
      'Tebuconazole 25.9% EC @ 1ml/L'
    ],
    preventiveMeasures: [
      'Sow rust-resistant varieties recommended for your agro-climatic zone',
      'Avoid excessive late-season nitrogen fertilizer that fosters vegetative spore growth',
      'Maintain field sanitation and manage weed hosts (grass weeds)'
    ],
    expertAdviceNeeded: false
  },
  'Healthy Leaf': {
    cropName: 'Healthy Crop Sample',
    diseaseName: 'No Pathology Detected (Healthy Leaf)',
    scientificName: 'Physiologically Sound Plant Tissue',
    confidenceScore: 98,
    severity: 'None (Healthy)',
    symptoms: [
      'Vibrant uniform green coloration without chlorosis',
      'Intact cuticle and cellular structure',
      'No fungal spores, bacterial oozes, or insect chewing marks observed'
    ],
    organicTreatment: [
      'Continue standard balanced nourishment and micro-nutrient foliar spray',
      'Apply liquid seaweed extract or Panchagavya monthly for immune resilience'
    ],
    chemicalTreatment: [],
    preventiveMeasures: [
      'Maintain regular scout monitoring every 4 to 5 days',
      'Keep soil organic carbon healthy with compost / vermicompost',
      'Adhere to recommended crop watering schedules'
    ],
    expertAdviceNeeded: false
  }
};

/**
 * Simulates AI computer vision analysis on a given image.
 */
export async function analyzeCropDisease(
  imageUrl: string,
  sampleId?: string
): Promise<CropDiseaseDiagnosis> {
  // Simulate neural processing delay
  await new Promise(resolve => setTimeout(resolve, 1800));

  let profile = DISEASE_DATABASE['Tomato Early Blight'];

  if (sampleId === 'sample-potato-blight') {
    profile = DISEASE_DATABASE['Potato Late Blight'];
  } else if (sampleId === 'sample-wheat-rust') {
    profile = DISEASE_DATABASE['Wheat Yellow Rust'];
  } else if (sampleId === 'sample-healthy') {
    profile = DISEASE_DATABASE['Healthy Leaf'];
  } else {
    const keys = Object.keys(DISEASE_DATABASE);
    const chosenKey = keys[Math.floor(Math.random() * (keys.length - 1))];
    profile = DISEASE_DATABASE[chosenKey];
  }

  return {
    id: `CC-${Date.now().toString(36).toUpperCase()}`,
    ...profile,
    analyzedAt: new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    imageUrl
  };
}
