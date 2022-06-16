import moment from "moment";

export function TKDateCompare(date1: string, date2: string): number {
  const asplitted = date1.split("/");
  const bsplitted = date2.split("/");
  if (asplitted.length !== 3 || bsplitted.length !== 3) {
    return 0;
  }
  const adated = new Date(
    parseInt(asplitted[2]),
    parseInt(asplitted[1]) - 1,
    parseInt(asplitted[0])
  );
  const bdated = new Date(
    parseInt(bsplitted[2]),
    parseInt(bsplitted[1]) - 1,
    parseInt(bsplitted[0])
  );
  if (adated < bdated) return 1;
  else if (adated > bdated) return -1;
  else return 0;
}

// ////////////////////////////////////////////////////////////////////////////
// sort dates
// ////////////////////////////////////////////////////////////////////////////

export function TKDateFormat(date: string, format: string): string {
  if (format) {
    const day = moment(date, format);
    return day.format("DD/MM/YYYY");
  }

  return date;
}
