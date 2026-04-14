"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "akaar-settings";

export interface Settings {
  // Display
  currency: "INR" | "USD" | "EUR" | "GBP";
  language: string;
  units: "metric" | "imperial";
  productsPerPage: number;
  defaultView: "grid" | "list";

  // Notifications
  emailMarketing: boolean;
  emailOrders: boolean;
  emailNewsletter: boolean;
  pushNotifications: boolean;

  // Accessibility
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: "small" | "medium" | "large";

  // Privacy
  analytics: boolean;
  personalizedAds: boolean;
  cookies: "essential" | "functional" | "all";
}

export const defaultSettings: Settings = {
  currency: "INR",
  language: "en",
  units: "metric",
  productsPerPage: 12,
  defaultView: "grid",
  emailMarketing: false,
  emailOrders: true,
  emailNewsletter: false,
  pushNotifications: false,
  reducedMotion: false,
  highContrast: false,
  fontSize: "medium",
  analytics: true,
  personalizedAds: false,
  cookies: "functional",
};

export const currencies = {
  INR: { symbol: "₹", name: "Indian Rupee", locale: "en-IN" },
  USD: { symbol: "$", name: "US Dollar", locale: "en-US" },
  EUR: { symbol: "€", name: "Euro", locale: "de-DE" },
  GBP: { symbol: "£", name: "British Pound", locale: "en-GB" },
} as const;

