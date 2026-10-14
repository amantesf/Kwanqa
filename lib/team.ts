// Founder profiles shown on the home page and the Team page.
//
// To change a photo: drop the new image into `public/team/` and update the
// `image` path below (e.g. '/team/nehmiya-new.jpg'). Square photos of at
// least 600×600px look best. Set `image` to null to show initials instead.

export type Founder = {
  name: string;
  role: string;
  image: string | null;
  bio: string;
};

export const founders: Founder[] = [
  {
    name: 'Amanuel Tesfaye',
    role: 'Co‑founder',
    image: '/team/amanuel.jpeg',
    bio: 'Amanuel co‑founded Kwanqa to give Amharic speakers and diaspora kids the kind of learning tools he never had growing up. He cares deeply about access, clarity, and building technology that actually feels like it was made for our community.',
  },
  {
    name: 'Nehmiya Erkelo',
    role: 'Co‑founder',
    image: '/team/nehmiya.png',
    bio: 'Nehmiya co‑founded Kwanqa to bridge the gap between Ethiopia and the diaspora through language. He believes technology should amplify teachers, families, and cultural knowledge—not replace them.',
  },
];
