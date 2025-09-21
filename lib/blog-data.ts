// Sample blog data based on extracted WordPress content
export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  featuredImage: string
  category: string
  author: {
    name: string
    avatar?: string
  }
  publishDate: string
  readTime: string
  slug: string
  tags: string[]
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Costa Rica Gay Travel: Ultimate Bear Adventures Guide',
    excerpt: 'Discover the ultimate guide to Costa Rica for gay travelers seeking adventure, luxury, and authentic experiences. From rainforest zip-lining to pristine beaches, create unforgettable memories in this eco-paradise.',
    content: `
      <h2>Welcome to Costa Rica - A Paradise for Gay Travelers</h2>
      <p>Costa Rica has become one of the most LGBTQ+ friendly destinations in Central America, offering a perfect blend of adventure, luxury, and natural beauty that makes it ideal for gay travelers seeking authentic experiences.</p>

      <h3>Why Costa Rica is Perfect for Bear Adventures</h3>
      <p>As a destination that celebrates diversity and natural wonder, Costa Rica provides the perfect backdrop for our carefully curated adventures. Here's what makes it special:</p>

      <ul>
        <li>Progressive LGBTQ+ rights and welcoming locals</li>
        <li>Incredible biodiversity with 5% of the world's species</li>
        <li>Adventure activities from zip-lining to volcano hiking</li>
        <li>Luxury eco-lodges and boutique hotels</li>
        <li>World-class beaches on both Pacific and Caribbean coasts</li>
      </ul>

      <h3>Our Recommended Itinerary</h3>
      <p>Our 8-day Costa Rica adventure combines the best of luxury and adventure:</p>

      <h4>Days 1-3: Arenal Volcano Region</h4>
      <p>Start your journey in the Arenal region, home to one of Costa Rica's most active volcanoes. Stay at luxury eco-lodges with stunning volcano views, enjoy world-class spa treatments with natural hot springs, and experience thrilling zip-line adventures through the cloud forest canopy.</p>

      <h4>Days 4-6: Manuel Antonio National Park</h4>
      <p>Transition to the Pacific coast where pristine beaches meet tropical rainforest. Manuel Antonio offers some of the country's best wildlife viewing, beautiful beaches perfect for relaxation, and charming beachfront restaurants serving fresh seafood.</p>

      <h4>Days 7-8: San José and Cultural Experiences</h4>
      <p>End your journey in the vibrant capital, exploring local markets, museums, and experiencing Costa Rica's famous coffee culture. Our insider connections ensure authentic experiences that showcase the real Costa Rica.</p>

      <h3>LGBTQ+ Travel Tips for Costa Rica</h3>
      <p>Costa Rica is generally very welcoming to LGBTQ+ travelers, but here are some tips to enhance your experience:</p>

      <ul>
        <li>San José has a vibrant gay scene with several LGBTQ+ friendly bars and clubs</li>
        <li>Most hotels and resorts are very welcoming to gay couples</li>
        <li>Public displays of affection are generally accepted in tourist areas</li>
        <li>Costa Rica legalized same-sex marriage in 2020</li>
      </ul>

      <p>Ready to experience Costa Rica with Bear Adventures? Our expert guides ensure every detail is perfectly planned, from luxury accommodations to unforgettable adventures that create lasting memories.</p>
    `,
    featuredImage: '/images/blog/costa-rica-adventure.jpg',
    category: 'Destinations',
    author: {
      name: 'Frank',
      avatar: '/images/team/frank-avatar.jpg'
    },
    publishDate: 'March 15, 2024',
    readTime: '8 min read',
    slug: 'costa-rica-gay-travel-ultimate-bear-adventures-guide',
    tags: ['Costa Rica', 'Central America', 'Adventure Travel', 'LGBTQ+ Travel', 'Eco-Tourism']
  },
  {
    id: '2',
    title: 'Iceland Gay Travel: A Spectacular Voyage of Adventure & Acceptance',
    excerpt: 'Experience the Land of Fire and Ice with fellow travelers who appreciate both adventure and luxury. From Northern Lights to geothermal spas, Iceland offers unforgettable experiences.',
    content: `
      <h2>Iceland: Where Natural Wonder Meets Progressive Values</h2>
      <p>Iceland stands as one of the world's most LGBTQ+ friendly countries, making it an ideal destination for gay travelers seeking both spectacular natural beauty and a welcoming, progressive atmosphere.</p>

      <h3>The Magic of Iceland's Natural Phenomena</h3>
      <p>Few places on Earth offer the diverse natural spectacles that Iceland provides year-round:</p>

      <h4>Northern Lights (Aurora Borealis)</h4>
      <p>From September to March, Iceland offers some of the world's best Northern Lights viewing. Our carefully planned itineraries maximize your chances of witnessing this magical display, with expert guides who know the best viewing locations away from light pollution.</p>

      <h4>Geothermal Wonders</h4>
      <p>Iceland's geothermal activity creates a unique landscape of hot springs, geysers, and thermal pools. The famous Blue Lagoon is just the beginning - we'll take you to hidden hot springs and natural thermal pools known only to locals.</p>

      <h4>Dramatic Landscapes</h4>
      <p>From massive glaciers to volcanic fields, Iceland's landscape is constantly changing and always dramatic. Our adventure includes glacier hiking, volcano tours, and visits to some of the most photographed waterfalls in the world.</p>

      <h3>Iceland's LGBTQ+ Friendliness</h3>
      <p>Iceland has been a pioneer in LGBTQ+ rights and continues to be one of the most accepting countries in the world:</p>

      <ul>
        <li>Same-sex marriage has been legal since 2010</li>
        <li>Reykjavik Pride is one of Europe's most celebrated events</li>
        <li>LGBTQ+ travelers face no discrimination or safety concerns</li>
        <li>The former Prime Minister was openly lesbian</li>
      </ul>

      <h3>Our Luxury Iceland Experience</h3>
      <p>Bear Adventures has crafted a 6-day luxury experience that combines Iceland's natural wonders with sophisticated accommodations and authentic cultural experiences:</p>

      <h4>Reykjavik Cultural Immersion</h4>
      <p>Start your journey in Iceland's vibrant capital, staying in boutique hotels in the heart of the city. Explore the colorful houses of the old town, visit world-class museums, and experience Reykjavik's famous nightlife scene.</p>

      <h4>Golden Circle Adventure</h4>
      <p>Discover Iceland's most famous natural attractions including Gullfoss waterfall, Geysir geothermal area, and Þingvellir National Park. Our small group tours ensure intimate experiences with expert local guides.</p>

      <h4>South Coast Exploration</h4>
      <p>Journey along Iceland's dramatic south coast, visiting black sand beaches, glacier lagoons, and powerful waterfalls. Stay in luxury lodges with panoramic views of glaciers and volcanic landscapes.</p>

      <p>Iceland offers the perfect combination of natural wonder and cultural sophistication, making it an ideal destination for discerning gay travelers who appreciate both adventure and luxury.</p>
    `,
    featuredImage: '/images/blog/iceland-northern-lights.jpg',
    category: 'Destinations',
    author: {
      name: 'Frank',
      avatar: '/images/team/frank-avatar.jpg'
    },
    publishDate: 'March 10, 2024',
    readTime: '10 min read',
    slug: 'iceland-gay-travel-spectacular-voyage-adventure-acceptance',
    tags: ['Iceland', 'Northern Europe', 'Northern Lights', 'LGBTQ+ Travel', 'Winter Travel']
  },
  {
    id: '3',
    title: 'Gay Travel Barcelona Guide: Embracing the European LGBTQ+ Scene',
    excerpt: 'Discover Barcelona\'s vibrant LGBTQ+ culture, from historic Gaixample district to modern beach clubs. Experience Catalonian culture, world-class cuisine, and legendary nightlife.',
    content: `
      <h2>Barcelona: Europe's LGBTQ+ Cultural Capital</h2>
      <p>Barcelona has long been recognized as one of Europe's most gay-friendly cities, offering a perfect blend of historic charm, cultural sophistication, and vibrant LGBTQ+ nightlife that makes it irresistible for gay travelers.</p>

      <h3>The Heart of Gay Barcelona: Gaixample</h3>
      <p>The Eixample district, affectionately known as "Gaixample," is the beating heart of Barcelona's gay scene:</p>

      <ul>
        <li>Dozens of gay bars, clubs, and restaurants within walking distance</li>
        <li>Beautiful modernist architecture including Gaudí masterpieces</li>
        <li>Gay-friendly hotels and boutique accommodations</li>
        <li>The famous "Gaydar" street art and rainbow crosswalks</li>
      </ul>

      <h3>Gaudí's Architectural Wonders</h3>
      <p>No visit to Barcelona is complete without experiencing the genius of Antoni Gaudí:</p>

      <h4>Sagrada Família</h4>
      <p>This UNESCO World Heritage site remains unfinished yet magnificent. Our private tours provide skip-the-line access and expert commentary on Gaudí's revolutionary architectural vision.</p>

      <h4>Park Güell</h4>
      <p>This whimsical public park showcases Gaudí's unique style with colorful mosaics, organic shapes, and stunning city views. Perfect for afternoon explorations and photography.</p>

      <h4>Casa Batlló and Casa Milà</h4>
      <p>These residential masterpieces on Passeig de Gràcia demonstrate Gaudí's evolution as an architect and offer insight into Barcelona's wealthy past.</p>

      <h3>Barcelona's Beach Culture</h3>
      <p>One of the few major European cities with quality beaches right in the city:</p>

      <h4>Barceloneta Beach</h4>
      <p>The main city beach offers golden sand, beach bars, and a lively atmosphere. The nearby Port Olímpic provides upscale dining and nightlife options.</p>

      <h4>Sitges Day Trip</h4>
      <p>Just 30 minutes south of Barcelona, Sitges is Europe's gay beach capital. This charming coastal town offers beautiful beaches, gay-friendly resorts, and a legendary nightlife scene.</p>

      <h3>Culinary Excellence</h3>
      <p>Barcelona's food scene rivals any city in the world:</p>

      <h4>Traditional Tapas Culture</h4>
      <p>Experience authentic Catalonian cuisine in historic taverns and modern tapas bars. Our food tours include both traditional favorites and innovative contemporary dishes.</p>

      <h4>Market Visits</h4>
      <p>Explore La Boquería and other local markets with expert guides who can introduce you to local specialties and help you understand Catalonian food culture.</p>

      <h4>Michelin-Starred Dining</h4>
      <p>Barcelona boasts numerous Michelin-starred restaurants, and we can arrange reservations at the city's most exclusive establishments.</p>

      <h3>LGBTQ+ Nightlife and Events</h3>
      <p>Barcelona's gay nightlife is legendary throughout Europe:</p>

      <ul>
        <li>Circuit Festival in August - one of Europe's largest gay festivals</li>
        <li>Pride Barcelona in June with massive street celebrations</li>
        <li>Year-round club scene with venues like Arena Madre and Metro</li>
        <li>Sophisticated cocktail bars and rooftop terraces</li>
      </ul>

      <p>Barcelona offers the perfect European city break for gay travelers, combining cultural richness, architectural wonders, beautiful beaches, and one of the world's best LGBTQ+ scenes all in one spectacular destination.</p>
    `,
    featuredImage: '/images/blog/barcelona-sagrada-familia.jpg',
    category: 'Featured',
    author: {
      name: 'Frank',
      avatar: '/images/team/frank-avatar.jpg'
    },
    publishDate: 'March 5, 2024',
    readTime: '12 min read',
    slug: 'gay-travel-barcelona-guide-embracing-european-lgbtq-scene',
    tags: ['Barcelona', 'Spain', 'Europe', 'LGBTQ+ Travel', 'City Break', 'Architecture']
  },
  {
    id: '4',
    title: 'The Best Time to Go to Cappadocia',
    excerpt: 'Discover the optimal seasons for visiting Cappadocia\'s fairy chimneys and cave hotels. From hot air balloon rides to underground cities, timing is everything.',
    content: `
      <h2>Timing Your Cappadocia Adventure Perfectly</h2>
      <p>Cappadocia's otherworldly landscape of fairy chimneys, cave hotels, and ancient underground cities offers incredible experiences year-round, but timing your visit can make the difference between a good trip and an unforgettable adventure.</p>

      <h3>Spring (April to June): The Sweet Spot</h3>
      <p>Spring is widely considered the best time to visit Cappadocia for several compelling reasons:</p>

      <h4>Perfect Weather Conditions</h4>
      <ul>
        <li>Comfortable temperatures ranging from 15-25°C (59-77°F)</li>
        <li>Minimal rainfall and clear skies</li>
        <li>Ideal conditions for hot air balloon flights</li>
        <li>Pleasant for hiking and outdoor exploration</li>
      </ul>

      <h4>Natural Beauty</h4>
      <ul>
        <li>Wildflowers bloom throughout the valleys</li>
        <li>Green landscapes contrast beautifully with rock formations</li>
        <li>Longer daylight hours for photography</li>
        <li>Crystal clear air for panoramic views</li>
      </ul>

      <h3>Summer (July to August): Peak Season Considerations</h3>
      <p>While summer brings the warmest weather, it also presents both opportunities and challenges:</p>

      <h4>Advantages</h4>
      <ul>
        <li>Guaranteed sunny weather</li>
        <li>Extended daylight hours</li>
        <li>All attractions and activities fully operational</li>
        <li>Vibrant outdoor dining scene</li>
      </ul>

      <h4>Considerations</h4>
      <ul>
        <li>High temperatures can reach 35°C (95°F)</li>
        <li>Peak tourist season means larger crowds</li>
        <li>Higher accommodation and tour prices</li>
        <li>Early morning starts recommended for outdoor activities</li>
      </ul>

      <h3>Autumn (September to November): The Hidden Gem</h3>
      <p>Autumn in Cappadocia offers many of spring's advantages with its own unique charm:</p>

      <h4>Weather Benefits</h4>
      <ul>
        <li>Warm but comfortable temperatures</li>
        <li>Stable weather patterns</li>
        <li>Excellent hot air balloon conditions</li>
        <li>Beautiful golden hour lighting</li>
      </ul>

      <h4>Experience Advantages</h4>
      <ul>
        <li>Fewer crowds than summer</li>
        <li>Harvest season creates unique cultural experiences</li>
        <li>Grape harvesting in local vineyards</li>
        <li>Stunning autumn colors in the valleys</li>
      </ul>

      <h3>Winter (December to March): A Magical Transformation</h3>
      <p>Winter in Cappadocia creates a completely different but equally magical experience:</p>

      <h4>Unique Beauty</h4>
      <ul>
        <li>Snow-covered fairy chimneys create fairy-tale landscapes</li>
        <li>Dramatic lighting for photography</li>
        <li>Cozy cave hotel experiences with fireplaces</li>
        <li>Fewer tourists mean intimate experiences</li>
      </ul>

      <h4>Activity Considerations</h4>
      <ul>
        <li>Hot air balloon flights weather dependent</li>
        <li>Some outdoor activities may be limited</li>
        <li>Warm clothing essential</li>
        <li>Underground cities provide warm exploration options</li>
      </ul>

      <h3>Special Events and Festivals</h3>
      <p>Consider timing your visit around these special events:</p>

      <h4>Cappadocia Wine Harvest Festival (September)</h4>
      <p>Celebrate the region's wine-making tradition with tastings, cultural performances, and harvest activities.</p>

      <h4>International Cappadocia Hot Air Balloon Festival (July)</h4>
      <p>Witness hundreds of balloons filling the sky in this spectacular annual event.</p>

      <h3>Our Recommendation</h3>
      <p>For the perfect balance of weather, experiences, and value, we recommend visiting Cappadocia during late April to early June or September to early November. These periods offer the ideal combination of comfortable weather, stunning natural beauty, and manageable crowds.</p>

      <p>Bear Adventures can help you time your Cappadocia experience perfectly, ensuring you experience this UNESCO World Heritage site at its absolute best.</p>
    `,
    featuredImage: '/images/blog/cappadocia-balloons.jpg',
    category: 'Tips & Tricks',
    author: {
      name: 'Frank',
      avatar: '/images/team/frank-avatar.jpg'
    },
    publishDate: 'February 28, 2024',
    readTime: '6 min read',
    slug: 'best-time-to-go-to-cappadocia',
    tags: ['Cappadocia', 'Turkey', 'Travel Planning', 'Hot Air Balloons', 'Best Time to Visit']
  },
  {
    id: '5',
    title: '10 Luxury Hotels Every Luxury Traveler Should Visit',
    excerpt: 'Discover the world\'s most exceptional luxury hotels that redefine hospitality. From overwater villas to historic palaces, these properties offer once-in-a-lifetime experiences.',
    content: `
      <h2>The Pinnacle of Luxury Hospitality Around the World</h2>
      <p>True luxury travel is defined not just by comfort, but by exceptional experiences that create lasting memories. These ten extraordinary hotels represent the absolute pinnacle of luxury hospitality, each offering something truly unique for the discerning traveler.</p>

      <h3>1. The Brando, French Polynesia</h3>
      <p>Located on the private island of Tetiaroa, The Brando offers the ultimate in sustainable luxury. This eco-luxury resort features:</p>
      <ul>
        <li>35 villas with private beaches and plunge pools</li>
        <li>Renewable energy and sustainable practices throughout</li>
        <li>World-class spa using traditional Polynesian treatments</li>
        <li>Access to pristine coral reefs and lagoons</li>
      </ul>

      <h3>2. Aman Venice, Italy</h3>
      <p>Housed in a 16th-century palazzo on the Grand Canal, Aman Venice brings contemporary luxury to historic Venice:</p>
      <ul>
        <li>24 rooms and suites with canal or garden views</li>
        <li>Private gardens - a rarity in Venice</li>
        <li>Exclusive access to the palazzo's historic library</li>
        <li>Michelin-starred dining with local ingredients</li>
      </ul>

      <h3>3. Singita Grumeti, Tanzania</h3>
      <p>This luxury safari lodge in the Serengeti offers unparalleled wildlife experiences:</p>
      <ul>
        <li>Front-row seats to the Great Migration</li>
        <li>Luxurious tented camps with panoramic views</li>
        <li>Expert guides and conservationists on staff</li>
        <li>Anti-poaching initiatives you can support</li>
      </ul>

      <h3>4. Amanzoe, Greece</h3>
      <p>Perched on a hilltop in the Peloponnese, Amanzoe offers modern luxury with ancient Greek inspiration:</p>
      <ul>
        <li>Pavilions with private pools and Aegean Sea views</li>
        <li>Beach club on a secluded bay</li>
        <li>Spa treatments inspired by ancient Greek wellness traditions</li>
        <li>Access to historical sites and exclusive cultural experiences</li>
      </ul>

      <h3>5. COMO Shambhala Estate, Bali</h3>
      <p>A wellness retreat in the Balinese jungle focusing on holistic health:</p>
      <ul>
        <li>Residences designed for complete privacy and tranquility</li>
        <li>Comprehensive wellness programs with expert practitioners</li>
        <li>Organic cuisine using estate-grown ingredients</li>
        <li>Activities from yoga to white-water rafting</li>
      </ul>

      <h3>6. The Lodge at Blue Sky, Utah, USA</h3>
      <p>An ultra-luxury ranch experience in the Wasatch Mountains:</p>
      <ul>
        <li>Adventure activities from fly-fishing to horseback riding</li>
        <li>Luxurious accommodations with mountain views</li>
        <li>World-class spa using local minerals and herbs</li>
        <li>Access to exclusive outdoor experiences</li>
      </ul>

      <h3>7. Cheval Blanc Randheli, Maldives</h3>
      <p>The epitome of Maldivian luxury on a private island:</p>
      <ul>
        <li>45 villas including overwater and island locations</li>
        <li>Multiple dining venues by renowned chefs</li>
        <li>World-class diving and water sports</li>
        <li>Guerlain spa with overwater treatment rooms</li>
      </ul>

      <h3>8. Hotel de Crillon, Paris, France</h3>
      <p>A palace hotel on Place de la Concorde combining history with modern luxury:</p>
      <ul>
        <li>Recently renovated suites with period details</li>
        <li>Michelin-starred restaurants and legendary bar</li>
        <li>Sense spa by Rosewood</li>
        <li>Unparalleled location in the heart of Paris</li>
      </ul>

      <h3>9. Explora Patagonia, Chile</h3>
      <p>Luxury meets adventure in the heart of Torres del Paine National Park:</p>
      <ul>
        <li>All-inclusive exploration packages</li>
        <li>Expert guides for hiking, horseback riding, and wildlife viewing</li>
        <li>Contemporary design that honors the landscape</li>
        <li>Panoramic views of the Patagonian wilderness</li>
      </ul>

      <h3>10. Four Seasons Tented Camp Golden Triangle, Thailand</h3>
      <p>Luxury safari-style accommodations in the hills of northern Thailand:</p>
      <ul>
        <li>Authentic tented accommodations with modern amenities</li>
        <li>Elephant experiences and jungle activities</li>
        <li>Burma Bridge and jungle spa treatments</li>
        <li>Cultural experiences with local hill tribes</li>
      </ul>

      <h3>What Makes These Hotels Special</h3>
      <p>Each of these properties goes beyond luxury amenities to offer:</p>
      <ul>
        <li>Unique locations that can't be replicated</li>
        <li>Exceptional service that anticipates every need</li>
        <li>Cultural immersion and authentic experiences</li>
        <li>Sustainability and community involvement</li>
        <li>Exclusive access to experiences unavailable elsewhere</li>
      </ul>

      <p>Bear Adventures has partnerships with these and other luxury properties worldwide, ensuring our travelers receive VIP treatment and exclusive amenities that enhance every stay.</p>
    `,
    featuredImage: '/images/blog/luxury-hotels-collage.jpg',
    category: 'Luxury Travel',
    author: {
      name: 'Frank',
      avatar: '/images/team/frank-avatar.jpg'
    },
    publishDate: 'February 20, 2024',
    readTime: '15 min read',
    slug: '10-luxury-hotels-every-luxury-traveler-should-visit',
    tags: ['Luxury Hotels', 'Luxury Travel', 'World Travel', 'Hotel Reviews', 'Travel Inspiration']
  }
]

export const getBlogPostBySlug = (slug: string): BlogPost | undefined => {
  return blogPosts.find(post => post.slug === slug)
}

export const getBlogPostsByCategory = (category: string): BlogPost[] => {
  return blogPosts.filter(post => post.category.toLowerCase() === category.toLowerCase())
}

export const getFeaturedBlogPosts = (limit: number = 3): BlogPost[] => {
  return blogPosts.slice(0, limit)
}