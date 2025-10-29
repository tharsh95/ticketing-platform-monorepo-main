import { db, events } from './index';

async function seed() {
  console.log('🌱 Starting database seed...');
//   await db.delete(events)

  try {
const sampleEvents=[
    {
      "title": "Mobile Gaming Startup Meetup",
      "description": "Network with mobile game developers and publishers. Discuss monetization strategies, game design, and publishing opportunities.",
      "date": "2025-12-24 18:30:00",
      "location": "San Francisco",
      "totalTickets": 354,
      "availableTickets": 305,
      "isActive": false,
      "category": "Business",
      "price": 45
    },
    {
      "title": "Mystery & Thriller Book Fair",
      "description": "Book fair dedicated to mystery, thriller, and crime fiction. Meet bestselling authors and discover new page-turners.",
      "date": "2025-12-10 10:00:00",
      "location": "San Francisco",
      "totalTickets": 519,
      "availableTickets": 198,
      "isActive": true,
      "category": "Literature",
      "price": 20
    },
    {
      "title": "Valentine's Comedy Special Night",
      "description": "Special Valentine's Day comedy show with romantic humor. Perfect date night entertainment with laughs and love.",
      "date": "2026-02-14 20:00:00",
      "location": "Seattle",
      "totalTickets": 431,
      "availableTickets": 19,
      "isActive": true,
      "category": "Entertainment",
      "price": 65
    },
    {
      "title": "Ceramics & Pottery Art Exhibition",
      "description": "Stunning ceramic artworks and pottery from skilled artisans. Functional art pieces, sculptures, and traditional pottery techniques.",
      "date": "2025-12-07 11:00:00",
      "location": "New York",
      "totalTickets": 423,
      "availableTickets": 11,
      "isActive": false,
      "category": "Arts & Culture",
      "price": 25
    },
    {
      "title": "Installation Art Exhibition",
      "description": "Large-scale art installations transforming gallery spaces. Immersive experiences blending sculpture, light, and multimedia elements.",
      "date": "2026-02-07 14:00:00",
      "location": "Chicago",
      "totalTickets": 505,
      "availableTickets": 61,
      "isActive": true,
      "category": "Arts & Culture",
      "price": 30
    },
    {
      "title": "New Year's Eve Book Fair",
      "description": "Special year-end book fair with discounts on bestsellers. Authors, book signings, and literary trivia to close the year.",
      "date": "2025-12-31 12:00:00",
      "location": "Boston",
      "totalTickets": 223,
      "availableTickets": 61,
      "isActive": true,
      "category": "Literature",
      "price": 35
    },
    {
      "title": "NBA Finals Championship Game",
      "description": "Experience the excitement of professional basketball at its finest. Watch elite athletes compete for the championship title in this thrilling sporting event.",
      "date": "2026-01-02 19:30:00",
      "location": "Los Angeles",
      "totalTickets": 148,
      "availableTickets": 45,
      "isActive": true,
      "category": "Sports",
      "price": 250
    },
    {
      "title": "Tech Startup Networking Meetup",
      "description": "Connect with entrepreneurs, investors, and innovators in the startup ecosystem. Share ideas, pitch your startup, and build valuable connections.",
      "date": "2025-12-01 17:00:00",
      "location": "New York",
      "totalTickets": 607,
      "availableTickets": 544,
      "isActive": false,
      "category": "Business",
      "price": 50
    },
    {
      "title": "Stand-Up Comedy Night Showcase",
      "description": "Enjoy an evening of laughter with talented comedians performing live. Features both rising stars and established performers in an intimate venue.",
      "date": "2026-02-24 21:00:00",
      "location": "Los Angeles",
      "totalTickets": 73,
      "availableTickets": 20,
      "isActive": true,
      "category": "Entertainment",
      "price": 40
    },
    {
      "title": "International Food & Wine Festival",
      "description": "Savor culinary delights from around the world. Sample gourmet dishes, craft beverages, and meet renowned chefs in this gastronomic celebration.",
      "date": "2025-12-14 13:00:00",
      "location": "Dallas",
      "totalTickets": 424,
      "availableTickets": 353,
      "isActive": true,
      "category": "Food & Drink",
      "price": 85
    },
    {
      "title": "Summer Music Festival Concert",
      "description": "Rock out to live performances from top artists and bands. Multiple stages featuring diverse genres from indie to rock, pop to electronic.",
      "date": "2026-02-26 16:00:00",
      "location": "Boston",
      "totalTickets": 560,
      "availableTickets": 426,
      "isActive": true,
      "category": "Music",
      "price": 75
    },
    {
      "title": "Live Music Concert Experience",
      "description": "Immerse yourself in an unforgettable night of live music. Premium sound quality and stunning visual effects create the perfect concert atmosphere.",
      "date": "2026-01-14 20:30:00",
      "location": "Chicago",
      "totalTickets": 978,
      "availableTickets": 90,
      "isActive": false,
      "category": "Music",
      "price": 90
    },
    {
      "title": "Annual Technology Conference & Expo",
      "description": "Explore the latest innovations in technology. Attend keynotes, workshops, and network with industry leaders shaping the digital future.",
      "date": "2026-04-10 09:00:00",
      "location": "Boston",
      "totalTickets": 231,
      "availableTickets": 68,
      "isActive": true,
      "category": "Technology",
      "price": 300
    },
    {
      "title": "Broadway-Style Theater Production",
      "description": "Experience world-class theatrical performance. This dramatic production features talented actors, stunning sets, and captivating storytelling.",
      "date": "2026-03-15 19:00:00",
      "location": "Boston",
      "totalTickets": 547,
      "availableTickets": 368,
      "isActive": true,
      "category": "Arts & Theater",
      "price": 85
    },
    {
      "title": "Street Food Festival Extravaganza",
      "description": "Discover diverse street food from local vendors and food trucks. Live music, family activities, and mouth-watering dishes await.",
      "date": "2026-03-20 11:00:00",
      "location": "San Francisco",
      "totalTickets": 798,
      "availableTickets": 489,
      "isActive": false,
      "category": "Food & Drink",
      "price": 25
    },
    {
      "title": "Contemporary Art Exhibition Opening",
      "description": "Explore cutting-edge contemporary art from emerging and established artists. Gallery tours, artist talks, and interactive installations included.",
      "date": "2025-12-31 18:00:00",
      "location": "Denver",
      "totalTickets": 587,
      "availableTickets": 551,
      "isActive": false,
      "category": "Arts & Culture",
      "price": 35
    },
    {
      "title": "Classic Theater Play Revival",
      "description": "A timeless theatrical masterpiece brought to life on stage. Award-winning director and cast deliver an unforgettable performance.",
      "date": "2026-02-15 19:30:00",
      "location": "Houston",
      "totalTickets": 767,
      "availableTickets": 121,
      "isActive": false,
      "category": "Arts & Theater",
      "price": 75
    },
    {
      "title": "Farm-to-Table Food Festival",
      "description": "Celebrate local and sustainable cuisine with farm-fresh ingredients. Cooking demonstrations, tastings, and meet local farmers and chefs.",
      "date": "2026-01-21 12:00:00",
      "location": "Boston",
      "totalTickets": 248,
      "availableTickets": 175,
      "isActive": true,
      "category": "Food & Drink",
      "price": 60
    },
    {
      "title": "Acoustic Music Concert Evening",
      "description": "An intimate acoustic performance featuring singer-songwriters and solo artists. Perfect for music lovers seeking a relaxed, unplugged experience.",
      "date": "2025-12-22 20:00:00",
      "location": "Boston",
      "totalTickets": 84,
      "availableTickets": 81,
      "isActive": true,
      "category": "Music",
      "price": 45
    },
    {
      "title": "Dramatic Theater Performance",
      "description": "Powerful dramatic storytelling comes alive on stage. This emotional journey features stunning performances and thought-provoking themes.",
      "date": "2026-03-05 19:15:00",
      "location": "Chicago",
      "totalTickets": 632,
      "availableTickets": 261,
      "isActive": false,
      "category": "Arts & Theater",
      "price": 65
    },
    {
      "title": "Innovation & Tech Conference Summit",
      "description": "Join tech visionaries and innovators at this premier conference. Cutting-edge presentations, hands-on workshops, and networking opportunities.",
      "date": "2026-04-20 08:30:00",
      "location": "Denver",
      "totalTickets": 936,
      "availableTickets": 43,
      "isActive": true,
      "category": "Technology",
      "price": 350
    },
    {
      "title": "Outdoor Music Concert Festival",
      "description": "Open-air concert featuring chart-topping artists under the stars. Bring your friends for an unforgettable musical celebration.",
      "date": "2026-03-29 17:00:00",
      "location": "Los Angeles",
      "totalTickets": 644,
      "availableTickets": 494,
      "isActive": true,
      "category": "Music",
      "price": 95
    },
    {
      "title": "Startup Pitch & Networking Event",
      "description": "Watch innovative startups pitch to investors and industry experts. Network with founders, learn from success stories, and discover opportunities.",
      "date": "2026-01-11 16:00:00",
      "location": "Boston",
      "totalTickets": 110,
      "availableTickets": 98,
      "isActive": true,
      "category": "Business",
      "price": 40
    },
    {
      "title": "Professional Sports Championship Finals",
      "description": "Witness athletic excellence at the championship finals. High-stakes competition featuring the season's best teams battling for glory.",
      "date": "2025-12-19 20:00:00",
      "location": "Denver",
      "totalTickets": 612,
      "availableTickets": 409,
      "isActive": true,
      "category": "Sports",
      "price": 180
    },
    {
      "title": "Arena Music Concert Spectacular",
      "description": "Massive arena concert with incredible production value. Laser shows, pyrotechnics, and world-class musical performances await.",
      "date": "2026-02-02 19:45:00",
      "location": "San Francisco",
      "totalTickets": 657,
      "availableTickets": 459,
      "isActive": true,
      "category": "Music",
      "price": 120
    },
    {
      "title": "Comedy Club Night - Local Talent",
      "description": "Laugh until your sides hurt with talented local comedians. Featuring fresh perspectives and hilarious observations about everyday life.",
      "date": "2025-11-03 20:30:00",
      "location": "Denver",
      "totalTickets": 347,
      "availableTickets": 151,
      "isActive": true,
      "category": "Entertainment",
      "price": 30
    },
    {
      "title": "Entrepreneurship & Innovation Meetup",
      "description": "Connect with fellow entrepreneurs and innovators. Share experiences, gain insights, and collaborate on groundbreaking business ideas.",
      "date": "2025-11-11 18:00:00",
      "location": "Houston",
      "totalTickets": 926,
      "availableTickets": 492,
      "isActive": false,
      "category": "Business",
      "price": 35
    },
    {
      "title": "Live Music Concert - All Ages",
      "description": "Family-friendly concert featuring popular artists and bands. Great sound, comfortable venue, and an atmosphere that everyone will enjoy.",
      "date": "2025-11-17 15:00:00",
      "location": "Miami",
      "totalTickets": 642,
      "availableTickets": 393,
      "isActive": true,
      "category": "Music",
      "price": 55
    },
    {
      "title": "Gourmet Food Festival & Tasting",
      "description": "Indulge in premium culinary experiences from award-winning chefs. Wine pairings, cooking classes, and exclusive tasting menus available.",
      "date": "2026-02-13 19:00:00",
      "location": "Los Angeles",
      "totalTickets": 122,
      "availableTickets": 116,
      "isActive": true,
      "category": "Food & Drink",
      "price": 150
    },
    {
      "title": "Annual Book Fair & Author Signings",
      "description": "Meet bestselling authors, discover new releases, and attend literary discussions. Book signings, readings, and workshops throughout the event.",
      "date": "2025-12-31 10:00:00",
      "location": "Los Angeles",
      "totalTickets": 737,
      "availableTickets": 590,
      "isActive": true,
      "category": "Literature",
      "price": 25
    },
    {
      "title": "Holiday Music Concert Special",
      "description": "Celebrate the season with festive music and holiday classics. Perfect for families and anyone who loves seasonal celebrations.",
      "date": "2025-12-25 19:30:00",
      "location": "Boston",
      "totalTickets": 608,
      "availableTickets": 559,
      "isActive": true,
      "category": "Music",
      "price": 50
    },
    {
      "title": "Championship Sports Tournament",
      "description": "Elite athletes compete in this prestigious sporting championship. Experience the intensity and skill of professional competition.",
      "date": "2026-01-20 14:00:00",
      "location": "Houston",
      "totalTickets": 288,
      "availableTickets": 218,
      "isActive": true,
      "category": "Sports",
      "price": 120
    },
    {
      "title": "Literary Book Fair & Festival",
      "description": "Celebrate the written word at this comprehensive book festival. Author panels, book launches, and literary workshops for all ages.",
      "date": "2026-04-22 11:00:00",
      "location": "Seattle",
      "totalTickets": 290,
      "availableTickets": 186,
      "isActive": true,
      "category": "Literature",
      "price": 30
    },
    {
      "title": "Beachside Music Concert",
      "description": "Enjoy live music with ocean views and sunset backdrop. Laid-back atmosphere with talented musicians and coastal vibes.",
      "date": "2025-11-09 17:30:00",
      "location": "Miami",
      "totalTickets": 591,
      "availableTickets": 367,
      "isActive": true,
      "category": "Music",
      "price": 65
    },
    {
      "title": "Tech & Digital Innovation Conference",
      "description": "Explore emerging technologies and digital transformation strategies. Expert speakers, product demos, and hands-on learning sessions.",
      "date": "2025-12-07 09:00:00",
      "location": "Seattle",
      "totalTickets": 649,
      "availableTickets": 519,
      "isActive": true,
      "category": "Technology",
      "price": 275
    },
    {
      "title": "Startup Founders Networking Meetup",
      "description": "Exclusive meetup for startup founders and co-founders. Share challenges, celebrate wins, and build meaningful connections.",
      "date": "2025-11-29 18:30:00",
      "location": "Seattle",
      "totalTickets": 227,
      "availableTickets": 122,
      "isActive": true,
      "category": "Business",
      "price": 60
    },
    {
      "title": "Regional Theater Play Production",
      "description": "Local theater company presents an engaging dramatic work. Support regional arts while enjoying exceptional theatrical entertainment.",
      "date": "2026-03-05 19:00:00",
      "location": "Dallas",
      "totalTickets": 82,
      "availableTickets": 73,
      "isActive": true,
      "category": "Arts & Theater",
      "price": 40
    },
    {
      "title": "Independent Film Screening & Q&A",
      "description": "Watch curated independent films followed by filmmaker Q&A sessions. Discover unique storytelling and cinematic artistry.",
      "date": "2026-03-05 19:30:00",
      "location": "Miami",
      "totalTickets": 231,
      "availableTickets": 153,
      "isActive": false,
      "category": "Film",
      "price": 20
    },
    {
      "title": "Major League Sports Championship",
      "description": "Professional sports championship game featuring top teams. Witness history in the making at this premier sporting event.",
      "date": "2026-01-11 20:15:00",
      "location": "Chicago",
      "totalTickets": 263,
      "availableTickets": 81,
      "isActive": true,
      "category": "Sports",
      "price": 200
    },
    {
      "title": "Regional Sports Championship Game",
      "description": "Local teams compete for regional championship honors. Support your hometown heroes in this exciting athletic competition.",
      "date": "2026-02-06 19:00:00",
      "location": "San Francisco",
      "totalTickets": 279,
      "availableTickets": 138,
      "isActive": false,
      "category": "Sports",
      "price": 75
    },
    {
      "title": "Country Music Concert Night",
      "description": "Celebrate country music with live performances from talented artists. Great for fans of authentic country sound and storytelling.",
      "date": "2026-01-31 20:00:00",
      "location": "Dallas",
      "totalTickets": 523,
      "availableTickets": 504,
      "isActive": true,
      "category": "Music",
      "price": 70
    },
    {
      "title": "Modern Art Exhibition Showcase",
      "description": "Discover contemporary artistic expressions and modern masterpieces. Interactive exhibits and guided tours by expert curators.",
      "date": "2026-02-04 10:00:00",
      "location": "Houston",
      "totalTickets": 560,
      "availableTickets": 376,
      "isActive": true,
      "category": "Arts & Culture",
      "price": 28
    },
    {
      "title": "Cultural Food Festival Experience",
      "description": "Journey through diverse culinary traditions and authentic international flavors. Live entertainment and cultural performances included.",
      "date": "2026-02-21 13:00:00",
      "location": "Chicago",
      "totalTickets": 207,
      "availableTickets": 181,
      "isActive": true,
      "category": "Food & Drink",
      "price": 45
    },
    {
      "title": "Comedy Night - Headliner Show",
      "description": "Top comedian headliner performs live with opening acts. Premium comedy experience in an intimate club setting.",
      "date": "2025-10-27 21:00:00",
      "location": "Dallas",
      "totalTickets": 291,
      "availableTickets": 188,
      "isActive": false,
      "category": "Entertainment",
      "price": 55
    },
    {
      "title": "Children's Book Fair & Activities",
      "description": "Family-friendly book fair featuring children's authors and illustrators. Story time, crafts, and activities for young readers.",
      "date": "2026-01-14 10:30:00",
      "location": "Denver",
      "totalTickets": 795,
      "availableTickets": 508,
      "isActive": true,
      "category": "Literature",
      "price": 15
    },
    {
      "title": "National Sports Championship Finals",
      "description": "The ultimate showdown for the national championship title. Premium seating and unforgettable athletic performances guaranteed.",
      "date": "2026-04-10 20:00:00",
      "location": "New York",
      "totalTickets": 569,
      "availableTickets": 49,
      "isActive": true,
      "category": "Sports",
      "price": 300
    },
    {
      "title": "Tech Startup Showcase & Demo Day",
      "description": "Innovative startups present their products and business models. Perfect for investors, entrepreneurs, and tech enthusiasts.",
      "date": "2025-12-04 13:00:00",
      "location": "Dallas",
      "totalTickets": 315,
      "availableTickets": 137,
      "isActive": true,
      "category": "Business",
      "price": 75
    },
    {
      "title": "Musical Theater Production",
      "description": "Broadway-caliber musical theater with stunning vocals and choreography. Family-friendly entertainment with unforgettable songs.",
      "date": "2025-12-27 14:00:00",
      "location": "Boston",
      "totalTickets": 820,
      "availableTickets": 622,
      "isActive": true,
      "category": "Arts & Theater",
      "price": 80
    },
    {
      "title": "Playoff Sports Championship",
      "description": "Playoff round championship game with high stakes and intense competition. Don't miss this crucial sporting matchup.",
      "date": "2025-11-23 19:30:00",
      "location": "New York",
      "totalTickets": 686,
      "availableTickets": 467,
      "isActive": true,
      "category": "Sports",
      "price": 150
    },
    {
      "title": "Annual Tech Conference & Workshop",
      "description": "Comprehensive technology conference with workshops and certifications. Learn from industry experts and expand your tech skills.",
      "date": "2026-01-07 08:30:00",
      "location": "Dallas",
      "totalTickets": 804,
      "availableTickets": 599,
      "isActive": true,
      "category": "Technology",
      "price": 325
    },
    {
      "title": "Gallery Art Exhibition Opening",
      "description": "Exclusive gallery opening featuring works from talented artists. Wine reception and opportunity to meet the artists.",
      "date": "2026-03-03 18:00:00",
      "location": "Houston",
      "totalTickets": 347,
      "availableTickets": 97,
      "isActive": false,
      "category": "Arts & Culture",
      "price": 40
    },
    {
      "title": "Seafood & Coastal Food Festival",
      "description": "Fresh seafood and coastal cuisine from top chefs. Live music, cooking demonstrations, and waterfront dining experiences.",
      "date": "2025-11-13 12:00:00",
      "location": "Miami",
      "totalTickets": 994,
      "availableTickets": 944,
      "isActive": true,
      "category": "Food & Drink",
      "price": 70
    },
    {
      "title": "Fine Arts Exhibition & Auction",
      "description": "View exquisite fine art pieces from renowned and emerging artists. Silent auction and private viewing opportunities available.",
      "date": "2025-12-15 17:00:00",
      "location": "Los Angeles",
      "totalTickets": 650,
      "availableTickets": 451,
      "isActive": true,
      "category": "Arts & Culture",
      "price": 50
    },
    {
      "title": "Rock Music Concert Festival",
      "description": "High-energy rock concert with multiple bands and artists. Amplified sound, electrifying performances, and unforgettable atmosphere.",
      "date": "2026-04-20 19:00:00",
      "location": "Dallas",
      "totalTickets": 870,
      "availableTickets": 832,
      "isActive": true,
      "category": "Music",
      "price": 85
    },
    {
      "title": "Software & AI Tech Conference",
      "description": "Cutting-edge conference on AI, machine learning, and software development. Keynotes, workshops, and networking with tech leaders.",
      "date": "2025-11-28 09:00:00",
      "location": "Miami",
      "totalTickets": 837,
      "availableTickets": 330,
      "isActive": true,
      "category": "Technology",
      "price": 400
    },
    {
      "title": "Stand-Up Comedy Festival",
      "description": "Multi-day comedy festival featuring top comedians from around the country. Late-night shows and comedy workshops included.",
      "date": "2026-04-17 20:30:00",
      "location": "Los Angeles",
      "totalTickets": 527,
      "availableTickets": 403,
      "isActive": true,
      "category": "Entertainment",
      "price": 75
    },
    {
      "title": "Culinary Food Festival & Competition",
      "description": "Watch professional chefs compete in culinary challenges. Taste award-winning dishes and learn from cooking demonstrations.",
      "date": "2026-04-02 11:00:00",
      "location": "New York",
      "totalTickets": 942,
      "availableTickets": 538,
      "isActive": true,
      "category": "Food & Drink",
      "price": 95
    },
    {
      "title": "Enterprise Technology Conference",
      "description": "Conference focused on enterprise technology solutions and digital transformation. CIO panels, case studies, and vendor exhibitions.",
      "date": "2026-04-06 08:00:00",
      "location": "Boston",
      "totalTickets": 885,
      "availableTickets": 266,
      "isActive": true,
      "category": "Technology",
      "price": 450
    },
    {
      "title": "Regional Sports Tournament Finals",
      "description": "Regional tournament finals featuring local teams competing for glory. Support local sports and witness thrilling athletic competition.",
      "date": "2026-01-11 15:00:00",
      "location": "Seattle",
      "totalTickets": 560,
      "availableTickets": 216,
      "isActive": true,
      "category": "Sports",
      "price": 60
    },
    {
      "title": "Annual Sports Championship Match",
      "description": "Year's most anticipated sports championship match. Elite athletes, dramatic moments, and championship-level competition.",
      "date": "2026-01-28 19:00:00",
      "location": "Houston",
      "totalTickets": 601,
      "availableTickets": 148,
      "isActive": true,
      "category": "Sports",
      "price": 220
    },
    {
      "title": "Startup Ecosystem Networking Event",
      "description": "Build connections within the startup community. Meet investors, advisors, and fellow entrepreneurs in a collaborative environment.",
      "date": "2026-03-20 17:30:00",
      "location": "Los Angeles",
      "totalTickets": 253,
      "availableTickets": 200,
      "isActive": true,
      "category": "Business",
      "price": 55
    },
    {
      "title": "Professional Sports Championship Series",
      "description": "Part of the championship series between top professional teams. Experience the excitement of high-level athletic competition.",
      "date": "2025-11-17 20:00:00",
      "location": "San Francisco",
      "totalTickets": 884,
      "availableTickets": 270,
      "isActive": true,
      "category": "Sports",
      "price": 190
    },
    {
      "title": "Innovation Startup Meetup & Pitch",
      "description": "Monthly meetup for innovative startups to pitch ideas and network. Feedback sessions, mentorship opportunities, and investor connections.",
      "date": "2026-01-19 18:00:00",
      "location": "Seattle",
      "totalTickets": 830,
      "availableTickets": 67,
      "isActive": true,
      "category": "Business",
      "price": 45
    },
    {
      "title": "Poetry & Literature Book Fair",
      "description": "Celebrate poetry and contemporary literature. Author readings, open mic sessions, and book sales from independent publishers.",
      "date": "2026-01-21 14:00:00",
      "location": "Denver",
      "totalTickets": 942,
      "availableTickets": 291,
      "isActive": false,
      "category": "Literature",
      "price": 18
    },
    {
      "title": "Contemporary Theater Performance",
      "description": "Modern theatrical production with innovative staging and powerful performances. Thought-provoking themes and exceptional acting.",
      "date": "2026-01-29 19:15:00",
      "location": "Miami",
      "totalTickets": 779,
      "availableTickets": 462,
      "isActive": true,
      "category": "Arts & Theater",
      "price": 70
    },
    {
      "title": "State Sports Championship Game",
      "description": "State championship determining the best team in the region. Intense competition and passionate fan atmosphere.",
      "date": "2026-01-19 18:30:00",
      "location": "Houston",
      "totalTickets": 659,
      "availableTickets": 386,
      "isActive": true,
      "category": "Sports",
      "price": 90
    },
    {
      "title": "Classic Theater Revival Performance",
      "description": "Timeless classic theater production with modern interpretation. Experience theatrical excellence and masterful storytelling.",
      "date": "2026-01-08 19:00:00",
      "location": "Chicago",
      "totalTickets": 957,
      "availableTickets": 749,
      "isActive": false,
      "category": "Arts & Theater",
      "price": 65
    },
    {
      "title": "Documentary Film Screening Series",
      "description": "Thought-provoking documentary films followed by panel discussions. Explore important social and cultural issues through cinema.",
      "date": "2025-11-12 19:30:00",
      "location": "Denver",
      "totalTickets": 550,
      "availableTickets": 375,
      "isActive": true,
      "category": "Film",
      "price": 22
    },
    {
      "title": "Literary Arts Book Fair Festival",
      "description": "Comprehensive book fair celebrating literary arts. Workshops, panels, and book sales from publishers and independent authors.",
      "date": "2026-02-19 11:00:00",
      "location": "Miami",
      "totalTickets": 729,
      "availableTickets": 636,
      "isActive": true,
      "category": "Literature",
      "price": 28
    },
    {
      "title": "Spring Sports Championship Event",
      "description": "Spring season championship featuring top athletic talent. Perfect weather for outdoor sporting excellence and competition.",
      "date": "2026-04-15 13:00:00",
      "location": "Denver",
      "totalTickets": 487,
      "availableTickets": 255,
      "isActive": true,
      "category": "Sports",
      "price": 110
    },
    {
      "title": "Cloud Computing Tech Conference",
      "description": "Conference dedicated to cloud technology and infrastructure. Expert sessions on AWS, Azure, and emerging cloud platforms.",
      "date": "2026-01-25 09:00:00",
      "location": "Houston",
      "totalTickets": 638,
      "availableTickets": 245,
      "isActive": false,
      "category": "Technology",
      "price": 375
    },
    {
      "title": "Cybersecurity Technology Conference",
      "description": "Leading conference on cybersecurity threats and solutions. Learn from security experts and explore the latest protection technologies.",
      "date": "2026-03-11 08:30:00",
      "location": "Miami",
      "totalTickets": 374,
      "availableTickets": 262,
      "isActive": true,
      "category": "Technology",
      "price": 425
    },
    {
      "title": "International Film Festival Screening",
      "description": "Curated international films from acclaimed directors worldwide. Subtitled screenings with post-film discussions and filmmaker appearances.",
      "date": "2026-02-03 19:00:00",
      "location": "Houston",
      "totalTickets": 741,
      "availableTickets": 254,
      "isActive": false,
      "category": "Film",
      "price": 25
    },
    {
      "title": "Data Science Tech Conference",
      "description": "Conference exploring data science, analytics, and big data solutions. Workshops on Python, R, and machine learning applications.",
      "date": "2026-01-19 09:00:00",
      "location": "Denver",
      "totalTickets": 364,
      "availableTickets": 288,
      "isActive": false,
      "category": "Technology",
      "price": 350
    },
    {
      "title": "Abstract Art Exhibition Gallery",
      "description": "Explore abstract expressionism and modern artistic movements. Interactive installations and artist-led gallery tours.",
      "date": "2025-11-15 10:00:00",
      "location": "Houston",
      "totalTickets": 72,
      "availableTickets": 24,
      "isActive": false,
      "category": "Arts & Culture",
      "price": 32
    },
    {
      "title": "Sculpture & Visual Arts Exhibition",
      "description": "Three-dimensional artworks and sculptures from contemporary artists. Outdoor installations and multimedia presentations.",
      "date": "2026-03-26 11:00:00",
      "location": "Houston",
      "totalTickets": 817,
      "availableTickets": 686,
      "isActive": false,
      "category": "Arts & Culture",
      "price": 30
    },
    {
      "title": "Comedy Improv Night Show",
      "description": "Spontaneous comedy improvisation performances by talented troupes. Audience participation and unpredictable hilarious moments.",
      "date": "2026-01-04 20:00:00",
      "location": "Dallas",
      "totalTickets": 446,
      "availableTickets": 345,
      "isActive": true,
      "category": "Entertainment",
      "price": 35
    },
    {
      "title": "Winter Sports Championship Game",
      "description": "Championship game in the heart of winter sports season. Indoor arena provides comfortable viewing of elite athletic competition.",
      "date": "2026-02-27 19:00:00",
      "location": "Miami",
      "totalTickets": 409,
      "availableTickets": 242,
      "isActive": true,
      "category": "Sports",
      "price": 130
    },
    {
      "title": "Venture Capital Startup Meetup",
      "description": "Network with venture capitalists and investment professionals. Learn about funding strategies and present your startup to potential investors.",
      "date": "2026-03-29 17:00:00",
      "location": "San Francisco",
      "totalTickets": 894,
      "availableTickets": 651,
      "isActive": false,
      "category": "Business",
      "price": 85
    },
    {
      "title": "Division Sports Championship Finals",
      "description": "Division championship finals with teams competing for advancement. High-energy atmosphere and passionate fan support.",
      "date": "2026-01-28 18:30:00",
      "location": "Seattle",
      "totalTickets": 346,
      "availableTickets": 332,
      "isActive": true,
      "category": "Sports",
      "price": 80
    },
    {
      "title": "College Sports Championship Game",
      "description": "Collegiate athletes compete at the highest level for championship glory. School spirit and intense competition guaranteed.",
      "date": "2025-11-15 15:00:00",
      "location": "Los Angeles",
      "totalTickets": 217,
      "availableTickets": 189,
      "isActive": true,
      "category": "Sports",
      "price": 65
    },
    {
      "title": "Rare Books & Collectibles Fair",
      "description": "Discover rare books, first editions, and literary collectibles. Expert appraisals, antiquarian dealers, and private collections on display.",
      "date": "2026-04-11 10:00:00",
      "location": "New York",
      "totalTickets": 266,
      "availableTickets": 133,
      "isActive": true,
      "category": "Literature",
      "price": 40
    },
    {
      "title": "Symphony Music Concert Performance",
      "description": "Classical symphony orchestra performs masterpieces from renowned composers. Elegant venue with world-class acoustics.",
      "date": "2026-02-23 19:30:00",
      "location": "Seattle",
      "totalTickets": 67,
      "availableTickets": 12,
      "isActive": false,
      "category": "Music",
      "price": 75
    },
    {
      "title": "Professional League Sports Championship",
      "description": "Professional league championship with top-ranked teams. Experience the pinnacle of competitive sports excellence.",
      "date": "2025-12-11 20:00:00",
      "location": "Chicago",
      "totalTickets": 562,
      "availableTickets": 120,
      "isActive": false,
      "category": "Sports",
      "price": 240
    },
    {
      "title": "Blockchain & Web3 Tech Conference",
      "description": "Explore blockchain technology, cryptocurrency, and Web3 innovations. Expert talks on decentralized systems and digital assets.",
      "date": "2025-11-09 09:00:00",
      "location": "Houston",
      "totalTickets": 758,
      "availableTickets": 448,
      "isActive": true,
      "category": "Technology",
      "price": 380
    },
    {
      "title": "Experimental Theater Production",
      "description": "Avant-garde theatrical experience pushing creative boundaries. Innovative staging, immersive storytelling, and unique performances.",
      "date": "2026-02-01 19:45:00",
      "location": "Dallas",
      "totalTickets": 550,
      "availableTickets": 83,
      "isActive": true,
      "category": "Arts & Theater",
      "price": 55
    },
    {
      "title": "Classic Film Screening & Discussion",
      "description": "Restored classic films on the big screen with expert commentary. Cinema history comes alive with pristine digital remastering.",
      "date": "2026-03-03 19:00:00",
      "location": "Seattle",
      "totalTickets": 922,
      "availableTickets": 147,
      "isActive": true,
      "category": "Film",
      "price": 18
    },
    {
      "title": "Modern Drama Theater Performance",
      "description": "Contemporary dramatic theater exploring current social themes. Award-winning production with powerful performances and staging.",
      "date": "2026-01-03 19:30:00",
      "location": "New York",
      "totalTickets": 259,
      "availableTickets": 169,
      "isActive": true,
      "category": "Arts & Theater",
      "price": 70
    },
    {
      "title": "Shakespeare Theater Production",
      "description": "Classic Shakespearean play performed by accomplished theater company. Traditional staging meets contemporary interpretation.",
      "date": "2025-12-04 19:00:00",
      "location": "Boston",
      "totalTickets": 231,
      "availableTickets": 164,
      "isActive": true,
      "category": "Arts & Theater",
      "price": 65
    },
    {
      "title": "Alternative Comedy Night Show",
      "description": "Cutting-edge alternative comedy with unique perspectives. Features experimental comedians and unconventional humor styles.",
      "date": "2026-04-16 21:00:00",
      "location": "Los Angeles",
      "totalTickets": 806,
      "availableTickets": 248,
      "isActive": true,
      "category": "Entertainment",
      "price": 42
    },
    {
      "title": "Pop Music Concert Extravaganza",
      "description": "Chart-topping pop artists perform their biggest hits. High-energy show with spectacular choreography and production.",
      "date": "2026-01-17 20:00:00",
      "location": "Dallas",
      "totalTickets": 700,
      "availableTickets": 542,
      "isActive": false,
      "category": "Music",
      "price": 95
    },
    {
      "title": "BBQ & Grilling Food Festival",
      "description": "Smoky flavors and BBQ competition featuring pit masters. Live music, cold beverages, and mouthwatering barbecue all day long.",
      "date": "2025-12-10 12:00:00",
      "location": "Dallas",
      "totalTickets": 728,
      "availableTickets": 93,
      "isActive": true,
      "category": "Food & Drink",
      "price": 55
    },
    {
      "title": "Halloween Comedy Special Night",
      "description": "Special Halloween-themed comedy show with costume contest. Spooky humor and hilarious performances in festive atmosphere.",
      "date": "2025-10-31 20:30:00",
      "location": "Dallas",
      "totalTickets": 269,
      "availableTickets": 210,
      "isActive": true,
      "category": "Entertainment",
      "price": 48
    },
    {
      "title": "Antiquarian Book Fair & Market",
      "description": "Historic books and manuscripts from specialized dealers. Browse centuries-old texts and learn about book preservation.",
      "date": "2026-04-20 10:00:00",
      "location": "San Francisco",
      "totalTickets": 55,
      "availableTickets": 49,
      "isActive": false,
      "category": "Literature",
      "price": 35
    },
    {
      "title": "Comedy Central Stand-Up Showcase",
      "description": "Top-tier stand-up comedians from national comedy circuits. Professional comedy production with multiple performers.",
      "date": "2026-04-23 20:00:00",
      "location": "Seattle",
      "totalTickets": 834,
      "availableTickets": 476,
      "isActive": true,
      "category": "Entertainment",
      "price": 68
    },
    {
      "title": "New Year Comedy Celebration",
      "description": "Ring in the new year with laughter and comedy performances. Special celebratory show with party atmosphere and entertainment.",
      "date": "2026-01-06 21:30:00",
      "location": "Dallas",
      "totalTickets": 749,
      "availableTickets": 75,
      "isActive": true,
      "category": "Entertainment",
      "price": 85
    },
    {
      "title": "Latin Food Festival Celebration",
      "description": "Celebrate Latin American cuisine and culture through food. Authentic dishes, salsa dancing, and live Latin music.",
      "date": "2025-11-13 18:00:00",
      "location": "Miami",
      "totalTickets": 518,
      "availableTickets": 288,
      "isActive": false,
      "category": "Food & Drink",
      "price": 50
    },
    {
      "title": "Jazz & Blues Music Concert",
      "description": "Smooth jazz and soulful blues performances in intimate setting. World-class musicians deliver unforgettable musical experience.",
      "date": "2026-04-06 20:00:00",
      "location": "Boston",
      "totalTickets": 747,
      "availableTickets": 331,
      "isActive": false,
      "category": "Music",
      "price": 60
    },
    {
      "title": "Science Fiction Book Fair & Con",
      "description": "Sci-fi and fantasy book fair with author panels and cosplay. Meet favorite authors and discover new speculative fiction.",
      "date": "2026-04-03 10:00:00",
      "location": "Houston",
      "totalTickets": 61,
      "availableTickets": 32,
      "isActive": true,
      "category": "Literature",
      "price": 38
    },
    {
      "title": "DevOps & Engineering Tech Conference",
      "description": "Technical conference for software engineers and DevOps professionals. Hands-on sessions on CI/CD, containers, and automation.",
      "date": "2026-03-25 09:00:00",
      "location": "Denver",
      "totalTickets": 527,
      "availableTickets": 82,
      "isActive": true,
      "category": "Technology",
      "price": 325
    },
    {
      "title": "Indie Film Festival Screening",
      "description": "Independent films from emerging filmmakers worldwide. Celebrate creative storytelling and support independent cinema.",
      "date": "2026-03-31 19:00:00",
      "location": "Dallas",
      "totalTickets": 969,
      "availableTickets": 338,
      "isActive": true,
      "category": "Film",
      "price": 22
    },
    {
      "title": "Extreme Sports Championship Event",
      "description": "Action-packed extreme sports championship with daring athletes. Skateboarding, BMX, and other adrenaline-fueled competitions.",
      "date": "2026-02-06 13:00:00",
      "location": "Denver",
      "totalTickets": 169,
      "availableTickets": 31,
      "isActive": true,
      "category": "Sports",
      "price": 95
    },
    {
      "title": "Vegan Food Festival & Market",
      "description": "Plant-based culinary celebration with vegan vendors and chefs. Sustainable food, cooking demos, and health workshops.",
      "date": "2026-04-01 11:00:00",
      "location": "San Francisco",
      "totalTickets": 133,
      "availableTickets": 91,
      "isActive": false,
      "category": "Food & Drink",
      "price": 32
    },
    {
      "title": "Electronic Music Concert Festival",
      "description": "EDM and electronic music festival with top DJs and producers. Light shows, dancing, and cutting-edge electronic sounds.",
      "date": "2026-01-21 22:00:00",
      "location": "Seattle",
      "totalTickets": 492,
      "availableTickets": 84,
      "isActive": true,
      "category": "Music",
      "price": 88
    },
    {
      "title": "Photography Art Exhibition",
      "description": "Contemporary photography exhibition featuring diverse visual styles. From photojournalism to artistic photography and portraits.",
      "date": "2026-03-13 10:00:00",
      "location": "New York",
      "totalTickets": 515,
      "availableTickets": 251,
      "isActive": true,
      "category": "Arts & Culture",
      "price": 26
    },
    {
      "title": "Indie Rock Music Concert",
      "description": "Independent rock bands and artists perform live. Discover new music and support the indie music scene.",
      "date": "2025-12-10 20:00:00",
      "location": "Boston",
      "totalTickets": 560,
      "availableTickets": 233,
      "isActive": true,
      "category": "Music",
      "price": 45
    },
    {
      "title": "Mobile & App Development Tech Conference",
      "description": "Conference for mobile developers covering iOS, Android, and cross-platform development. Workshops and networking sessions.",
      "date": "2026-02-03 09:00:00",
      "location": "Chicago",
      "totalTickets": 833,
      "availableTickets": 520,
      "isActive": true,
      "category": "Technology",
      "price": 300
    },
    {
      "title": "Sketch Comedy Night Performance",
      "description": "Live sketch comedy troupe performs original comedy sketches. Fast-paced humor with costume changes and character work.",
      "date": "2025-11-10 20:30:00",
      "location": "San Francisco",
      "totalTickets": 329,
      "availableTickets": 214,
      "isActive": false,
      "category": "Entertainment",
      "price": 38
    },
    {
      "title": "IoT & Smart Tech Conference",
      "description": "Internet of Things conference exploring connected devices and smart systems. Industry applications and future technology trends.",
      "date": "2026-04-24 09:00:00",
      "location": "Houston",
      "totalTickets": 701,
      "availableTickets": 302,
      "isActive": true,
      "category": "Technology",
      "price": 350
    },
    {
      "title": "Off-Broadway Theater Performance",
      "description": "Intimate off-Broadway style theatrical production. Powerful storytelling in a small venue with exceptional acting.",
      "date": "2025-11-08 19:30:00",
      "location": "New York",
      "totalTickets": 457,
      "availableTickets": 409,
      "isActive": false,
      "category": "Arts & Theater",
      "price": 58
    },
    {
      "title": "Community Theater Play Showcase",
      "description": "Local community theater presents family-friendly production. Support local arts while enjoying quality theatrical entertainment.",
      "date": "2025-12-14 19:00:00",
      "location": "Denver",
      "totalTickets": 884,
      "availableTickets": 719,
      "isActive": true,
      "category": "Arts & Theater",
      "price": 28
    },
    {
      "title": "Used & Vintage Book Fair",
      "description": "Browse thousands of used books, vintage editions, and collectibles. Book lovers' paradise with affordable finds and rare discoveries.",
      "date": "2025-11-02 10:00:00",
      "location": "Boston",
      "totalTickets": 535,
      "availableTickets": 11,
      "isActive": false,
      "category": "Literature",
      "price": 12
    },
    {
      "title": "Youth Sports Championship Tournament",
      "description": "Young athletes compete in championship tournament games. Family-friendly sporting event supporting youth development.",
      "date": "2026-02-10 09:00:00",
      "location": "Chicago",
      "totalTickets": 62,
      "availableTickets": 7,
      "isActive": false,
      "category": "Sports",
      "price": 15
    },
    {
      "title": "Street Art Exhibition & Festival",
      "description": "Urban street art and graffiti exhibition featuring local and international artists. Live mural painting and hip-hop culture.",
      "date": "2026-04-14 12:00:00",
      "location": "Los Angeles",
      "totalTickets": 664,
      "availableTickets": 570,
      "isActive": true,
      "category": "Arts & Culture",
      "price": 22
    },
    {
      "title": "Thanksgiving Comedy Special Show",
      "description": "Special Thanksgiving comedy show perfect for family entertainment. Clean humor and festive atmosphere for the holiday season.",
      "date": "2025-11-25 19:00:00",
      "location": "Boston",
      "totalTickets": 555,
      "availableTickets": 143,
      "isActive": true,
      "category": "Entertainment",
      "price": 42
    },
    {
      "title": "Track & Field Sports Championship",
      "description": "Athletic championship featuring track and field competitions. Witness speed, strength, and endurance from elite athletes.",
      "date": "2026-03-13 10:00:00",
      "location": "Seattle",
      "totalTickets": 594,
      "availableTickets": 227,
      "isActive": true,
      "category": "Sports",
      "price": 45
    },
    {
      "title": "Underground Music Concert Series",
      "description": "Intimate concert featuring underground and emerging music artists. Discover tomorrow's stars in an authentic music venue.",
      "date": "2026-01-13 21:00:00",
      "location": "Dallas",
      "totalTickets": 69,
      "availableTickets": 56,
      "isActive": true,
      "category": "Music",
      "price": 25
    },
    {
      "title": "SaaS & Cloud Startup Meetup",
      "description": "Networking event for SaaS and cloud-based startup founders. Share growth strategies and learn about scaling businesses.",
      "date": "2026-03-12 18:00:00",
      "location": "Chicago",
      "totalTickets": 249,
      "availableTickets": 66,
      "isActive": true,
      "category": "Business",
      "price": 52
    },
    {
      "title": "5G & Telecom Tech Conference",
      "description": "Conference exploring 5G technology and telecommunications innovation. Network infrastructure, applications, and future connectivity.",
      "date": "2026-02-25 09:00:00",
      "location": "Miami",
      "totalTickets": 436,
      "availableTickets": 64,
      "isActive": true,
      "category": "Technology",
      "price": 375
    },
    {
      "title": "Mixed Media Art Exhibition",
      "description": "Innovative mixed media artworks combining multiple artistic techniques. Interactive installations and experimental art forms.",
      "date": "2026-03-18 11:00:00",
      "location": "Houston",
      "totalTickets": 485,
      "availableTickets": 397,
      "isActive": true,
      "category": "Arts & Culture",
      "price": 29
    },
    {
      "title": "Open Source Tech Conference",
      "description": "Conference celebrating open source software and community collaboration. Contribute to projects and meet maintainers.",
      "date": "2025-11-08 09:00:00",
      "location": "New York",
      "totalTickets": 571,
      "availableTickets": 521,
      "isActive": true,
      "category": "Technology",
      "price": 150
    },
    {
      "title": "Immersive Theater Experience",
      "description": "Unique immersive theater where audience becomes part of the story. Interactive performance in unconventional venue space.",
      "date": "2026-03-11 19:00:00",
      "location": "Seattle",
      "totalTickets": 299,
      "availableTickets": 294,
      "isActive": true,
      "category": "Arts & Theater",
      "price": 85
    },
    {
      "title": "Soccer Sports Championship Match",
      "description": "Professional soccer championship match with international-level competition. Passionate fans and world-class athletic skill.",
      "date": "2026-03-09 16:00:00",
      "location": "Dallas",
      "totalTickets": 154,
      "availableTickets": 96,
      "isActive": false,
      "category": "Sports",
      "price": 110
    },
    {
      "title": "E-commerce Startup Networking Event",
      "description": "Connect with e-commerce entrepreneurs and learn scaling strategies. Topics include logistics, marketing, and customer acquisition.",
      "date": "2026-04-08 17:00:00",
      "location": "Los Angeles",
      "totalTickets": 335,
      "availableTickets": 68,
      "isActive": true,
      "category": "Business",
      "price": 65
    },
    {
      "title": "Foreign Film Festival Screening",
      "description": "International cinema from award-winning foreign directors. Subtitled films showcasing diverse cultures and storytelling styles.",
      "date": "2026-02-01 19:00:00",
      "location": "Los Angeles",
      "totalTickets": 693,
      "availableTickets": 609,
      "isActive": true,
      "category": "Film",
      "price": 20
    },
    {
      "title": "FinTech Startup Meetup & Demo",
      "description": "Financial technology startups showcase innovations. Learn about digital banking, payments, and blockchain applications.",
      "date": "2026-03-29 18:00:00",
      "location": "Houston",
      "totalTickets": 209,
      "availableTickets": 35,
      "isActive": false,
      "category": "Business",
      "price": 75
    },
    {
      "title": "Drama Theater Festival Performance",
      "description": "Theater festival featuring dramatic works from multiple companies. Week-long celebration of dramatic arts and storytelling.",
      "date": "2026-02-24 19:30:00",
      "location": "New York",
      "totalTickets": 864,
      "availableTickets": 770,
      "isActive": false,
      "category": "Arts & Theater",
      "price": 55
    },
    {
      "title": "Basketball Sports Championship Finals",
      "description": "Championship basketball finals with top teams competing. Fast-paced action and clutch performances under pressure.",
      "date": "2026-02-14 19:00:00",
      "location": "Chicago",
      "totalTickets": 132,
      "availableTickets": 129,
      "isActive": true,
      "category": "Sports",
      "price": 180
    },
    {
      "title": "Digital Art & NFT Exhibition",
      "description": "Cutting-edge digital art and NFT showcase. Explore the intersection of technology, blockchain, and contemporary art.",
      "date": "2026-03-24 13:00:00",
      "location": "New York",
      "totalTickets": 83,
      "availableTickets": 41,
      "isActive": true,
      "category": "Arts & Culture",
      "price": 35
    },
    {
      "title": "Blues Music Concert & Jam Session",
      "description": "Authentic blues music with live jam sessions. Talented musicians perform traditional and contemporary blues classics.",
      "date": "2025-11-28 20:00:00",
      "location": "Chicago",
      "totalTickets": 774,
      "availableTickets": 129,
      "isActive": true,
      "category": "Music",
      "price": 50
    },
    {
      "title": "Holiday Comedy Special Event",
      "description": "Special holiday-themed comedy show spreading seasonal cheer. Family-friendly entertainment perfect for the festive season.",
      "date": "2025-12-12 19:30:00",
      "location": "Seattle",
      "totalTickets": 850,
      "availableTickets": 504,
      "isActive": true,
      "category": "Entertainment",
      "price": 48
    },
    {
      "title": "Spring Comedy Festival Showcase",
      "description": "Multi-day spring comedy festival with regional and national acts. Stand-up, improv, and sketch comedy in multiple venues.",
      "date": "2026-03-25 20:00:00",
      "location": "Chicago",
      "totalTickets": 305,
      "availableTickets": 143,
      "isActive": false,
      "category": "Entertainment",
      "price": 58
    },
    {
      "title": "Impressionist Art Exhibition",
      "description": "Beautiful impressionist artworks on loan from private collections. Guided tours exploring the impressionist movement and techniques.",
      "date": "2026-01-27 10:00:00",
      "location": "Boston",
      "totalTickets": 449,
      "availableTickets": 437,
      "isActive": true,
      "category": "Arts & Culture",
      "price": 32
    },
    {
      "title": "Short Film Festival Screening",
      "description": "Curated short films from emerging filmmakers. Competition categories and audience choice awards throughout the festival.",
      "date": "2026-03-14 19:00:00",
      "location": "Chicago",
      "totalTickets": 273,
      "availableTickets": 99,
      "isActive": true,
      "category": "Film",
      "price": 24
    },
    {
      "title": "Holiday Film Festival Screening",
      "description": "Classic and contemporary holiday films on the big screen. Festive atmosphere with special seasonal screenings for families.",
      "date": "2025-12-28 14:00:00",
      "location": "Denver",
      "totalTickets": 442,
      "availableTickets": 245,
      "isActive": true,
      "category": "Film",
      "price": 18
    },
    {
      "title": "Latin Music Concert Celebration",
      "description": "Vibrant Latin music performances featuring salsa, reggaeton, and bachata. Dance-friendly venue with infectious rhythms.",
      "date": "2025-11-16 21:00:00",
      "location": "Miami",
      "totalTickets": 779,
      "availableTickets": 478,
      "isActive": true,
      "category": "Music",
      "price": 65
    },
    {
      "title": "UX/UI Design Tech Conference",
      "description": "Conference for designers covering UX research, UI design, and design systems. Portfolio reviews and design thinking workshops.",
      "date": "2025-12-07 09:00:00",
      "location": "Seattle",
      "totalTickets": 81,
      "availableTickets": 81,
      "isActive": false,
      "category": "Technology",
      "price": 280
    },
    {
      "title": "Hockey Sports Championship Game",
      "description": "Ice hockey championship with fast-paced action on ice. Physical competition and skilled skating from elite hockey players.",
      "date": "2025-11-20 19:30:00",
      "location": "Chicago",
      "totalTickets": 116,
      "availableTickets": 82,
      "isActive": true,
      "category": "Sports",
      "price": 140
    },
    {
      "title": "Winter Sports Tournament Championship",
      "description": "Championship tournament for winter sports athletes. Indoor competition featuring the best winter sports talent.",
      "date": "2025-12-19 18:00:00",
      "location": "Seattle",
      "totalTickets": 265,
      "availableTickets": 141,
      "isActive": true,
      "category": "Sports",
      "price": 85
    },
    {
      "title": "Animated Film Festival Screening",
      "description": "Animated films for all ages from international studios. Feature films, shorts, and special screenings with animation workshops.",
      "date": "2026-01-24 15:00:00",
      "location": "Miami",
      "totalTickets": 772,
      "availableTickets": 339,
      "isActive": true,
      "category": "Film",
      "price": 20
    },
    {
      "title": "Football Sports Championship Game",
      "description": "Championship football game with intense gridiron action. Tailgating, halftime entertainment, and passionate fan atmosphere.",
      "date": "2025-11-10 13:00:00",
      "location": "Houston",
      "totalTickets": 663,
      "availableTickets": 459,
      "isActive": true,
      "category": "Sports",
      "price": 160
    },
    {
      "title": "Art House Film Screening Series",
      "description": "Curated art house cinema from critically acclaimed directors. Thought-provoking films with post-screening discussions.",
      "date": "2026-01-10 19:30:00",
      "location": "New York",
      "totalTickets": 140,
      "availableTickets": 113,
      "isActive": false,
      "category": "Film",
      "price": 26
    },
    {
      "title": "Asian Food Festival Experience",
      "description": "Explore diverse Asian cuisines from multiple countries. Authentic dishes, cultural performances, and cooking demonstrations.",
      "date": "2025-11-18 12:00:00",
      "location": "Los Angeles",
      "totalTickets": 417,
      "availableTickets": 183,
      "isActive": true,
      "category": "Food & Drink",
      "price": 52
    },
    {
      "title": "AI & Machine Learning Startup Meetup",
      "description": "Meetup for AI and ML startup founders and engineers. Discuss latest models, applications, and business opportunities in AI.",
      "date": "2026-02-18 18:00:00",
      "location": "Los Angeles",
      "totalTickets": 67,
      "availableTickets": 6,
      "isActive": true,
      "category": "Business",
      "price": 70
    },
    {
      "title": "Hip-Hop Music Concert Show",
      "description": "Live hip-hop performances from top artists and up-and-coming rappers. DJ sets, breakdancing, and authentic hip-hop culture.",
      "date": "2026-04-17 21:00:00",
      "location": "Chicago",
      "totalTickets": 728,
      "availableTickets": 441,
      "isActive": true,
      "category": "Music",
      "price": 72
    },
    {
      "title": "Romantic Film Festival Screening",
      "description": "Romantic films perfect for date night or film enthusiasts. Classic romances and contemporary love stories on the big screen.",
      "date": "2026-02-14 19:00:00",
      "location": "Los Angeles",
      "totalTickets": 348,
      "availableTickets": 69,
      "isActive": false,
      "category": "Film",
      "price": 22
    },
    {
      "title": "Mediterranean Food Festival",
      "description": "Taste the flavors of the Mediterranean region. Greek, Italian, Spanish, and Middle Eastern cuisine with wine tastings.",
      "date": "2026-03-21 13:00:00",
      "location": "Dallas",
      "totalTickets": 891,
      "availableTickets": 336,
      "isActive": false,
      "category": "Food & Drink",
      "price": 58
    },
    {
      "title": "Watercolor Art Exhibition & Workshop",
      "description": "Watercolor paintings from local and regional artists. Hands-on workshops teaching watercolor techniques for all skill levels.",
      "date": "2025-12-27 11:00:00",
      "location": "New York",
      "totalTickets": 186,
      "availableTickets": 58,
      "isActive": true,
      "category": "Arts & Culture",
      "price": 30
    },
    {
      "title": "Folk Music Concert & Storytelling",
      "description": "Traditional folk music with storytelling and acoustic instruments. Intimate setting celebrating folk traditions and heritage.",
      "date": "2025-11-10 19:00:00",
      "location": "Seattle",
      "totalTickets": 402,
      "availableTickets": 210,
      "isActive": true,
      "category": "Music",
      "price": 38
    },
    {
      "title": "Winter Holiday Music Concert",
      "description": "Special winter concert featuring holiday classics and winter-themed music. Choir performances and orchestral arrangements.",
      "date": "2025-12-27 19:30:00",
      "location": "Denver",
      "totalTickets": 77,
      "availableTickets": 10,
      "isActive": true,
      "category": "Music",
      "price": 42
    }
  ]

    // Convert date strings to Date objects
    const eventsWithDateObjects = sampleEvents.map(event => ({
      ...event,
      date: new Date(event.date)
    }));
console.log(eventsWithDateObjects.length)
    // // Insert sample events
    const insertedEvents = await db.insert(events).values(eventsWithDateObjects).returning();
    console.log(`✅ Inserted ${insertedEvents.length} sample events`);

    // Display inserted events
    console.log('\n📋 Sample events created:');
    insertedEvents.forEach((event, index) => {
      console.log(`${index + 1}. ${event.title} - ${event.location} (${event.isActive ? 'Active' : 'Inactive'})`);
    });

    console.log('\n🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seed()
    .then(() => {
      console.log('✅ Seed completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seed failed:', error);
      process.exit(1);
    });
}

export { seed };
