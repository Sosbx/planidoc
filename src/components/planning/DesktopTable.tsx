import React from 'react';
import { format, isSameMonth, getDaysInMonth } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getMonthsInRange, isGrayedOut } from '../../utils/dateUtils';
import PlanningCell from '../PlanningCell';

interface DesktopTableProps {
  startDate: Date;
  endDate: Date;
  selections: Record<string, 'primary' | 'secondary' | null>;
  onCellMouseDown: (key: string) => void;
  onCellMouseEnter: (key: string) => void;
  readOnly?: boolean;
}

const DesktopTable: React.FC<DesktopTableProps> = ({
  startDate,
  endDate,
  selections,
  onCellMouseDown,
  onCellMouseEnter,
  readOnly = false
}) => {
  const months = getMonthsInRange(startDate, endDate);

  const renderMonthTable = (month: Date) => {
    const daysInMonth = getDaysInMonth(month);
    const days = Array.from({ length: daysInMonth }, (_, i) => {
      const date = new Date(month.getFullYear(), month.getMonth(), i + 1);
      return date;
    }).filter(date => date >= startDate && date <= endDate);

    return (
      <div key={month.getTime()} className="inline-block align-top mr-4 mb-4">
        <table className="border border-gray-200 bg-white">
          <thead>
            <tr>
              <th colSpan={4} className="px-3 py-2 text-sm font-medium text-gray-700 border-b bg-gray-50">
                {format(month, 'MMMM yyyy', { locale: fr })}
              </th>
            </tr>
            <tr className="bg-gray-50">
              <th className="border px-2 py-1 text-sm font-medium text-gray-700 w-20">Jour</th>
              <th className="border px-2 py-1 text-sm font-medium text-gray-700 w-12">M</th>
              <th className="border px-2 py-1 text-sm font-medium text-gray-700 w-12">AM</th>
              <th className="border px-2 py-1 text-sm font-medium text-gray-700 w-12">S</th>
            </tr>
          </thead>
          <tbody>
            {days.map(day => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const grayedOut = isGrayedOut(day);
              return (
                <tr key={dateStr}>
                  <td className={`border px-2 py-1 text-sm ${grayedOut ? 'text-gray-500 bg-gray-100' : ''}`}>
                    <div className="flex items-center justify-between">
                      <span>{format(day, 'd', { locale: fr })}</span>
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
                        isGrayedOut={grayedOut}
                        readOnly={readOnly}
                      />
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="overflow-x-auto whitespace-nowrap">
      {months.map(renderMonthTable)}
    </div>
  );
};

export default DesktopTable;