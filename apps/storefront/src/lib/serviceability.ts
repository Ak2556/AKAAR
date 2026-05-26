// PIN-code serviceability for India.
//
// Real production sites query Delhivery / Bluedart APIs to confirm
// pickup at origin + delivery at destination. We approximate that
// here using a static zone map keyed by the first two digits of the
// Indian 6-digit PIN code — enough to give customers a per-zone ETA
// at checkout and to gate a small set of un-serviceable ranges.

export type ServiceabilityZone =
  | "metro"
  | "tier-1"
  | "tier-2"
  | "tier-3"
  | "remote"
  | "blocked";

export interface ServiceabilityResult {
  zone: ServiceabilityZone;
  serviceable: boolean;
  city: string;
  state: string;
  cod: boolean;
  etaDays: {
    standard: [min: number, max: number];
    express: [min: number, max: number];
    priority: [min: number, max: number];
  };
  reason?: string;
}

interface ZoneEntry {
  zone: ServiceabilityZone;
  state: string;
  city: string;
}

// First two digits → zone. India's PIN format reserves the first
// digit for region and the first two for the sub-region.
const ZONE_PREFIX_TABLE: Record<string, ZoneEntry> = {
  // ── Northern India ────────────────────────────────────────────────────
  "11": { zone: "metro",  state: "Delhi",          city: "New Delhi" },
  "12": { zone: "tier-1", state: "Haryana",        city: "Haryana"   },
  "13": { zone: "tier-2", state: "Haryana",        city: "Haryana"   },
  "14": { zone: "tier-2", state: "Punjab",         city: "Punjab"    },
  "15": { zone: "tier-2", state: "Punjab",         city: "Punjab"    },
  "16": { zone: "tier-2", state: "Punjab",         city: "Punjab"    },
  "17": { zone: "tier-2", state: "Himachal Pradesh", city: "HP"      },
  "18": { zone: "remote", state: "Jammu & Kashmir", city: "J&K"      },
  "19": { zone: "remote", state: "Jammu & Kashmir", city: "J&K"      },

  // ── Rajasthan ─────────────────────────────────────────────────────────
  "30": { zone: "tier-1", state: "Rajasthan",      city: "Jaipur"    },
  "31": { zone: "tier-2", state: "Rajasthan",      city: "Bikaner"   },
  "32": { zone: "tier-2", state: "Rajasthan",      city: "Jodhpur"   },
  "33": { zone: "tier-2", state: "Rajasthan",      city: "Udaipur"   },
  "34": { zone: "tier-2", state: "Rajasthan",      city: "Rajasthan" },

  // ── Uttar Pradesh ─────────────────────────────────────────────────────
  "20": { zone: "tier-1", state: "Uttar Pradesh",  city: "Noida"     },
  "21": { zone: "tier-1", state: "Uttar Pradesh",  city: "Agra"      },
  "22": { zone: "tier-2", state: "Uttar Pradesh",  city: "Bareilly"  },
  "23": { zone: "tier-2", state: "Uttar Pradesh",  city: "Kanpur"    },
  "24": { zone: "tier-2", state: "Uttar Pradesh",  city: "Lucknow"   },
  "25": { zone: "tier-2", state: "Uttar Pradesh",  city: "Varanasi"  },
  "26": { zone: "tier-2", state: "Uttar Pradesh",  city: "Allahabad" },
  "27": { zone: "tier-2", state: "Uttar Pradesh",  city: "Gorakhpur" },
  "28": { zone: "tier-2", state: "Uttarakhand",    city: "Dehradun"  },
  "29": { zone: "tier-2", state: "Bihar",          city: "Patna"     },

  // ── Western India ─────────────────────────────────────────────────────
  "36": { zone: "tier-1", state: "Gujarat",        city: "Ahmedabad" },
  "37": { zone: "tier-2", state: "Gujarat",        city: "Vadodara"  },
  "38": { zone: "tier-2", state: "Gujarat",        city: "Surat"     },
  "39": { zone: "tier-2", state: "Gujarat",        city: "Gujarat"   },
  "40": { zone: "metro",  state: "Maharashtra",    city: "Mumbai"    },
  "41": { zone: "tier-1", state: "Maharashtra",    city: "Pune"      },
  "42": { zone: "tier-2", state: "Maharashtra",    city: "Nashik"    },
  "43": { zone: "tier-2", state: "Maharashtra",    city: "Aurangabad"},
  "44": { zone: "tier-2", state: "Maharashtra",    city: "Nagpur"    },
  "45": { zone: "tier-2", state: "Madhya Pradesh", city: "Bhopal"    },
  "46": { zone: "tier-2", state: "Madhya Pradesh", city: "Indore"    },
  "47": { zone: "tier-2", state: "Madhya Pradesh", city: "Jabalpur"  },
  "48": { zone: "tier-2", state: "Madhya Pradesh", city: "Gwalior"   },

  // ── Southern India ────────────────────────────────────────────────────
  "50": { zone: "metro",  state: "Telangana",      city: "Hyderabad" },
  "51": { zone: "tier-2", state: "Andhra Pradesh", city: "Vijayawada"},
  "52": { zone: "tier-2", state: "Andhra Pradesh", city: "Tirupati"  },
  "53": { zone: "tier-2", state: "Andhra Pradesh", city: "Visakhapatnam" },
  "56": { zone: "metro",  state: "Karnataka",      city: "Bengaluru" },
  "57": { zone: "tier-2", state: "Karnataka",      city: "Mysuru"    },
  "58": { zone: "tier-2", state: "Karnataka",      city: "Mangaluru" },
  "59": { zone: "tier-2", state: "Karnataka",      city: "Hubli"     },
  "60": { zone: "metro",  state: "Tamil Nadu",     city: "Chennai"   },
  "61": { zone: "tier-2", state: "Tamil Nadu",     city: "Tamil Nadu" },
  "62": { zone: "tier-2", state: "Tamil Nadu",     city: "Madurai"   },
  "63": { zone: "tier-2", state: "Tamil Nadu",     city: "Tirunelveli" },
  "64": { zone: "tier-2", state: "Tamil Nadu",     city: "Coimbatore" },
  "67": { zone: "tier-2", state: "Kerala",         city: "Kochi"     },
  "68": { zone: "tier-2", state: "Kerala",         city: "Thiruvananthapuram" },
  "69": { zone: "tier-2", state: "Kerala",         city: "Kozhikode" },

  // ── Eastern India ─────────────────────────────────────────────────────
  "70": { zone: "metro",  state: "West Bengal",    city: "Kolkata"   },
  "71": { zone: "tier-2", state: "West Bengal",    city: "Howrah"    },
  "72": { zone: "tier-2", state: "West Bengal",    city: "Asansol"   },
  "73": { zone: "tier-2", state: "West Bengal",    city: "Siliguri"  },
  "74": { zone: "remote", state: "West Bengal",    city: "Darjeeling" },
  "75": { zone: "tier-2", state: "Odisha",         city: "Bhubaneswar" },
  "76": { zone: "tier-2", state: "Odisha",         city: "Odisha"    },
  "77": { zone: "tier-2", state: "Odisha",         city: "Odisha"    },
  "78": { zone: "remote", state: "Assam",          city: "Guwahati"  },
  "79": { zone: "remote", state: "Assam",          city: "Assam"     },

  // ── North-East ────────────────────────────────────────────────────────
  "79x": { zone: "remote", state: "Arunachal Pradesh", city: "NE India" },
  "80x": { zone: "remote", state: "Bihar",         city: "Bihar"     },
  "81": { zone: "tier-2", state: "Bihar",          city: "Patna"     },
  "82": { zone: "tier-2", state: "Bihar",          city: "Bihar"     },
  "83": { zone: "tier-2", state: "Jharkhand",      city: "Ranchi"    },
  "84": { zone: "remote", state: "Bihar",          city: "Bihar"     },
  "85": { zone: "remote", state: "Bihar",          city: "Bihar"     },

  // ── Specific remote islands ───────────────────────────────────────────
  "74400": { zone: "remote", state: "Lakshadweep",  city: "Lakshadweep" },
  "744": { zone: "remote", state: "Andaman & Nicobar", city: "Port Blair" },
};

