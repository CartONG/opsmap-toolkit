import { TKCSVRead } from "@/domain/csv/TKCSVReader";
import { TKFDFFiles, TKFDFInfos } from "./TKFDFInfos";

// ////////////////////////////////////////////////////////////////////////////
// Thematic datatype
// ////////////////////////////////////////////////////////////////////////////

type TKFDFUrlRaw = Array<string>;

type TKFDFPartnerName = string;
type TKFDFPartnerURL = string;

export type TKFDFUrlsCollection = Record<TKFDFPartnerName, TKFDFPartnerURL>;

// ////////////////////////////////////////////////////////////////////////////
// Method that creates the Thematic collection object from the fdf folder
// ////////////////////////////////////////////////////////////////////////////

export async function TKReadFDFURLsCollection(
  infos: TKFDFInfos
): Promise<TKFDFUrlsCollection> {
  const rawUrl: TKFDFUrlRaw[] = await TKCSVRead<TKFDFUrlRaw[]>(
    TKFDFFiles.URLS,
    infos.folder,
    false
  );

  // Parse all the other lines: fill matching label with proper column indexes.
  const urlsCollection: TKFDFUrlsCollection = {};
  rawUrl.forEach(el => {
    if (el[0] && el[1]) {
      urlsCollection[el[0]] = el[1];
    }
  });

  return urlsCollection;
}
