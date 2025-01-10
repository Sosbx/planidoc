import React from 'react';
import { format, isSameMonth } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getDaysArray, getMonthsInRange, isWeekend } from '../../utils/dateUtils';
import PlanningCell from '../PlanningCell';

interface MobileTableProps {
  startDate: Date;
  endDate: Date;
  selections: Record<string, 'primary' | 'secondary' | null>;
  onCellMouseDown: (key: string) => void;
  onCellMouseEnter: (key: string) => void;
}

const MobileTable: React.FC<MobileTableProps> = ({
  startDate,
  endDate,
  selections,
  onCellMouseDown,
  onCellMouseEnter
}) => {
  const days = getDaysArray(startDate, endDate);
  const months = getMonthsInRange(startDate, endDate);

  return (
    <div className="space-y-8">
      {months.map((month, monthIndex) => {
        const daysInMonth = days.filter(day => isSameMonth(day, month));
        
        return (
          <div key={monthIndex} className="bg-white rounded-lg shadow">
            <div className="bg-gray-50 px-4 py-2 rounded-t-lg border-b">
              <h3 className="text-lg font-medium text-gray-900">
                {format(month, 'MMMM yyyy', { locale: fr })}
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="px-2 py-1 text-sm font-medium text-gray-700">Jour</th>
                    <th className="px-2 py-1 text-sm font-medium text-gray-700">M</th>
                    <th className="px-2 py-1 text-sm font-medium text-gray-700">AM</th>
                    <th className="px-2 py-1 text-sm font-medium text-gray-700">S</th>
                  </tr>
                </thead>
                <tbody>
                  {daysInMonth.map(day => {
                    const dateStr = format(day, 'yyyy-MM-dd');
                    return (
                      <tr key={dateStr} className={isWeekend(day) ? 'bg-gray-50' : ''}>
                        <td className="border px-2 py-1 text-sm">
                          <div className="flex items-center space-x-2">
                            <span>{day.getDate()}</span>
                            <span className="text-gray-500">
                              {format(day, 'EEEEEE', { locale: fr })}
                            </span>
                          </div>
                        </td>
                        {['M', 'AM', 'S'].map(period => {
                          const cellKey = `${dateStr}-${period}`;
                          return (
                            <PlanningCell
                              key={cellKey}
                              cellKey={cellKey}
                              desiderataType={selections[cellKey]}
                              onMouseDown={onCellMouseDown}
                              onMouseEnter={onCellMouseEnter}
                              isWeekend={isWeekend(day)}
                            />
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MobileTable;