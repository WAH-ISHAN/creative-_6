import { ContentStatus, ProjectCase } from '../types';

// Base static projects — DEFAULTS for the website.
// The Admin Panel edits the authoritative copy stored in data/content.json;
// these records are used as fallbacks when a server record is missing fields.
export const PROJECT_DEFAULTS_RAW: Omit<ProjectCase, 'status'>[] = [
  {
    "id": "proj-01",
    "code": "PROJECT / 001",
    "slug": "neo-sphere-kinetic",
    "title": "PRODUCTS",
    "client": "VARIOUS",
    "type": "video",
    "featured": true,
    "category": "COMMERCIAL",
    "categoryLabel": "Product Videography",
    "year": "2026",
    "coverImage": "/img/poster/Sprite Shoot- Final.webp",
    "videoUrl": "/video/Products/Sprite Shoot- Final.webm",
    "aspectRatio": "landscape",
    "summary": "High-end product videography featuring intricate macro shots, dynamic lighting, and cinematic motion.",
    "challenge": "Capturing the essence and detail of physical products while maintaining brand identity.",
    "solution": "Utilized precision robotic arms, custom lighting setups, and advanced color grading.",
    "deliverables": [
      "Commercial Videos",
      "Social Media Reels",
      "High-Res Stills"
    ],
    "gallery": [
      "/video/Products/Chefa Official Video (1).webm",
      "/video/Products/Sprite Shoot- Final.webm",
      "/video/Products/TESTCOKENEWGRAINED.webm",
      "/img/poster/Chefa Official Video (1).webp",
      "/img/poster/Sprite Shoot- Final.webp",
      "/img/poster/TESTCOKENEWGRAINED.webp"
    ],
    "tags": [
      "Products",
      "Commercial",
      "Macro"
    ],
    "socialUrl": "https://www.facebook.com/creativefx.lk",
    "socialLabel": "WATCH COMMERCIALS ON FACEBOOK",
    "socialPosts": [
      { "name": "CreativeFX - Commercial Production Reel", "url": "https://www.facebook.com/share/r/1Br1SqsowT/", "type": "reel" },
      { "name": "CreativeFX - Official Facebook Page", "url": "https://www.facebook.com/creativefx.lk", "type": "post" }
    ]
  },
  {
    "id": "proj-02",
    "code": "PROJECT / 002",
    "slug": "aura-sound-identity",
    "title": "MARKETING",
    "client": "VARIOUS",
    "type": "video",
    "featured": false,
    "category": "COMMERCIAL",
    "categoryLabel": "Marketing Campaigns",
    "year": "2026",
    "coverImage": "/img/poster/RentMasterFinal.webp",
    "videoUrl": "/video/Marketing/HELAFITS - Final.webm",
    "aspectRatio": "portrait",
    "summary": "Engaging marketing campaigns designed to captivate audiences and drive brand awareness.",
    "challenge": "Creating scroll-stopping content in a saturated digital landscape.",
    "solution": "Fast-paced editing, bold typography, and energetic sound design.",
    "deliverables": [
      "Campaign Videos",
      "Promo Teasers"
    ],
    "gallery": [
      "/video/Marketing/Ashan Glass FInal.webm",
      "/video/Marketing/GreenCosmoPromotion.webm",
      "/video/Marketing/HELAFITS - Final.webm",
      "/video/Marketing/Kowakka - Suwaprana.webm",
      "/video/Marketing/RentMasterFinal.webm",
      "/video/Marketing/Suwaprana Revised.webm",
      "/video/Marketing/Techubiz Final.webm",
      "/img/poster/Ashan Glass FInal.webp",
      "/img/poster/GreenCosmoPromotion.webp",
      "/img/poster/HELAFITS - Final.webp",
      "/img/poster/Kowakka - Suwaprana.webp",
      "/img/poster/RentMasterFinal.webp",
      "/img/poster/Suwaprana Revised.webp",
      "/img/poster/Techubiz Final.webp"
    ],
    "tags": [
      "Marketing",
      "Promo",
      "Digital"
    ],
    "socialUrl": "https://www.facebook.com/creativefx.lk",
    "socialLabel": "WATCH CAMPAIGNS ON FACEBOOK",
    "socialPosts": [
      { "name": "CreativeFX - Marketing & Brand Campaigns", "url": "https://www.facebook.com/share/r/1Br1SqsowT/", "type": "reel" },
      { "name": "CreativeFX - Official Facebook Page", "url": "https://www.facebook.com/creativefx.lk", "type": "post" }
    ]
  },
  {
    "id": "proj-03",
    "status": "draft",
    "code": "PROJECT / 003",
    "slug": "vortex-titanium-stills",
    "title": "GRADUATION",
    "client": "GRADUATES",
    "type": "video",
    "featured": true,
    "category": "EVENTS",
    "categoryLabel": "Graduation Films & Photos",
    "year": "2026",
    "coverImage": "/img/poster/Pera Convocation - Full.webp",
    "videoUrl": "/video/Graduation/Pera Convocation - Full.webm",
    "aspectRatio": "landscape",
    "summary": "Cinematic graduation films and photo shoot sessions capturing proudest moments and the journey of achievement across leading universities.",
    "challenge": "Documenting the emotion and scale of convocation ceremonies.",
    "solution": "Multi-camera setups and intimate portrait sessions mixed with event coverage.",
    "deliverables": [
      "Highlight Reel",
      "Portrait Videos",
      "Ceremony Edits",
      "Convocation Photo Albums"
    ],
    "gallery": [
      "/video/Graduation/Couples.webm",
      "/video/Graduation/Dilki Final 02.webm",
      "/video/Graduation/Father final.webm",
      "/video/Graduation/Parents Final.webm",
      "/video/Graduation/Pera Convocation - Full.webm",
      "/video/Graduation/pink girl.webm",
      "/img/poster/Couples.webp",
      "/img/poster/Dilki Final 02.webp",
      "/img/poster/Father final.webp",
      "/img/poster/Parents Final.webp",
      "/img/poster/Pera Convocation - Full.webp",
      "/img/poster/pink girl.webp"
    ],
    "tags": [
      "Graduation",
      "Convocation",
      "Milestone",
      "Event"
    ],
    "socialUrl": "https://www.facebook.com/share/r/1Ag6mekb7Y/",
    "socialLabel": "WATCH CONVOCATION REELS ON FACEBOOK",
    "socialPosts": [
      { "name": "Wayamba University - Convocation Reel", "url": "https://www.facebook.com/share/r/1Ag6mekb7Y/", "type": "reel" },
      { "name": "Sabaragamuwa University (Couples) - Convocation Reel", "url": "https://www.facebook.com/share/r/1DNVuBhp6T/", "type": "reel" },
      { "name": "Layani - Graduation Highlight", "url": "https://www.facebook.com/share/r/1d4gxLvjg5/", "type": "reel" },
      { "name": "Peradeniya University (Parents Edition)", "url": "https://www.facebook.com/share/r/1C3QQpmcsq/", "type": "reel" },
      { "name": "Peradeniya University - Main Convocation Film", "url": "https://www.facebook.com/share/r/18otAnFbdS/", "type": "reel" },
      { "name": "Peradeniya University (Couples Edition)", "url": "https://www.facebook.com/share/r/1BLza21hhZ/", "type": "reel" },
      { "name": "Dilki - Graduation Reel", "url": "https://www.facebook.com/share/r/1BksPD3i7o/", "type": "reel" },
      { "name": "SLIIT (Parents Edition)", "url": "https://www.facebook.com/share/r/14ifxdhdF1V/", "type": "reel" },
      { "name": "Kaveen and Sanuri - Convocation Shoot", "url": "https://www.facebook.com/share/p/1QCxTqzgxv/", "type": "post" },
      { "name": "Nadeeka - Convocation Album", "url": "https://www.facebook.com/share/p/1GqnJqqrBq/", "type": "post" },
      { "name": "Anupama - Graduation Portrait Session", "url": "https://www.facebook.com/share/p/1Bizpe11G1/", "type": "post" },
      { "name": "Madukanka - Convocation Album", "url": "https://www.facebook.com/share/p/1C2h4LEfW6/", "type": "post" },
      { "name": "Samudi - Convocation Album", "url": "https://www.facebook.com/share/p/1D3Wo59pSv/", "type": "post" },
      { "name": "Vaichaly - Graduation Album", "url": "https://www.facebook.com/share/p/1LVhJb5seU/", "type": "post" }
    ]
  },
  {
    "id": "story-meera-arjun",
    "code": "PROJECT / 004",
    "slug": "meera-and-arjun-kandy",
    "title": "EVENTS",
    "client": "VARIOUS",
    "type": "video",
    "featured": true,
    "category": "EVENTS",
    "categoryLabel": "Event Cinematography",
    "year": "2026",
    "coverImage": "/img/poster/finalWasthi.webp",
    "videoUrl": "/video/Marketing/Techubiz Final.webm",
    "aspectRatio": "landscape",
    "summary": "Dynamic event coverage that encapsulates the energy, scale, and atmosphere of live concerts, cultural ceremonies, and grand opening events.",
    "challenge": "Adapting to unpredictable lighting and fast-paced environments.",
    "solution": "Run-and-gun cinematography with stabilized rigs and low-light capable lenses.",
    "deliverables": [
      "Event Aftermovies",
      "Social Snippets",
      "Full Concert Reels"
    ],
    "gallery": [
      "/video/Marketing/Ashan Glass FInal.webm",
      "/video/Events/finalWasthi.webm",
      "/img/poster/finalWasthi.webp"
    ],
    "tags": [
      "Events",
      "Live",
      "Concerts",
      "Aftermovie"
    ],
    "socialUrl": "https://www.facebook.com/share/r/1HVQWa5Lru/",
    "socialLabel": "WATCH EVENT REELS & FILMS ON FACEBOOK",
    "socialPosts": [
      { "name": "Sankalana Concert Film", "url": "https://www.facebook.com/share/r/1HVQWa5Lru/", "type": "reel" },
      { "name": "Euphoria Concert - Film 1", "url": "https://www.facebook.com/share/r/1DuRKmj15y/", "type": "reel" },
      { "name": "Euphoria Concert - Film 2", "url": "https://www.facebook.com/share/r/1EqipAzzAL/", "type": "reel" },
      { "name": "Sankalana Concert - Photo Album", "url": "https://www.facebook.com/share/p/198XMTJp5C/", "type": "post" },
      { "name": "Euphoria Concert - Photo Album", "url": "https://www.facebook.com/share/p/1JmpDsJ1mG/", "type": "post" },
      { "name": "25th Anniversary Milestone Album", "url": "https://www.facebook.com/share/p/1E9tWW6g5i/", "type": "post" },
      { "name": "Bhadrakali Amman Temple Maha Kumbhabhishekam", "url": "https://www.facebook.com/share/v/1CxME63StG/", "type": "video" },
      { "name": "Tezlaa - Opening Ceremony", "url": "https://www.facebook.com/share/v/1TXyVzNfTR/", "type": "video" },
      { "name": "SLIIT Wasantha Muwadora - Awurudu Film 1", "url": "https://www.facebook.com/share/r/1ZACAkZhxo/", "type": "reel" },
      { "name": "SLIIT Wasantha Muwadora - Awurudu Film 2", "url": "https://www.facebook.com/share/r/1LQJFdXx8B/", "type": "reel" }
    ]
  },
  {
    "id": "proj-05",
    "code": "PROJECT / 005",
    "slug": "birthday-films",
    "title": "BIRTHDAY FILMS",
    "client": "VARIOUS",
    "type": "video",
    "featured": false,
    "category": "CELEBRATIONS",
    "categoryLabel": "Birthday Celebrations",
    "year": "2026",
    "coverImage": "/img/poster/FINAL AYODYA REEL .webp",
    "videoUrl": "/video/Birthdays/FINAL AYODYA REEL .webm",
    "aspectRatio": "portrait",
    "summary": "Joyful and cinematic birthday films and reels that preserve beautiful memories with family and friends.",
    "challenge": "Capturing candid emotions without interrupting the celebration.",
    "solution": "Unobtrusive shooting style with a focus on genuine interactions and atmospheric details.",
    "deliverables": [
      "Birthday Film",
      "Teaser Reels",
      "Social Story Edits"
    ],
    "gallery": [
      "/video/Birthdays/FINAL AYODYA REEL .webm",
      "/video/Birthdays/Final Wageesha Horton.webm",
      "/video/Birthdays/Githmi Final Video.webm",
      "/video/Birthdays/dinara final edit new 1.webm",
      "/video/Birthdays/sakuniflowedit.webm",
      "/img/poster/FINAL AYODYA REEL .webp",
      "/img/poster/Final Wageesha Horton.webp",
      "/img/poster/Githmi Final Video.webp",
      "/img/poster/dinara final edit new 1.webp",
      "/img/poster/sakuniflowedit.webp"
    ],
    "tags": [
      "Birthdays",
      "Celebration",
      "Candid"
    ],
    "socialUrl": "https://www.facebook.com/share/r/19RQnN5yrG/",
    "socialLabel": "WATCH BIRTHDAY FILMS ON FACEBOOK",
    "socialPosts": [
      { "name": "Ayodya - Birthday Reel", "url": "https://www.facebook.com/share/r/19RQnN5yrG/", "type": "reel" },
      { "name": "Dinara - Birthday Film", "url": "https://www.facebook.com/share/r/1bmbVuQEmZ/", "type": "reel" },
      { "name": "Wageesha - Birthday Reel", "url": "https://www.facebook.com/share/r/1EseuUkCZe/", "type": "reel" },
      { "name": "Samara - Birthday Film", "url": "https://www.facebook.com/share/r/14otwB5BTGd/", "type": "reel" },
      { "name": "Githmi - Birthday Reel", "url": "https://www.facebook.com/share/r/19KLF3wjxF/", "type": "reel" },
      { "name": "Chamudi - Birthday Photo Album", "url": "https://www.facebook.com/share/p/1Cxv6RXmgj/", "type": "post" },
      { "name": "Sachini - Birthday Photo Album", "url": "https://www.facebook.com/share/p/17uW8grJ3S/", "type": "post" },
      { "name": "Dinara - Birthday Photo Album", "url": "https://www.facebook.com/share/p/19TUTdicZs/", "type": "post" }
    ]
  },
  {
    "id": "video-dance-covers",
    "code": "PROJECT / 009",
    "slug": "dance-covers",
    "title": "DANCE COVERS",
    "client": "CREATIVE VISUALS",
    "type": "video",
    "featured": false,
    "category": "COMMERCIAL",
    "categoryLabel": "Dance & Choreography Visuals",
    "year": "2026",
    "coverImage": "/img/poster/FINAL AYODYA REEL .webp",
    "videoUrl": "/video/Birthdays/FINAL AYODYA REEL .webm",
    "aspectRatio": "portrait",
    "summary": "Energetic and rhythmic dance cover video productions with dynamic lighting and camera movement.",
    "challenge": "Synchronizing camera movement and edits with complex choreography and rhythm.",
    "solution": "Custom gimbal moves, speed ramping, and beat-matched cuts.",
    "deliverables": [
      "Dance Film",
      "Instagram Reels",
      "TikTok Cuts"
    ],
    "gallery": [
      "/video/Birthdays/FINAL AYODYA REEL .webm",
      "/video/Birthdays/Githmi Final Video.webm"
    ],
    "tags": [
      "Dance",
      "Music Video",
      "Choreography"
    ],
    "socialUrl": "https://www.facebook.com/share/r/19aBu38Jr1/",
    "socialLabel": "WATCH DANCE REELS ON FACEBOOK",
    "socialPosts": [
      { "name": "Mi Chico - Dance Cover Reel", "url": "https://www.facebook.com/share/r/19aBu38Jr1/", "type": "reel" },
      { "name": "Kavkaz - Dance Cover Reel", "url": "https://www.facebook.com/share/r/1DSUj7yzAE/", "type": "reel" }
    ]
  },
  {
    "id": "photo-01",
    "code": "PHOTO / 001",
    "slug": "zova-clothing",
    "title": "ZOVA CLOTHING",
    "client": "ZOVA",
    "type": "photography",
    "featured": false,
    "category": "FASHION",
    "categoryLabel": "Fashion Editorial",
    "year": "2026",
    "coverImage": "/img/Products/Zova Clothing/DSC06306.webp",
    "aspectRatio": "portrait",
    "summary": "High-end fashion photography showcasing the latest collection with striking poses and moody lighting.",
    "challenge": "Highlighting fabric textures while maintaining an editorial vibe.",
    "solution": "Used specialized strobe lighting and a neutral background.",
    "deliverables": [
      "Lookbook",
      "Social Media Assets"
    ],
    "gallery": [
      "/img/Products/Zova Clothing/DSC06306.webp",
      "/img/Products/Zova Clothing/DSC06381.webp",
      "/img/Products/Zova Clothing/DSC06409.webp",
      "/img/Products/Zova Clothing/DSC06418.webp",
      "/img/Products/Zova Clothing/DSC06449.webp",
      "/img/Products/Zova Clothing/DSC06460.webp",
      "/img/Products/Zova Clothing/DSC06493.webp"
    ],
    "tags": [
      "Fashion",
      "Editorial",
      "Clothing"
    ],
    "socialUrl": "https://www.facebook.com/creativefx.lk",
    "socialLabel": "VIEW FASHION ON FACEBOOK",
    "socialPosts": [
      { "name": "Zova Clothing - Fashion Editorial Lookbook", "url": "https://www.facebook.com/creativefx.lk", "type": "post" },
      { "name": "CreativeFX - Official Facebook Page", "url": "https://www.facebook.com/creativefx.lk", "type": "post" }
    ]
  },
  {
    "id": "photo-02",
    "code": "PHOTO / 002",
    "slug": "ceylon-gems",
    "title": "CEYLON GEMS",
    "client": "JEWELRY",
    "type": "photography",
    "featured": false,
    "category": "COMMERCIAL",
    "categoryLabel": "Product Photography",
    "year": "2026",
    "coverImage": "/img/Products/Gems/DSC01031.webp",
    "aspectRatio": "portrait",
    "summary": "Macro product photography capturing the brilliance, cut, and clarity of premium gemstones.",
    "challenge": "Managing reflections and highlighting the internal facets of the gems.",
    "solution": "Focus stacking and polarized lighting techniques.",
    "deliverables": [
      "E-Commerce Stills",
      "Macro Details"
    ],
    "gallery": [
      "/img/Products/Gems/DSC00813.webp",
      "/img/Products/Gems/DSC00837.webp",
      "/img/Products/Gems/DSC00851.webp",
      "/img/Products/Gems/DSC00892.webp",
      "/img/Products/Gems/DSC00986.webp",
      "/img/Products/Gems/DSC01012.webp",
      "/img/Products/Gems/DSC01031.webp",
      "/img/Products/Gems/DSC01063.webp"
    ],
    "tags": [
      "Product",
      "Macro",
      "Jewelry"
    ],
    "socialUrl": "https://www.facebook.com/creativefx.lk",
    "socialLabel": "VIEW PRODUCT STILLS ON FACEBOOK",
    "socialPosts": [
      { "name": "Ceylon Gems - Macro Product Photography", "url": "https://www.facebook.com/creativefx.lk", "type": "post" },
      { "name": "CreativeFX - Official Facebook Page", "url": "https://www.facebook.com/creativefx.lk", "type": "post" }
    ]
  },
  {
    "id": "photo-03",
    "code": "PHOTO / 003",
    "slug": "25th-anniversary",
    "title": "25TH ANNIVERSARY",
    "client": "PRIVATE",
    "type": "photography",
    "featured": false,
    "category": "EVENTS",
    "categoryLabel": "Event Photography",
    "year": "2026",
    "coverImage": "/img/Events/25th Annivesary/DSC01701.webp",
    "aspectRatio": "landscape",
    "summary": "Capturing the beautiful milestone of a 25th anniversary celebration.",
    "challenge": "Documenting candid moments in a dimly lit banquet hall.",
    "solution": "Fast prime lenses and discreet off-camera flashes.",
    "deliverables": [
      "Event Album",
      "Print Frames"
    ],
    "gallery": [
      "/img/Events/25th Annivesary/DSC01106.webp",
      "/img/Events/25th Annivesary/DSC01126.webp",
      "/img/Events/25th Annivesary/DSC01137.webp",
      "/img/Events/25th Annivesary/DSC01188.webp",
      "/img/Events/25th Annivesary/DSC01198.webp",
      "/img/Events/25th Annivesary/DSC01218.webp",
      "/img/Events/25th Annivesary/DSC01306.webp",
      "/img/Events/25th Annivesary/DSC01318.webp",
      "/img/Events/25th Annivesary/DSC01335.webp",
      "/img/Events/25th Annivesary/DSC01353.webp",
      "/img/Events/25th Annivesary/DSC01457.webp",
      "/img/Events/25th Annivesary/DSC01514.webp",
      "/img/Events/25th Annivesary/DSC01526.webp",
      "/img/Events/25th Annivesary/DSC01556.webp",
      "/img/Events/25th Annivesary/DSC01569.webp",
      "/img/Events/25th Annivesary/DSC01632.webp",
      "/img/Events/25th Annivesary/DSC01701.webp",
      "/img/Events/25th Annivesary/DSC01704.webp",
      "/img/o/Events/25th Annivesary/DSC01750.webp"
    ],
    "tags": [
      "Event",
      "Anniversary",
      "Celebration"
    ],
    "socialUrl": "https://www.facebook.com/share/p/1E9tWW6g5i/",
    "socialLabel": "VIEW 25TH ANNIVERSARY ON FACEBOOK",
    "socialPosts": [
      { "name": "25th Anniversary Milestone Album", "url": "https://www.facebook.com/share/p/1E9tWW6g5i/", "type": "post" }
    ]
  },
  {
    "id": "photo-04",
    "code": "PHOTO / 004",
    "slug": "gender-reveal",
    "title": "GENDER REVEAL",
    "client": "PRIVATE",
    "type": "photography",
    "featured": false,
    "category": "EVENTS",
    "categoryLabel": "Event Photography",
    "year": "2026",
    "coverImage": "/img/Events/Gender Reveal/DSC09306.webp",
    "aspectRatio": "portrait",
    "summary": "A joyous gender reveal party filled with emotion and surprise.",
    "challenge": "Capturing the exact split-second of the reveal reaction.",
    "solution": "High-speed continuous shooting mode and multiple angles.",
    "deliverables": [
      "Highlight Gallery",
      "Social Media Snaps"
    ],
    "gallery": [
      "/img/Events/Gender Reveal/DSC09294.webp",
      "/img/Events/Gender Reveal/DSC09298.webp",
      "/img/Events/Gender Reveal/DSC09306.webp",
      "/img/Events/Gender Reveal/DSC09315.webp",
      "/img/Events/Gender Reveal/DSC09333.webp",
      "/img/Events/Gender Reveal/DSC09391.webp",
      "/img/Events/Gender Reveal/DSC09400.webp",
      "/img/Events/Gender Reveal/DSC09418.webp",
      "/img/Events/Gender Reveal/DSC09470.webp",
      "/img/Events/Gender Reveal/DSC09543.webp",
      "/img/Events/Gender Reveal/DSC09621.webp"
    ],
    "tags": [
      "Event",
      "Gender Reveal",
      "Candid"
    ],
    "socialUrl": "https://www.facebook.com/creativefx.lk",
    "socialLabel": "VIEW GENDER REVEAL ON FACEBOOK",
    "socialPosts": [
      { "name": "Gender Reveal Celebration Photo Session", "url": "https://www.facebook.com/creativefx.lk", "type": "post" },
      { "name": "CreativeFX - Official Facebook Page", "url": "https://www.facebook.com/creativefx.lk", "type": "post" }
    ]
  },
  {
    "id": "photo-05",
    "code": "PHOTO / 005",
    "slug": "jana-birthday",
    "title": "JANA'S BIRTHDAY & CASUAL SHOOT",
    "client": "PRIVATE",
    "type": "photography",
    "featured": false,
    "category": "PORTRAIT",
    "categoryLabel": "Birthday & Casual Photography",
    "year": "2026",
    "coverImage": "/img/Birthdays/Jana/DSC08039.webp",
    "aspectRatio": "portrait",
    "summary": "A beautiful birthday and casual portrait session capturing joy and personality.",
    "challenge": "Creating a relaxed and fun atmosphere for the subject.",
    "solution": "Used natural daylight and interactive prompts.",
    "deliverables": [
      "Portrait Gallery",
      "Casual Lookbook"
    ],
    "gallery": [
      "/img/Birthdays/Jana/DSC08039.webp",
      "/img/Birthdays/Jana/DSC08168.webp",
      "/img/Birthdays/Jana/DSC08198.webp",
      "/img/Birthdays/Jana/Untitled-1.webp",
      "/img/Casual Shoot/Jana/DSC08039.webp",
      "/img/Casual Shoot/Jana/DSC08082.webp",
      "/img/Casual Shoot/Jana/DSC08168.webp",
      "/img/Casual Shoot/Jana/DSC08188.webp",
      "/img/Casual Shoot/Jana/DSC08198.webp",
      "/img/Casual Shoot/Jana/DSC08212.webp",
      "/img/Casual Shoot/Jana/DSC08218.webp",
      "/img/Casual Shoot/Jana/DSC08227.webp",
      "/img/Casual Shoot/Jana/Untitled-1.webp",
      "/img/Casual Shoot/Jana/Untitled-3.webp",
      "/img/Casual Shoot/Jana/Untitled-4.webp"
    ],
    "tags": [
      "Birthday",
      "Casual",
      "Portrait"
    ],
    "socialUrl": "https://www.facebook.com/share/p/1GqKQqchBx/",
    "socialLabel": "VIEW CASUAL SHOOTS ON FACEBOOK",
    "socialPosts": [
      { "name": "Janakalani - Casual Shoot Album", "url": "https://www.facebook.com/share/p/1GqKQqchBx/", "type": "post" },
      { "name": "Githmi - Casual Shoot Album", "url": "https://www.facebook.com/share/p/197ZHfJjdw/", "type": "post" }
    ]
  },
  {
    "id": "photo-06",
    "code": "PHOTO / 006",
    "slug": "thathsarani-birthday",
    "title": "THATHSARANI",
    "client": "PRIVATE",
    "type": "photography",
    "featured": false,
    "category": "PORTRAIT",
    "categoryLabel": "Birthday Photography",
    "year": "2026",
    "coverImage": "/img/Birthdays/Thathsarani/1st copy.webp",
    "aspectRatio": "portrait",
    "summary": "Stunning outdoor birthday portraits focusing on natural beauty.",
    "challenge": "Balancing harsh sunlight during the outdoor shoot.",
    "solution": "Used diffusers and shot during the golden hour.",
    "deliverables": [
      "Retouched Portraits"
    ],
    "gallery": [
      "/img/Birthdays/Thathsarani/1st copy.webp",
      "/img/Birthdays/Thathsarani/DSC00140 copy.webp",
      "/img/Birthdays/Thathsarani/DSC00258 copy.webp",
      "/img/Birthdays/Thathsarani/DSC00323 copy.webp",
      "/img/Casual Shoot/Thathsarani/DSC00077 copy.webp",
      "/img/Casual Shoot/Thathsarani/DSC00116 copy.webp",
      "/img/Casual Shoot/Thathsarani/DSC00132 copy.webp",
      "/img/Casual Shoot/Thathsarani/DSC00140 copy.webp",
      "/img/Casual Shoot/Thathsarani/DSC00210 copy 2.webp",
      "/img/Casual Shoot/Thathsarani/DSC00257 copy.webp",
      "/img/Casual Shoot/Thathsarani/DSC00258 copy.webp",
      "/img/Casual Shoot/Thathsarani/DSC00323 copy.webp"
    ],
    "tags": [
      "Birthday",
      "Portrait",
      "Outdoor"
    ],
    "socialUrl": "https://www.facebook.com/share/p/1GqKQqchBx/",
    "socialLabel": "VIEW BIRTHDAY ALBUM ON FACEBOOK",
    "socialPosts": [
      { "name": "Thathsarani - Birthday Portrait Album", "url": "https://www.facebook.com/share/p/1GqKQqchBx/", "type": "post" },
      { "name": "CreativeFX - Official Facebook Page", "url": "https://www.facebook.com/creativefx.lk", "type": "post" }
    ]
  },
  {
    "id": "video-graduation",
    "code": "PROJECT / 007",
    "slug": "graduation-films",
    "title": "GRADUATION FILMS",
    "client": "VARIOUS",
    "type": "video",
    "featured": true,
    "category": "EVENTS",
    "categoryLabel": "Graduation Cinematography",
    "year": "2026",
    "coverImage": "/img/poster/Pera Convocation - Full.webp",
    "videoUrl": "/video/Graduation/Pera Convocation - Full.webm",
    "aspectRatio": "landscape",
    "summary": "Cinematic graduation films that preserve one of life's most cherished milestones with emotional depth and visual beauty.",
    "challenge": "Capturing raw emotion across a large venue with hundreds of graduates while maintaining storytelling cohesion.",
    "solution": "Multi-camera coverage with handheld cinema rigs and telephoto lenses for intimate close-ups.",
    "deliverables": [
      "Feature Film",
      "Highlight Reels",
      "Social Clips"
    ],
    "gallery": [
      "/video/Graduation/Pera Convocation - Full.webm",
      "/video/Graduation/Dilki Final 02.webm",
      "/video/Graduation/Couples.webm",
      "/video/Graduation/Father final.webm",
      "/video/Graduation/Parents Final.webm",
      "/video/Graduation/pink girl.webm",
      "/img/poster/Pera Convocation - Full.webp",
      "/img/poster/Dilki Final 02.webp",
      "/img/poster/Couples.webp",
      "/img/poster/Father final.webp",
      "/img/poster/Parents Final.webp",
      "/img/poster/pink girl.webp"
    ],
    "tags": [
      "Graduation",
      "Events",
      "Cinematography"
    ],
    "socialUrl": "https://www.facebook.com/share/r/1Ag6mekb7Y/",
    "socialLabel": "WATCH CONVOCATION FILMS ON FACEBOOK",
    "socialPosts": [
      { "name": "Wayamba University - Convocation Reel", "url": "https://www.facebook.com/share/r/1Ag6mekb7Y/", "type": "reel" },
      { "name": "Sabaragamuwa University (Couples) - Convocation Reel", "url": "https://www.facebook.com/share/r/1DNVuBhp6T/", "type": "reel" },
      { "name": "Layani - Graduation Highlight", "url": "https://www.facebook.com/share/r/1d4gxLvjg5/", "type": "reel" },
      { "name": "Peradeniya University (Parents Edition)", "url": "https://www.facebook.com/share/r/1C3QQpmcsq/", "type": "reel" },
      { "name": "Peradeniya University - Main Convocation Film", "url": "https://www.facebook.com/share/r/18otAnFbdS/", "type": "reel" },
      { "name": "Peradeniya University (Couples Edition)", "url": "https://www.facebook.com/share/r/1BLza21hhZ/", "type": "reel" },
      { "name": "Dilki - Graduation Reel", "url": "https://www.facebook.com/share/r/1BksPD3i7o/", "type": "reel" },
      { "name": "SLIIT (Parents Edition)", "url": "https://www.facebook.com/share/r/14ifxdhdF1V/", "type": "reel" },
      { "name": "Kaveen and Sanuri - Convocation Shoot", "url": "https://www.facebook.com/share/p/1QCxTqzgxv/", "type": "post" },
      { "name": "Nadeeka - Convocation Album", "url": "https://www.facebook.com/share/p/1GqnJqqrBq/", "type": "post" },
      { "name": "Anupama - Graduation Portrait Session", "url": "https://www.facebook.com/share/p/1Bizpe11G1/", "type": "post" },
      { "name": "Madukanka - Convocation Album", "url": "https://www.facebook.com/share/p/1C2h4LEfW6/", "type": "post" },
      { "name": "Samudi - Convocation Album", "url": "https://www.facebook.com/share/p/1D3Wo59pSv/", "type": "post" },
      { "name": "Vaichaly - Graduation Album", "url": "https://www.facebook.com/share/p/1LVhJb5seU/", "type": "post" }
    ]
  },
  {
    "id": "photo-casual",
    "code": "PHOTO / 007",
    "slug": "casual-shoot",
    "title": "CASUAL SHOOTS",
    "client": "PRIVATE",
    "type": "photography",
    "featured": false,
    "category": "PORTRAIT",
    "categoryLabel": "Casual Portrait Shoots",
    "year": "2026",
    "coverImage": "/img/N_Shoots/FB_IMG_1786940354705.jpg.webp",
    "aspectRatio": "portrait",
    "summary": "Relaxed, candid portrait sessions that bring out natural personality and genuine emotion in real environments.",
    "challenge": "Creating comfortable, authentic moments without the stiffness of a traditional studio shoot.",
    "solution": "Shot in natural environments with lifestyle prompts and minimal direction.",
    "deliverables": [
      "Portrait Gallery",
      "Social Media Edits"
    ],
    "gallery": [
      "/img/N_Shoots/FB_IMG_1786940354705.jpg.webp",
      "/img/N_Shoots/FB_IMG_1786940366722.jpg.webp",
      "/img/N_Shoots/FB_IMG_1786940374047.jpg.webp",
      "/img/N_Shoots/FB_IMG_1786940381518.jpg.webp",
      "/img/N_Shoots/FB_IMG_1786940490646.jpg.webp",
      "/img/N_Shoots/FB_IMG_1786940501967.jpg.webp",
      "/img/N_Shoots/FB_IMG_1786940512573.jpg.webp"
    ],
    "tags": [
      "Casual",
      "Portrait",
      "Natural"
    ],
    "socialUrl": "https://www.facebook.com/share/p/1GqKQqchBx/",
    "socialLabel": "VIEW CASUAL SHOOTS ON FACEBOOK",
    "socialPosts": [
      { "name": "Janakalani - Casual Shoot Album", "url": "https://www.facebook.com/share/p/1GqKQqchBx/", "type": "post" },
      { "name": "Githmi - Casual Shoot Album", "url": "https://www.facebook.com/share/p/197ZHfJjdw/", "type": "post" }
    ]
  },
  {
    "id": "photo-graduation",
    "status": "draft",
    "code": "PHOTO / 011",
    "slug": "graduation-photo",
    "title": "CONVOCATION PHOTOGRAPHY",
    "client": "GRADUATES",
    "type": "photography",
    "featured": false,
    "category": "EVENTS",
    "categoryLabel": "Convocation Photography",
    "year": "2026",
    "coverImage": "/img/Graduation/IIT/DSC02671.webp",
    "aspectRatio": "landscape",
    "summary": "Convocation and graduation portrait sessions — robes, diplomas and proud smiles captured across IIT, Sabaragamuwa, Peradeniya and private sittings.",
    "challenge": "Compressing individual portraits and ceremony energy into fast-moving schedules across venues.",
    "solution": "Dedicated portrait stations paired with roaming candid coverage and scouted campus backdrops.",
    "deliverables": [
      "Graduation Albums",
      "Individual Portraits",
      "Group Photos",
      "Framed Prints"
    ],
    "gallery": [
      "/img/Graduation/IIT/DSC02657.webp",
      "/img/Graduation/IIT/DSC02671.webp",
      "/img/Graduation/IIT/DSC02681.webp",
      "/img/Graduation/IIT/DSC02682.webp",
      "/img/Graduation/IIT/DSC02751.webp",
      "/img/Graduation/IIT/DSC02757 (1).webp",
      "/img/Graduation/IIT/DSC02795.webp",
      "/img/Graduation/IIT/DSC02816.webp",
      "/img/Graduation/IIT/DSC02856 (1).webp",
      "/img/Graduation/IIT/DSC02950.webp",
      "/img/Graduation/Sabaragamu/DSC08712.webp",
      "/img/Graduation/Sabaragamu/DSC08739.webp",
      "/img/Graduation/Sabaragamu/DSC08751.webp",
      "/img/Graduation/Sabaragamu/DSC0875133.webp",
      "/img/Graduation/Sabaragamu/DSC08797.webp",
      "/img/Graduation/Sabaragamu/DSC08817.webp",
      "/img/Graduation/Sabaragamu/DSC08823.webp",
      "/img/Graduation/Sabaragamu/Untitled-3.webp",
      "/img/Graduation/Samudi/DSC00001.webp",
      "/img/Graduation/Samudi/DSC00131.webp",
      "/img/Graduation/Samudi/DSC00176.webp",
      "/img/Graduation/Samudi/DSC09878.webp",
      "/img/Graduation/Samudi/DSC09905.webp",
      "/img/Graduation/Samudi/DSC09907.webp",
      "/img/Graduation/Samudi/DSC09917.webp",
      "/img/Graduation/Samudi/DSC09950.webp",
      "/img/Graduation/Samudi/DSC09994.webp"
    ],
    "tags": [
      "Graduation",
      "Photography",
      "Milestone"
    ],
    "socialUrl": "https://www.facebook.com/share/p/1QCxTqzgxv/",
    "socialLabel": "VIEW CONVOCATION ALBUMS ON FACEBOOK",
    "socialPosts": [
      { "name": "Kaveen and Sanuri - Convocation Shoot", "url": "https://www.facebook.com/share/p/1QCxTqzgxv/", "type": "post" },
      { "name": "Nadeeka - Convocation Album", "url": "https://www.facebook.com/share/p/1GqnJqqrBq/", "type": "post" },
      { "name": "Anupama - Graduation Portrait Session", "url": "https://www.facebook.com/share/p/1Bizpe11G1/", "type": "post" },
      { "name": "Madukanka - Convocation Album", "url": "https://www.facebook.com/share/p/1C2h4LEfW6/", "type": "post" },
      { "name": "Samudi - Convocation Album", "url": "https://www.facebook.com/share/p/1D3Wo59pSv/", "type": "post" },
      { "name": "Vaichaly - Graduation Album", "url": "https://www.facebook.com/share/p/1LVhJb5seU/", "type": "post" },
      { "name": "Wayamba University - Convocation Reel", "url": "https://www.facebook.com/share/r/1Ag6mekb7Y/", "type": "reel" },
      { "name": "Sabaragamuwa University (Couples) - Convocation Reel", "url": "https://www.facebook.com/share/r/1DNVuBhp6T/", "type": "reel" },
      { "name": "Layani - Graduation Highlight", "url": "https://www.facebook.com/share/r/1d4gxLvjg5/", "type": "reel" },
      { "name": "Peradeniya University (Parents Edition)", "url": "https://www.facebook.com/share/r/1C3QQpmcsq/", "type": "reel" },
      { "name": "Peradeniya University - Main Convocation Film", "url": "https://www.facebook.com/share/r/18otAnFbdS/", "type": "reel" },
      { "name": "Peradeniya University (Couples Edition)", "url": "https://www.facebook.com/share/r/1BLza21hhZ/", "type": "reel" },
      { "name": "Dilki - Graduation Reel", "url": "https://www.facebook.com/share/r/1BksPD3i7o/", "type": "reel" },
      { "name": "SLIIT (Parents Edition)", "url": "https://www.facebook.com/share/r/14ifxdhdF1V/", "type": "reel" }
    ]
  },
  {
    "id": "video-events",
    "code": "PROJECT / 008",
    "slug": "events-cinematography",
    "title": "EVENTS & CELEBRATIONS",
    "client": "VARIOUS",
    "type": "video",
    "featured": false,
    "category": "EVENTS",
    "categoryLabel": "Event Cinematography",
    "year": "2026",
    "coverImage": "/img/poster/ColoredFinalEuphoria (1).webp",
    "videoUrl": "/video/Events/ColoredFinalEuphoria (1).webm",
    "aspectRatio": "landscape",
    "summary": "High-energy event films for concerts, cultural celebrations, private parties, and milestone events across Sri Lanka.",
    "challenge": "Maintaining narrative structure and visual consistency across unpredictable, dynamic events.",
    "solution": "Pre-event planning sessions with clients and multi-camera setups with dedicated audio capture.",
    "deliverables": [
      "Event Highlight Film",
      "Same-Day Edit",
      "Teaser Reel"
    ],
    "gallery": [
      "/video/Events/ColoredFinalEuphoria (1).webm",
      "/video/Events/finalWasthi.webm",
      "/img/poster/ColoredFinalEuphoria (1).webp",
      "/img/poster/finalWasthi.webp"
    ],
    "tags": [
      "Events",
      "Celebration",
      "Corporate"
    ],
    "socialUrl": "https://www.facebook.com/share/r/1HVQWa5Lru/",
    "socialLabel": "WATCH EVENT FILMS ON FACEBOOK",
    "socialPosts": [
      { "name": "Sankalana Concert Film", "url": "https://www.facebook.com/share/r/1HVQWa5Lru/", "type": "reel" },
      { "name": "Euphoria Concert - Film 1", "url": "https://www.facebook.com/share/r/1DuRKmj15y/", "type": "reel" },
      { "name": "Euphoria Concert - Film 2", "url": "https://www.facebook.com/share/r/1EqipAzzAL/", "type": "reel" },
      { "name": "Sankalana Concert - Photo Album", "url": "https://www.facebook.com/share/p/198XMTJp5C/", "type": "post" },
      { "name": "Euphoria Concert - Photo Album", "url": "https://www.facebook.com/share/p/1JmpDsJ1mG/", "type": "post" },
      { "name": "25th Anniversary Milestone Album", "url": "https://www.facebook.com/share/p/1E9tWW6g5i/", "type": "post" },
      { "name": "Bhadrakali Amman Temple Maha Kumbhabhishekam", "url": "https://www.facebook.com/share/v/1CxME63StG/", "type": "video" },
      { "name": "Tezlaa - Opening Ceremony", "url": "https://www.facebook.com/share/v/1TXyVzNfTR/", "type": "video" },
      { "name": "SLIIT Wasantha Muwadora - Awurudu Film 1", "url": "https://www.facebook.com/share/r/1ZACAkZhxo/", "type": "reel" },
      { "name": "SLIIT Wasantha Muwadora - Awurudu Film 2", "url": "https://www.facebook.com/share/r/1LQJFdXx8B/", "type": "reel" }
    ]
  },
  {
    "id": "photo-wedding-ravindu",
    "code": "PHOTO / 008",
    "slug": "ravindu-malikshi-wedding",
    "title": "RAVINDU & MALIKSHI",
    "client": "RAVINDU & MALIKSHI",
    "type": "photography",
    "featured": true,
    "category": "WEDDINGS",
    "categoryLabel": "Wedding Photography",
    "year": "2026",
    "coverImage": "/img/wedding/Ravindu & Malikshi/DSC09233.webp",
    "aspectRatio": "landscape",
    "summary": "A beautiful wedding story told through intimate photography — from the pre-dawn preparations to the final dance.",
    "challenge": "Balancing grand ceremony scale with intimate, emotional micro-moments throughout the day.",
    "solution": "Two-photographer approach with prime lenses for low-light ceremony coverage and wide angles for grand venue shots.",
    "deliverables": [
      "Full Wedding Album",
      "Highlight Gallery",
      "Fine Art Prints"
    ],
    "gallery": [
      "/img/wedding/Ravindu & Malikshi/DSC09088.webp",
      "/img/wedding/Ravindu & Malikshi/DSC09201.webp",
      "/img/wedding/Ravindu & Malikshi/DSC09225.webp",
      "/img/wedding/Ravindu & Malikshi/DSC09233.webp",
      "/img/wedding/Ravindu & Malikshi/DSC09271.webp",
      "/img/wedding/Ravindu & Malikshi/DSC09275.webp",
      "/img/wedding/Ravindu & Malikshi/DSC09295.webp",
      "/img/wedding/Ravindu & Malikshi/DSC09312.webp"
    ],
    "tags": [
      "Wedding",
      "Photography",
      "Ceremony"
    ],
    "socialUrl": "https://www.facebook.com/creativefx.lk",
    "socialLabel": "VIEW WEDDINGS ON FACEBOOK",
    "socialPosts": [
      { "name": "Ravindu & Malikshi - Wedding Day Gallery", "url": "https://www.facebook.com/creativefx.lk", "type": "post" }
    ]
  },
  {
    "id": "photo-wedding-preshoot",
    "code": "PHOTO / 014",
    "slug": "ravindu-malikshi-pre-shoot",
    "title": "RAVINDU & MALIKSHI PRE-SHOOT",
    "client": "RAVINDU & MALIKSHI",
    "type": "photography",
    "featured": false,
    "category": "WEDDINGS",
    "categoryLabel": "Wedding Pre-Shoot",
    "year": "2026",
    "coverImage": "/img/Weddings/Ravindu & Malikshi PreShoot/DSC09498.webp",
    "aspectRatio": "portrait",
    "summary": "An intimate pre-wedding shoot ahead of the big day — relaxed moments, chemistry and anticipation.",
    "challenge": "Helping a couple feel natural on camera before their wedding day.",
    "solution": "A pressure-free location session that doubles as a comfort-building experience.",
    "deliverables": [
      "Pre-Shoot Gallery",
      "Save-the-Date Frames"
    ],
    "gallery": [
      "/img/Weddings/Ravindu & Malikshi PreShoot/DSC09088.webp",
      "/img/Weddings/Ravindu & Malikshi PreShoot/DSC09201.webp",
      "/img/Weddings/Ravindu & Malikshi PreShoot/DSC09225.webp",
      "/img/Weddings/Ravindu & Malikshi PreShoot/DSC09233.webp",
      "/img/Weddings/Ravindu & Malikshi PreShoot/DSC09271.webp",
      "/img/Weddings/Ravindu & Malikshi PreShoot/DSC09275.webp",
      "/img/Weddings/Ravindu & Malikshi PreShoot/DSC09295.webp",
      "/img/Weddings/Ravindu & Malikshi PreShoot/DSC09312.webp",
      "/img/Weddings/Ravindu & Malikshi PreShoot/DSC09498.webp",
      "/img/o/Weddings/Ravindu & Malikshi PreShoot/DSC09547.webp",
      "/img/Weddings/Ravindu & Malikshi PreShoot/DSC09583.webp"
    ],
    "tags": [
      "Wedding",
      "Pre-Shoot",
      "Couple"
    ],
    "socialUrl": "https://www.facebook.com/creativefx.lk",
    "socialLabel": "VIEW PRE-SHOOT ON FACEBOOK",
    "socialPosts": [
      { "name": "Ravindu & Malikshi - Pre-Wedding Album", "url": "https://www.facebook.com/creativefx.lk", "type": "post" }
    ]
  }
];

// Hero media framing that was previously hardcoded in the detail page — now a
// per-project default the admin can override via `heroPosition`.
const HERO_POSITION_DEFAULTS: Record<string, string> = {
  'thathsarani-birthday': 'center 60%',
  'aura-sound-identity': 'center 26%',
  'birthday-films': 'center 50%',
  'zova-clothing': 'center 18%',
  'jana-birthday': 'center 22%',
  'casual-shoot': 'center 20%',
  'gender-reveal': 'center 28%',
  'ravindu-malikshi-pre-shoot': 'center 25%',
  'dance-covers': 'center 20%',
};

export const ALL_PROJECTS: ProjectCase[] = PROJECT_DEFAULTS_RAW.map(p => ({
  ...p,
  status: 'published' as ContentStatus,
  heroPosition: p.heroPosition || HERO_POSITION_DEFAULTS[p.slug] || (p.aspectRatio === 'portrait' ? 'center 20%' : 'center center'),
}));
