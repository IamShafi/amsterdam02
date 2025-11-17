'use client';
import { useEffect } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import peterPhoto from "../../../../public/assets/tour-guide-peter.png";

const RecommendationsPeter = () => {
  // Prevent Google indexing
  useEffect(() => {
    const metaRobots = document.createElement('meta');
    metaRobots.name = 'robots';
    metaRobots.content = 'noindex, nofollow';
    document.head.appendChild(metaRobots);
    
    return () => {
      document.head.removeChild(metaRobots);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-5 sm:px-4 max-w-4xl py-8 md:py-12">
        {/* Hero Section */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8">
            Peter's Recommendations
          </h1>
          
          <Image 
            src={peterPhoto} 
            alt="Peter"
            className="w-full rounded-2xl shadow-2xl mb-6 md:mb-8"
          />
        </div>

        {/* Welcome Section */}
        <div className="prose prose-lg max-w-none mb-8 md:mb-10">
          <p className="text-xl md:text-2xl font-semibold mb-4">
            Hey there 👋
          </p>
          
          <p className="text-base md:text-lg leading-relaxed mb-4">
            Welcome to my personal page, where you will find all kinds of useful information and suggestions to help you make the rest of your stay in Amsterdam even more memorable!
          </p>
          
          <p className="text-base md:text-lg leading-relaxed mb-6">
            All suggestions are hand-picked by myself, Peter.
          </p>
        </div>

        {/* Recommendations Content */}
        <div className="space-y-8 md:space-y-10">
          {/* Food & Bar Section */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">🍽️ Food & Bar Recommendations</h2>
            <ul className="space-y-3 ml-4">
              <li className="leading-relaxed">
                <strong>Café Restaurant van Kerkwijk</strong> - Modern Dutch Lunch/Dinner (Centre)
              </li>
              <li className="leading-relaxed">
                <strong>Camino Taqueria</strong> - Best Tacos in town (West)
              </li>
              <li className="leading-relaxed">
                <strong>TerraZen Centre</strong> - Affordable Vegan food (Centre)
              </li>
              <li className="leading-relaxed">
                <strong>Caldi e Freddi</strong> - Cheap Italian sandwiches (Centre)
              </li>
              <li className="leading-relaxed">
                <strong>Festina Lente</strong> - Cozy Bar in Jordaan
              </li>
              <li className="leading-relaxed">
                <strong>Monty's Toasties</strong> - Cheesy cheesy toasties in Jordaan
              </li>
              <li className="leading-relaxed">
                <strong>Pamela</strong> - Queer bar in West
              </li>
              <li className="leading-relaxed">
                <strong>Toko Dun Yong</strong> - Asian supermarket with great ramen upstairs (Centre)
              </li>
              <li className="leading-relaxed">
                <strong>Massimo Gelato</strong> - Ice Cream (several locations)
              </li>
              <li className="leading-relaxed">
                <strong>Pllek</strong> - Dutch Waterfront Restaurant in Noord (travel by free Ferry)
              </li>
              <li className="leading-relaxed">
                <strong>Sea Palace</strong> - Fancy Chinese food on the water (centre)
              </li>
              <li className="leading-relaxed">
                <strong>Winkel 43</strong> - Best apple pie in town (Jordaan)
              </li>
              <li className="leading-relaxed">
                <strong>Moak Pancakes</strong> - Hip-hop pancakes (several locations)
              </li>
              <li className="leading-relaxed">
                <strong>Restaurant Barracuda</strong> - Seafood in Noord
              </li>
              <li className="leading-relaxed">
                <strong>Indonesian Food</strong> - Kartika (Oud West), Restaurant Max (Centre), or Sampurna (Centre). Treat yourself to a Rijstafel and get to sample loads of dishes!
              </li>
              <li className="leading-relaxed">
                <strong>Thaise Snackbar Bird</strong> - Thai food (centre)
              </li>
              <li className="leading-relaxed">
                <strong>Chinese food in China Town</strong> - Hoi Tin, Nam Kee
              </li>
              <li className="leading-relaxed">
                <strong>Brown Cafes (Dutch Pubs)</strong> - L'Affiche (Oud West), Café Chris (Jordaan), Het Smalle (Jordaan), Proeflokaal de Ooievaar (Centre)
              </li>
            </ul>
          </section>

          {/* Markets Section */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">🛍️ Markets</h2>
            <ul className="space-y-3 ml-4">
              <li className="leading-relaxed">
                <strong>Waterlooplein</strong> - Flea Market, Souvenirs
              </li>
              <li className="leading-relaxed">
                <strong>Albert Cuypmarkt</strong> - Food market, souvenirs, everyday goods
              </li>
            </ul>
          </section>

          {/* Museums Section */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">🎨 Museums</h2>
            <ul className="space-y-3 ml-4">
              <li className="leading-relaxed">
                <strong>Van Gogh Museum</strong>
              </li>
              <li className="leading-relaxed">
                <strong>Foam</strong> (photography)
              </li>
              <li className="leading-relaxed">
                <strong>Stedelijk</strong> (Modern art)
              </li>
              <li className="leading-relaxed">
                <strong>Huis Marseille</strong> (photography)
              </li>
              <li className="leading-relaxed">
                <strong>Rijksmuseum</strong> (classical art, Rembrandt etc.)
              </li>
            </ul>
          </section>

          {/* Nightlife Section */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">🎉 Nightlife</h2>
            <ul className="space-y-3 ml-4">
              <li className="leading-relaxed">
                <strong>Paradiso</strong> - Live music/club
              </li>
              <li className="leading-relaxed">
                <strong>Raum</strong> - Queer techno club
              </li>
              <li className="leading-relaxed">
                <strong>Melkweg</strong> - Live music/club
              </li>
              <li className="leading-relaxed">
                <strong>Mezrab</strong> - Storytelling
              </li>
              <li className="leading-relaxed">
                <strong>Jazz Cafe Alto</strong> - Jazz music
              </li>
              <li className="leading-relaxed">
                <strong>TillaTec</strong> - Club
              </li>
              <li className="leading-relaxed">
                <strong>Skate Cafe</strong> - Club
              </li>
            </ul>
          </section>

          {/* Coffeeshops Section */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">☕ Coffeeshops · Not for coffee ;)</h2>
            <ul className="space-y-3 ml-4">
              <li className="leading-relaxed">
                <strong>La Tertulia</strong> - Open since 1983 and run by mother and daughter
              </li>
              <li className="leading-relaxed">
                <strong>Siberië</strong> - Good vibes & good products
              </li>
            </ul>
          </section>

          {/* Walking & Cycling Activities Section */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">🚶 Walking & Cycling Activities</h2>
            <div className="space-y-4">
              <p className="leading-relaxed">
                <strong>Jordaan & Prinseneiland:</strong> Take a walk around Jordaan and the Prinseneiland neighbourhoods to get a more authentic taste of some classic neighbourhoods of the city, and stop off for an apple pie at Winkel 43, or for a toastie at Monty's.
              </p>
              
              <p className="leading-relaxed">
                <strong>Bike Rental & Neighborhoods:</strong> Rent a bike and leave the city centre! I recommend cycling around parks and more residential neighbourhoods. Check out the 19th century Oud-Zuid and Oud-West for beautiful architecture, and go through Vondelpark in the middle of them. Or head out to the Eastern Docklands for more modern, brutalist architecture, open water, the Flevopark, and plenty of swimming spots.
              </p>
              
              <p className="leading-relaxed">
                <strong>Nature Cycling Trips:</strong> If the weather is good, rent bikes and cycle out of the city into the nature. I recommend taking the ferry to Noord and then cycling past cute villages and windmills to 'Het Twiske', a big nature reserve where you can also swim. (There is even a dedicated and discreet nudist beach if skinny dipping is your thing!). You can also go south of the city to the Amsterdam Bos (Forest), where there are nice walks, pancake houses, and even a goat farm! Amsterdam Bos is relatively easy to access by public transport.
              </p>
              
              <p className="leading-relaxed">
                <strong>Canal Cruise:</strong> Go on a canal cruise!! You simply cannot come to Amsterdam and not see it from the water, which is where all those beautiful canal houses were meant to be seen from, so don't miss this opportunity! I recommend Those Damn Boat Guys.
              </p>
              
              <p className="leading-relaxed">
                <strong>Windmills:</strong> If you want to visit the windmills, you can book a tour to go the Zaanse Schans or just go there by yourself with the bus or train.
              </p>
            </div>
          </section>

          {/* Seasonal Activities Section */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">🌷 Seasonal Activities</h2>
            <p className="leading-relaxed">
              <strong>Keukenhof Gardens (Spring/Tulip Season):</strong> If it is Spring Time (aka Tulip season), then you must visit the Keukenhof gardens, around 30/45 minutes outside of the city. It's like Disney Land for flowers!
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default RecommendationsPeter;
