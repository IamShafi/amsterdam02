'use client';
import Image from "next/image";
import { useEffect } from "react";
import Header from "@/components/Header";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import nicPhoto from "../../../../public/assets/tour-guide-nic.png";

const RecommendationsNic = () => {
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
            Nic's Recommendations
          </h1>
          
          <Image 
            src={nicPhoto} 
            alt="Nic"
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
          
          <p className="text-base md:text-lg leading-relaxed mb-6">
            You will find the group picture here:{" "}
            <a href="https://www.facebook.com/profile.php?id=61551056437973" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Facebook
            </a>
          </p>
        </div>

        {/* Recommendations Content */}
        <div className="space-y-8 md:space-y-10">
          {/* Food Recommendations Section */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">🍽️ Food Recommendations</h2>
            <ul className="space-y-3 ml-4">
              <li className="leading-relaxed">
                <strong>Pllek</strong> - Dutch Waterfront Restaurant (travel by free Ferry)
              </li>
              <li className="leading-relaxed">
                <strong>Soju Bar</strong> - Korean
              </li>
              <li className="leading-relaxed">
                <strong>Nea Pizza</strong> - Italian
              </li>
              <li className="leading-relaxed">
                <strong>Biscuit Baby</strong> - American Burgers
              </li>
              <li className="leading-relaxed">
                <strong>Albert Cuyp Markt</strong> - Market
              </li>
              <li className="leading-relaxed">
                <strong>Rudi's Original Stroopwafels</strong> - At Albert Cuyp Markt
              </li>
              <li className="leading-relaxed">
                <strong>Hoi Tin</strong> - Chinese
              </li>
              <li className="leading-relaxed">
                <strong>Wing Kee</strong> - Chinese
              </li>
              <li className="leading-relaxed">
                <strong>Massimo Gelato</strong> - Ice Cream
              </li>
              <li className="leading-relaxed">
                <strong>Benji's</strong> - Brunch (multiple locations)
              </li>
              <li className="leading-relaxed">
                <strong>Lagom Amsterdam</strong> - Brunch
              </li>
              <li className="leading-relaxed">
                <strong>Bocca Coffee</strong> - Cafe - NOT A COFFEESHOP :)
              </li>
              <li className="leading-relaxed">
                <strong>Meatless District</strong> - Vegetarian (must try the sweet potato fries)
              </li>
              <li className="leading-relaxed">
                <strong>Caldi e freddi</strong> - Sandwich shop
              </li>
              <li className="leading-relaxed">
                <strong>Sandwichshop Amsterdam</strong> - Food
              </li>
              <li className="leading-relaxed">
                <strong>Flying dutchman cocktails</strong> - Drinks
              </li>
              <li className="leading-relaxed">
                <strong>Beemster cheese</strong> - Must try!
              </li>
              <li className="leading-relaxed">
                <strong>Xian delicious foods</strong> - Food
              </li>
              <li className="leading-relaxed">
                <strong>Hongdae</strong> - Food
              </li>
              <li className="leading-relaxed">
                <strong>The Eye</strong> - Film museum and restaurant with a view of the IJ
              </li>
              <li className="leading-relaxed">
                <strong>Hannekes Boom</strong> - Food and drinks on the IJ
              </li>
            </ul>
          </section>

          {/* Museums/Daytime Visits Section */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">🎨 Museums/Daytime Visits</h2>
            <ul className="space-y-3 ml-4">
              <li className="leading-relaxed">
                <strong>Fabrique des Lumières</strong> - Immersive digital art centre
              </li>
              <li className="leading-relaxed">
                <strong>Van Gogh Museum</strong> - Museum/gallery
              </li>
              <li className="leading-relaxed">
                <strong>Anne Frank House</strong> - Museum
              </li>
              <li className="leading-relaxed">
                <strong>FOAM Gallery</strong> - Photography gallery
              </li>
              <li className="leading-relaxed">
                <strong>Our Dear Lord in The Attic</strong> - Hidden Catholic church
              </li>
              <li className="leading-relaxed">
                <strong>Rijksmuseum</strong> - Museum
              </li>
              <li className="leading-relaxed">
                <strong>Vondelpark</strong> - Park
              </li>
              <li className="leading-relaxed">
                <strong>Westerpark</strong> - Park
              </li>
              <li className="leading-relaxed">
                <strong>Kiloshop De Pijp</strong> - Thrift store
              </li>
            </ul>
          </section>

          {/* Nightlife Section */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">🎉 Nightlife</h2>
            <ul className="space-y-3 ml-4">
              <li className="leading-relaxed">
                <strong>Paradiso</strong> - Live music
              </li>
              <li className="leading-relaxed">
                <strong>Melkweg</strong> - Live/dance music
              </li>
              <li className="leading-relaxed">
                <strong>Mezrab</strong> - Storytelling
              </li>
              <li className="leading-relaxed">
                <strong>Cinetol</strong> - Live music
              </li>
              <li className="leading-relaxed">
                <strong>Murmur</strong> - Easy dance music
              </li>
              <li className="leading-relaxed">
                <strong>Tolhuistuin</strong> - Live music
              </li>
              <li className="leading-relaxed">
                <strong>Radion</strong> - Dance music
              </li>
            </ul>
          </section>

          {/* Additional Tips & Activities Section */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">💡 More Tips & Activities</h2>
            <div className="space-y-4">
              <p className="leading-relaxed">
                <strong>Canal Cruise:</strong> Go on a canal cruise!! You simply cannot come to Amsterdam and not see it from the water, which is where all those beautiful canal houses were meant to be seen from, so don't miss this opportunity! I recommend Those Damn Boat Guys.
              </p>
              
              <p className="leading-relaxed">
                <strong>Jordaan & Apple Pie:</strong> Visit the Jordaan (especially the northern part, north of Rozengracht) and have an apple pie at Winkel 43 (best apple pie in town!)
              </p>
              
              <p className="leading-relaxed">
                <strong>Hidden Church:</strong> If you want to visit the hidden church we talked about, it's called: Our Dear Lord in the Attic Museum
              </p>
              
              <p className="leading-relaxed">
                <strong>Maritime History:</strong> If you want to experience 500 years of maritime history through interactive exhibits and hop on board a Dutch ship, you should check out the National Maritime Museum
              </p>
              
              <p className="leading-relaxed">
                <strong>Street Art:</strong> Take a free ferry to the NDSM shipyard and check out the largest Street Art museum in the world located in the 'Lasloods'.
              </p>
              
              <p className="leading-relaxed">
                <strong>Moco Museum:</strong> If you want to check out a wide range of inspiring modern, contemporary, and street art, you should go the Moco Museum
              </p>
              
              <p className="leading-relaxed">
                <strong>Bike Tour:</strong> Get a bike and visit the 19th Century neighborhoods around the city center: De Pijp, (hipster district) Oud Zuid, (affluent part of town) Oud west (especially the Helmersstraat area and Food Hallen), Oost (I live there)
              </p>
              
              <p className="leading-relaxed">
                <strong>Shopping:</strong> If you want to stroll & shop go to the Nine little streets and Utrechtsestraat
              </p>
              
              <p className="leading-relaxed">
                <strong>Stroopwafel & Cheese:</strong> Get a fresh stroopwafel (!!!) or some Dutch Cheese at the Albert Cuypmarket (Monday – Saturday 9am – 5pm) On sunday you can get the stroopwafels at this shop: van Wonderen Stroopwafels
              </p>
              
              <p className="leading-relaxed">
                <strong>Parks:</strong> Visit at least one of our great parks: Vondelpark (!), Westerpark, Sarphatipark, Oosterpark.
              </p>
              
              <p className="leading-relaxed">
                <strong>Windmills:</strong> If you want to visit the windmills, you can book a tour to go the Zaanse Schans or just go there by yourself with the bus or train.
              </p>
              
              <p className="leading-relaxed">
                <strong>Library View:</strong> Visit the Public Library called OBA, which is next to central station, and get a stunning view from their rooftop terrace for free! You can get a really nice view of Amsterdam at the Amsterdam Lookout point
              </p>
            </div>
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

export default RecommendationsNic;