const ZONE_ETA: Record<ServiceabilityZone, ServiceabilityResult["etaDays"]> = {
  metro:    { standard: [3, 5],  express: [2, 3], priority: [1, 2] },
  "tier-1": { standard: [4, 6],  express: [2, 4], priority: [2, 3] },
  "tier-2": { standard: [5, 7],  express: [3, 5], priority: [2, 3] },
  "tier-3": { standard: [6, 8],  express: [4, 6], priority: [3, 4] },
  remote:   { standard: [7, 10], express: [6, 8], priority: [5, 7] },
  blocked:  { standard: [0, 0],  express: [0, 0], priority: [0, 0] },
};

const COD_ELIGIBLE: ServiceabilityZone[] = ["metro", "tier-1", "tier-2"];

export function isValidIndianPin(value: string): boolean {
  return /^[1-9][0-9]{5}$/.test(value);
}

export function checkServiceability(rawPin: string): ServiceabilityResult {
  const pin = (rawPin || "").trim();

  if (!isValidIndianPin(pin)) {
    return {
      zone: "blocked",
      serviceable: false,
      city: "",
      state: "",
      cod: false,
      etaDays: ZONE_ETA.blocked,
      reason: "Enter a valid 6-digit Indian PIN code.",
    };
  }

  // Try a 3-digit prefix first (for specific overrides like 744 = Port Blair),
  // then fall back to the 2-digit prefix.
  const three = pin.slice(0, 3);
  const two = pin.slice(0, 2);
  const entry = ZONE_PREFIX_TABLE[three] ?? ZONE_PREFIX_TABLE[two];

  if (!entry) {
    // Default unknown PINs to tier-3 rather than blocking outright —
    // most are valid but rural.
    return {
      zone: "tier-3",
      serviceable: true,
      city: "Your area",
      state: "India",
      cod: false,
      etaDays: ZONE_ETA["tier-3"],
    };
  }

  return {
    zone: entry.zone,
    serviceable: entry.zone !== "blocked",
    city: entry.city,
    state: entry.state,
    cod: COD_ELIGIBLE.includes(entry.zone),
    etaDays: ZONE_ETA[entry.zone],
  };
}

export function deliveryDateRange(
  etaDays: [number, number],
  fromDate = new Date()
): { earliest: Date; latest: Date } {
  const earliest = new Date(fromDate);
  earliest.setDate(earliest.getDate() + etaDays[0]);
  const latest = new Date(fromDate);
  latest.setDate(latest.getDate() + etaDays[1]);
  return { earliest, latest };
}
