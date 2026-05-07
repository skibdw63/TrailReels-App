export const starterReelers = [
  {
    id: "owner",
    email: "owner@trailreels.app",
    username: "trailowner",
    displayName: "TrailReels Owner",
    role: "owner",
    creatorType: "music",
    bio: "Founder of TrailReels. Building memory feeds, Reelers, Trails, and archive systems.",
    followers: 12840,
    banner: "Founder Trail"
  },
  {
    id: "admin1",
    username: "sunsetmod",
    displayName: "SunsetMod",
    role: "admin",
    creatorType: "film",
    bio: "Admin and film Reeler. I help keep TrailReels safe and cinematic.",
    followers: 3204,
    banner: "Admin Glow"
  },
  {
    id: "music1",
    username: "dreamwaves",
    displayName: "DreamWaves",
    role: "reeler",
    creatorType: "music",
    bio: "Music Reeler. Soft loops, memory edits, blue-hour sounds.",
    followers: 8842,
    banner: "Music Reeler"
  },
  {
    id: "archive1",
    username: "oldtapes94",
    displayName: "OldTapes94",
    role: "reeler",
    creatorType: "archive",
    bio: "Recovering forgotten clips, school drive memories, and dusty uploads.",
    followers: 5277,
    banner: "Archive Keeper"
  },
  {
    id: "game1",
    username: "pixeltrail",
    displayName: "PixelTrail",
    role: "reeler",
    creatorType: "gaming",
    bio: "Gaming videos, devlogs, clips, and strange little internet worlds.",
    followers: 2190,
    banner: "Gaming Reeler"
  },
  {
    id: "art1",
    username: "paintedmemory",
    displayName: "PaintedMemory",
    role: "reeler",
    creatorType: "art",
    bio: "Art Reeler making dreamy orange, yellow, blue, and dark-blue edits.",
    followers: 1765,
    banner: "Art Reeler"
  }
];

export const starterPosts = [
  {
    id: "reel1",
    authorId: "music1",
    type: "reel",
    title: "Blissful Memory Loop",
    caption: "A short emotional edit for the Memories tab.",
    length: "0:32",
    echoes: 1421,
    comments: 138,
    tags: ["music", "memories", "sunset"]
  },
  {
    id: "trail1",
    authorId: "owner",
    type: "trail",
    title: "The First TrailReels Update",
    caption: "A long video showing the creator panel, badges, reports, and Reelers.",
    length: "18:44",
    echoes: 7300,
    comments: 620,
    tags: ["update", "owner", "platform"]
  },
  {
    id: "reel2",
    authorId: "archive1",
    type: "reel",
    title: "Recovered School Drive Clip",
    caption: "Not horror. Just that lonely old-file feeling.",
    length: "0:19",
    echoes: 889,
    comments: 71,
    tags: ["archive", "recovered", "nostalgia"]
  },
  {
    id: "trail2",
    authorId: "admin1",
    type: "trail",
    title: "Blue Hour Documentary",
    caption: "A cinematic Trail about why old online memories feel emotional.",
    length: "42:03",
    echoes: 2733,
    comments: 392,
    tags: ["film", "bluehour", "documentary"]
  },
  {
    id: "reel3",
    authorId: "game1",
    type: "reel",
    title: "Game Dev Clip",
    caption: "A tiny clip from a weird dreamlike Roblox-style level.",
    length: "0:27",
    echoes: 420,
    comments: 49,
    tags: ["gaming", "devlog", "clip"]
  },
  {
    id: "trail3",
    authorId: "art1",
    type: "trail",
    title: "Painting a Sunset UI",
    caption: "Full creative process for a TrailReels profile frame.",
    length: "23:11",
    echoes: 998,
    comments: 88,
    tags: ["art", "ui", "profile"]
  }
];

export const starterBadges = [
  { id: "b1", name: "Owner Crown", icon: "♛", type: "owner", color: "blue-red" },
  { id: "b2", name: "Admin Hammer", icon: "🔨", type: "admin", color: "blue" },
  { id: "b3", name: "Music Creator", icon: "♪", type: "creator", color: "sunset" },
  { id: "b4", name: "Archive Keeper", icon: "▣", type: "creator", color: "dark-blue" },
  { id: "b5", name: "Memory Maker", icon: "🌅", type: "creator", color: "yellow-orange" },
  { id: "b6", name: "Trusted Reeler", icon: "✓", type: "trust", color: "blue" }
];