export const translations: Record<string, Record<string, string>> = {
  en: {
    // Nav
    "nav.products": "Products",
    "nav.services": "Services",
    "nav.about": "About",
    "nav.settings": "Settings",
    "nav.get_quote": "Get Quote",
    // Common actions
    "action.sign_in": "Sign In",
    "action.sign_out": "Sign Out",
    "action.search": "Search",
    "action.view_all": "View All Products",
    "action.get_quote": "Get a Quote",
    "action.start_project": "Start a Project",
    "action.contact_us": "Contact Us",
    "action.browse_products": "Browse Products",
    "action.add_to_cart": "Add to Cart",
    "action.quick_view": "Quick View",
    // Settings labels
    "settings.title": "Settings",
    "settings.subtitle": "Customize your Akaar experience",
    "settings.theme": "Theme",
    "settings.display": "Display",
    "settings.notifications": "Notifications",
    "settings.accessibility": "Accessibility",
    "settings.privacy": "Privacy",
    "settings.data": "Data Management",
    "settings.save": "Save",
    "settings.reset": "Reset All Settings",
    "settings.saved": "Saved",
    // Products
    "products.title": "Our Products",
    "products.subtitle": "Browse our collection of precision-manufactured parts.",
    "products.search": "Search products...",
    "products.filters": "Filters",
    "products.sort": "Sort",
    "products.no_results": "No products found",
    "products.no_results_hint": "Try adjusting your search or filters.",
    "products.per_page": "Products per page",
    // Quote
    "quote.title": "Upload CAD / Get Quote",
    "quote.subtitle": "Drop your mesh file. Instant pricing.",
    "quote.upload": "Upload Files",
    "quote.drop_hint": "Drop your files here or click to browse",
    "quote.submit": "Submit Quote Request",
    "quote.submitting": "Submitting...",
    // Footer
    "footer.newsletter_placeholder": "Enter your email",
    "footer.newsletter_button": "Subscribe",
    "footer.rights": "All rights reserved.",
  },
  hi: {
    // Nav
    "nav.products": "उत्पाद",
    "nav.services": "सेवाएं",
    "nav.about": "हमारे बारे में",
    "nav.settings": "सेटिंग्स",
    "nav.get_quote": "कोट प्राप्त करें",
    // Common actions
    "action.sign_in": "साइन इन करें",
    "action.sign_out": "साइन आउट करें",
    "action.search": "खोजें",
    "action.view_all": "सभी उत्पाद देखें",
    "action.get_quote": "कोट प्राप्त करें",
    "action.start_project": "प्रोजेक्ट शुरू करें",
    "action.contact_us": "संपर्क करें",
    "action.browse_products": "उत्पाद ब्राउज़ करें",
    "action.add_to_cart": "कार्ट में जोड़ें",
    "action.quick_view": "त्वरित दृश्य",
    // Settings labels
    "settings.title": "सेटिंग्स",
    "settings.subtitle": "अपने आकार अनुभव को अनुकूलित करें",
    "settings.theme": "थीम",
    "settings.display": "डिस्प्ले",
    "settings.notifications": "सूचनाएं",
    "settings.accessibility": "पहुंच",
    "settings.privacy": "गोपनीयता",
    "settings.data": "डेटा प्रबंधन",
    "settings.save": "सहेजें",
    "settings.reset": "सभी सेटिंग्स रीसेट करें",
    "settings.saved": "सहेजा गया",
    // Products
    "products.title": "हमारे उत्पाद",
    "products.subtitle": "हमारे उच्च-गुणवत्ता वाले पुर्जों का संग्रह देखें।",
    "products.search": "उत्पाद खोजें...",
    "products.filters": "फ़िल्टर",
    "products.sort": "क्रमबद्ध करें",
    "products.no_results": "कोई उत्पाद नहीं मिला",
    "products.no_results_hint": "अपनी खोज या फ़िल्टर समायोजित करें।",
    "products.per_page": "प्रति पृष्ठ उत्पाद",
    // Quote
    "quote.title": "CAD अपलोड करें / कोट पाएं",
    "quote.subtitle": "अपनी मेश फ़ाइल डालें। तुरंत मूल्य निर्धारण।",
    "quote.upload": "फ़ाइलें अपलोड करें",
    "quote.drop_hint": "फ़ाइलें यहाँ छोड़ें या ब्राउज़ करें",
    "quote.submit": "कोट अनुरोध सबमिट करें",
    "quote.submitting": "सबमिट हो रहा है...",
    // Footer
    "footer.newsletter_placeholder": "अपना ईमेल दर्ज करें",
    "footer.newsletter_button": "सदस्यता लें",
    "footer.rights": "सर्वाधिकार सुरक्षित।",
  },
  ta: {
    // Nav
    "nav.products": "தயாரிப்புகள்",
    "nav.services": "சேவைகள்",
    "nav.about": "எங்களைப் பற்றி",
    "nav.settings": "அமைப்புகள்",
    "nav.get_quote": "மேற்கோள் பெறுக",
    // Common actions
    "action.sign_in": "உள்நுழைக",
    "action.sign_out": "வெளியேறு",
    "action.search": "தேடு",
    "action.view_all": "அனைத்து தயாரிப்புகளும்",
    "action.get_quote": "மேற்கோள் பெறுக",
    "action.start_project": "திட்டம் தொடங்கு",
    "action.contact_us": "தொடர்பு கொள்ளுங்கள்",
    "action.browse_products": "தயாரிப்புகளை உலாவுக",
    "action.add_to_cart": "கார்ட்டில் சேர்க்கவும்",
    "action.quick_view": "விரைவு பார்வை",
    // Settings
    "settings.title": "அமைப்புகள்",
    "settings.subtitle": "உங்கள் அகார் அனுபவத்தை தனிப்பயனாக்குங்கள்",
    "settings.theme": "தீம்",
    "settings.display": "காட்சி",
    "settings.notifications": "அறிவிப்புகள்",
    "settings.accessibility": "அணுகல்",
    "settings.privacy": "தனியுரிமை",
    "settings.data": "தரவு மேலாண்மை",
    "settings.save": "சேமி",
    "settings.reset": "அனைத்தையும் மீட்டமை",
    "settings.saved": "சேமிக்கப்பட்டது",
    // Products
    "products.title": "எங்கள் தயாரிப்புகள்",
    "products.search": "தயாரிப்புகளை தேடுங்கள்...",
    "products.filters": "வடிப்பான்கள்",
    "products.no_results": "தயாரிப்புகள் இல்லை",
    "products.no_results_hint": "உங்கள் தேடலை சரிசெய்யுங்கள்.",
    "quote.submit": "மேற்கோள் கோரிக்கையை சமர்ப்பிக்கவும்",
    "quote.submitting": "சமர்ப்பிக்கிறது...",
    "footer.rights": "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
  },
  te: {
    // Nav
    "nav.products": "ఉత్పత్తులు",
    "nav.services": "సేవలు",
    "nav.about": "మా గురించి",
    "nav.settings": "సెట్టింగులు",
    "nav.get_quote": "కోట్ పొందండి",
    // Common actions
    "action.sign_in": "సైన్ ఇన్",
    "action.sign_out": "సైన్ అవుట్",
    "action.search": "శోధన",
    "action.view_all": "అన్ని ఉత్పత్తులు",
    "action.get_quote": "కోట్ పొందండి",
    "action.start_project": "ప్రాజెక్ట్ ప్రారంభించండి",
    "action.contact_us": "సంప్రదించండి",
    "action.browse_products": "ఉత్పత్తులు చూడండి",
    "action.add_to_cart": "కార్ట్‌కు జోడించండి",
    "action.quick_view": "త్వరిత వీక్షణ",
    // Settings
    "settings.title": "సెట్టింగులు",
    "settings.subtitle": "మీ ఆకార్ అనుభవాన్ని అనుకూలీకరించండి",
    "settings.theme": "థీమ్",
    "settings.display": "డిస్ప్లే",
    "settings.notifications": "నోటిఫికేషన్లు",
    "settings.accessibility": "ప్రాప్యత",
    "settings.privacy": "గోప్యత",
    "settings.data": "డేటా నిర్వహణ",
    "settings.save": "సేవ్",
    "settings.reset": "అన్ని రీసెట్",
    "settings.saved": "సేవ్ అయింది",
    // Products
    "products.title": "మా ఉత్పత్తులు",
    "products.search": "ఉత్పత్తులు వెతకండి...",
    "products.filters": "ఫిల్టర్లు",
    "products.no_results": "ఉత్పత్తులు కనుగొనబడలేదు",
    "products.no_results_hint": "మీ శోధనను సర్దుబాటు చేయండి.",
    "quote.submit": "కోట్ అభ్యర్థన సమర్పించండి",
    "quote.submitting": "సమర్పిస్తున్నది...",
    "footer.rights": "అన్ని హక్కులు రిజర్వ్ చేయబడ్డాయి.",
  },
};

