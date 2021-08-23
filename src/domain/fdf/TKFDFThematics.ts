import { TKCSVRead } from "@/domain/csv/TKCSVReader";
import { TKLabel } from "../ui/TKLabel";
import { TKFDFFiles, TKFDFInfos } from "./TKFDFInfos";

// ////////////////////////////////////////////////////////////////////////////
// Thematic datatype
// ////////////////////////////////////////////////////////////////////////////
const FORMATTED_NAME_INDEX = 0;
const ICON_NAME_INDEX = 1;

export type TKFDFThematicRaw = Array<string>;
export interface TKFDFThematic {
  formattedName: string;
  iconFileName: string;
  thematicLabel: TKLabel;
}

export type TKTFDFhematicsCollection = Record<string, TKFDFThematic>;

// ////////////////////////////////////////////////////////////////////////////
// Method that creates the Thematic collection object from the fdf folder
// ////////////////////////////////////////////////////////////////////////////

export async function TKReadFDFThematicsCollection(
  infos: TKFDFInfos
): Promise<TKTFDFhematicsCollection> {
  const rawThematics: TKFDFThematicRaw[] = await TKCSVRead<TKFDFThematicRaw[]>(
    TKFDFFiles.THEMATICS,
    infos.folder,
    false
  );

  // Parse header to find out coumn - language correspondance
  const header: string[] = Object.values(rawThematics[0]);
  const localesValuesForIndexes: string[] = ["ignore-0", "ignore-1"]; // ignore first col --> choice name
  for (let i = 2; i < header.length; i++) {
    const split = header[i].split("_");
    const lang = split[split.length - 1] ?? "";
    localesValuesForIndexes.push(lang);
  }

  // Parse all the other lines: fill matching label with proper column indexes.
  const thematicsCollection: TKTFDFhematicsCollection = {};

  for (let i = 1; i < rawThematics.length; i++) {
    const item = rawThematics[i];
    thematicsCollection[item[FORMATTED_NAME_INDEX]] = {
      formattedName: item[FORMATTED_NAME_INDEX],
      iconFileName: item[ICON_NAME_INDEX],
      thematicLabel: {}
    };

    for (let j = 2; j < Object.keys(item).length; j++) {
      thematicsCollection[item[FORMATTED_NAME_INDEX]].thematicLabel[
        localesValuesForIndexes[j]
      ] = item[j];
    }
  }

  return thematicsCollection;
}
