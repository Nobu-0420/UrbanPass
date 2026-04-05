'use client';

import { motion } from 'framer-motion';

const paths = [
  { d: 'M60 60 L20 20 L100 20 Z', fill: '#0f172a' },
  { d: 'M60 60 L100 20 L100 100 Z', fill: '#00CED1' },
  { d: 'M60 60 L100 100 L20 100 Z', fill: '#0f172a' },
  { d: 'M60 60 L20 100 L20 20 Z', fill: '#00CED1' },
];

export default function HeroLogo() {
  return (
    <motion.svg
      width="200"
      height="200"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-48 h-48 md:w-64 md:h-64 mx-auto"
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.07,
            delayChildren: 0.15,
          },
        },
      }}
    >
      {paths.map((path, i) => (
        <motion.path
          key={i}
          d={path.d}
          fill={path.fill}
          style={{ transformOrigin: '60px 60px' }}
          variants={{
            hidden: {
              opacity: 0,
              scale: 0,
            },
            visible: {
              opacity: 1,
              scale: [0, 1.12, 1],
              transition: {
                duration: 0.9,
                times: [0, 0.6, 1],
                ease: [0.22, 0.61, 0.36, 1],
              },
            },
          }}
        />
      ))}
    </motion.svg>
  );
}
