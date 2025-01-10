import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getDaysArray, getMonthsInRange, isGrayedOut } from './dateUtils';

interface ExportPlanningOptions {
  userName: string;
  startDate: Date;
  endDate: Date;
  selections: Record<string, 'primary' | 'secondary' | null>;
}

export const exportPlanningToPDF = ({
  userName,
  startDate,
  endDate,
  selections
}: ExportPlanningOptions): void => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const margin = 10;
  const pageWidth = doc.internal.pageSize.width;

  // Titre du document
  const title = `Desiderata ${userName} - ${format(startDate, 'dd/MM/yyyy')} au ${format(endDate, 'dd/MM/yyyy')}`;
  doc.setFontSize(11);
  doc.text(title, margin, margin);

  // Préparation des données par mois
  const months = getMonthsInRange(startDate, endDate);
  const monthTables = months.map(month => {
    const days = getDaysArray(startDate, endDate).filter(day => 
      day.getMonth() === month.getMonth() && day.getFullYear() === month.getFullYear()
    );

    return {
      monthTitle: format(month, 'MMMM yyyy', { locale: fr }).toUpperCase(),
      data: days.map(day => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const dayLabel = `${format(day, 'd', { locale: fr })} ${format(day, 'EEEEEE', { locale: fr })}`;
        const isGrayed = isGrayedOut(day);
        
        return {
          dayLabel,
          isGrayed,
          periods: ['M', 'AM', 'S'].map(period => {
            const cellKey = `${dateStr}-${period}`;
            return {
              value: selections[cellKey] === 'primary' ? 'P' : 
                     selections[cellKey] === 'secondary' ? 'S' : '',
              type: selections[cellKey]
            };
          })
        };
      })
    };
  });

  // Calcul des dimensions des tableaux
  const tableWidth = (pageWidth - (2 * margin) - ((months.length - 1) * 2)) / months.length;
  const columnWidth = tableWidth / 4;

  let startX = margin;
  const startY = margin + 8;

  // Définition des couleurs avec plus de contraste
  const colors = {
    primary: {
      bg: [255, 205, 210], // Rouge plus soutenu
      text: [183, 28, 28]  // Rouge foncé pour le texte
    },
    secondary: {
      bg: [255, 224, 178], // Orange plus soutenu
      text: [230, 81, 0]   // Orange foncé pour le texte
    },
    grayed: {
      bg: [243, 244, 246], // bg-gray-100
      text: [75, 85, 99]   // text-gray-600 pour plus de contraste
    },
    header: {
      bg: [243, 244, 246], // bg-gray-100
      text: [31, 41, 55]   // text-gray-800 pour plus de contraste
    }
  };

  // Génération des tableaux pour chaque mois
  monthTables.forEach(({ monthTitle, data }, monthIndex) => {
    // En-tête du mois
    autoTable(doc, {
      startY,
      head: [[monthTitle]],
      body: [],
      theme: 'grid',
      styles: {
        fontSize: 8,
        fontStyle: 'bold',
        halign: 'center',
        fillColor: colors.header.bg,
        textColor: colors.header.text,
        cellPadding: 2
      },
      margin: { left: startX },
      tableWidth
    });

    // Corps du tableau
    autoTable(doc, {
      startY: startY + 8,
      head: [['Jour', 'M', 'AM', 'S']],
      body: data.map(({ dayLabel, isGrayed, periods }) => [
        { content: dayLabel, isGrayed },
        ...periods.map(p => ({
          content: p.value,
          type: p.type,
          isGrayed
        }))
      ]),
      theme: 'grid',
      styles: {
        fontSize: 7,
        cellPadding: 1,
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
        minCellHeight: 4
      },
      headStyles: {
        fillColor: colors.header.bg,
        textColor: colors.header.text,
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { cellWidth: columnWidth * 1.5 },
        1: { cellWidth: columnWidth * 0.8, halign: 'center' },
        2: { cellWidth: columnWidth * 0.8, halign: 'center' },
        3: { cellWidth: columnWidth * 0.8, halign: 'center' }
      },
      didParseCell: (data) => {
        if (data.section === 'body') {
          const cellData = data.cell.raw as { content: string; type?: string; isGrayed: boolean };
          
          // Appliquer les couleurs avec plus de contraste
          if (cellData.type === 'primary') {
            data.cell.styles.fillColor = colors.primary.bg;
            data.cell.styles.textColor = colors.primary.text;
            data.cell.styles.fontStyle = 'bold';
          } else if (cellData.type === 'secondary') {
            data.cell.styles.fillColor = colors.secondary.bg;
            data.cell.styles.textColor = colors.secondary.text;
            data.cell.styles.fontStyle = 'bold';
          } else if (cellData.isGrayed) {
            data.cell.styles.fillColor = colors.grayed.bg;
            data.cell.styles.textColor = colors.grayed.text;
          }
          
          data.cell.text = [cellData.content];
        }
      },
      margin: { left: startX },
      tableWidth
    });

    startX += tableWidth + (monthIndex < months.length - 1 ? 2 : 0);
  });

  // Génération du fichier
  const fileName = `desiderata_${userName}_${format(startDate, 'yyyy-MM-dd')}.pdf`;
  doc.save(fileName);
};