export class ArcgisServerDataGetter {
  constructor(
    public service: string,
    public whereClause: string,
    public geometry: boolean,
    public output: "geojson" | "json"
  ) {
    this.service = service;
    this.whereClause = whereClause;
    this.geometry = geometry;
    this.output = output;
  }

  async getData() {
    const boundaries = await fetch(
      `https://gis.unhcr.org/arcgis/rest/services/${this.service}/query?where=${this.whereClause}&outFields=*&returnGeometry=${this.geometry}&f=${this.output}`
    );
    const plop = boundaries.json();
    return plop;
  }
}
