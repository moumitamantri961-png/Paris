/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';

interface MarqueeProps {
  text?: string;
}

export function Marquee({ text }: MarqueeProps) {
  if (!text) return null;

  return (
    <div className="bg-primary text-white py-2 overflow-hidden whitespace-nowrap border-y border-white/10">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="inline-block"
      >
        <span className="text-sm font-medium mr-12">{text}</span>
        <span className="text-sm font-medium mr-12">{text}</span>
        <span className="text-sm font-medium mr-12">{text}</span>
        <span className="text-sm font-medium mr-12">{text}</span>
      </motion.div>
    </div>
  );
}
