import React, { useState, useEffect } from 'react';
import { Gamepad2, Menu, X, CalendarCheck } from 'lucide-react';

interface NavBarProps {
  currentRoute: string;
  setRoute: (route: string) => void;
}

export default function NavBar({ currentRoute, setRoute }: NavBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Stations', href: '#stations' },
    { name: 'Games', href: '#games' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Location', href: '#location' },
    { name: 'Reviews', href: '#reviews' },
  ];

  // Monitor active scroll section when on the home route
  useEffect(() => {
    if (currentRoute !== '/') return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120; // offset for sticky nav

      for (const link of navLinks) {
        const elementId = link.href.substring(1);
        const element = document.getElementById(elementId);
        if (element) {
          const top = element.getBoundingClientRect().top + window.scrollY;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(elementId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentRoute]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const wasOpen = isOpen;
    setIsOpen(false);

    const sectionId = href.substring(1);

    if (currentRoute !== '/') {
      // Go back to landing page first, then wait for page exit transition (350ms) and scroll
      setRoute('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const offsetTop = element.getBoundingClientRect().top + window.scrollY - 80; // height of navbar
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth',
          });
        }
      }, 400);
    } else {
      // Small timeout to allow the menu closing state to propagate if it was open (prevent layout race)
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const offsetTop = element.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth',
          });
          setActiveSection(sectionId);
          // Update URL hash without jumping
          window.history.pushState(null, '', href);
        }
      }, wasOpen ? 150 : 0);
    }
  };

  return (
    <nav 
      id="navbar-sticky"
      className="sticky top-0 z-50 w-full border-b border-cyber-purple/20 bg-cyber-dark/85 backdrop-blur-sm transition-all duration-300"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          
          {/* Logo and Cafe Brand */}
          <button 
            id="nav-logo-btn"
            onClick={() => setRoute('/')}
            className="flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-cyber-purple focus:ring-offset-2 focus:ring-offset-cyber-dark rounded-md p-1 group text-left cursor-pointer"
            aria-label="GameZ Home"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyber-purple to-cyber-cyan text-white shadow-lg shadow-cyber-purple/20 group-hover:scale-105 transition-transform duration-200">
              <Gamepad2 className="h-5 w-5" />
            </div>
            <div>
              <span className="font-display text-xl font-bold tracking-wider text-white">
                GAME<span className="text-cyber-purple">Z</span>
              </span>
              <span className="block font-mono text-[9px] uppercase tracking-widest text-cyber-cyan">
                MANGALURU
              </span>
            </div>
          </button>

          <div className="hidden lg:flex items-center gap-3">
            {navLinks.map((link) => {
              const sectionId = link.href.substring(1);
              const isActive = currentRoute === '/' && activeSection === sectionId;
              
              return (
                <a
                  key={link.name}
                  id={`nav-link-${sectionId}`}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`relative px-2.5 py-1.5 text-sm font-semibold tracking-wide transition-colors duration-200 focus:outline-none ${
                    isActive 
                      ? 'text-cyber-purple' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <span className="relative z-10">{link.name}</span>
                  <span 
                    className={`absolute -bottom-1 left-1 right-1 h-[2.5px] bg-cyber-purple rounded-full transition-all duration-300 ${
                      isActive 
                        ? 'scale-x-100 opacity-100 shadow-[0_0_8px_rgba(139,92,246,0.8)]' 
                        : 'scale-x-0 opacity-0'
                    }`}
                  />
                </a>
              );
            })}
          </div>

          {/* CTA "Book Now" Button */}
          <div className="hidden sm:block">
            <button
              id="nav-book-now-btn"
              onClick={() => setRoute('/book')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-display text-sm font-semibold tracking-wide shadow-md transition-all duration-300 hover:scale-[1.05] focus:outline-none focus:ring-2 focus:ring-cyber-cyan focus:ring-offset-2 focus:ring-offset-cyber-dark cursor-pointer ${
                currentRoute === '/book'
                  ? 'bg-cyber-gray text-cyber-cyan border border-cyber-cyan/30'
                  : 'bg-gradient-to-r from-cyber-purple to-cyber-cyan text-white shadow-cyber-purple/15 hover:shadow-cyber-purple/25 animate-cta-glow'
              }`}
            >
              <CalendarCheck className="h-4 w-4" />
              Book Now
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center gap-4">
            <button
              id="mobile-book-now-btn"
              onClick={() => setRoute('/book')}
              className={`sm:hidden flex items-center justify-center p-2.5 rounded-xl text-white cursor-pointer ${
                currentRoute === '/book'
                  ? 'bg-cyber-gray text-cyber-cyan border border-cyber-cyan/30'
                  : 'bg-gradient-to-r from-cyber-purple to-cyber-cyan animate-cta-glow-compact'
              }`}
              aria-label="Book Reservation"
            >
              <CalendarCheck className="h-5 w-5" />
            </button>
            <button
              id="mobile-hamburger-btn"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-xl p-2.5 text-gray-400 hover:bg-cyber-lightgray hover:text-white focus:outline-none focus:ring-2 focus:ring-cyber-purple"
              aria-expanded={isOpen}
              aria-label="Toggle Main Menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {isOpen && (
        <div 
          id="mobile-drawer-menu"
          className="absolute left-0 right-0 top-full lg:hidden border-b border-cyber-purple/20 bg-cyber-dark/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-200 shadow-2xl z-50"
        >
          {navLinks.map((link) => {
            const sectionId = link.href.substring(1);
            const isActive = currentRoute === '/' && activeSection === sectionId;

            return (
              <a
                key={link.name}
                id={`mobile-nav-link-${sectionId}`}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`block px-4 py-3 text-base font-medium rounded-xl transition-colors ${
                  isActive
                    ? 'text-cyber-purple bg-cyber-purple/10 font-semibold'
                    : 'text-gray-300 hover:text-white hover:bg-cyber-lightgray'
                }`}
              >
                {link.name}
              </a>
            );
          })}
          <div className="pt-4 border-t border-cyber-purple/10">
            <button
              id="mobile-drawer-book-btn"
              onClick={() => {
                setIsOpen(false);
                setRoute('/book');
              }}
              className="flex w-full items-center justify-center gap-2 bg-gradient-to-r from-cyber-purple to-cyber-cyan text-white py-3 rounded-xl font-display font-semibold shadow-lg shadow-cyber-purple/10 cursor-pointer animate-cta-glow"
            >
              <CalendarCheck className="h-4 w-4" />
              Book Reservation Now
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
