import { courseContent, type Track } from '@/lib/courses';
import { isDone, trackCourses, type Climb } from '@/lib/climb';

// The Kwanqa passport: finishing a camp (every lesson, and its mistakes review)
// earns a stamp from a real place in Ethiopia, with a short fact about it. The
// last camp of a course is always the summit, Ras Dashen.
//
// Facts were checked against UNESCO, Britannica, Wikipedia, the Met Museum and
// Al Jazeera (Addis Ababa and Konso: UNESCO and africamap.net; Sof Omar:
// UNESCO's tentative list and showcaves.com).

export type StampId =
  | 'lalibela'
  | 'gondar'
  | 'axum'
  | 'tana'
  | 'harar'
  | 'danakil'
  | 'bale'
  | 'addis'
  | 'konso'
  | 'sof-omar'
  | 'tis-abay'
  | 'ras-dashen';

export type Stamp = {
  id: StampId;
  name: string;
  amharic: string;
  region: string;
  /** Ink colour for the stamp. */
  ink: string;
  fact: string;
};

/** Places in the order they're collected; the summit stamp is kept for the last camp. */
const PLACES: Stamp[] = [
  {
    id: 'lalibela',
    name: 'Lalibela',
    amharic: 'ላሊበላ',
    region: 'Amhara',
    ink: '#b5452a',
    fact:
      'Eleven churches here were carved straight down into solid rock. Tradition says King Lalibela built them over 800 years ago.',
  },
  {
    id: 'gondar',
    name: 'Gondar',
    amharic: 'ጎንደር',
    region: 'Amhara',
    ink: '#7b4a2b',
    fact:
      'Emperor Fasilides made Gondar his capital in 1636 and built a stone castle. His successors added more, so it’s called the Camelot of Africa.',
  },
  {
    id: 'axum',
    name: 'Axum',
    amharic: 'አክሱም',
    region: 'Tigray',
    ink: '#5b4fb3',
    fact:
      'The Obelisk of Axum is 24 m tall and about 1,700 years old. It was taken to Rome in 1937 and came home in 2005.',
  },
  {
    id: 'tana',
    name: 'Lake Tana',
    amharic: 'ጣና ሐይቅ',
    region: 'Amhara',
    ink: '#1f6fb5',
    fact:
      'Ethiopia’s largest lake feeds the Blue Nile (ዓባይ). Old monasteries sit on its islands, and fishermen still sail papyrus boats called tankwa.',
  },
  {
    id: 'harar',
    name: 'Harar',
    amharic: 'ሐረር',
    region: 'Harari',
    ink: '#1f8a5b',
    fact:
      'The old walled town has five main gates. Since the 1960s, Harar’s “hyena men” have fed wild hyenas by hand at night.',
  },
  {
    id: 'danakil',
    name: 'Danakil',
    amharic: 'ዳናኪል',
    region: 'Afar',
    ink: '#c27a12',
    fact:
      'About 125 m below sea level, it’s one of the hottest places on Earth. Camels still carry its salt bars, which were once used as money.',
  },
  {
    id: 'bale',
    name: 'Bale Mountains',
    amharic: 'ባሌ ተራሮች',
    region: 'Oromia',
    ink: '#3f7d3a',
    fact:
      'More than half of all Ethiopian wolves live here. With fewer than 500 left, they’re the rarest wild dogs in the world.',
  },
  {
    id: 'addis',
    name: 'Addis Ababa',
    amharic: 'አዲስ አበባ',
    region: 'Capital city',
    ink: '#c2366b',
    fact:
      'Menelik II and Empress Taytu founded the capital in 1886, and its name means “new flower.” It’s home to the African Union and Merkato, one of Africa’s largest open-air markets.',
  },
  {
    id: 'konso',
    name: 'Konso',
    amharic: 'ኮንሶ',
    region: 'South Ethiopia',
    ink: '#8a5a1f',
    fact:
      'For over 400 years the Konso people have built stone terraces, some 5 m high, to farm dry hillsides, and carved wooden statues called waka to honour the dead. It’s a UNESCO World Heritage Site.',
  },
  {
    id: 'sof-omar',
    name: 'Sof Omar Caves',
    amharic: 'ሶፍ ዑመር',
    region: 'Oromia',
    ink: '#2a7f8a',
    fact:
      'Ethiopia’s longest cave, over 15 km, was carved by the Weyib River. It’s named after Sheikh Sof Omar, a holy man who sheltered here about 1,000 years ago, and Muslim pilgrims still come to pray.',
  },
  {
    id: 'tis-abay',
    name: 'Blue Nile Falls',
    amharic: 'ጢስ ዓባይ',
    region: 'Near Bahir Dar',
    ink: '#2f6db5',
    fact:
      'Downstream from Lake Tana, the Blue Nile drops about 40 m over a wide cliff. Its Amharic name, ጢስ ዓባይ, means “smoking Nile”, for the mist that rises from the falls.',
  },
];

const SUMMIT: Stamp = {
  id: 'ras-dashen',
  name: 'Ras Dashen',
  amharic: 'ራስ ዳሽን',
  region: 'Simien Mountains',
  ink: '#d2582e',
  fact:
    'Ethiopia’s highest mountain, at 4,550 m. The Simien Mountains around it are the only place in the world where the walia ibex lives.',
};

/** The stamp for each camp of a course, from Camp 1 to the summit. */
export function stampsFor(track: Track): { stamp: Stamp; slug: string; camp: number }[] {
  const courses = trackCourses(track);
  return courses.map((course, i) => ({
    stamp: i === courses.length - 1 ? SUMMIT : PLACES[i % PLACES.length],
    slug: course.slug,
    camp: i + 1,
  }));
}

/**
 * A camp's stamp is earned once every lesson is done and its missed
 * questions have been reviewed, the same moment its trophy turns gold.
 */
export function campComplete(climb: Climb, slug: string, pendingMistakes: number) {
  const lessons = courseContent[slug]?.sections ?? [];
  return lessons.length > 0 && lessons.every((_, i) => isDone(climb, slug, i)) && pendingMistakes === 0;
}
