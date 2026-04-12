import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useRole } from './RoleContext';
import { hrService, hrServiceMode } from '../services/hrService';
import { buildEmptyHrData, buildInitialHrData } from '../services/hrDataStorage';

const HrDataContext = createContext(null);

export function HrDataProvider({ children }) {
  const { isAuthenticated, token, role } = useRole();
  const [data, setData] = useState(() =>
    hrServiceMode === 'http' ? buildEmptyHrData() : buildInitialHrData(),
  );
  const [isHydrated, setIsHydrated] = useState(hrServiceMode !== 'http');
  const [hydrationError, setHydrationError] = useState('');

  useEffect(() => {
    let active = true;

    async function hydrate() {
      if (active && hrServiceMode === 'http') {
        setIsHydrated(false);
        setHydrationError('');
      }

      if (hrServiceMode === 'http' && !isAuthenticated) {
        if (active) {
          setData(buildEmptyHrData());
          setIsHydrated(true);
          setHydrationError('');
        }
        return;
      }

      try {
          const snapshot = await hrService.dashboard.getSnapshot(role);

        if (active) {
          setData(snapshot);
          setIsHydrated(true);
          setHydrationError('');
        }
      } catch (error) {
        if (active) {
          setData(hrServiceMode === 'http' ? buildEmptyHrData() : buildInitialHrData());
          setIsHydrated(true);
          setHydrationError(error.message || 'Gagal memuat data HR.');
        }
      }
    }

    hydrate();

    return () => {
      active = false;
    };
  }, [isAuthenticated, role, token]);

  async function refreshSnapshot() {
    const snapshot = await hrService.dashboard.getSnapshot(role);
    setData(snapshot);
    setHydrationError('');
    return snapshot;
  }

  async function addEmployee(form) {
    await hrService.employees.create(form);
    return refreshSnapshot();
  }

  async function updateEmployee(id, updates) {
    await hrService.employees.update(id, updates);
    return refreshSnapshot();
  }

  async function deleteEmployee(id) {
    await hrService.employees.remove(id);
    return refreshSnapshot();
  }

  async function exportEmployeesCsv() {
    return hrService.employees.exportCsv?.();
  }

  async function saveDepartment(item) {
    await hrService.master.saveDepartment(item);
    return refreshSnapshot();
  }

  async function deleteDepartment(id) {
    await hrService.master.deleteDepartment(id);
    return refreshSnapshot();
  }

  async function savePosition(item) {
    await hrService.master.savePosition(item);
    return refreshSnapshot();
  }

  async function deletePosition(id) {
    await hrService.master.deletePosition(id);
    return refreshSnapshot();
  }

  async function clockIn() {
    const result = await hrService.attendance.clockIn();
    await refreshSnapshot();
    return result;
  }

  async function clockOut() {
    const result = await hrService.attendance.clockOut();
    await refreshSnapshot();
    return result;
  }

  async function exportAttendanceCsv() {
    return hrService.attendance.exportCsv?.();
  }

  async function createLeaveRequest(form) {
    await hrService.leaves.createEmployeeRequest(form);
    return refreshSnapshot();
  }

  async function updateLeaveStatus(id, status) {
    await hrService.leaves.updateAdminRequestStatus(id, status);
    return refreshSnapshot();
  }

  async function resetHrData() {
    const resetData = await hrService.system.reset();
    setData(resetData);
    return resetData;
  }

  const value = useMemo(
    () => ({
      ...data,
      isHydrated,
      hydrationError,
      dataSourceMode: hrServiceMode,
      refreshSnapshot,
      addEmployee,
      updateEmployee,
      deleteEmployee,
      exportEmployeesCsv,
      saveDepartment,
      deleteDepartment,
      savePosition,
      deletePosition,
      clockIn,
      clockOut,
      exportAttendanceCsv,
      createLeaveRequest,
      updateLeaveStatus,
      resetHrData,
    }),
    [data, hydrationError, isHydrated],
  );

  return <HrDataContext.Provider value={value}>{children}</HrDataContext.Provider>;
}

export function useHrData() {
  const context = useContext(HrDataContext);

  if (!context) {
    throw new Error('useHrData harus digunakan di dalam HrDataProvider.');
  }

  return context;
}
