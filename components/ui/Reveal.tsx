
import React, { useEffect, useRef } from "react";

interface RevealProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
  once?: boolean;
  className?: string;
  threshold?: number;
}

const Reveal: React.FC<RevealProps> = ({
  children,
  direction = "up",
  delay = 0,
  duration = 600,
  once = true,
  className = "",
  threshold = 0.1,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Set initial styles
    element.style.opacity = "0";
    element.style.transition = `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`;
    element.style.transitionDelay = `${delay}ms`;

    // Apply direction-specific transform
    switch (direction) {
      case "up":
        element.style.transform = "translateY(20px)";
        break;
      case "down":
        element.style.transform = "translateY(-20px)";
        break;
      case "left":
        element.style.transform = "translateX(20px)";
        break;
      case "right":
        element.style.transform = "translateX(-20px)";
        break;
    }

    // Setup Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            element.style.opacity = "1";
            element.style.transform = "translate(0, 0)";
            
            if (once) observer.disconnect();
          } else if (!once) {
            // Reset styles when element is out of view
            element.style.opacity = "0";
            switch (direction) {
              case "up":
                element.style.transform = "translateY(20px)";
                break;
              case "down":
                element.style.transform = "translateY(-20px)";
                break;
              case "left":
                element.style.transform = "translateX(20px)";
                break;
              case "right":
                element.style.transform = "translateX(-20px)";
                break;
            }
          }
        });
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [direction, delay, duration, once, threshold]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

export default Reveal;