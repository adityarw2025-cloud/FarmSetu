export type Language = 'en' | 'hi' | 'mr';

export interface Translations {
  // Brand & Tagline
  tagline: string;
  subTagline: string;
  login: string;
  signup: string;
  logout: string;
  welcomeBack: string;

  // Navigation
  home: string;
  marketplace: string;
  myFarm: string;
  equipment: string;
  farmAI: string;
  qualityPassport: string;
  weatherCenter: string;
  activity: string;

  // Hero & CTA
  exploreMarketplace: string;
  listHarvest: string;
  rentMachinery: string;
  viewDetails: string;
  rentMachine: string;
  viewProduce: string;
  viewProduct: string;
  buyNow: string;

  // Features & Pillars
  aiQualityRadar: string;
  aiQualityDesc: string;
  zeroMiddlemen: string;
  zeroMiddlemenDesc: string;
  liveWeatherTitle: string;
  liveWeatherDesc: string;
  equipmentSharing: string;
  equipmentSharingDesc: string;
  directMandiPricing: string;
  directMandiDesc: string;

  // Stats & Badges
  avgQualityScore: string;
  zeroMiddlemenFee: string;
  realtimeWeatherAPI: string;
  farmcheckVerified: string;
  gradeA: string;
  available: string;

  // Dashboard & Metrics
  weatherForecast: string;
  temperature: string;
  humidity: string;
  windSpeed: string;
  qualityGrade: string;
  verified: string;
  farmIntelligence: string;
  availableQuantity: string;
  location: string;
  dailyPrice: string;
  perDay: string;
  availableItems: string;
  quickActions: string;

  // Marketplace & Categories
  all: string;
  produce: string;
  vegetables: string;
  fruits: string;
  grains: string;
  searchPlaceholder: string;

  // Sample Products
  tomatoesName: string;
  tomatoesDesc: string;
  wheatName: string;
  wheatDesc: string;
  broccoliName: string;
  broccoliDesc: string;
  strawberriesName: string;
  strawberriesDesc: string;

  // Sample Equipment
  tractorName: string;
  tractorDesc: string;
  rotavatorName: string;
  rotavatorDesc: string;

  // AI & Help
  askFarmAI: string;
  aiPlaceholder: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    tagline: 'From Farm to Buyer. Connected by Data.',
    subTagline: 'Direct Kisan marketplace, AI quality evaluation & machinery rental portal.',
    login: 'Log In',
    signup: 'Sign Up',
    logout: 'Logout',
    welcomeBack: 'Welcome back',
    home: 'Home',
    marketplace: 'Agri Marketplace',
    myFarm: 'My Harvest Listings',
    equipment: 'Machinery Rental',
    farmAI: 'FarmAI Assistant',
    qualityPassport: 'FarmCheck AI Radar',
    weatherCenter: 'Weather & Climate Center',
    activity: 'My Activity & Orders',

    exploreMarketplace: 'Explore Marketplace',
    listHarvest: 'Add New Crop Listing',
    rentMachinery: 'Rent Machinery',
    viewDetails: 'View Details',
    rentMachine: 'Rent Machine',
    viewProduce: 'View Product',
    viewProduct: 'View Product',
    buyNow: 'Purchase Product',

    aiQualityRadar: 'AI Quality Radar',
    aiQualityDesc: 'Computer vision evaluation & 100-point FarmCheck verification passports for every harvest batch.',
    zeroMiddlemen: 'Zero Middlemen Fee',
    zeroMiddlemenDesc: 'Direct farmer-to-buyer transactions ensuring 100% fair mandi rates and instant payments.',
    liveWeatherTitle: 'Live Weather Telemetry',
    liveWeatherDesc: 'Real-time OpenWeather API climate data, rainfall advisory, and smart crop irrigation alerts.',
    equipmentSharing: 'Tractor & Machinery Hub',
    equipmentSharingDesc: 'Peer-to-peer agricultural machinery rental platform for tractors, rotavators, and sprayers.',
    directMandiPricing: 'Transparent Mandi Pricing',
    directMandiDesc: 'Live district-level mandi benchmark prices and historical trend charts.',

    avgQualityScore: 'Avg Quality Score',
    zeroMiddlemenFee: 'Zero Middlemen Fee',
    realtimeWeatherAPI: 'Real-time Weather API',
    farmcheckVerified: 'FARMCHECK VERIFIED',
    gradeA: 'GRADE A (92/100)',
    available: 'Available',

