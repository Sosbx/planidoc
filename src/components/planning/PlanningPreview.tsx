import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import DesktopTable from './DesktopTable';
import MobileTable from './MobileTable';

interface PlanningPreviewProps {
  user: {
    firstName: string;
    lastName: string;
  };
  selections: Record<string, 'primary' | 'secondary' | null>;
  validatedAt: string;
  startDate: Date;
  endDate: Date;
}

const PlanningPreview: React.FC<PlanningPreviewProps> = ({
  user,
  selections,
  validatedAt,
  startDate,
  endDate,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Planning de {user.firstName} {user.lastName}
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Validé le {format(new Date(validatedAt), 'dd MMMM yyyy à HH:mm', { locale: fr })}
        </p>
      </div>

      <div className="hidden md:block">
        <DesktopTable
          startDate={startDate}
          endDate={endDate}
          selections={selections}
          onCellMouseDown={() => {}}
          onCellMouseEnter={() => {}}
          readOnly
        />
      </div>

      <div className="md:hidden">
        <MobileTable
          startDate={startDate}
          endDate={endDate}
          selections={selections}
          onCellMouseDown={() => {}}
          onCellMouseEnter={() => {}}
          readOnly
        />
      </div>
    </div>
  );
};

export default PlanningPreview;