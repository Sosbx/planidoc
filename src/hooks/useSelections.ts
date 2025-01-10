import { useState, useCallback, useEffect, useMemo } from 'react';
import { calculatePercentages, wouldExceedLimit } from '../utils/planningUtils';
import { useDesiderataState } from './useDesiderataState';
import { useDesiderata } from './useDesiderata';

interface UseSelectionsProps {
  startDate: Date;
  endDate: Date;
  primaryLimit: number;
  secondaryLimit: number;
  onLimitExceeded: (message: string) => void;
}

export const useSelections = ({
  startDate,
  endDate,
  primaryLimit,
  secondaryLimit,
  onLimitExceeded
}: UseSelectionsProps) => {
  const { selections: savedSelections, isLoading } = useDesiderataState();
  const { saveDesiderata, isSaving } = useDesiderata();
  const [activeDesiderata, setActiveDesiderata] = useState<'primary' | 'secondary' | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localSelections, setLocalSelections] = useState<Record<string, 'primary' | 'secondary' | null>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setLocalSelections(savedSelections);
    }
  }, [savedSelections, isLoading]);

  const percentages = useMemo(() => 
    calculatePercentages(localSelections, startDate, endDate),
    [localSelections, startDate, endDate]
  );

  const updateSelection = useCallback((dateKey: string, action: 'select' | 'deselect') => {
    if (!activeDesiderata) return;

    setLocalSelections(prev => {
      const newSelections = { ...prev };
      
      if (action === 'select') {
        if (activeDesiderata === prev[dateKey]) return prev;
        newSelections[dateKey] = activeDesiderata;
        
        const limit = activeDesiderata === 'primary' ? primaryLimit : secondaryLimit;
        if (wouldExceedLimit(newSelections, startDate, endDate, activeDesiderata, limit)) {
          onLimitExceeded(`Limite de ${limit}% atteinte`);
          return prev;
        }
      } else {
        if (!prev[dateKey]) return prev;
        delete newSelections[dateKey];
      }

      setHasUnsavedChanges(true);
      return newSelections;
    });
  }, [activeDesiderata, startDate, endDate, primaryLimit, secondaryLimit, onLimitExceeded]);

  const handleCellMouseDown = useCallback((dateKey: string) => {
    if (!activeDesiderata) return;
    setIsDragging(true);
    const isSelected = localSelections[dateKey] === activeDesiderata;
    updateSelection(dateKey, isSelected ? 'deselect' : 'select');
  }, [activeDesiderata, localSelections, updateSelection]);

  const handleCellMouseEnter = useCallback((dateKey: string) => {
    if (!isDragging || !activeDesiderata) return;
    const isSelected = localSelections[dateKey] === activeDesiderata;
    if (!isSelected) {
      updateSelection(dateKey, 'select');
    }
  }, [isDragging, activeDesiderata, localSelections, updateSelection]);

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  const resetSelections = useCallback(async () => {
    setLocalSelections({});
    setActiveDesiderata(null);
    setHasUnsavedChanges(false);
    await saveDesiderata({});
  }, [saveDesiderata]);

  const saveSelections = useCallback(async () => {
    if (!hasUnsavedChanges) return;
    await saveDesiderata(localSelections);
    setHasUnsavedChanges(false);
  }, [saveDesiderata, localSelections, hasUnsavedChanges]);

  return {
    activeDesiderata,
    setActiveDesiderata,
    selections: localSelections,
    primaryPercentage: percentages.primary,
    secondaryPercentage: percentages.secondary,
    handleCellMouseDown,
    handleCellMouseEnter,
    resetSelections,
    saveSelections,
    isLoading,
    hasUnsavedChanges,
    isSaving
  };
};