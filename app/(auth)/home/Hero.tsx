'use client'

import React from 'react';
import TextPressure from '@/components/effects/TextPressure';
import VariableProximity from '@/components/effects/VariableProximity';
import GradientText from '@/components/effects/GradientText';
import Link from 'next/link';

interface HeroProps {
  heroRef: React.RefObject<HTMLDivElement>;
  containerRef: React.RefObject<HTMLDivElement>;
}

export default function Hero({ heroRef, containerRef }: HeroProps) {
  return (
    <div id="home" className="relative min-h-screen w-full">
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: "url('/assets/hero.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />

      <div ref={heroRef} className="relative min-h-screen pt-16 md:pt-24 lg:pt-32">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="max-w-5xl">
            <div className="py-8 md:py-12 lg:py-16 space-y-8 md:space-y-12">
              <div className="w-full h-24 md:h-32 lg:h-40">
                <TextPressure
                  text="Hourvest"
                  fontFamily="Inter"
                  textColor="transparent"
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-4xl sm:text-5xl md:text-6xl lg:text-7xl cursor-default"
                  minFontSize={20}
                  scale={true}
                  width={true}
                />
              </div>

              <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                <GradientText
                  colors={["	#8ddcde", "#6dbabc", "#488b8c", "#194546"]}
                  animationSpeed={75}
                  fontSize="clamp(1.5rem, 4vw, 2.5rem)"
                  className="italic block font-['Roboto_Flex'] cursor-default select-none"
                >
                  <VariableProximity
                    label="Time Bank"
                    fromFontVariationSettings="'wght' 300, 'wdth' 100"
                    toFontVariationSettings="'wght' 900, 'wdth' 150"
                    containerRef={containerRef}
                    radius={150}
                    falloff="exponential"
                    className="italic block font-['Roboto_Flex'] cursor-default select-none"
                  />
                </GradientText>
                <div className="relative cursor-default">
                  <GradientText
                    colors={["#6366f1", "#d946ef", "#6366f1", "#d946ef", "#6366f1"]}
                    animationSpeed={75}
                    fontSize="clamp(1.5rem, 4vw, 2.5rem)"
                    className="italic block font-['Roboto_Flex'] cursor-default select-none" children={undefined}>
                  </GradientText>
                </div>
              </div>

              <div className="relative">
                <GradientText
                  colors={["#6366f1", "#d946ef", "#6366f1", "#d946ef", "#6366f1"]}
                  animationSpeed={75}
                  fontSize="clamp(1rem, 2vw, 1.25rem)"
                  className='font-semibold text-white leading-tight md:leading-tight cursor-default relative z-10'
                >
                  Every Hour Counts at Hourvest
                  Connect, contribute, and thrive in a community where time is valued above all.
                </GradientText>
              </div>

              <div>
                <Link
                  href="/sign-up"
                  className="group inline-block px-4 py-3 md:px-6 md:py-4 lg:px-8 lg:py-4 text-base md:text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg shadow-lg hover:from-purple-700 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 cursor-pointer select-none relative z-20"
                >
                  <span className="relative z-10">Join Now</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
