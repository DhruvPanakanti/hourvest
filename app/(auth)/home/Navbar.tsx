'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

interface NavItemProps {
  href: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
  isMobile?: boolean;
}

const NavItem = ({ href, label, isActive, onClick, isMobile }: NavItemProps) => (
  <Link 
    href={href}
    onClick={onClick}
    className={`px-3 py-2 rounded-lg transition-colors ${
      isActive 
        ? 'bg-purple-300/20 text-white' 
        : 'text-white hover:text-purple-300 hover:bg-black/40'
    } ${isMobile ? 'block w-full text-center mb-2' : ''} text-base-medium`}
  >
    {label}
  </Link>
);

const Navbar = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navItems = [
    { href: '#home', label: 'Home', id: 'home' },
    { href: '#about', label: 'About Us', id: 'about' },
    { href: '#explore', label: 'Explore', id: 'explore' },
    { href: '#difference', label: 'Why Choose Us', id: 'difference' },
    { href: '#team', label: 'Our Team', id: 'team' },
  ];

  const smoothScrollTo = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const navbarHeight = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  };

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    smoothScrollTo(id);
    
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  // Rest of the existing useEffect hooks remain the same

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary-500/20 backdrop-blur-sm border-b border-secondary-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2">
            <Image
              src="/favicon.ico"
              alt="Ambrosia Logo"
              width={36}
              height={36}
              className="sm:w-12 sm:h-12"
            />
            <h1 className="text-white text-heading4-medium">Hourvest</h1>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="text-white p-2 rounded-md bg-primary-500/20 backdrop-blur-sm hover:bg-black/40 text-base-medium"
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop Navigation Items */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4 bg-black/30 px-4 lg:px-6 py-2 rounded-full backdrop-blur-sm">
            {navItems.map((item) => (
              <NavItem
                key={item.id}
                href={item.href}
                label={item.label}
                isActive={activeSection === item.id}
                onClick={() => handleNavClick(item.id)}
              />
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:block">
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <div className="flex items-center space-x-2 lg:space-x-4">
                <Link href="/sign-in">
                  <span className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 lg:px-4 lg:py-2 rounded-lg transition-colors font-medium cursor-pointer text-base-semibold">
                    Sign In
                  </span>
                </Link>
                <Link href="/sign-up">
                  <span className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 lg:px-4 lg:py-2 rounded-lg transition-colors font-medium cursor-pointer text-base-semibold">
                    Sign Up
                  </span>
                </Link>
              </div>
            </SignedOut>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-primary-500/20 backdrop-blur-md">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navItems.map((item) => (
              <NavItem
                key={item.id}
                href={item.href}
                label={item.label}
                isActive={activeSection === item.id}
                onClick={() => handleNavClick(item.id)}
                isMobile={true}
              />
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <SignedIn>
                <div className="flex justify-center">
                  <UserButton />
                </div>
              </SignedIn>
              <SignedOut>
                <Link href="/sign-in">
                  <span className="block w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors font-medium cursor-pointer text-center text-base-semibold">
                    Sign In
                  </span>
                </Link>
                <Link href="/sign-up">
                  <span className="block w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors font-medium cursor-pointer text-center text-base-semibold">
                    Sign Up
                  </span>
                </Link>
              </SignedOut>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;