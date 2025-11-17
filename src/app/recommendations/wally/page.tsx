'use client';
import { useEffect } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import wallyPhoto from "../../../../public/assets/tour-guide-wally-new.png";

const RecommendationsWally = () => {
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
            Wally's Recommendations
          </h1>
          
          <Image 
            src={wallyPhoto} 
            alt="Wally"
            className="w-full rounded-2xl shadow-2xl mb-6 md:mb-8"
          />
        </div>

        {/* Welcome Section */}
        <div className="prose prose-lg max-w-none mb-8 md:mb-10">
          <p className="text-xl md:text-2xl font-semibold mb-4">
            Hey there 👋
          </p>
          
          <p className="text-base md:text-lg leading-relaxed mb-4">
            Welcome to my personal page, where you will find all kinds of useful information and suggestions to help you make the rest of your stay in Amsterdam even more memorable! All suggestions are hand-picked by myself.
          </p>
        </div>

        {/* Recommendations Content */}
        <div className="space-y-8 md:space-y-10">
          {/* Food Recommendations Section */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">🍽️ Food Recommendations</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">Lunch in the center of town</h3>
                <ul className="space-y-2 ml-4">
                  <li className="leading-relaxed"><strong>Cafe de Waag</strong></li>
                  <li className="leading-relaxed"><strong>Kapitein Zeppos</strong></li>
                  <li className="leading-relaxed"><strong>Lagom</strong></li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Typical Dutch food for dinner</h3>
                <ul className="space-y-2 ml-4">
                  <li className="leading-relaxed"><strong>Café Sonneveld</strong></li>
                  <li className="leading-relaxed"><strong>Moeders</strong></li>
                  <li className="leading-relaxed"><strong>The Pantry</strong></li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">International Cuisine</h3>
                <ul className="space-y-2 ml-4">
                  <li className="leading-relaxed"><strong>Indonesian Restaurant:</strong> Sampurna or Cafe Kadijk</li>
                  <li className="leading-relaxed"><strong>Indonesian Take-Away:</strong> Indo at home</li>
                  <li className="leading-relaxed"><strong>Surinamese Food:</strong> Warung Spang Makandra</li>
                  <li className="leading-relaxed"><strong>Thai food:</strong> Bird or Bangkok</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Quick Bites & Specialties</h3>
                <ul className="space-y-2 ml-4">
                  <li className="leading-relaxed"><strong>Dutch Fastfood:</strong> FEBO</li>
                  <li className="leading-relaxed"><strong>Pancakes:</strong> Upstairs Pancakes</li>
                  <li className="leading-relaxed"><strong>Best Apple pie in Amsterdam:</strong> Winkel 43</li>
                  <li className="leading-relaxed"><strong>Vegetarian Food:</strong> Meatless District</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Street Food Market Section */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">🍜 Street Food Market</h2>
            <p className="leading-relaxed">
              Get a fresh stroopwafel (!!!) or some Dutch Cheese at the <strong>Albert Cuypmarket</strong> (Monday – Saturday 9am – 5pm, closed on Sundays). On Sundays you can get the stroopwafels at this shop: van Wonderen Stroopwafels.
            </p>
          </section>

          {/* Activities Section */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">🚤 Activities & Sightseeing</h2>
            <div className="space-y-4">
              <p className="leading-relaxed">
                <strong>Canal Cruise:</strong> Go on a canal cruise!! You simply cannot come to Amsterdam and not see it from the water, which is where all those beautiful canal houses were meant to be seen from, so don't miss this opportunity! I recommend Those Damn Boat Guys.
              </p>
              
              <p className="leading-relaxed">
                <strong>Jordaan & Apple Pie:</strong> Visit the Jordaan (especially the northern part, north of Rozengracht) and have an apple pie at Winkel 43 (best apple pie in town!)
              </p>

              <p className="leading-relaxed">
                <strong>Windmills:</strong> If you want to visit the windmills, you can book a tour to go the Zaanse Schans or just go there by yourself with the bus or train.
              </p>

              <p className="leading-relaxed">
                <strong>Street Art:</strong> Take a free ferry to the NDSM shipyard and check out the largest Street Art museum in the world located in the 'Lasloods'.
              </p>

              <p className="leading-relaxed">
                <strong>Library View:</strong> Visit the Public Library called OBA, which is next to central station, and get a stunning view from their rooftop terrace for free! You can get a really nice view of Amsterdam at the Amsterdam Lookout point.
              </p>
            </div>
          </section>

          {/* Museums Section */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">🎨 Must-visit Museums</h2>
            <ul className="space-y-3 ml-4">
              <li className="leading-relaxed">
                <strong>Van Gogh Museum</strong>
              </li>
              <li className="leading-relaxed">
                <strong>The Rijksmuseum</strong>
              </li>
              <li className="leading-relaxed">
                <strong>Anne Frank House</strong>
              </li>
              <li className="leading-relaxed">
                <strong>Our Dear Lord in the Attic Museum</strong> - If you want to visit the hidden church we talked about
              </li>
              <li className="leading-relaxed">
                <strong>National Maritime Museum</strong> - If you want to experience 500 years of maritime history through interactive exhibits and hop on board a Dutch ship
              </li>
              <li className="leading-relaxed">
                <strong>Moco Museum</strong> - If you want to check out a wide range of inspiring modern, contemporary, and street art
              </li>
            </ul>
          </section>

          {/* Shopping Section */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">🛍️ Shopping</h2>
            <div className="space-y-4">
              <p className="leading-relaxed">
                <strong>Waterlooplein Flea Market:</strong> If you want to shop for souvenirs or thrift shopping, go to the Waterlooplein Flea Market.
              </p>
              
              <p className="leading-relaxed">
                <strong>Shopping Streets:</strong> If you want to stroll & shop, go to the Nine little streets and Utrechtsestraat.
              </p>
            </div>
          </section>

          {/* Parks Section */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">🌳 Parks</h2>
            <p className="leading-relaxed mb-3">
              Visit at least one of our great parks:
            </p>
            <ul className="space-y-2 ml-4">
              <li className="leading-relaxed"><strong>Vondelpark (!)</strong></li>
              <li className="leading-relaxed"><strong>Westerpark</strong></li>
              <li className="leading-relaxed"><strong>Sarphatipark</strong></li>
            </ul>
          </section>

          {/* Nightlife Section */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">🎉 Nightlife</h2>
            <p className="leading-relaxed">
              If you want to experience Amsterdam's Nightlife, I recommend you go to the <strong>Rembrandt Square</strong> or to the <strong>Leidse Square</strong>.
            </p>
          </section>
        </div>

        {/* Footer Message */}
        <div className="mt-12 md:mt-16 text-center p-6 md:p-8 bg-primary/5 rounded-2xl">
          <p className="text-lg md:text-xl font-semibold">
            Thanks again for joining my tour and I hope you have a wonderful stay in Amsterdam 🤩
          </p>
        </div>
      </main>
    </div>
  );
};

export default RecommendationsWally;
