import { ArcgisServerDataGetter } from "@/domain/map/TKArcgisServerDataGetter";
import { TKGeoDataset } from "@/domain/map/TKGeoDataset";
import { FeatureCollection } from "geojson";
import { TKSpatialDescription } from "../opsmapConfig/TKSpatialDescription";
import { TKDatasetFilterer } from "../survey/TKDatasetFilterer";

export async function TKGetGeoBoundaries(
  dataset: TKDatasetFilterer,
  spatialDescription: TKSpatialDescription
): Promise<TKGeoDataset> {
  const before = Date.now();

  // Get Admin1 from file in public
  let admin1GeoData: FeatureCollection = {
    type: "FeatureCollection",
    features: []
  };
  await fetch(`${process.env.BASE_URL}/${spatialDescription.admin1LocalURL}`)
    .then(response => response.json())
    .then(json => {
      admin1GeoData = json;
    });

  // Get Admin2 from unhcr server
  let admin1List: string[] = [];
  for (const survey of dataset.surveys) {
    survey.boundariesList.admin1.map(x => admin1List.push(x.pcode));
  }

  admin1List = [...new Set(admin1List)];
  let admin2WhereClause = "";

  admin1List.map(
    x =>
      (admin2WhereClause += `${spatialDescription.adm2RefInAdm1} = '${x}' OR `)
  );
  admin2WhereClause = admin2WhereClause.substring(
    0,
    admin2WhereClause.length - 3
  );

  const admin2GeoData = await new ArcgisServerDataGetter(
    encodeURI("core/wrl_adm2_polbnd_a_unhcr/FeatureServer/0"),
    encodeURI(admin2WhereClause),
    true,
    "geojson"
  ).getData();

  console.log(
    `GeoBoundaries retrieved in ${(Date.now() - before) / 1000} seconds.`
  );

  return {
    admin1: admin1GeoData,
    admin2: admin2GeoData
  };
}
