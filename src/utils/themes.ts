import { Theme } from '../types';

export const THEMES: Theme[] = [
  { id: 'elegant-dark', label: 'Elegant Dark (Default)', c1: '#2563eb', c2: '#1d4ed8' },
  { id: 'spiderman', label: 'Spiderman', c1: '#e30022', c2: '#002d62' },
  { id: 'blood', label: 'Blood', c1: '#840000', c2: '#0d0d0d' },
  { id: 'sapphire', label: 'Sapphire & Steel', c1: '#0f52ba', c2: '#4682b4' },
  { id: 'emerald', label: 'Emerald & Charcoal', c1: '#50c878', c2: '#2f4f4f' },
  { id: 'digital-twilight', label: 'Digital Twilight', c1: '#4b0082', c2: '#00003b' },
  { id: 'coral-aqua', label: 'Coral & Aqua', c1: '#ff7f50', c2: '#00c5cd' },
  { id: 'electric-citrus', label: 'Electric Citrus', c1: '#ff8c00', c2: '#ff007f' },
  { id: 'artisan-clay', label: 'Artisan Clay', c1: '#b22222', c2: '#8b4513' },
  { id: 'forest-canopy', label: 'Forest Canopy', c1: '#2e8b57', c2: '#1e3f20' },
  { id: 'ocean-depth', label: 'Ocean Depth', c1: '#000080', c2: '#008b8b' },
  { id: 'desert-sunset', label: 'Desert Sunset', c1: '#ff4500', c2: '#ffd700' },
  { id: 'monochrome-focus', label: 'Monochrome Focus', c1: '#262626', c2: '#a3a3a3' },
  { id: 'soft-nordic', label: 'Soft Nordic', c1: '#3a5f43', c2: '#a3b18a' },
  { id: 'neutral-peach', label: 'Neutral Peach', c1: '#e9967a', c2: '#ffdab9' },
  { id: 'retro-pop', label: 'Retro Pop', c1: '#ff007f', c2: '#39ff14' },
  { id: 'cyberpunk-glow', label: 'Cyberpunk Glow', c1: '#ff00ff', c2: '#00ffff' },
  { id: 'plum-gold', label: 'Plum & Gold', c1: '#dda0dd', c2: '#ffd700' },
  { id: 'purple-black-matter', label: 'Purple Black Matter', c1: '#4b0082', c2: '#09090b' },
  { id: 'black-hole', label: 'Black Hole', c1: '#18181b', c2: '#020617' },
  { id: 'red-blue', label: 'Red & Blue', c1: '#e11d48', c2: '#2563eb' },
  { id: 'pink-black', label: 'Pink & Black', c1: '#f472b6', c2: '#09090b' },
  { id: 'pink-purple', label: 'Pink & Purple', c1: '#ec4899', c2: '#a855f7' },
  { id: 'rose-gold', label: 'Rose Gold', c1: '#b76e79', c2: '#fef08a' },
  { id: 'neon-pink', label: 'Neon Pink', c1: '#ff1493', c2: '#39ff14' },
  { id: 'blush-cherry', label: 'Blush Cherry', c1: '#be123c', c2: '#fda4af' },
  { id: 'bubblegum', label: 'Bubblegum', c1: '#f472b6', c2: '#38bdf8' },
  { id: 'flamingo', label: 'Flamingo', c1: '#ff8da1', c2: '#ffccd5' },
  { id: 'pink-yellow', label: 'Pink & Yellow', c1: '#ec4899', c2: '#facc15' },
  { id: 'pink-white', label: 'Pink & White', c1: '#f472b6', c2: '#ffffff' },
  { id: 'pink-overall', label: 'Pink Overall', c1: '#db2777', c2: '#f472b6' },
  { id: 'black-noir', label: 'Black Noir', c1: '#09090b', c2: '#27272a' },
  { id: 'ladybug-noir', label: 'Ladybug Noir', c1: '#dc2626', c2: '#09090b' },
  { id: 'prideful-sun', label: 'Prideful Sun', c1: '#eab308', c2: '#ca8a04' },
  { id: 'kakarot-orange', label: 'Kakarot Orange', c1: '#ea580c', c2: '#f97316' },
  { id: 'saiyan-prince', label: 'Saiyan Prince', c1: '#1d4ed8', c2: '#ca8a04' },
  { id: 'omni-green', label: 'Omni Green', c1: '#16a34a', c2: '#22c55e' },
  { id: 'goldenrod', label: 'Goldenrod', c1: '#daa520', c2: '#fbbf24' },
  { id: 'bumblebee', label: 'Bumblebee', c1: '#eab308', c2: '#09090b' },
  { id: 'lemonade', label: 'Lemonade', c1: '#ca8a04', c2: '#86efac' }
];

// Hex helper utilities for color math without library dependencies
function hexToRgb(hex: string) {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return { r, g, b };
}

function rgbToHex(r: number, g: number, b: number): string {
  const safeHex = (channel: number) => {
    const val = Math.max(0, Math.min(255, Math.round(channel)));
    return val.toString(16).padStart(2, '0');
  };
  return `#${safeHex(r)}${safeHex(g)}${safeHex(b)}`;
}

function shadeRgb(rgb: { r: number; g: number; b: number }, percent: number) {
  const amt = Math.round(255 * Math.abs(percent));
  const op = percent < 0 
    ? (a: number, b: number) => Math.max(0, a - b) 
    : (a: number, b: number) => Math.min(255, a + b);
  return {
    r: op(rgb.r, amt),
    g: op(rgb.g, amt),
    b: op(rgb.b, amt)
  };
}

// Generate premium custom shaded background gradients for each card category
export function getShadeGradient(themeId: string, category: string): string {
  if (themeId === 'elegant-dark') {
    return '#0f0f0f';
  }
  const theme = THEMES.find(t => t.id === themeId) || THEMES[0];
  const rgb1 = hexToRgb(theme.c1);
  const rgb2 = hexToRgb(theme.c2);

  // Variant shifts
  const variants: { [key: string]: { c1: number; c2: number } } = {
    'academic': { c1: -0.18, c2: -0.08 },
    'hackathon': { c1: 0.02, c2: -0.22 },
    'coursework': { c1: -0.05, c2: 0.05 },
    'side': { c1: 0.12, c2: 0.12 },
    'default': { c1: 0.04, c2: -0.04 }
  };

  const v = variants[category] || variants['default'];

  const c1Shaded = rgbToHex(
    shadeRgb(rgb1, v.c1).r,
    shadeRgb(rgb1, v.c1).g,
    shadeRgb(rgb1, v.c1).b
  );

  const c2Shaded = rgbToHex(
    shadeRgb(rgb2, v.c2).r,
    shadeRgb(rgb2, v.c2).g,
    shadeRgb(rgb2, v.c2).b
  );

  return `linear-gradient(135deg, ${c1Shaded}ee, ${c2Shaded}ee)`;
}

// Map selected font label to actual CSS font stack
export function getFontFamilyString(fontName: string): string {
  const map: { [key: string]: string } = {
    "Inter": "'Inter', 'Poppins', sans-serif",
    "Poppins": "'Poppins', 'Inter', sans-serif",
    "Roboto": "'Roboto', sans-serif",
    "Source Sans 3": "'Source Sans 3', sans-serif"
  };
  return map[fontName] || map["Inter"];
}
