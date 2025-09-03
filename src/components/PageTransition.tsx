import React from 'react';
import { motion } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
  isVisible: boolean;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -20,
  }
};

const pageTransition = {
  duration: 0.3,
  ease: "easeInOut"
};

const PageTransition: React.FC<PageTransitionProps> = ({ children, isVisible }) => {
  return (
    <motion.div
      initial="initial"
      animate={isVisible ? "in" : "out"}
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;