import { TKCSVParse } from "../csv/TKCSV";
import { TKFDFFiles } from "./TKFDFInfos";
import { TKFDFInfos } from "../../domain/fdf/TKFDFInfos";
import { TKFDFUrlsCollection } from "@/domain/fdf/TKFDFURLs";

// ////////////////////////////////////////////////////////////////////////////
// Thematic datatype
// ////////////////////////////////////////////////////////////////////////////

type TKFDFUrlRaw = Array<string>;

// ////////////////////////////////////////////////////////////////////////////
// Method that creates the Thematic collection object from the fdf folder
// ////////////////////////////////////////////////////////////////////////////

export async function TKReadFDFURLsCollection(
  infos: TKFDFInfos
): Promise<TKFDFUrlsCollection> {
  const rawUrl: TKFDFUrlRaw[] = await TKCSVParse<TKFDFUrlRaw[]>(
    `${process.env.BASE_URL}/${infos.folder}/${TKFDFFiles.URLS}.csv`,
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