    weatherForecast: 'Live Weather Telemetry',
    temperature: 'Temperature',
    humidity: 'Humidity',
    windSpeed: 'Wind Speed',
    qualityGrade: 'Quality Grade',
    verified: 'Verified',
    farmIntelligence: 'Farm Intelligence & Advisory',
    availableQuantity: 'Available Quantity',
    location: 'Location',
    dailyPrice: 'Daily Rate',
    perDay: '/ day',
    availableItems: 'Available Items',
    quickActions: 'Quick Kisan Actions',

    all: 'All Items',
    produce: 'Produce',
    vegetables: 'Vegetables',
    fruits: 'Fruits',
    grains: 'Grains',
    searchPlaceholder: 'Search tomatoes, wheat, tractors, pumps, locations...',

    tomatoesName: 'Organic Red Tomatoes',
    tomatoesDesc: 'Fresh Grade A vine-ripe tomatoes from Nashik valley.',
    wheatName: 'Sharbati Wheat (Premium)',
    wheatDesc: 'High protein golden Sharbati wheat grains.',
    broccoliName: 'Fresh Green Broccoli',
    broccoliDesc: 'Pesticide-free organic broccoli heads.',
    strawberriesName: 'Organic Strawberries',
    strawberriesDesc: 'Sweet Mahabaleshwar Grade A strawberries.',

    tractorName: 'Mahindra 575 DI Tractor (45 HP)',
    tractorDesc: '45 HP power tractor suitable for heavy plowing and rotavator operations.',
    rotavatorName: 'Shaktiman Heavy Duty Rotavator (7 ft)',
    rotavatorDesc: '7 feet wide rotavator for fine soil tilling.',

