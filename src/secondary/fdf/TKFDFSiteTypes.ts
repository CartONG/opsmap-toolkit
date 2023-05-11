// ////////////////////////////////////////////////////////////////////////////
// Thematic datatype

import { TKFDFInfos } from "@/domain/fdf/TKFDFInfos";
import { TKFDFSiteTypeCollection } from "@/domain/fdf/TKFDFSiteTypes";
import { TKCSVParse } from "@/secondary/csv/TKCSV";
import { TKFDFFiles } from "./TKFDFInfos";

// ////////////////////////////////////////////////////////////////////////////
const FORMATTED_NAME_INDEX = 0;
const ICON_NAME_INDEX = 1;
const ICON_SELECTED_NAME_INDEX = 2;

export type TKFDFSiteTypeRaw = Array<string>;

// ////////////////////////////////////////////////////////////////////////////
// Method that creates the Thematic collection object from the fdf folder
// ////////////////////////////////////////////////////////////////////////////

export async function TKReadFDFSiteTypesCollection(
  infos: TKFDFInfos
): Promise<TKFDFSiteTypeCollection> {
  const rawSiteTypes: TKFDFSiteTypeRaw[] = await TKCSVParse<TKFDFSiteTypeRaw[]>(
    `${process.env.BASE_URL}/${infos.folder}/${TKFDFFiles.SITE_TYPES}.csv`,
    false
  );

  // Parse header to find out coumn - language correspondance
  const header: string[] = Object.values(rawSiteTypes[0]);
  const localesValuesForIndexes: string[] = [
    "ignore-0",
    "ignore-1",
    "ignore-2"
  ]; // ignore first col --> choice name

  for (let i = 3; i < header.length; i++) {
    const split = header[i].split("_");
    const lang = split[split.length - 1] ?? "";
    localesValuesForIndexes.push(lang);
  }

  // Parse all the other lines: fill matching label with proper column indexes.
  const siteTypesCollection: TKFDFSiteTypeCollection = {};

  for (let i = 1; i < rawSiteTypes.length; i++) {
    const item = rawSiteTypes[i];
    siteTypesCollection[item[FORMATTED_NAME_INDEX]] = {
      formattedName: item[FORMATTED_NAME_INDEX],
      iconFileName: {
        normal: item[ICON_NAME_INDEX],
        selected: item[ICON_SELECTED_NAME_INDEX]
      },
      thematicLabel: {}
    };

    for (let j = 3; j < Object.keys(item).length; j++) {
      siteTypesCollection[item[FORMATTED_NAME_INDEX]].thematicLabel[
        localesValuesForIndexes[j]
      ] = item[j];
    }
  }

  return siteTypesCollection;
}
