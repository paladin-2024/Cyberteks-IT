import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Products from './pages/Products';
import Careers from './pages/Careers';
import Contact from './pages/Contact';
import GetStarted from './pages/GetStarted';
import RemoteITSupport from './pages/services/RemoteITSupport';
import AccessControl from './pages/services/AccessControl';
import CCTV from './pages/services/CCTV';
import VOIP from './pages/services/VOIP';
import ICTSkilling from './pages/services/ICTSkilling';
import SoftwareAI from './pages/services/SoftwareAI';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';

const AppRoutes = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/remote-it-support" element={<RemoteITSupport />} />
          <Route path="/services/access-control" element={<AccessControl />} />
          <Route path="/services/cctv" element={<CCTV />} />
          <Route path="/services/voip" element={<VOIP />} />
          <Route path="/services/ict-skilling" element={<ICTSkilling />} />
          <Route path="/services/software-ai" element={<SoftwareAI />} />
          <Route path="/products" element={<Products />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/get-started" element={<GetStarted />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <Layout>
      <AppRoutes />
    </Layout>
  );
};

export default App;
