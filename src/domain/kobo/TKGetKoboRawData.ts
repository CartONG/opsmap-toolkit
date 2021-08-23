import { TKSurveyInfosKobo } from "@/domain/opsmapConfig/TKSurveyInfos";

// ////////////////////////////////////////////////////////////////////////////
// Retrieve raw data from kobo
// ////////////////////////////////////////////////////////////////////////////

export async function TKGetKoboRawData(config: TKSurveyInfosKobo) {
  try {
    const response = await fetch(config.url, {
      method: "get",
      headers: new Headers({
        Authorization: `Token ${config.token}`
      })
    });
    const result = await response.json();
    return result.results;
  } catch (error) {
    console.log(error);
  }
}
