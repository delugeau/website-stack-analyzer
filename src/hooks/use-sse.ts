'use client';

import { useState, useEffect, useRef } from 'react';
import type { ScanResults } from '@/lib/types/scan';

interface SSEState {
  status: string;
  progress: number;
  currentStep: string;
  results: ScanResults | null;
  error: string | null;
  isConnected: boolean;
}

export function useSSE(scanId: string | null): SSEState {
  const [state, setState] = useState<SSEState>({
    status: 'queued',
    progress: 0,
    currentStep: 'Waiting...',
    results: null,
    error: null,
    isConnected: false,
  });

  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!scanId) return;

    const es = new EventSource(`/api/scan/${scanId}/stream`);
    eventSourceRef.current = es;

    setState((prev) => ({ ...prev, isConnected: true }));

    es.addEventListener('progress', (event) => {
      const data = JSON.parse(event.data);
      setState((prev) => ({
        ...prev,
        status: data.status,
        progress: data.progress,
        currentStep: data.currentStep,
      }));
    });

    es.addEventListener('complete', (event) => {
      const data = JSON.parse(event.data);
      setState((prev) => ({
        ...prev,
        status: 'completed',
        progress: 100,
        currentStep: 'Completed',
        results: data.results,
        isConnected: false,
      }));
      es.close();
    });

    es.addEventListener('error', (event) => {
      if (event instanceof MessageEvent) {
        const data = JSON.parse(event.data);
        setState((prev) => ({
          ...prev,
          status: 'error',
          error: data.message,
          isConnected: false,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          isConnected: false,
        }));
      }
      es.close();
    });

    es.onerror = () => {
      setState((prev) => ({ ...prev, isConnected: false }));
      es.close();
    };

    return () => {
      es.close();
      eventSourceRef.current = null;
    };
  }, [scanId]);

  return state;
}
