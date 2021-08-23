import { TKCSVRead } from "@/domain/csv/TKCSVReader";
import { TKFDFFiles, TKFDFInfos } from "./TKFDFInfos";

// ////////////////////////////////////////////////////////////////////////////
// Thematic datatype
// ////////////////////////////////////////////////////////////////////////////

type TKFDFTerminologyRaw = Array<string>;

type TKFDFTerminologyRawValue = string;
type TKFDFTerminologyConcept = string;

export type TKFDFTerminologyCollection = Record<
  TKFDFTerminologyRawValue,
  TKFDFTerminologyConcept
>;

// ////////////////////////////////////////////////////////////////////////////
// Method that creates the Thematic collection object from the fdf folder
// ////////////////////////////////////////////////////////////////////////////

export async function TKReadFDFTerminologyCollection(
  infos: TKFDFInfos
): Promise<TKFDFTerminologyCollection> {
  const rawUrl: TKFDFTerminologyRaw[] = await TKCSVRead<TKFDFTerminologyRaw[]>(
    TKFDFFiles.TERMINOLOGY,
    infos.folder,
    false
  );

  // Parse all the other lines: fill matching label with proper column indexes.
  const terminologyCollection: TKFDFTerminologyCollection = {};
  rawUrl.forEach(el => {
    if (el[0] && el[1]) {
      terminologyCollection[el[0]] = el[1];
    }
  });

  return terminologyCollection;
}
