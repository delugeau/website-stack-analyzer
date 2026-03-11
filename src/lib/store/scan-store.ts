import { EventEmitter } from 'events';
import type { ScanState, ScanStatus, ScanResults } from '../types/scan';

class ScanStoreClass extends EventEmitter {
  private scans = new Map<string, ScanState>();

  create(scanId: string, url: string): ScanState {
    const state: ScanState = {
      scanId,
      url,
      status: 'queued',
      progress: 0,
      currentStep: 'Queued',
      results: null,
      error: null,
      startedAt: Date.now(),
      completedAt: null,
    };
    this.scans.set(scanId, state);
    return state;
  }

  get(scanId: string): ScanState | undefined {
    return this.scans.get(scanId);
  }

  updateProgress(scanId: string, status: ScanStatus, progress: number, currentStep: string): void {
    const state = this.scans.get(scanId);
    if (!state) return;
    state.status = status;
    state.progress = progress;
    state.currentStep = currentStep;
    this.emit(`progress:${scanId}`, { status, progress, currentStep });
  }

  complete(scanId: string, results: ScanResults): void {
    const state = this.scans.get(scanId);
    if (!state) return;
    state.status = 'completed';
    state.progress = 100;
    state.currentStep = 'Completed';
    state.results = results;
    state.completedAt = Date.now();
    this.emit(`progress:${scanId}`, { status: 'completed', progress: 100, currentStep: 'Completed' });
    this.emit(`complete:${scanId}`, results);
  }

  setError(scanId: string, error: string): void {
    const state = this.scans.get(scanId);
    if (!state) return;
    state.status = 'error';
    state.error = error;
    state.completedAt = Date.now();
    this.emit(`progress:${scanId}`, { status: 'error', progress: state.progress, currentStep: error });
    this.emit(`error:${scanId}`, error);
  }
}

export const scanStore = new ScanStoreClass();
