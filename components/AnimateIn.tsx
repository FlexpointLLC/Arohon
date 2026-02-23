'use client';

import { motion } from 'framer-motion';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

/** Shared config for scroll-triggered appear animations. Use with motion.* elements. */
export const appearTransition = { duration: 0.5, ease: [0.22, 1, 0.36, 1] } as const;
/** amount: 0.25 = animate when 25% of element is in view (scroll-triggered, avoids all-at-once on large screens) */
export const appearViewport = { once: true, amount: 0.25 } as const;
export const fadeUpVariants = fadeUp;
export const fadeInVariants = fadeIn;

interface AnimateInProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof typeof motion;
  variant?: 'fadeUp' | 'fadeIn';
  delay?: number;
  once?: boolean;
}

export function AnimateIn({
  children,
  className,
  as: Tag = 'div',
  variant = 'fadeUp',
  delay = 0,
  once = true,
}: AnimateInProps) {
  const MotionTag = motion[Tag as keyof typeof motion] || motion.div;
  const v = variant === 'fadeUp' ? fadeUp : fadeIn;

  return (
    <MotionTag
      className={className}
      initial="initial"
      whileInView="animate"
      viewport={{ once, margin: '-48px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
      variants={v}
    >
      {children}
    </MotionTag>
  );
}
