import React, { memo } from 'react';
import { Percent, RotateCcw } from 'lucide-react';

interface DesiderataControlsProps {
  activeDesiderata: 'primary' | 'secondary' | null;
  setActiveDesiderata: (type: 'primary' | 'secondary' | null) => void;
  primaryPercentage: number;
  secondaryPercentage: number;
  primaryLimit: number;
  secondaryLimit: number;
  isDeadlineExpired?: boolean;
  isSaving?: boolean;
  onReset: () => void;
}

const DesiderataControls = memo<DesiderataControlsProps>(({
  activeDesiderata,
  setActiveDesiderata,
  primaryPercentage,
  secondaryPercentage,
  primaryLimit,
  secondaryLimit,
  isDeadlineExpired = false,
  isSaving = false,
  onReset,
}) => {
  const handleTypeClick = React.useCallback((type: 'primary' | 'secondary') => {
    setActiveDesiderata(activeDesiderata === type ? null : type);
  }, [activeDesiderata, setActiveDesiderata]);

  const handleReset = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onReset();
  }, [onReset]);

  const isDisabled = isDeadlineExpired || isSaving;

  return (
    <div className="sticky top-0 bg-white z-10 p-3 md:p-4 shadow-md rounded-md mb-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex flex-wrap gap-2 sm:gap-4 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => handleTypeClick('primary')}
            disabled={isDisabled}
            className={`flex-1 sm:flex-none min-w-[140px] px-3 py-2 rounded-md text-sm md:text-base transition-colors
              ${isDisabled ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-500' :
              activeDesiderata === 'primary' ? 'bg-red-600 text-white' : 'bg-white text-red-600 border border-red-600 hover:bg-red-50'}`}
          >
            Desiderata Primaire
          </button>
          
          <button
            type="button"
            onClick={() => handleTypeClick('secondary')}
            disabled={isDisabled}
            className={`flex-1 sm:flex-none min-w-[140px] px-3 py-2 rounded-md text-sm md:text-base transition-colors
              ${isDisabled ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-500' :
              activeDesiderata === 'secondary' ? 'bg-orange-500 text-white' : 'bg-white text-orange-500 border border-orange-500 hover:bg-orange-50'}`}
          >
            Desiderata Secondaire
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={isDisabled}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm md:text-base transition-colors
              ${isDisabled ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-500' : 
              'border border-gray-300 hover:bg-gray-50'}`}
          >
            <RotateCcw className="h-4 w-4" />
            <span className="hidden sm:inline">Réinitialiser</span>
          </button>
        </div>
        
        <div className="flex flex-wrap gap-4 w-full sm:w-auto sm:ml-auto text-sm">
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-md">
            <Percent className="h-4 w-4 text-red-600 shrink-0" />
            <span>
              Primaire: <span className={`font-bold ${primaryPercentage > primaryLimit ? 'text-red-600' : ''}`}>
                {primaryPercentage.toFixed(1)}%
              </span>
              /{primaryLimit}%
            </span>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-md">
            <Percent className="h-4 w-4 text-orange-500 shrink-0" />
            <span>
              Secondaire: <span className={`font-bold ${secondaryPercentage > secondaryLimit ? 'text-red-600' : ''}`}>
                {secondaryPercentage.toFixed(1)}%
              </span>
              /{secondaryLimit}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

DesiderataControls.displayName = 'DesiderataControls';

export default DesiderataControls;