// Approximate exchange rates (INR base)
export const exchangeRates = {
  INR: 1,
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.0095,
} as const;

interface SettingsContextValue {
  settings: Settings;
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  updateSettings: (newSettings: Partial<Settings>) => void;
  resetSettings: () => void;
  formatPrice: (priceInINR: number) => string;
  formatDimension: (mm: number) => string;
  t: (key: string) => string;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

function applyAccessibilitySettings(settings: Settings) {
  if (typeof document === "undefined") return;

  const root = document.documentElement;

  // Reduced motion
  if (settings.reducedMotion) {
    root.classList.add("reduce-motion");
  } else {
    root.classList.remove("reduce-motion");
  }

  // High contrast
  if (settings.highContrast) {
    root.classList.add("high-contrast");
  } else {
    root.classList.remove("high-contrast");
  }

  // Font size
  root.setAttribute("data-font-size", settings.fontSize);
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [mounted, setMounted] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const merged = { ...defaultSettings, ...parsed };
        setSettings(merged);
        applyAccessibilitySettings(merged);
      } catch (e) {
        console.error("Failed to load settings:", e);
      }
    }
    setMounted(true);
  }, []);

  // Apply accessibility settings when they change
  useEffect(() => {
    if (mounted) {
      applyAccessibilitySettings(settings);
    }
  }, [settings.reducedMotion, settings.highContrast, settings.fontSize, mounted]);

  // Save settings whenever they change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }
  }, [settings, mounted]);

  const updateSetting = useCallback(<K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const t = useCallback((key: string): string => {
    const lang = settings.language;
    return translations[lang]?.[key] || translations["en"]?.[key] || key;
  }, [settings.language]);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
    applyAccessibilitySettings(defaultSettings);
  }, []);

  // Format price based on selected currency
  const formatPrice = useCallback((priceInINR: number): string => {
    const currency = settings.currency;
    const rate = exchangeRates[currency];
    const converted = priceInINR * rate;
    const { locale, symbol } = currencies[currency];

    // Format with proper locale
    const formatted = new Intl.NumberFormat(locale, {
      minimumFractionDigits: currency === "INR" ? 0 : 2,
      maximumFractionDigits: currency === "INR" ? 0 : 2,
    }).format(converted);

    return `${symbol}${formatted}`;
  }, [settings.currency]);

  // Format dimensions based on selected units
  const formatDimension = useCallback((mm: number): string => {
    if (settings.units === "imperial") {
      const inches = mm / 25.4;
      return `${inches.toFixed(2)} in`;
    }
    if (mm >= 10) {
      return `${(mm / 10).toFixed(1)} cm`;
    }
    return `${mm.toFixed(1)} mm`;
  }, [settings.units]);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSetting,
        updateSettings,
        resetSettings,
        formatPrice,
        formatDimension,
        t,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
