'use client';

import { useState, useCallback } from 'react';

interface ScanProgress {
  status: string;
  progress: number;
  currentStep: string;
}

export function useScan() {
  const [scanId, setScanId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startScan = useCallback(async (url: string) => {
    setIsLoading(true);
    setError(null);
    setScanId(null);

    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to start scan');
      }

      const data = await response.json();
      setScanId(data.scanId);
      return data.scanId;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to start scan';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { scanId, isLoading, error, startScan };
}
