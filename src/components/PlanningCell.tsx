import React from 'react';

interface PlanningCellProps {
  cellKey: string;
  desiderataType: 'primary' | 'secondary' | null;
  onMouseDown: (key: string) => void;
  onMouseEnter: (key: string) => void;
  isGrayedOut: boolean;
  readOnly?: boolean;
}

const PlanningCell: React.FC<PlanningCellProps> = ({
  cellKey,
  desiderataType,
  onMouseDown,
  onMouseEnter,
  isGrayedOut,
  readOnly = false
}) => {
  const handleMouseDown = () => {
    if (!readOnly) {
      onMouseDown(cellKey);
    }
  };

  const handleMouseEnter = () => {
    if (!readOnly) {
      onMouseEnter(cellKey);
    }
  };

  const getCellClasses = () => {
    const baseClasses = 'border px-2 py-1 text-center select-none transition-colors';
    const cursorClasses = readOnly ? 'cursor-default' : 'cursor-pointer';
    
    let colorClasses = '';
    if (desiderataType === 'primary') {
      colorClasses = readOnly ? 'bg-red-100' : 'bg-red-100 hover:bg-red-200';
    } else if (desiderataType === 'secondary') {
      colorClasses = readOnly ? 'bg-orange-100' : 'bg-orange-100 hover:bg-orange-200';
    } else if (isGrayedOut) {
      colorClasses = 'bg-gray-100';
    } else {
      colorClasses = readOnly ? '' : 'hover:bg-gray-50';
    }

    return `${baseClasses} ${colorClasses} ${cursorClasses}`;
  };

  return (
    <td
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      className={getCellClasses()}
    >
      {desiderataType === 'primary' && 'P'}
      {desiderataType === 'secondary' && 'S'}
    </td>
  );
};

export default React.memo(PlanningCell);