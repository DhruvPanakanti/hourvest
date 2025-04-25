import React, { useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import { ChefHat, MessageCircle, Utensils } from "lucide-react";
import VariableProximity from '@/components/effects/VariableProximity';
import GradientText from '@/components/effects/GradientText';


const aboutUs: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const parallaxItem1 = useRef<HTMLDivElement>(null);
  const parallaxItem2 = useRef<HTMLDivElement>(null);
  const parallaxItem3 = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const items = [parallaxItem1.current, parallaxItem2.current, parallaxItem3.current];
    
    if (!card) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      
      items.forEach((item, index) => {
        if (item) {
          const speed = 0.5 + (index * 0.1);
          item.style.transform = `translate(${(centerX - x) * speed * 0.1}px, ${(centerY - y) * speed * 0.1}px)`;
        }
      });
    };
    
    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
      card.style.transition = 'transform 0.5s ease';
      
      items.forEach(item => {
        if (item) {
          item.style.transform = 'translate(0, 0)';
        }
      });
    };
    
    const handleMouseEnter = () => {
      card.style.transition = 'transform 0.1s ease';
    };
    
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    card.addEventListener('mouseenter', handleMouseEnter);
    
    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
      card.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  return (
    <section id="about" className="py-20 bg-dark-2 z-10">
      <div className="container mx-auto px-6 lg:px-12 z-10">
        {/* Heading with short centered underline */}
        <div className="mb relative">
          <div className="flex items-center">
            <GradientText
              colors={["#6366f1", "#d946ef", "#6366f1", "#d946ef", "#6366f1"]}
              animationSpeed={0}
              fontSize="clamp(1.5rem, 4vw, 2.5rem)"
              className="block font-['Roboto_Flex'] cursor-default select"
            >
              <VariableProximity
                label="About Us"
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

        {/* Grid layout with content on left, parallax on right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
          {/* Text Content - Left Side */}
          <div className="order-2 lg:order-1 flex flex-col justify-center">
            <Reveal delay={100}>
              <p className="text-body-medium text-light-2 mb-6">
              Hourvest is a decentralized time-banking platform designed to transform how 
              communities exchange value—through time, not money.
              </p>
            </Reveal>
            
            <Reveal delay={200}>
              <p className="text-body-medium text-light-2 mb-8">
              Built on the principle that everyone’s time holds equal worth, Hourvest enables users to
              invest their time providing services in exchange for time credits they can redeem for help
              in other areas of life. In a global economy where access to services often depends 
              on income, Hourvest offers an inclusive, skills-based ecosystem that promotes equity, 
              collaboration, and local resilience.

              We are on a mission to reshape the future of work and community support by unlocking
              the full potential of peer-to-peer service exchange. As the demand for alternative 
              economies grows, Hourvest stands at the intersection of social impact and sustainable 
              innovation.
              </p>
            </Reveal>
          </div>
          </div>
      </div>
    </section>
  );
};

export default aboutUs;