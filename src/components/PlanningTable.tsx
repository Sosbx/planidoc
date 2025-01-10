import React, { useState, useCallback, useMemo, forwardRef, useImperativeHandle } from 'react';
import DesiderataControls from './DesiderataControls';
import Toast from './Toast';
import DesktopTable from './planning/DesktopTable';
import MobileTable from './planning/MobileTable';
import { useSelections } from '../hooks/useSelections';
import { useAuth } from '../hooks/useAuth';
import { useUnsavedChanges } from '../hooks/useUnsavedChanges';
import LoadingSpinner from './common/LoadingSpinner';

interface PlanningTableProps {
  startDate: Date;
  endDate: Date;
  primaryLimit: number;
  secondaryLimit: number;
  isDeadlineExpired?: boolean;
}

export interface PlanningTableRef {
  saveSelections: () => Promise<void>;
}

const PlanningTable = forwardRef<PlanningTableRef, PlanningTableProps>(({
  startDate,
  endDate,
  primaryLimit,
  secondaryLimit,
  isDeadlineExpired = false
}, ref) => {
  const [toast, setToast] = useState({ visible: false, message: '', type: 'error' as 'error' | 'success' });
  const { user } = useAuth();

  const handleLimitExceeded = useCallback((message: string) => {
    setToast({ visible: true, message, type: 'error' });
  }, []);

  const selectionsConfig = useMemo(() => ({
    startDate,
    endDate,
    primaryLimit,
    secondaryLimit,
    onLimitExceeded: handleLimitExceeded
  }), [startDate, endDate, primaryLimit, secondaryLimit, handleLimitExceeded]);

  const {
    activeDesiderata,
    setActiveDesiderata,
    selections,
    primaryPercentage,
    secondaryPercentage,
    handleCellMouseDown,
    handleCellMouseEnter,
    resetSelections,
    saveSelections,
    isLoading,
    hasUnsavedChanges,
    isSaving
  } = useSelections(selectionsConfig);

  useUnsavedChanges(hasUnsavedChanges);

  useImperativeHandle(ref, () => ({
    saveSelections
  }), [saveSelections]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <Toast 
        message={toast.message}
        isVisible={toast.visible}
        type={toast.type}
        onClose={() => setToast(prev => ({ ...prev, visible: false }))}
      />

      <DesiderataControls
        activeDesiderata={activeDesiderata}
        setActiveDesiderata={setActiveDesiderata}
        primaryPercentage={primaryPercentage}
        secondaryPercentage={secondaryPercentage}
        primaryLimit={primaryLimit}
        secondaryLimit={secondaryLimit}
        isDeadlineExpired={isDeadlineExpired}
        isSaving={isSaving}
        onReset={resetSelections}
      />

      <div className="hidden md:block">
        <DesktopTable
          startDate={startDate}
          endDate={endDate}
          selections={selections}
          onCellMouseDown={handleCellMouseDown}
          onCellMouseEnter={handleCellMouseEnter}
        />
      </div>

      <div className="md:hidden">
        <MobileTable
          startDate={startDate}
          endDate={endDate}
          selections={selections}
          onCellMouseDown={handleCellMouseDown}
          onCellMouseEnter={handleCellMouseEnter}
        />
      </div>
    </div>
  );
});

PlanningTable.displayName = 'PlanningTable';

export default React.memo(PlanningTable);