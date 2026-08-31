import { WeddingTimelineStage, WeddingStory } from '../types';

export const WEDDING_TIMELINE_STAGES: WeddingTimelineStage[] = [
  {
    id: 'stage-morning-prep',
    stageNumber: '01',
    title: 'MORNING PREPARATION',
    shortDesc: 'The quiet moments before the celebration begins.',
    fullDesc: 'The quiet moments before the celebration begins. From getting ready and final details to family blessings, we capture the excitement, emotions, and anticipation of the morning.',
    image: '/img/wedding/Ravindu & Malikshi/DSC09088.webp',
    moodNote: 'BRIDAL & GROOM PREPARATION / FAMILY BLESSINGS / INTIMATE DETAILS',
    moments: [
      'Bridal & Groom getting-ready moments',
      'Hair, makeup, attire & jewelry details',
      'Parents\' blessings and emotional moments',
      'Natural portraits before the ceremony'
    ]
  },
  {
    id: 'stage-first-look',
    stageNumber: '02',
    title: 'FIRST LOOK',
    shortDesc: 'A beautiful moment of anticipation, emotion, and connection.',
    fullDesc: 'A beautiful moment of anticipation, emotion, and connection. We capture the genuine reactions and intimate moments when the couple sees each other for the first time.',
    image: '/img/wedding/Ravindu & Malikshi/DSC09233.webp',
    moodNote: 'EMOTIONAL FIRST LOOK / CANDID REACTION / INTIMATE CONNECTION',
    moments: [
      'The couple\'s first look',
      'Genuine reactions and emotions',
      'First moments together',
      'Intimate portraits of the couple',
      'Candid moments with the bridal party'
    ]
  },
  {
    id: 'stage-sacred-ceremony',
    stageNumber: '03',
    title: 'THE SACRED CEREMONY',
    shortDesc: 'The heart of the celebration, traditional rituals and sacred vows.',
    fullDesc: 'The heart of the celebration. From traditional rituals and meaningful vows to blessings and joyful emotions, we preserve every significant moment of the ceremony.',
    image: '/img/wedding/Ravindu & Malikshi/DSC09201.webp',
    moodNote: 'TRADITIONAL RITUALS / MEANINGFUL VOWS / SACRED BLESSINGS',
    moments: [
      'Traditional wedding rituals & ceremonies',
      'Vows, blessings & symbolic moments',
      'Family and loved ones witnessing the ceremony',
      'Emotional reactions and candid moments',
      'Beautiful details of the ceremony setting'
    ]
  },
  {
    id: 'stage-wedding-function',
    stageNumber: '04',
    title: 'WEDDING FUNCTION',
    shortDesc: 'The celebration comes alive with laughter, music, and unforgettable energy.',
    fullDesc: 'The celebration comes alive with laughter, music, family, and unforgettable moments. We capture the energy of the reception while preserving the details and emotions that make your wedding unique.',
    image: '/img/wedding/Ravindu & Malikshi/DSC09225.webp',
    moodNote: 'RECEPTION ENERGY / CELEBRATION / FIRST DANCE & MEMORIES',
    moments: [
      'Couple entrances & grand moments',
      'Cake cutting and special traditions',
      'First dance & couple moments',
      'Family, friends & candid celebrations',
      'Speeches, laughter and joyful memories',
      'Reception details, décor & atmosphere'
    ]
  }
];

export const SELECTED_WEDDINGS: WeddingStory[] = [
  {
    id: 'story-ravindu-malikshi',
    slug: 'ravindu-and-malikshi',
    storyNumber: '01',
    couple: 'RAVINDU & MALIKSHI',
    location: 'COLOMBO, SRI LANKA',
    venue: 'Galle Face Heritage & Ocean Lawn',
    date: 'JANUARY 2026',
    coverImage: '/img/wedding/Ravindu & Malikshi/DSC09233.webp',
    heroImage: '/img/wedding/Ravindu & Malikshi/DSC09233.webp',
    thumbnail: '/img/wedding/Ravindu & Malikshi/DSC09088.webp',
    storyQuote: 'Not a single moment felt forced or uncomfortable. CreativeFX captured the true emotions, the laughter, and every tear so beautifully.',
    storyParagraphs: [
      'Set against the historic oceanfront backdrop of Colombo, Ravindu and Malikshi wanted their wedding documented authentically—focusing on genuine emotions rather than stiff poses.',
      'Our team covered every chapter of their special day with multi-camera 4K cinema coverage and high-resolution photography, preserving the colors, the joy, and the intimate memories for a lifetime.'
    ],
    gallery: [
      {
        url: '/img/wedding/Ravindu & Malikshi/DSC09088.webp',
        caption: 'Bridal morning preparation and quiet anticipation',
        aspect: 'portrait'
      },
      {
        url: '/img/wedding/Ravindu & Malikshi/DSC09201.webp',
        caption: 'Sacred wedding ceremony and exchanging promises',
        aspect: 'landscape'
      },
      {
        url: '/img/wedding/Ravindu & Malikshi/DSC09225.webp',
        caption: 'Evening reception and celebrating with family',
        aspect: 'landscape'
      },
      {
        url: '/img/wedding/Ravindu & Malikshi/DSC09233.webp',
        caption: 'Iconic couple portraits by the ocean lawn',
        aspect: 'portrait'
      },
      {
        url: '/img/wedding/Ravindu & Malikshi/DSC09271.webp',
        caption: 'Spontaneous candid laughter and happy moments',
        aspect: 'portrait'
      },
      {
        url: '/img/wedding/Ravindu & Malikshi/DSC09275.webp',
        caption: 'Romantic night portrait under ambient lights',
        aspect: 'portrait'
      },
      {
        url: '/img/wedding/Ravindu & Malikshi/DSC09295.webp',
        caption: 'Elegant bridal detail and architectural lighting',
        aspect: 'portrait'
      },
      {
        url: '/img/wedding/Ravindu & Malikshi/DSC09312.webp',
        caption: 'Enduring memories of an unforgettable wedding',
        aspect: 'landscape'
      }
    ],
    videoUrl: '/video/Malikshi_Ravindu_Wedding.webm',
    videoPoster: '/img/wedding/Ravindu & Malikshi/DSC09233.webp',
    highlights: [
      { title: 'COVERAGE STYLE', desc: 'Natural, candid, and cinematic storytelling' },
      { title: 'LIGHTING', desc: 'Warm natural light and elegant ambient lighting' },
      { title: 'EXPERIENCE', desc: 'Relaxed, unobtrusive, and genuinely fun' }
    ],
    details: {
      photographer: 'CreativeFX Wedding Photography Team',
      cinematographer: 'CreativeFX Cinema & Drone Crew',
      cameraFormat: 'Full Frame Sony 4K & Prime Lenses',
      deliveredFrames: '800+ Edited High-Res Photos & 4K Cinema Reel'
    }
  }
];

export const WEDDING_APPROACH_PRINCIPLES = [
  {
    number: '01',
    title: 'NATURAL & CANDID MOMENTS',
    desc: 'No awkward posing or forced smiles. We blend in seamlessly to capture genuine laughter, happy tears, and real emotions as they happen naturally.'
  },
  {
    number: '02',
    title: 'WARM & TIMELESS COLORS',
    desc: 'We craft rich, true-to-life tones that never go out of style. Years from now, your photos will look just as stunning and vibrant as they felt on your wedding day.'
  },
  {
    number: '03',
    title: 'ALL-DAY DEDICATED TEAM',
    desc: 'From early morning dressing to the final farewell dance, our passionate photographers and videographers are by your side to make sure not a single moment is missed.'
  }
];
