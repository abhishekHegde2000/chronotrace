"use client";

import { useEffect } from 'react';
import { initClientLogger } from './index';

export function ChronotraceProvider() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      initClientLogger();
    }
  }, []);

  return null;
}
