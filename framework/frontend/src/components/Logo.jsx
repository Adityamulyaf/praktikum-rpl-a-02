import React from 'react';
import logoUrl from '../assets/logo-halombg.png';

/**
 * HaloMBG Logo Component
 * Renders the brand logo from assets/logo-halombg.png cropped as a circle with transparent background
 */
export default function Logo({ size = 32, className = '' }) {
  return (
    <img
      src={logoUrl}
      alt="HaloMBG Logo"
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        objectFit: 'cover',
        display: 'inline-block',
        verticalAlign: 'middle',
        flexShrink: 0,
        backgroundColor: 'transparent',
      }}
      className={className}
    />
  );
}
