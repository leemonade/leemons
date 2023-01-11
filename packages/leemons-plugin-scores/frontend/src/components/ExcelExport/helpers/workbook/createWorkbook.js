import { Workbook } from 'exceljs';

export default function createWorkbook(title, subject) {
  const wb = new Workbook();

  wb.creator = 'Leemons EdTech Solutions';
  wb.title = title || 'Leemons scores report';
  wb.subject = subject;

  return wb;
}
