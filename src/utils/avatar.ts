// High-Resolution Professional Human Portrait Headshots
// Authentic business attire human portraits (diverse executives, recruiters, tech leaders)
// Completely removes cartoon, illustrated, and initial avatars

export const PROFESSIONAL_PORTRAITS: string[] = [
  // Local high-res portraits
  '/src/assets/images/avatar_alex_tech_1792802860657.jpg',
  '/src/assets/images/avatar_sarah_product_1792802860781.jpg',
  '/src/assets/images/avatar_marcus_cro_1792802861859.jpg',
  '/src/assets/images/avatar_elena_growth_1792802861333.jpg',
  
  // Verified Unsplash high-resolution corporate & executive headshots (all returning 200 OK)
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
  'https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
  'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
  'https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
  'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
  'https://images.unsplash.com/photo-1548142813-c348350df52b?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
  'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
  'https://images.unsplash.com/photo-1573497019236-17f8177b81e8?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
  'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=400&h=400&auto=format&fit=crop&crop=faces&q=80'
];

/**
 * Returns a deterministic, high-resolution human portrait headshot in professional business attire
 * for any given person name or role. Never returns cartoons, vector illustrations, or initials.
 */
export function getDeterministicAvatar(name: string, role?: string, id?: string): string {
  if (!name) return PROFESSIONAL_PORTRAITS[0];

  // Specific high-profile executive mappings
  if (name.includes('Alex Rivera')) return '/src/assets/images/avatar_alex_tech_1792802860657.jpg';
  if (name.includes('Sarah Chen')) return '/src/assets/images/avatar_sarah_product_1792802860781.jpg';
  if (name.includes('Marcus Vance')) return '/src/assets/images/avatar_marcus_cro_1792802861859.jpg';
  if (name.includes('Elena Rostova')) return '/src/assets/images/avatar_elena_growth_1792802861333.jpg';

  // Dedicated human recruiter headshots for common C2C finder recruiters
  if (name.includes('Anil') || name.includes('Varma')) {
    return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&auto=format&fit=crop&crop=faces&q=80';
  }
  if (name.includes('Samantha') || name.includes('Green')) {
    return 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&auto=format&fit=crop&crop=faces&q=80';
  }
  if (name.includes('Rajesh') || name.includes('Nambiar')) {
    return 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&auto=format&fit=crop&crop=faces&q=80';
  }
  if (name.includes('David Miller')) {
    return 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&auto=format&fit=crop&crop=faces&q=80';
  }
  if (name.includes('Neha') || name.includes('Patel')) {
    return 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&auto=format&fit=crop&crop=faces&q=80';
  }
  if (name.includes('Michael Rossi')) {
    return 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&auto=format&fit=crop&crop=faces&q=80';
  }

  // Consistent deterministic hash across the professional human portraits pool
  const seedString = `${name}-${role || ''}-${id || ''}`;
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % PROFESSIONAL_PORTRAITS.length;
  return PROFESSIONAL_PORTRAITS[index];
}

/**
 * Fallback handler for <img> onError to ensure an authentic human portrait is always shown.
 */
export function getAvatarFallback(seed = 'fallback'): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash) % PROFESSIONAL_PORTRAITS.length;
  return PROFESSIONAL_PORTRAITS[idx];
}
