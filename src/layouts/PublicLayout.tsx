import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Menu, X } from 'lucide-react';
import { BackgroundParticles } from '../components/ui/BackgroundParticles';
import { Background3D } from '../components/3d/Background3D';
import Lenis from 'lenis';

const Navbar: React.FC<{
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
}> = ({ isMobileMenuOpen, toggleMobileMenu, closeMobileMenu }) => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      scrolled ? 'bg-gradient-to-b from-black/60 to-transparent py-4' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-8 lg:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => { navigate('/'); closeMobileMenu(); }}>
          <img src="/Logo.jpeg" alt="DextroSage Logo" className="w-8 h-8 rounded-lg object-contain" />
          <span className="hidden sm:block text-lg font-bold tracking-tight text-white uppercase drop-shadow-md">DextroSage</span>
        </div>
        {/* The floating menu capsule */}
        <div className={`hidden md:flex gap-12 items-center px-10 py-3.5 rounded-full border transition-colors duration-500 ${
          scrolled ? 'bg-black/50 backdrop-blur-3xl border-white/10 shadow-[0_32px_64px_rgba(0,0,0,0.4)]' : 'bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-2xl border-white/10 shadow-[0_32px_64px_rgba(0,0,0,0.2)]'
        }`}>
          {['About Us', 'Services', 'Work', 'Contact'].map((item) => {
            const path = item === 'About Us' ? '#about' : `#${item.toLowerCase()}`;
            return (
              <a key={item} href={path} className="text-[18px] font-[500] text-gray-300 hover:text-white transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-white hover:after:w-full after:transition-all after:duration-300">
                {item}
              </a>
            );
          })}
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-3 text-xs uppercase tracking-tight font-bold bg-white/5 hover:bg-white/10 text-white backdrop-blur-xl rounded-full transition-all border border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.2)] flex items-center gap-2 group"
          >
            Login <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={toggleMobileMenu}
            className="md:hidden ml-2 p-2 rounded-lg text-gray-400 hover:bg-white/10 hover:text-white transition-colors border border-white/5"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export const PublicLayout: React.FC = () => {
  const navigate = useNavigate();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    let rafId: number;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Intercept navbar link clicks for smooth scrolling
    const handleLinkClick = (e: MouseEvent) => {
      try {
        const target = (e.target as HTMLElement).closest('a');
        if (target && target.getAttribute('href')?.startsWith('#')) {
          e.preventDefault();
          const href = target.getAttribute('href');
          if (href) {
            let el: HTMLElement | null = null;
            try {
              el = document.querySelector(href) as HTMLElement;
            } catch (e) {
              console.warn('Invalid selector:', href);
            }
            
            if (el) {
              lenis.scrollTo(el, { offset: -50 });
            } else {
              navigate('/' + href);
            }
          }
        }
      } catch (err) {
        console.error('Error handling link click:', err);
      }
    };
    
    document.addEventListener('click', handleLinkClick);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      document.removeEventListener('click', handleLinkClick);
    };
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_60%_50%,_rgba(15,23,42,0.8),_rgba(2,6,23,1)_60%,_black_100%)] flex flex-col font-sans selection:bg-blue-500/30 relative">
      <Background3D />
      <BackgroundParticles />
      
      {/* Navigation */}
      <Navbar 
        isMobileMenuOpen={isMobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
        closeMobileMenu={closeMobileMenu}
      />

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-[#020617] pt-24 px-6 md:hidden overflow-y-auto"
          >
            <div className="flex flex-col gap-6 py-8">
              {['About Us', 'Services', 'Work', 'Contact'].map((item) => {
                const path = item === 'About Us' ? '#about' : `#${item.toLowerCase()}`;
                return (
                  <a 
                    key={item} 
                    href={path}
                    onClick={closeMobileMenu}
                    className="text-lg font-light tracking-wider text-gray-300 hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                );
              })}
              <button
                onClick={() => { closeMobileMenu(); navigate('/login'); }}
                className="text-center w-full py-4 mt-4 text-sm font-semibold bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl transition-all"
              >
                Login
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 relative z-10 w-full">
        <Outlet />
      </div>
    </div>
  );
};
