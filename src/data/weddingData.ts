import { WeddingTimelineStage, WeddingStory } from '../types';

export const WEDDING_TIMELINE_STAGES: WeddingTimelineStage[] = [
  {
    id: 'stage-beginning',
    stageNumber: '01',
    title: 'THE MORNING PREPARATION',
    shortDesc: 'The quiet anticipation. Getting ready with loved ones.',
    fullDesc: 'The calm before the celebration begins. Hair, makeup, traditional jewelry, family blessings, and the emotional, heartfelt moments before you step out to say "I do".',
    image: '/img/wedding/Ravindu & Malikshi/DSC09088.jpg',
    moodNote: 'BRIDAL PREPARATION / CANDID EMOTIONS / FAMILY BLESSINGS',
    moments: [
      'Bridal & Groom getting ready details',
      'Mother & Father blessings and happy tears',
      'The intimate first look with parents & bridal party',
      'Relaxed, natural portraits before the ceremony'
    ]
  },
  {
    id: 'stage-ceremony',
    stageNumber: '02',
    title: 'THE SACRED CEREMONY',
    shortDesc: 'The exchange of vows, traditions, and timeless promises.',
    fullDesc: 'The heart of your wedding day. From the walk down the aisle and the traditional Poruwa rituals to the exchanging of rings and blessings from family and friends.',
    image: '/img/wedding/Ravindu & Malikshi/DSC09201.jpg',
    moodNote: 'TRADITIONAL CUSTOMS / SACRED VOWS / UNFILTERED JOY',
    moments: [
      'Aisle entrance & emotional first look',
      'Traditional Poruwa ceremony & customs',
      'Vow & ring exchange witnessed by loved ones',
      'The joyous walk out as newlyweds to roaring cheers'
    ]
  },
  {
    id: 'stage-celebration',
    stageNumber: '03',
    title: 'THE RECEPTION & FIRST DANCE',
    shortDesc: 'Laughter, heartfelt speeches, and unforgettable celebrations.',
    fullDesc: 'The energy and happiness of celebrating with everyone you love. Champagne toasts, moving speeches, your romantic first dance under warm lights, and an electric dance floor.',
    image: '/img/wedding/Ravindu & Malikshi/DSC09225.jpg',
    moodNote: 'LIVE CELEBRATION / FIRST DANCE / DANCE FLOOR ENERGY',
    moments: [
      'Romantic first dance under ambient lights',
      'Heartfelt toasts, cheers, and laughs',
      'Cake cutting & celebratory champagne toast',
      'High-energy party moments on the dance floor'
    ]
  },
  {
    id: 'stage-farewell',
    stageNumber: '04',
    title: 'COUPLE PORTRAITS & FAREWELL',
    shortDesc: 'Golden hour sunset frames and the midnight send-off.',
    fullDesc: 'Taking a quiet breath together during sunset for stunning couple portraits, followed by a sparkling night send-off into your new journey together.',
    image: '/img/wedding/Ravindu & Malikshi/DSC09233.jpg',
    moodNote: 'GOLDEN HOUR / ROMANTIC PORTRAITS / MEMORABLE SEND-OFF',
    moments: [
      'Golden hour romantic couple portraits',
      'Warm hugs & emotional goodbyes with closest friends',
      'Sparkler tunnel & night farewell departure',
      'Timeless memories captured forever'
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
    coverImage: '/img/wedding/Ravindu & Malikshi/DSC09233.jpg',
    heroImage: '/img/wedding/Ravindu & Malikshi/DSC09233.jpg',
    thumbnail: '/img/wedding/Ravindu & Malikshi/DSC09088.jpg',
    storyQuote: 'Not a single moment felt forced or uncomfortable. CreativeFX captured the true emotions, the laughter, and every tear so beautifully.',
    storyParagraphs: [
      'Set against the historic oceanfront backdrop of Colombo, Ravindu and Malikshi wanted their wedding documented authentically—focusing on genuine emotions rather than stiff poses.',
      'Our team covered every chapter of their special day with multi-camera 4K cinema coverage and high-resolution photography, preserving the colors, the joy, and the intimate memories for a lifetime.'
    ],
    gallery: [
      {
        url: '/img/wedding/Ravindu & Malikshi/DSC09088.jpg',
        caption: 'Bridal morning preparation and quiet anticipation',
        aspect: 'portrait'
      },
      {
        url: '/img/wedding/Ravindu & Malikshi/DSC09201.jpg',
        caption: 'Sacred wedding ceremony and exchanging promises',
        aspect: 'landscape'
      },
      {
        url: '/img/wedding/Ravindu & Malikshi/DSC09225.jpg',
        caption: 'Evening reception and celebrating with family',
        aspect: 'landscape'
      },
      {
        url: '/img/wedding/Ravindu & Malikshi/DSC09233.jpg',
        caption: 'Iconic couple portraits by the ocean lawn',
        aspect: 'portrait'
      },
      {
        url: '/img/wedding/Ravindu & Malikshi/DSC09271.jpg',
        caption: 'Spontaneous candid laughter and happy moments',
        aspect: 'portrait'
      },
      {
        url: '/img/wedding/Ravindu & Malikshi/DSC09275.jpg',
        caption: 'Romantic night portrait under ambient lights',
        aspect: 'portrait'
      },
      {
        url: '/img/wedding/Ravindu & Malikshi/DSC09295.jpg',
        caption: 'Elegant bridal detail and architectural lighting',
        aspect: 'portrait'
      },
      {
        url: '/img/wedding/Ravindu & Malikshi/DSC09312.jpg',
        caption: 'Enduring memories of an unforgettable wedding',
        aspect: 'landscape'
      }
    ],
    videoUrl: '/video/Malikshi_Ravindu_Wedding.mp4',
    videoPoster: '/img/wedding/Ravindu & Malikshi/DSC09233.jpg',
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
