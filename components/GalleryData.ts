/* Gallery content lives here, away from the UI. Add a photo by adding one object.
   Files in /public with "&" or spaces in the name work (images are unoptimized),
   but plain names like yard-meeting-16.jpg are safer to link and cache. */

export type GalleryCategory = "campaigns" | "partnerships" | "achievements";

export interface GalleryItem {
  id: number;
  title: string;
  category: GalleryCategory;
  image_url: string;
  description: string;
}

export const CATEGORIES: { id: GalleryCategory; name: string }[] = [
  { id: "campaigns", name: "Campaigns" },
  { id: "partnerships", name: "Partnerships" },
  { id: "achievements", name: "Achievements" },
];

export const CATEGORY_NAME: Record<GalleryCategory, string> = {
  campaigns: "Campaigns",
  partnerships: "Partnerships",
  achievements: "Achievements",
};

/* Farmer photos (farmer-1.png to farmer-8.png, "Farmer with Cattle") are switched off.
   To bring them back, add a "farmers" category above and one item per photo. */

const YARD = "Yard Meeting & Awareness Campaign";

export const GALLERY_DATA: GalleryItem[] = [
  // ---- Campaigns ----
  { id: 105, title: YARD, category: "campaigns", image_url: "/seminar.jpeg", description: "" },
  { id: 106, title: YARD, category: "campaigns", image_url: "/seminar2.jpeg", description: "" },
  { id: 103, title: "Awareness Campaign by our CEO and COO", category: "campaigns", image_url: "/boss1.jpeg", description: "" },
  { id: 104, title: "Branch Campaign", category: "campaigns", image_url: "/branch.jpeg", description: "" },
  { id: 10, title: "Training for Farmers and Cattle Rearers", category: "campaigns", image_url: "/Training-for-Farmers-and-Cattle-Rearers.jpg", description: "" },
  { id: 11, title: YARD, category: "campaigns", image_url: "/Yard-Meeting-&-Awareness-Campaign-16.jpg", description: "" },
  { id: 12, title: YARD, category: "campaigns", image_url: "/Yard-Meeting-&-Awareness-Campaign-17.jpg", description: "" },
  { id: 13, title: YARD, category: "campaigns", image_url: "/Yard-Meeting-&-Awareness-Campaign-18.jpg", description: "" },
  { id: 14, title: YARD, category: "campaigns", image_url: "/Yard-Meeting-&-Awareness-Campaign-20.jpg", description: "" },
  { id: 15, title: YARD, category: "campaigns", image_url: "/Yard-Meeting-&-Awareness-Campaign-22.jpg", description: "" },
  { id: 16, title: YARD, category: "campaigns", image_url: "/Yard-Meeting-&-Awareness-Campaign-25.jpg", description: "" },
  { id: 17, title: YARD, category: "campaigns", image_url: "/Yard-Meeting-&-Awareness-Campaign-26.jpg", description: "" },
  { id: 18, title: YARD, category: "campaigns", image_url: "/Yard-Meeting-&-Awareness-Campaign-27.jpg", description: "" },
  { id: 19, title: YARD, category: "campaigns", image_url: "/Yard-Meeting-&-Awareness-Campaign-29.jpg", description: "" },
  { id: 20, title: YARD, category: "campaigns", image_url: "/Yard-Meeting-&-Awareness-Campaign-24.jpg", description: "" },

  // ---- Partnerships ----
  { id: 21, title: "Bangladesh Agriculture University", category: "partnerships", image_url: "/Bangladesh_Agriculture_University.png", description: "" },
  { id: 22, title: "B-Briddhi", category: "partnerships", image_url: "/bridhi.jpg", description: "" },
  { id: 23, title: "Swiss Contact", category: "partnerships", image_url: "/BMMDP.jpg", description: "" },
  { id: 24, title: "Tenity", category: "partnerships", image_url: "/tenity.png", description: "" },
  { id: 99, title: "Accelerating Asia", category: "partnerships", image_url: "/accelaringasia.jpg", description: "" },

  // ---- Achievements ----
  { id: 25, title: "Briddhi", category: "achievements", image_url: "/bridhi.jpg", description: "Impact Ready Matching Fund (IRMF)" },
  { id: 26, title: "GITEX Global 2023", category: "achievements", image_url: "/dubai2023.png", description: "Supernova Insurtech Disruptor Champion - Prize $8000" },
  { id: 27, title: "Huawei ICT Incubator 2022", category: "achievements", image_url: "/huawei.webp", description: "Winner - Prize $12500" },
  { id: 28, title: "She Loves Tech Bangladesh 2023 Competition Winner", category: "achievements", image_url: "/achivement.jpeg", description: "" },
  { id: 29, title: "MENA Insurtech Summit 2024 Winner", category: "achievements", image_url: "/InsurTech-2024.jpg", description: "" },
];