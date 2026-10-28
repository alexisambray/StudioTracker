import { useState, useEffect } from 'react';
import type { Package, ClassLog } from './types';

const PACKAGES_KEY = 'wellness_packages';
const LOGS_KEY = 'wellness_logs';
const ONBOARDED_KEY = 'wellness_onboarded';

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function useStore() {
  const [packages, setPackages] = useState<Package[]>(() => load(PACKAGES_KEY, []));
  const [logs, setLogs] = useState<ClassLog[]>(() => load(LOGS_KEY, []));
  const [onboarded, setOnboarded] = useState<boolean>(() => load(ONBOARDED_KEY, false));

  useEffect(() => { save(PACKAGES_KEY, packages); }, [packages]);
  useEffect(() => { save(LOGS_KEY, logs); }, [logs]);
  useEffect(() => { save(ONBOARDED_KEY, onboarded); }, [onboarded]);

  function addPackage(pkg: Package) {
    setPackages(prev => [pkg, ...prev]);
  }

  function updatePackage(id: string, updates: Partial<Package>) {
    setPackages(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }

  function archivePackage(id: string) {
    setPackages(prev => prev.map(pkg =>
      pkg.id === id ? { ...pkg, archivedAt: new Date().toISOString() } : pkg
    ));
  }

  function addLog(log: ClassLog) {
    setLogs(prev => [log, ...prev]);
    if (log.packageId) {
      setPackages(prev => prev.map(p =>
        p.id === log.packageId ? { ...p, remainingClasses: Math.max(0, p.remainingClasses - 1) } : p
      ));
    }
  }

  function removeLog(id: string) {
    const log = logs.find(l => l.id === id);
    setLogs(prev => prev.filter(l => l.id !== id));
    if (log?.packageId) {
      setPackages(prev => prev.map(p =>
        p.id === log.packageId ? { ...p, remainingClasses: p.remainingClasses + 1 } : p
      ));
    }
  }

  function updateLog(updatedLog: ClassLog) {
    const previousLog = logs.find(log => log.id === updatedLog.id);
    if (!previousLog) return;

    setLogs(prev => prev.map(log => log.id === updatedLog.id ? updatedLog : log));

    if (previousLog.packageId !== updatedLog.packageId) {
      setPackages(prev => prev.map(pkg => {
        if (pkg.id === previousLog.packageId) {
          return {
            ...pkg,
            remainingClasses: Math.min(pkg.totalClasses, pkg.remainingClasses + 1),
          };
        }
        if (pkg.id === updatedLog.packageId) {
          return {
            ...pkg,
            remainingClasses: Math.max(0, pkg.remainingClasses - 1),
          };
        }
        return pkg;
      }));
    }
  }

  function clearLogs() {
    setPackages(prev => prev.map(pkg => {
      const restoredClasses = logs.filter(log => log.packageId === pkg.id).length;
      return {
        ...pkg,
        remainingClasses: Math.min(pkg.totalClasses, pkg.remainingClasses + restoredClasses),
      };
    }));
    setLogs([]);
  }

  function completeOnboarding() {
    setOnboarded(true);
  }

  return {
    packages, logs, onboarded,
    addPackage, updatePackage, archivePackage,
    addLog, updateLog, removeLog, clearLogs,
    completeOnboarding,
  };
}
