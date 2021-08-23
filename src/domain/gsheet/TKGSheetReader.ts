/* eslint-disable @typescript-eslint/no-explicit-any */

import { parse } from "papaparse";

// ////////////////////////////////////////////////////////////////////////////
// Temaplted Read method for csv inputs
// ////////////////////////////////////////////////////////////////////////////

export async function TKGSheetRead<T>(
  url: string,
  header: boolean
): Promise<T> {
  return new Promise((resolve, reject) => {
    parse(url, {
      header: header,
      encoding: "utf-8",
      download: true,
      skipEmptyLines: true,
      complete(results: any) {
        resolve(results.data);
      },
      error(err) {
        reject(err);
      }
    });
  });
}
