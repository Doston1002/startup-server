type IllnessDurationType = '6_months' | 'academic_year' | '6_months_to_1_year';

interface StudentPeriodInput {
  illnessType?: string;
  conclusionDate?: string;
  academicYear?: string;
  illnessEndDate?: string;
  illnessEndDateMax?: string;
}

const ILLNESS_DURATIONS: Record<string, IllnessDurationType> = {
  'somatik:biriktiruvchi_toqima': '6_months',
  'somatik:yurak_kasalligi': '6_months',
  'somatik:tetrada_fallo': 'academic_year',
  'somatik:opka_bronx': '6_months',
  'somatik:asma': 'academic_year',
  'somatik:glom': 'academic_year',
  'somatik:piyelonefrit': 'academic_year',
  'somatik:otkir_glom': 'academic_year',
  'somatik:onkologiya': 'academic_year',
  'somatik:mukovissidoz': '6_months',
  'somatik:seliakiya': '6_months',
  'somatik:yarali_kolit': '6_months',
  'somatik:kron': '6_months',
  'somatik:jigar_sirrozi': 'academic_year',
  'somatik:oqsil_yetishmovchiligi': '6_months',
  'somatik:leykoz': 'academic_year',
  'somatik:gemorragik': '6_months',
  'somatik:immun_tanqisligi': 'academic_year',
  'psix:ruhiy': 'academic_year',
  'psix:nevroz': 'academic_year',
  'psix:ensefaloastenik': 'academic_year',
  'psix:psixopatiya': 'academic_year',
  'psix:epilepsiya': 'academic_year',
  'psix:harakat_buzilishi': 'academic_year',
  'psix:serebral_falaj': 'academic_year',
  'psix:avtizm': 'academic_year',
  'psix:miopatiya': 'academic_year',
  'psix:demiyelin': 'academic_year',
  'xir:orqa_miya': 'academic_year',
  'xir:siydik': 'academic_year',
  'xir:atreziya': '6_months',
  'xir:oyoqlar': 'academic_year',
  'xir:osteomiyelit': 'academic_year',
  'xir:bosh_miya': 'academic_year',
  'xir:reabilitatsiya': '6_months_to_1_year',
  'teri:epidermoliz': 'academic_year',
  'teri:ihtioz': '6_months',
  'teri:psoriaz_yiringli': '6_months',
  'teri:psoriaz_artropatik': '6_months',
  'teri:teri_sil': 'academic_year',
};

function parseDateInput(value: string): Date | null {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

function getAcademicYearBounds(academicYear: string): { start: Date; end: Date } | null {
  const match = academicYear.match(/^(\d{4})-(\d{4})$/);
  if (!match) return null;
  const startYear = Number(match[1]);
  const endYear = Number(match[2]);
  if (endYear !== startYear + 1) return null;
  return {
    start: new Date(startYear, 8, 2),
    end: new Date(endYear, 4, 25),
  };
}

function resolveAcademicYearEnd(conclusionDate: Date, academicYear?: string): Date {
  if (academicYear) {
    const bounds = getAcademicYearBounds(academicYear);
    if (bounds) {
      if (conclusionDate <= bounds.end) return bounds.end;
      const nextYear = `${bounds.end.getFullYear()}-${bounds.end.getFullYear() + 1}`;
      const nextBounds = getAcademicYearBounds(nextYear);
      if (nextBounds) return nextBounds.end;
    }
  }

  const year = conclusionDate.getFullYear();
  const month = conclusionDate.getMonth();
  const day = conclusionDate.getDate();

  if (month > 8 || (month === 8 && day >= 2)) return new Date(year + 1, 4, 25);
  if (month < 4 || (month === 4 && day <= 25)) return new Date(year, 4, 25);
  return new Date(year + 1, 4, 25);
}

export function getStudentPeriodEnd(student: StudentPeriodInput): Date | null {
  if (student.illnessEndDateMax) {
    const parsed = parseDateInput(student.illnessEndDateMax);
    if (parsed) {
      parsed.setHours(23, 59, 59, 999);
      return parsed;
    }
  }
  if (student.illnessEndDate) {
    const parsed = parseDateInput(student.illnessEndDate);
    if (parsed) {
      parsed.setHours(23, 59, 59, 999);
      return parsed;
    }
  }

  if (!student.illnessType || !student.conclusionDate) return null;

  const duration = ILLNESS_DURATIONS[student.illnessType];
  const start = parseDateInput(student.conclusionDate);
  if (!duration || !start) return null;

  let end: Date;
  if (duration === '6_months') {
    end = addMonths(start, 6);
  } else if (duration === 'academic_year') {
    end = resolveAcademicYearEnd(start, student.academicYear);
  } else {
    end = addMonths(start, 12);
  }

  end.setHours(23, 59, 59, 999);
  return end;
}

export function getStudentPeriodEndIso(student: StudentPeriodInput): string {
  const end = getStudentPeriodEnd(student);
  return end ? toIsoDate(end) : '';
}

export function getStudentPeriodDaysRemaining(student: StudentPeriodInput, now = new Date()): number | null {
  const endDate = getStudentPeriodEnd(student);
  if (!endDate) return null;
  const diffMs = endDate.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function isStudentPeriodExpiringSoon(student: StudentPeriodInput, now = new Date()): boolean {
  const days = getStudentPeriodDaysRemaining(student, now);
  if (days === null) return false;
  return days <= 30;
}
