'use client'

import React, { useRef, useEffect } from 'react';
import Navbar from './Navbar';
import AboutUs from './aboutUs';
import VariableProximity from '@/components/effects/VariableProximity';
import GradientText from '@/components/effects/GradientText';
import Hero from './Hero';

import Ribbons from '@/components/effects/Ribbons';
import InfiniteMenu from '@/components/effects/InfiniteMenu';

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null!);
  const heroRef = useRef<HTMLDivElement>(null!);

  const items = [
    {
      image: '/assets/book.png',
      link: 'https://google.com/',
      title: 'Recipes',
      description: 'Share your favorite recipes with the community and discover new dishes from around the world.'
    },
    {
      image: '/assets/chat.png',
      link: 'https://google.com/',
      title: 'Real-time Discussion',
      description: 'Ask questions and get immediate answers from experienced cooks and food enthusiasts.'
    },
    {
      image: '/assets/like.png',
      link: 'https://google.com/',
      title: 'Like & Recommend',
      description: 'Like your favorite recipes and cooking tips to help others find the best content.'
    },
    {
      image: '/assets/groups.png',
      link: 'https://google.com/',
      title: 'Communities',
      description: 'Join specialized cooking groups focused on cuisines, dietary needs, or cooking techniques.'
    },
    {
      image: '/assets/share.png',
      link: 'https://google.com/',
      title: 'Share',
      description: 'Easily share cooking discoveries and successes with friends on other platforms.'
    },
    {
      image: '/assets/gemini.png',
      link: 'https://google.com/',
      title: 'Rephrase',
      description: 'Rephrase and correct grammar your thread with one click.'
    },
  ];

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full" ref={containerRef}>
      <div className="fixed inset-0" style={{ zIndex: 1 }}>
        <Ribbons
          colors={['#6366f1', '#8b5cf6', '#d946ef']}
          baseThickness={15}
          enableFade={true}
          pointCount={30}
          speedMultiplier={0.4}
          maxAge={300}
        />
      </div>

      <Navbar />

      <div id="hero">
        <Hero heroRef={heroRef} containerRef={containerRef} />
      </div>

      <div id="about">
        <AboutUs />
      </div>
      <div id="explore" className="relative z-10" style={{ height: '500px' }}>
      <section id="about" className="py-20 bg-dark-2 z-10">
      <div className="container mx-auto px-6 lg:px-12 z-10">
      <div className="mb relative bg-dark-2">
          <div className="flex items-center">
            <GradientText
              colors={["#6366f1", "#d946ef", "#6366f1", "#d946ef", "#6366f1"]}
              animationSpeed={0}
              fontSize="clamp(1.5rem, 4vw, 2.5rem)"
              className="block font-['Roboto_Flex'] cursor-default select"
            >
              <VariableProximity
                label="Explore"
                fromFontVariationSettings="'wght' 300, 'wdth' 100"
                toFontVariationSettings="'wght' 900, 'wdth' 150"
                containerRef={containerRef}
                radius={150}
                falloff="exponential"
                className="block font-['Roboto_Flex'] cursor-default select-none"
              />
            </GradientText>
          </div>
          {/* Short, centered underline */}
          <div className="absolute left-0 w-24 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mt-2 rounded-full"></div>
        </div>
        </div>
        </section>
        <InfiniteMenu items={items} />
      </div>
      
    </div>
  );
}