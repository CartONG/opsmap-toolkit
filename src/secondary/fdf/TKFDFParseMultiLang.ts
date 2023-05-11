import { TKFDFLabelCollection } from "@/domain/fdf/TKFDFParseMultiLang";
import { TKCSVParse } from "@/secondary/csv/TKCSV";

// ////////////////////////////////////////////////////////////////////////////
// Definition of the Answer label object
// The fields are the one described in the fdf file
// ////////////////////////////////////////////////////////////////////////////

export type TKFDFLabelRaw = Array<string>;

// ////////////////////////////////////////////////////////////////////////////
// Parse the csv file
// ////////////////////////////////////////////////////////////////////////////

async function parseCSVContent(
  rawLabels: TKFDFLabelRaw[]
): Promise<TKFDFLabelCollection> {
  // Parse all the other lines: fill matching label with proper column indexes.
  const labelsCollection: TKFDFLabelCollection = {};

  if (rawLabels.length < 1) {
    return labelsCollection;
  }

  // Parse header to find out coumn - language correspondance
  const header: string[] = Object.values(rawLabels[0]);

  const localesValuesForIndexes: string[] = ["ignore"]; // ignore first col --> choice name
  for (let i = 1; i < header.length; i++) {
    const split = header[i].split("_");
    const lang = split[split.length - 1] ?? "";
    localesValuesForIndexes.push(lang);
  }

  for (let i = 1; i < rawLabels.length; i++) {
    const answer = rawLabels[i];
    labelsCollection[answer[0]] = {};

    for (let j = 1; j < answer.length; j++) {
      labelsCollection[answer[0]][localesValuesForIndexes[j]] = answer[j];
    }
  }

  return labelsCollection;
}

// ////////////////////////////////////////////////////////////////////////////
// Method that creates the AnswerLabel object from the fdf folder
// ////////////////////////////////////////////////////////////////////////////

export async function TKReadFDFLabelCollection(
  url: string
): Promise<TKFDFLabelCollection> {
  const rawLabels: TKFDFLabelRaw[] = await TKCSVParse(url, false);
  return parseCSVContent(rawLabels);
}
