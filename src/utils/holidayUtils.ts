import { getYear, addDays, subDays, isSameDay } from 'date-fns';

// Calcul de Pâques selon l'algorithme de Meeus/Jones/Butcher
function getEasterDate(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  
  return new Date(year, month, day);
}

// Calcul des jours fériés pour une année donnée
function getHolidaysForYear(year: number): Date[] {
  const easter = getEasterDate(year);
  const easterMonday = addDays(easter, 1);
  const ascension = addDays(easter, 39);
  const pentecost = addDays(easter, 50);

  return [
    new Date(year, 0, 1),   // Jour de l'an
    easter,                 // Pâques
    easterMonday,          // Lundi de Pâques
    new Date(year, 4, 1),   // Fête du Travail
    new Date(year, 4, 8),   // Victoire 1945
    ascension,             // Ascension
    pentecost,             // Pentecôte
    new Date(year, 6, 14),  // Fête Nationale
    new Date(year, 7, 15),  // Assomption
    new Date(year, 10, 1),  // Toussaint
    new Date(year, 10, 11), // Armistice
    new Date(year, 11, 25), // Noël
  ];
}

// Cache pour stocker les jours fériés par année
const holidaysCache = new Map<number, Date[]>();

export function isHoliday(date: Date): boolean {
  const year = getYear(date);
  
  if (!holidaysCache.has(year)) {
    holidaysCache.set(year, getHolidaysForYear(year));
  }
  
  const holidays = holidaysCache.get(year)!;
  return holidays.some(holiday => isSameDay(holiday, date));
}

// Vérifie si une date est un jour de pont
export function isBridgeDay(date: Date): boolean {
  const prevDay = subDays(date, 1);
  const nextDay = addDays(date, 1);
  const dayOfWeek = date.getDay();

  // Si c'est un jour entre deux jours fériés
  if (isHoliday(prevDay) && isHoliday(nextDay)) {
    return true;
  }

  // Vendredi pont (jeudi férié)
  if (dayOfWeek === 5 && isHoliday(prevDay)) {
    return true;
  }

  // Lundi pont (mardi férié)
  if (dayOfWeek === 1 && isHoliday(nextDay)) {
    return true;
  }

  return false;
}

// Vérifie si un jour doit être grisé (férié ou pont)
export function isGrayedDay(date: Date): boolean {
  return isHoliday(date) || isBridgeDay(date);
}