    askFarmAI: 'Ask FarmAI Assistant',
    aiPlaceholder: 'Ask crop health, weather, or mandi prices...'
  },

  hi: {
    tagline: 'खेत से सीधे खरीदार तक। डेटा से जुड़े।',
    subTagline: 'प्रत्यक्ष किसान बाज़ार, एआई गुणवत्ता जांच एवं कृषि उपकरण किराए पर लेने का पोर्टल।',
    login: 'लॉग इन करें',
    signup: 'साइन अप करें',
    logout: 'लॉग आउट',
    welcomeBack: 'वापसी पर स्वागत है',
    home: 'मुख्य पृष्ठ',
    marketplace: 'कृषि मंडी',
    myFarm: 'मेरी फसल सूची',
    equipment: 'कृषि उपकरण भाड़ा',
    farmAI: 'फार्म एआई सहायक',
    qualityPassport: 'फार्मचेक एआई गुणवत्ता',
    weatherCenter: 'मौसम एवं जलवायु केंद्र',
    activity: 'मेरी गतिविधि एवं ऑर्डर',

    exploreMarketplace: 'मंडी देखें',
    listHarvest: 'नई फसल जोड़ें',
    rentMachinery: 'उपकरण किराए पर लें',
    viewDetails: 'विवरण देखें',
    rentMachine: 'मशीन किराए पर लें',
    viewProduce: 'फसल देखें',
    viewProduct: 'उत्पाद देखें',
    buyNow: 'फसल खरीदें',

    aiQualityRadar: 'एआई गुणवत्ता राडार',
    aiQualityDesc: 'कंप्यूटर विज़न जांच और हर फसल बैच के लिए 100-अंक फार्मचेक सत्यापन पासपोर्ट।',
    zeroMiddlemen: 'शून्य बिचौलिया शुल्क',
    zeroMiddlemenDesc: 'सीधा किसान-से-खरीदार सौदा जिससे 100% उचित मंडी भाव और तुरंत भुगतान मिलता है।',
    liveWeatherTitle: 'लाइव मौसम डेटा',
    liveWeatherDesc: 'रियल-टाइम ओपनवेदर एपीआई डेटा, बारिश की चेतावनी और स्मार्ट सिंचाई अलर्ट।',
    equipmentSharing: 'ट्रैक्टर एवं मशीनरी हब',
    equipmentSharingDesc: 'ट्रैक्टर, रोटावेटर और स्प्रेयर के लिए किसान-से-किसान कृषि उपकरण किराए की सुविधा।',
    directMandiPricing: 'पारदर्शी मंडी भाव',
    directMandiDesc: 'ज़िलावार लाइव मंडी दरें और ऐतिहासिक मूल्य रुझान।',

    avgQualityScore: 'औसत गुणवत्ता स्कोर',
    zeroMiddlemenFee: 'शून्य बिचौलिया शुल्क',
    realtimeWeatherAPI: 'लाइव मौसम एपीआई',
    farmcheckVerified: 'फार्मचेक प्रमाणित',
    gradeA: 'ग्रेड ए (92/100)',
    available: 'उपलब्ध',

    weatherForecast: 'लाइव मौसम पूर्वाभास',
    temperature: 'तापमान',
    humidity: 'नमी (आद्रता)',
    windSpeed: 'हवा की गति',
    qualityGrade: 'गुणवत्ता ग्रेड',
    verified: 'प्रमाणित किसान',
    farmIntelligence: 'कृषि सलाह एवं मौसम',
    availableQuantity: 'उपलब्ध मात्रा',
    location: 'स्थान / ज़िला',
    dailyPrice: 'दैनिक दर',
    perDay: '/ दिन',
    availableItems: 'उपलब्ध वस्तुएं',
    quickActions: 'त्वरित किसान कार्य',

    all: 'सभी वस्तुएं',
    produce: 'उपज',
    vegetables: 'सब्जियां',
    fruits: 'फल',
    grains: 'अनाज',
    searchPlaceholder: 'टमाटर, गेहूं, ट्रैक्टर, पंप या स्थान खोजें...',

    tomatoesName: 'ऑर्गेनिक लाल टमाटर',
    tomatoesDesc: 'नाशिक घाटी के ताजा ग्रेड ए बेल से पके टमाटर।',
    wheatName: 'शरबती गेहूं (प्रीमियम)',
    wheatDesc: 'उच्च प्रोटीन युक्त सुनहरे शरबती गेहूं दाने।',
    broccoliName: 'ताजा हरा ब्रोकली',
    broccoliDesc: 'कीटनाशक-मुक्त जैविक ब्रोकली फूल।',
    strawberriesName: 'ऑर्गेनिक स्ट्रॉबेरी',
    strawberriesDesc: 'मीठे महाबलेश्वर ग्रेड ए स्ट्रॉबेरी।',

    tractorName: 'महिंद्रा 575 डीआई ट्रैक्टर (45 एचपी)',
    tractorDesc: '45 एचपी क्षमता का ट्रैक्टर भारी जुताई और रोटावेटर कार्यों के लिए उपयुक्त।',
    rotavatorName: 'शक्तिमान हैवी ड्यूटी रोटावेटर (7 फीट)',
    rotavatorDesc: 'बारीक मिट्टी जुताई के लिए 7 फीट चौड़ा रोटावेटर।',

    askFarmAI: 'फार्म एआई सहायक से पूछें',
    aiPlaceholder: 'फसल स्वास्थ्य, मौसम या मंडी भाव पूछें...'
  },

  mr: {
    tagline: 'शेतापासून थेट खरेदीदारापर्यंत. डेटाने जोडलेले.',
    subTagline: 'थेट शेतकरी बाजारपेठ, एआय गुणवत्ता तपासणी आणि शेती यंत्रसामग्री भाडे पोर्टल.',
    login: 'लॉग इन करा',
    signup: 'साइन अप करा',
    logout: 'बाहेर पडा',
    welcomeBack: 'पुन्हा स्वागत आहे',
    home: 'मुख्य पान',
    marketplace: 'कृषी बाजारपेठ',
    myFarm: 'माझी पीक यादी',
    equipment: 'यंत्रसामग्री भाडे हब',
    farmAI: 'फार्म एआय मदतनीस',
    qualityPassport: 'फार्मचेक एआय गुणवत्ता',
    weatherCenter: 'हवामान व हवामान केंद्र',
    activity: 'माझे व्यवहार व ऑर्डर्स',

    exploreMarketplace: 'बाजारपेठ पहा',
    listHarvest: 'नवीन पीक जोडा',
    rentMachinery: 'यंत्र भाड्याने घ्या',
    viewDetails: 'सविस्तर पहा',
    rentMachine: 'यंत्र भाड्याने घ्या',
    viewProduce: 'माल पहा',
    viewProduct: 'उत्पादन पहा',
    buyNow: 'माल खरेदी करा',

    aiQualityRadar: 'एआय गुणवत्ता तपासणी',
    aiQualityDesc: 'संगणकीय दृष्टी तपासणी आणि प्रत्येक पीक लॉटसाठी १००-गुण फार्मचेक गुणवत्ता प्रमाणपत्र.',
    zeroMiddlemen: 'शून्य मध्यस्थ शुल्क',
    zeroMiddlemenDesc: 'थेट शेतकरी-ते-खरेदीदार व्यवहार ज्यामुळे १००% योग्य बाजारभाव व त्वरित पैसे मिळतात.',
    liveWeatherTitle: 'थेट हवामान अंदाज',
    liveWeatherDesc: 'रिअल-टाइम ओपनवेदर एपीआई डेटा, पावसाचा अंदाज आणि सुज्ञ पाणी व्यवस्थापन इशारे.',
    equipmentSharing: 'ट्रॅक्टर व यंत्रसामग्री हब',
    equipmentSharingDesc: 'शेतकरी-ते-शेतकरी ट्रॅक्टर, रोटावेटर आणि फवारणी यंत्र भाडे व्यासपीठ.',
    directMandiPricing: 'पारदर्शक बाजारभाव',
    directMandiDesc: 'जिल्हास्तरीय थेट बाजारभाव आणि ऐतिहासिक दर कल.',

    avgQualityScore: 'सरासरी गुणवत्ता गुण',
    zeroMiddlemenFee: 'शून्य मध्यस्थ शुल्क',
    realtimeWeatherAPI: 'थेट हवामान एपीआय',
    farmcheckVerified: 'फार्मचेक प्रमाणित',
    gradeA: 'ग्रेड ए (९२/१००)',
    available: 'उपलब्ध',

    weatherForecast: 'थेट हवामान अंदाज',
    temperature: 'तापमान',
    humidity: 'आर्द्रता',
    windSpeed: 'वाऱ्याचा वेग',
    qualityGrade: 'गुणवत्ता श्रेणी',
    verified: 'प्रमाणित शेतकरी',
    farmIntelligence: 'शेती सल्ला व हवामान',
    availableQuantity: 'उपलब्ध प्रमाण',
    location: 'ठिकाण / जिल्हा',
    dailyPrice: 'दैनिक दर',
    perDay: '/ दिवस',
    availableItems: 'उपलब्ध वस्तू',
    quickActions: 'त्वरित शेतकरी कृती',

    all: 'सर्व वस्तू',
    produce: 'उत्पादन',
    vegetables: 'भाजीपाला',
    fruits: 'फळे',
    grains: 'धान्य',
    searchPlaceholder: 'टोमॅटो, गहू, ट्रॅक्टर, पंप किंवा ठिकाण शोधा...',

    tomatoesName: 'सेंद्रिय लाल टोमॅटो',
    tomatoesDesc: 'नाशिक खोऱ्यातील ताजे ग्रेड ए वेलीवर पिकलेले टोमॅटो.',
    wheatName: 'शरबती गहू (प्रीमियम)',
    wheatDesc: 'उच्च प्रथिनेयुक्त सोनेरी शरबती गव्हाचे दाणे.',
    broccoliName: 'ताजी हिरवी ब्रोकली',
    broccoliDesc: 'कीटकनाशकमुक्त सेंद्रिय ब्रोकली गट्टे.',
    strawberriesName: 'सेंद्रिय स्ट्रॉबेरी',
    strawberriesDesc: 'गोड महाबळेश्वर ग्रेड ए स्ट्रॉबेरी.',

    tractorName: 'महिंद्रा ५७५ डीआय ट्रॅक्टर (४५ एचपी)',
    tractorDesc: '४५ एचपी क्षमतेचा ट्रॅक्टर जड नांगरणी व रोटावेटर कामासाठी उत्तम.',
    rotavatorName: 'शक्तीमान हेवी ड्युटी रोटावेटर (७ फूट)',
    rotavatorDesc: 'बारीक माती नांगरणीसाठी ७ फूट रुंद रोटावेटर.',

    askFarmAI: 'फार्म एआय मदतनीस',
    aiPlaceholder: 'पीक आरोग्य, हवामान किंवा बाजारभाव विचारा...'
  }
};

const LANG_STORAGE_KEY = 'farmsetu_selected_lang_v1';

type LanguageListener = (lang: Language) => void;

class LanguageService {
  private currentLang: Language = 'en';
  private listeners: Set<LanguageListener> = new Set();

  constructor() {
    const saved = localStorage.getItem(LANG_STORAGE_KEY) as Language;
    if (saved && (saved === 'en' || saved === 'hi' || saved === 'mr')) {
      this.currentLang = saved;
    }
  }

  public getLanguage(): Language {
    return this.currentLang;
  }

  public setLanguage(lang: Language) {
    this.currentLang = lang;
    localStorage.setItem(LANG_STORAGE_KEY, lang);
    this.notify();
  }

  public t(): Translations {
    return translations[this.currentLang];
  }

  public subscribe(fn: LanguageListener) {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  private notify() {
    this.listeners.forEach(fn => fn(this.currentLang));
  }
}

export const i18n = new LanguageService();
