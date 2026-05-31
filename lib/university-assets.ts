import type { University } from "@/lib/types";

const logoDomains: Record<string, string> = {
  mit: "mit.edu",
  stanford: "stanford.edu",
  harvard: "harvard.edu",
  "uc-berkeley": "berkeley.edu",
  "carnegie-mellon": "cmu.edu",
  oxford: "ox.ac.uk",
  cambridge: "cam.ac.uk",
  imperial: "imperial.ac.uk",
  ucl: "ucl.ac.uk",
  toronto: "utoronto.ca",
  waterloo: "uwaterloo.ca",
  mcgill: "mcgill.ca",
  nus: "nus.edu.sg",
  "ntu-singapore": "ntu.edu.sg",
  hku: "hku.hk",
  hkust: "hkust.edu.hk",
  "eth-zurich": "ethz.ch",
  epfl: "epfl.ch",
  yale: "yale.edu",
  princeton: "princeton.edu"
};

export function getUniversityDomain(university: University) {
  return university.logoDomain ?? logoDomains[university.id] ?? "";
}

export function getUniversityLogoUrl(university: University) {
  const domain = getUniversityDomain(university);
  if (!domain) return "";
  return `https://www.google.com/s2/favicons?sz=128&domain=${domain}`;
}

export function getUniversityInitials(name: string) {
  return name
    .replace(/^the\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
