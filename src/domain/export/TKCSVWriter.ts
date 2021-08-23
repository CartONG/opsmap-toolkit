import { TKDatasetFilterer } from "@/domain/survey/TKDatasetFilterer";
import { TKSubmission } from "@/domain/survey/TKSubmission";
import { TKGetLocalValue } from "../ui/TKLabel";
import { TKComputeExportFilename } from "./TKExportCommon";
// ////////////////////////////////////////////////////////////////////////////
// Helper methods
// ////////////////////////////////////////////////////////////////////////////

function computeCSVContent(submission: TKSubmission, locale: string): string {
  if (submission) {
    const rows = [["thematic", "label", "value", "trafficlight"]];

    for (const thematic in submission.thematics) {
      const thematicName = TKGetLocalValue(
        submission.thematics[thematic].nameLabel,
        locale
      );

      for (const submissionItem in submission.thematics[thematic].data) {
        const item = submission.thematics[thematic].data[submissionItem];
        if (item.type === "text") {
          const itemName = TKGetLocalValue(item.fieldLabel, locale);
          const answer = TKGetLocalValue(item.answerLabel, locale);
          const trafficlight = item.trafficLight ? item.trafficLightColor : "";

          rows.push([thematicName, itemName, answer, trafficlight]);
        } else if (item.type === "age_pyramid") {
          const itemName = "age_pyramid";
          for (const [index, value] of item.malesEntries.entries()) {
            const chartItemName =
              itemName +
              " -- " +
              TKGetLocalValue(item.malesLabels[index], locale);
            rows.push([thematicName, chartItemName, value.toString(), ""]);
          }

          for (const [index, value] of item.femalesEntries.entries()) {
            const chartItemName =
              itemName +
              " -- " +
              TKGetLocalValue(item.femalesLabels[index], locale);
            rows.push([thematicName, chartItemName, value.toString(), ""]);
          }
        }
      }

      // Inser indicators right after group_general_info
      if (thematic === "group_general_info") {
        for (const index in submission.indicators) {
          const thematicName = "indicators";
          const field = TKGetLocalValue(
            submission.indicators[index].nameLabel,
            locale
          );
          const value = TKGetLocalValue(
            submission.indicators[index].valueLabel,
            locale
          );
          rows.push([thematicName, field, value, ""]);
        }
      }
    }

    return (
      "data:text/csv;charset=utf-8," + rows.map(e => e.join(";")).join("\n")
    );
  }

  return JSON.stringify([]);
}

// ////////////////////////////////////////////////////////////////////////////
// Temaplted Read method for csv inputs
// ////////////////////////////////////////////////////////////////////////////

export function TKCSVWrite(dataset: TKDatasetFilterer, locale: string) {
  if (dataset.currentSubmission) {
    const csvContent = computeCSVContent(dataset.currentSubmission, locale);
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", TKComputeExportFilename(dataset, "csv")); // filename
    document.body.appendChild(link); // Required for FF ?
    link.click();
  }
}
