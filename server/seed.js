require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Property = require('./models/Property');

const IMAGES = {
  apartment: [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop',
  ],
  house: [
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop',
  ],
  studio: [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&auto=format&fit=crop',
  ],
};

const SEED_USERS = [
  { username: 'amara_fomba',  email: 'amara@propspace.cm',  password: 'Test1234!' },
  { username: 'njike_realty', email: 'njike@propspace.cm',  password: 'Test1234!' },
];

const SEED_PROPERTIES = [
  // Douala
  {
    title: 'Résidence Les Palmiers — Douala Akwa',
    description: 'Lumineux appartement de standing au cœur du quartier Akwa. Finitions modernes, cuisine équipée, sécurité 24h/24 et vue dégagée sur la ville.',
    price: 48_000_000,
    city: 'Douala',
    country: 'Cameroon',
    type: 'Apartment',
    ownerIndex: 0,
    imageIndex: 0,
    imageType: 'apartment',
  },
  {
    title: 'Villa Bali — Bonamoussadi',
    description: 'Majestueuse villa 5 chambres dans la résidence sécurisée de Bonamoussadi. Piscine privée, jardin tropical, garage double et dépendance.',
    price: 285_000_000,
    city: 'Douala',
    country: 'Cameroon',
    type: 'House',
    ownerIndex: 1,
    imageIndex: 0,
    imageType: 'house',
  },
  {
    title: 'Studio Cosy — Bali Douala',
    description: 'Studio meublé idéalement situé à Bali, proche de toutes les commodités. Parfait pour jeune professionnel ou étudiant.',
    price: 9_500_000,
    city: 'Douala',
    country: 'Cameroon',
    type: 'Studio',
    ownerIndex: 0,
    imageIndex: 0,
    imageType: 'studio',
  },

  // Yaoundé
  {
    title: 'Appartement Bastos Prestige',
    description: 'Appartement haut standing dans le quartier diplomatique de Bastos. Sécurité renforcée, climatisation centralisée, et parkings sécurisés.',
    price: 75_000_000,
    city: 'Yaoundé',
    country: 'Cameroon',
    type: 'Apartment',
    ownerIndex: 1,
    imageIndex: 1,
    imageType: 'apartment',
  },
  {
    title: 'Villa Colline Verte — Mfandena',
    description: 'Belle villa avec vue panoramique sur la ville de Yaoundé. 4 chambres, salon spacieux, cuisine américaine, jardin et parking.',
    price: 195_000_000,
    city: 'Yaoundé',
    country: 'Cameroon',
    type: 'House',
    ownerIndex: 0,
    imageIndex: 1,
    imageType: 'house',
  },
  {
    title: 'Studio Moderne — Mvog-Mbi',
    description: 'Studio entièrement rénové au quartier Mvog-Mbi. Électroménager neuf, accès internet fibre et eau permanente.',
    price: 7_200_000,
    city: 'Yaoundé',
    country: 'Cameroon',
    type: 'Studio',
    ownerIndex: 1,
    imageIndex: 1,
    imageType: 'studio',
  },

  // Bafoussam
  {
    title: 'Résidence Mont Cameroun — Bafoussam',
    description: 'Appartement de 3 chambres dans une résidence neuve. Quartier calme, proche du centre-ville, gardiennage 24h.',
    price: 32_000_000,
    city: 'Bafoussam',
    country: 'Cameroon',
    type: 'Apartment',
    ownerIndex: 0,
    imageIndex: 2,
    imageType: 'apartment',
  },
  {
    title: 'Maison Familiale — Tamdja',
    description: "Grande maison familiale 5 chambres à Tamdja. Cour spacieuse, jardin fruitier, quartier paisible et facile d'accès.",
    price: 58_000_000,
    city: 'Bafoussam',
    country: 'Cameroon',
    type: 'House',
    ownerIndex: 1,
    imageIndex: 2,
    imageType: 'house',
  },

  // Kribi
  {
    title: 'Villa Bord de Mer — Kribi Sud',
    description: 'Villa de luxe avec accès direct à la plage. Vue mer imprenable, terrasse, 3 chambres avec salle de bain privative, et pool bar.',
    price: 165_000_000,
    city: 'Kribi',
    country: 'Cameroon',
    type: 'House',
    ownerIndex: 0,
    imageIndex: 3,
    imageType: 'house',
  },
  {
    title: 'Appartement Vue Océan — Kribi Centre',
    description: "Bel appartement 2 chambres avec vue sur l'océan Atlantique. Résidence récente, sécurisée, idéale pour résidence secondaire ou location saisonnière.",
    price: 42_500_000,
    city: 'Kribi',
    country: 'Cameroon',
    type: 'Apartment',
    ownerIndex: 1,
    imageIndex: 3,
    imageType: 'apartment',
  },

  // Limbe
  {
    title: 'Maison Résidentielle — Limbe Mile 4',
    description: 'Maison moderne 4 chambres à Limbe, quartier calme proche de la plage. Terrain clôturé, groupe électrogène et forage.',
    price: 72_000_000,
    city: 'Limbe',
    country: 'Cameroon',
    type: 'House',
    ownerIndex: 0,
    imageIndex: 4,
    imageType: 'house',
  },
  {
    title: 'Studio Balnéaire — Limbe Down Beach',
    description: 'Studio à quelques pas de Down Beach. Bien meublé, lumineux, idéal pour les professionnels du secteur pétrolier ou touristique.',
    price: 8_000_000,
    city: 'Limbe',
    country: 'Cameroon',
    type: 'Studio',
    ownerIndex: 1,
    imageIndex: 2,
    imageType: 'studio',
  },

  // Buea
  {
    title: 'Appartement Fako Heights — Buea',
    description: "Appartement 3 chambres avec vue sur le Mont Cameroun. Quartier universitaire, proche de l'UB, résidence sécurisée.",
    price: 27_500_000,
    city: 'Buea',
    country: 'Cameroon',
    type: 'Apartment',
    ownerIndex: 0,
    imageIndex: 0,
    imageType: 'apartment',
  },

  // Bamenda
  {
    title: 'Villa Panoramique — Bamenda Up Station',
    description: 'Villa 4 chambres avec vue sur les montagnes de l\'Ouest. Terrain de 500m², garage, jardins paysagés et quartier résidentiel haut de gamme.',
    price: 88_000_000,
    city: 'Bamenda',
    country: 'Cameroon',
    type: 'House',
    ownerIndex: 1,
    imageIndex: 1,
    imageType: 'house',
  },

  // Garoua
  {
    title: 'Appartement Moderne — Garoua Plateau',
    description: 'Appartement 2 chambres dans une résidence neuve à Garoua. Climatisation, eau chaude, groupe électrogène et gardiennage.',
    price: 18_000_000,
    city: 'Garoua',
    country: 'Cameroon',
    type: 'Apartment',
    ownerIndex: 0,
    imageIndex: 1,
    imageType: 'apartment',
  },

  // Ngaoundéré
  {
    title: 'Studio Étudiant — Ngaoundéré Centre',
    description: 'Studio propre et fonctionnel au centre de Ngaoundéré. Proche de l\'Université de Ngaoundéré, eau et électricité permanentes.',
    price: 6_500_000,
    city: 'Ngaoundéré',
    country: 'Cameroon',
    type: 'Studio',
    ownerIndex: 1,
    imageIndex: 0,
    imageType: 'studio',
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  await Property.deleteMany({});
  await User.deleteMany({});
  console.log('Cleared existing data');

  const users = await User.insertMany(SEED_USERS);
  console.log(`Created ${users.length} users`);

  const properties = SEED_PROPERTIES.map(p => ({
    title:       p.title,
    description: p.description,
    price:       p.price,
    city:        p.city,
    country:     p.country,
    type:        p.type,
    images:      [IMAGES[p.imageType][p.imageIndex % IMAGES[p.imageType].length]],
    owner:       users[p.ownerIndex]._id,
  }));

  await Property.insertMany(properties);
  console.log(`Created ${properties.length} properties`);

  console.log('\nSeed users (for login):');
  SEED_USERS.forEach(u => console.log(`  ${u.email} / ${u.password}`));

  await mongoose.disconnect();
  console.log('\nDone.');
}

seed().catch(err => { console.error(err); process.exit(1); });
