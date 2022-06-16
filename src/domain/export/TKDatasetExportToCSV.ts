import { TKDataset } from "@/domain/survey/TKDataset";
import {
  TKCSVWrite as TKCSVWriteCurrentCamp,
  TKCSVWriteCurrentSelection
} from "@/secondary/export/TKCSVWriter";

// ////////////////////////////////////////////////////////////////////////////
// Helper methods
// ////////////////////////////////////////////////////////////////////////////

function computeCampExportFileBasename(dataset: TKDataset): string {
  if (dataset) {
    const campId = dataset.currentCamp?.id ?? "";
    const campName = dataset.currentCamp?.name ?? "";
    const submissionId = dataset.currentSubmission?.date.replaceAll("/", "-");

    const filename = campId + "_" + campName + "_" + submissionId;

    return filename;
  }
  return "camp-export";
}

function computeSelectionExportFileBasename(dataset: TKDataset): string {
  if (dataset) {
    let filename = "export";
    if (dataset.currentAdmin1) {
      filename += "_" + dataset.currentAdmin1.name;

      if (dataset.currentAdmin2) {
        filename += "_" + dataset.currentAdmin2.name;

        if (dataset.currentCamp) {
          filename += "_" + dataset.currentCamp.name;
        }
      }
    }
    return filename;
  }
  return "selection-export";
}

export function TKComputeCampExportFilename(
  dataset: TKDataset,
  extension: string
): string {
  let name = computeCampExportFileBasename(dataset);
  if (extension) {
    name += `.${extension}`;
  }
  return name;
}

export function TKComputeSelectionExportFilename(
  dataset: TKDataset,
  extension: string
): string {
  let name = computeSelectionExportFileBasename(dataset);
  if (extension) {
    name += `.${extension}`;
  }
  return name;
}

// ////////////////////////////////////////////////////////////////////////////
// Write CSV file
// ////////////////////////////////////////////////////////////////////////////

export function TKDatasetExportCurrentCampToCSV(
  dataset: TKDataset,
  locale: string
) {
  TKCSVWriteCurrentCamp(
    dataset,
    TKComputeCampExportFilename(dataset, "csv"),
    locale
  );
}

// ////////////////////////////////////////////////////////////////////////////
// Write CSV file
// ////////////////////////////////////////////////////////////////////////////

export function TKDatasetExportCurrentSelectionToCSV(
  dataset: TKDataset,
  locale: string
) {
  TKCSVWriteCurrentSelection(
    dataset,
    TKComputeSelectionExportFilename(dataset, "csv"),
    locale
  );
}
