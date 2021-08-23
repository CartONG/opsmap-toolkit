import { TKDatasetFilterer } from "@/domain/survey/TKDatasetFilterer";
import { TKComputeExportFilename } from "./TKExportCommon";

import { jsPDF, jsPDFOptions } from "jspdf";

// ////////////////////////////////////////////////////////////////////////////
// Temaplted Read method for csv inputs
// ////////////////////////////////////////////////////////////////////////////

export function TKPDFWrite(dataset: TKDatasetFilterer, locale: string) {
  if (dataset.currentSubmission) {
    const documentTitle = TKComputeExportFilename(dataset, "pdf");

    const doc = new jsPDF();

    doc.save(documentTitle);
  }
}
