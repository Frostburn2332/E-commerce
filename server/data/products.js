const products = [
  {
    name: "LEGO Star Wars Millennium Falcon",
    price: 159.99,
    description: "Build the iconic Star Wars ship with this 1,351-piece LEGO set. Features detailed interior, rotating laser cannons, and minifigures.",
    image: "https://m.media-amazon.com/images/I/81elHe1xGWL.jpg",
    category: "Building Blocks",
    stock: 25,
    ageRange: "9-11 years",
    brand: "LEGO",
    ratings: 4.8
  },
  {
    name: "Baby Yoda Plush Toy",
    price: 24.99,
    description: "Soft and cuddly Baby Yoda (The Child) plush toy from The Mandalorian series. 11 inches tall.",
    image: "https://m.media-amazon.com/images/I/71O-Il088wL.jpg",
    category: "Plush Toys",
    stock: 50,
    ageRange: "3-5 years",
    brand: "Star Wars",
    ratings: 4.9
  },
  {
    name: "Hot Wheels 20-Car Gift Pack",
    price: 19.99,
    description: "Set of 20 die-cast cars with unique designs. Perfect for collectors and young car enthusiasts.",
    image: "https://m.media-amazon.com/images/I/81Ykz9TAacL.jpg",
    category: "Vehicles",
    stock: 30,
    ageRange: "3-5 years",
    brand: "Hot Wheels",
    ratings: 4.7
  },
  {
    name: "Barbie Dreamhouse",
    price: 199.99,
    description: "Three-story dollhouse with 8 rooms, working elevator, pool, and over 70 accessories.",
    image: "https://m.media-amazon.com/images/I/81U9M7pXfeL.jpg",
    category: "Dolls",
    stock: 15,
    ageRange: "6-8 years",
    brand: "Barbie",
    ratings: 4.6
  },
  {
    name: "Nintendo Switch Lite",
    price: 199.99,
    description: "Portable gaming system with built-in controllers and a sleek, lightweight design.",
    image: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800&auto=format&fit=crop",
    category: "Electronic",
    stock: 20,
    ageRange: "6-8 years",
    brand: "Nintendo",
    ratings: 4.8
  },
  {
    name: "Nerf Ultra One Motorized Blaster",
    price: 49.99,
    description: "High-performance Nerf blaster with motorized firing and 25-dart drum.",
    image: "https://m.media-amazon.com/images/I/71XtrYwQAWL._AC_UF1000,1000_QL80_.jpg",
    category: "Action Figures",
    stock: 35,
    ageRange: "9-11 years",
    brand: "Nerf",
    ratings: 4.5
  },
  {
    name: "Melissa & Doug Wooden Building Blocks",
    price: 29.99,
    description: "100-piece wooden block set for creative construction and early learning.",
    image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&auto=format&fit=crop",
    category: "Educational",
    stock: 40,
    ageRange: "3-5 years",
    brand: "Melissa & Doug",
    ratings: 4.7
  },
  {
    name: "Marvel Spider-Man Action Figure",
    price: 19.99,
    description: "Highly articulated 6-inch Spider-Man figure with web accessories.",
    image: "https://images.unsplash.com/photo-1608889476561-6242cfdbf622?w=800&auto=format&fit=crop",
    category: "Action Figures",
    stock: 45,
    ageRange: "6-8 years",
    brand: "Marvel",
    ratings: 4.6
  },
  {
    name: "Monopoly Board Game",
    price: 19.99,
    description: "Classic property trading board game for the whole family.",
    image: "https://images.unsplash.com/photo-1611371805429-8b5c1b2c34ba?w=800&auto=format&fit=crop",
    category: "Games",
    stock: 50,
    ageRange: "9-11 years",
    brand: "Hasbro",
    ratings: 4.8
  },
  {
    name: "Little Tikes Cozy Coupe",
    price: 59.99,
    description: "Classic ride-on car with working horn, cup holder, and storage.",
    image: "https://m.media-amazon.com/images/I/61DJnAztRgL.jpg",
    category: "Outdoor",
    stock: 25,
    ageRange: "0-2 years",
    brand: "Little Tikes",
    ratings: 4.7
  },
  {
    name: "Play-Doh Super Color Pack",
    price: 24.99,
    description: "20 different colors of Play-Doh modeling compound.",
    image: "https://m.media-amazon.com/images/I/814F2UmoUCL._AC_UF1000,1000_QL80_.jpg",
    category: "Educational",
    stock: 60,
    ageRange: "3-5 years",
    brand: "Play-Doh",
    ratings: 4.8
  },
  {
    name: "VTech Touch and Learn Activity Desk",
    price: 79.99,
    description: "Interactive desk with LED screen, converts from desk to easel and chalkboard.",
    image: "https://m.media-amazon.com/images/I/71cGl1kJG7L._AC_UF350,350_QL80_.jpg",
    category: "Educational",
    stock: 20,
    ageRange: "3-5 years",
    brand: "VTech",
    ratings: 4.6
  },
  {
    name: "Remote Control Monster Truck",
    price: 49.99,
    description: "4WD RC monster truck with shock absorbers and high-speed motor.",
    image: "https://m.media-amazon.com/images/I/81bvAoS+tRL.jpg",
    category: "Vehicles",
    stock: 30,
    ageRange: "6-8 years",
    brand: "Monster Jam",
    ratings: 4.5
  },
  {
    name: "Disney Princess Ultimate Celebration Castle",
    price: 149.99,
    description: "4-foot tall castle playset with lights, sounds, and furniture.",
    image: "https://m.media-amazon.com/images/I/81jad461T4S._AC_UF894,1000_QL80_.jpg",
    category: "Dolls",
    stock: 20,
    ageRange: "3-5 years",
    brand: "Disney",
    ratings: 4.7
  },
  {
    name: "Razor A5 Lux Scooter",
    price: 89.99,
    description: "Premium kick scooter with large wheels and adjustable handlebars.",
    image: "https://m.media-amazon.com/images/I/41SSDYmn0JL.jpg",
    category: "Outdoor",
    stock: 25,
    ageRange: "6-8 years",
    brand: "Razor",
    ratings: 4.8
  }
];

module.exports = products;