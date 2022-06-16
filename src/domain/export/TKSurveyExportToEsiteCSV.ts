import { TKIndicatorType } from "../survey/TKIndicator";
import { TKSubmissionEntryType } from "../survey/TKSubmissionEntry";
import { TKSurvey } from "../survey/TKSurvey";
import { TKGetLocalValue } from "../utils/TKLabel";

// ////////////////////////////////////////////////////////////////////////////
// Helper methods
// ////////////////////////////////////////////////////////////////////////////

function computeEsiteCSVContent(
  survey: TKSurvey,
  locale: string,
  filterEmptyColumns: boolean
): string {
  if (survey) {
    const rows: string[][] = [];

    const header = ["latitude", "longitude", "name", "type", "date"];

    survey.fdf.indicators.site.map(indicator => {
      header.push(`indicator/${TKGetLocalValue(indicator.name, locale)}`);
    });

    for (const ruleKey of Object.keys(survey.fdf.submissionsRules)) {
      const rule = survey.fdf.submissionsRules[ruleKey];
      if (rule.chartId === "") {
        const field = TKGetLocalValue(
          survey.fdf.fieldsLabels[rule.fieldName],
          locale
        );
        header.push(field);
      }
    }

    rows.push(header);

    for (const camp of survey.camps) {
      const submission = camp.submissions[0];
      if (submission) {
        const campAsCSVLine = [
          camp.lat.toString(),
          camp.lng.toString(),
          camp.name,
          camp.type.formattedName,
          submission.date
        ];

        submission.indicators.map(indicator => {
          if (indicator.type === TKIndicatorType.OCCUPATION) {
            campAsCSVLine.push(indicator.valueNumber.toString());
          } else {
            campAsCSVLine.push(TKGetLocalValue(indicator.valueLabel, locale));
          }
        });

        for (const ruleKey of Object.keys(survey.fdf.submissionsRules)) {
          const rule = survey.fdf.submissionsRules[ruleKey];
          if (rule.chartId === "") {
            const item = submission.thematics[rule.thematicGroup]?.data?.find(
              entry =>
                entry.type === TKSubmissionEntryType.TEXT &&
                entry.field === rule.fieldName
            );

            if (item && item.type === TKSubmissionEntryType.TEXT) {
              campAsCSVLine.push(
                TKGetLocalValue(item.answerLabel, locale).replace("\n", " ")
              );
            } else {
              campAsCSVLine.push("");
            }
          }
        }
        rows.push(campAsCSVLine);
      }
    }

    if (filterEmptyColumns) {
      const answerCount: Record<string, number> = {};

      for (const item of header) {
        answerCount[item] = 0;
      }

      for (let rowIndex = 1; rowIndex < rows.length; rowIndex++) {
        for (let colIndex = 0; colIndex < rows[0].length; colIndex++) {
          if (rows[rowIndex][colIndex] !== "") {
            answerCount[rows[0][colIndex]]++;
          }
        }
      }

      const rowsFiltered: string[][] = [];
      for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        rowsFiltered.push([]);
      }

      for (let colIndex = 0; colIndex < rows[0].length; colIndex++) {
        if (answerCount[rows[0][colIndex]]) {
          for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
            rowsFiltered[rowIndex].push(rows[rowIndex][colIndex]);
          }
        }
      }

      return (
        "data:text/csv;charset=utf-8," +
        rowsFiltered.map(e => e.join(";")).join("\n")
      );
    }

    return (
      "data:text/csv;charset=utf-8," + rows.map(e => e.join(";")).join("\n")
    );
  }
  return "";
}

// ////////////////////////////////////////////////////////////////////////////
// Write CSV file
// ////////////////////////////////////////////////////////////////////////////

export function TKSurveyExportToEsiteCSV(
  survey: TKSurvey,
  locale: string,
  exportName: string
) {
  if (survey) {
    const csvContent = computeEsiteCSVContent(survey, locale, true);
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);

    link.setAttribute("download", `test_${exportName}_v4.csv`); // filename
    document.body.appendChild(link); // Required for FF ?
    link.click();
  }
}
