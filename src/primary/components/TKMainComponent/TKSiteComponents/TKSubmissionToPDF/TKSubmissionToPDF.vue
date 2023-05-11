<template>
  <div class="pdf-document-container">
    <div class="pdf-document" ref="pdf-document">
      <div class="pdf-document-content">
        <TKSubmissionToPDFHeadlines />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import jsPDF from "jspdf";
import autoTable, {
  CellDef,
  MarginPaddingInput,
  RowInput,
  UserOptions
} from "jspdf-autotable";

import TKSubmissionToPDFHeadlines from "./TKSubmissionToPDFHeadlines.vue";

import { TKGetLocalValue } from "@/domain/utils/TKLabel";
import { IconPosition, TKIconUrl } from "@/domain/utils/TKIconUrl";
import { TKSubmissionThematic } from "@/domain/survey/TKSubmissionThematic";
import { TKTrafficLightValues } from "@/domain/fdf/TKFDFTrafficLight";
import { TKSubmissionEntryType } from "@/domain/survey/TKSubmissionEntry";
import TKDatasetModule from "@/store/modules/dataset/TKDatasetModule";
import TKPDFInfosModule from "@/store/modules/pdfinfos/TKPDFInfosModule";
import { TKColors } from "@/domain/utils/TKColors";

@Component({
  components: {
    TKSubmissionToPDFHeadlines
  }
})
export default class TKSubmissionToPDF extends Vue {
  mounted() {
    this.exportToPDF();
  }

  // ////////////////////////////////////////////////////////////////////////////////////////////////
  // EXPORT TO PDF
  // ////////////////////////////////////////////////////////////////////////////////////////////////
  /* eslint-disable @typescript-eslint/no-explicit-any */
  exportToPDF() {
    if (
      TKDatasetModule.dataset &&
      TKDatasetModule.dataset.currentSite &&
      TKDatasetModule.dataset.currentSubmission
    ) {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4"
      });

      ///
      const submission = TKDatasetModule.dataset.currentSubmission;
      this.$nextTick(function() {
        const divContent = this.$refs["pdf-document"] as HTMLElement;
        pdf
          .html(divContent, {
            x: 0,
            y: 0,
            html2canvas: { scale: 0.75 }
          })
          .then(() => {
            const PAGE_WIDTH = 595;
            const SPACING = 10;
            const TOTAL_SPACING_COUNT = 2 + TKPDFInfosModule.columnCount - 1;
            const TOTAL_SPACING = TOTAL_SPACING_COUNT * SPACING;

            const COLUMN_WIDTH = Math.round(
              (PAGE_WIDTH - TOTAL_SPACING) / TKPDFInfosModule.columnCount
            );
            const NONAUTOTABLECONTENTHEIGHT = 130 + SPACING;

            const margins = [];
            for (let i = 0; i < TKPDFInfosModule.columnCount; i++) {
              margins.push({
                left: SPACING + (COLUMN_WIDTH + SPACING) * i,
                right:
                  PAGE_WIDTH -
                  COLUMN_WIDTH -
                  (SPACING + (COLUMN_WIDTH + SPACING) * i)
              });
            }

            const drawPosition: Array<{
              startY: number;
              pageNumber: number;
            }> = [];

            for (let i = 0; i < TKPDFInfosModule.columnCount; i++) {
              drawPosition.push({
                startY: NONAUTOTABLECONTENTHEIGHT,
                pageNumber: (pdf.internal as any).getNumberOfPages()
              });
            }

            let indexColumn = 0;
            for (const key in submission.thematics) {
              const thematic = submission.thematics[key];

              const p = drawPosition[indexColumn];

              pdf.setPage(p.pageNumber);
              autoTable(
                pdf,
                this.createTable(
                  pdf,
                  p.startY,
                  margins[indexColumn],
                  thematic,
                  COLUMN_WIDTH
                )
              );

              p.pageNumber =
                (pdf as any).lastAutoTable.startPageNumber +
                ((pdf as any).lastAutoTable.pageCount - 1);
              p.startY = (pdf as any).lastAutoTable.finalY + 15;

              // Option 1 - Least Filled Column
              let min = drawPosition[0];
              indexColumn = 0;
              for (let i = 1; i < drawPosition.length; i++) {
                if (
                  drawPosition[i].pageNumber < min.pageNumber ||
                  (drawPosition[i].pageNumber === min.pageNumber &&
                    drawPosition[i].startY < min.startY)
                ) {
                  indexColumn = i;
                  min = drawPosition[i];
                }
              }

              // Option 2 - Round Robin
              // indexColumn++;
              // if (indexColumn === TKPDFInfosModule.columnCount) {
              //   indexColumn = 0;
              // }
            }

            const pageCount = pdf.getNumberOfPages(); //Total Page Number
            for (let i = 0; i < pageCount; i++) {
              const pageCurrent = i + 1;
              pdf.setPage(i + 1);
              pdf.setFontSize(10);
              pdf.setTextColor(TKColors.DARK_GREY);
              pdf.text(
                pageCurrent + "/" + pageCount,
                pdf.internal.pageSize.width / 2 - 10,
                pdf.internal.pageSize.height - 10
              );
            }

            const pdfDocument = pdf.output("bloburi");
            window.open(pdfDocument.toString(), "_blank");
            this.$emit("close-dialog");
          });
      });
    }
  }

  createTable(
    pdf: jsPDF,
    startY: number,
    margins: MarginPaddingInput,
    thematic: TKSubmissionThematic,
    columnWidth: number
  ): UserOptions {
    const headerHeight = 25;
    const iconURL = TKIconUrl(thematic.iconFileName, IconPosition.MAP);
    const iconProps = pdf.getImageProperties(iconURL);
    const iconContainerWidth = 35;
    const iconDisplayHeight = 10;
    const iconDisplayWidth =
      (iconProps.width / iconProps.height) * iconDisplayHeight;
    const iconDisplayX = iconContainerWidth / 2.0 - iconDisplayWidth / 2.0;
    const iconDisplayY = headerHeight / 2.0 - iconDisplayHeight / 2.0;

    const body = [];

    const charts: Record<
      number,
      {
        base64: string;
        width: number;
        height: number;
      }
    > = {};

    for (let i = 0; i < thematic.data.length; i++) {
      const item = thematic.data[i];
      if (item.type === TKSubmissionEntryType.TEXT) {
        let color = TKColors.DARK_GREY as string;
        switch (item.trafficLightColor) {
          case TKTrafficLightValues.OK:
            color = TKColors.TRAFFICLIGHT_PDF_OK;
            break;
          case TKTrafficLightValues.WARNING:
            color = TKColors.TRAFFICLIGHT_PDF_WARNING;
            break;
          case TKTrafficLightValues.DANGER:
            color = TKColors.TRAFFICLIGHT_PDF_DANGER;
            break;
          case TKTrafficLightValues.CRITICAL:
            color = TKColors.TRAFFICLIGHT_PDF_CRITICAL;
            break;
          default:
            color = TKColors.TRAFFICLIGHT_PDF_UNDEFINED;
        }

        const field: CellDef = {
          content: TKGetLocalValue(item.fieldLabel, this.$i18n.locale),
          styles: {
            halign: "left",
            fontSize: 7,
            cellPadding: {
              top: 5
            }
          }
        };
        const answer: CellDef = {
          content: TKGetLocalValue(item.answerLabel, this.$i18n.locale),
          styles: {
            halign: "left",
            textColor: color,
            fontSize: 7,
            fontStyle: "bold",
            cellPadding: {
              left: 0,
              top: 2
            }
          }
        };

        body.push([field]);
        body.push([answer]);
      } else {
        if (
          item.type === TKSubmissionEntryType.CHART_PYRAMID ||
          item.type === TKSubmissionEntryType.CHART_DOUGHNUT ||
          item.type === TKSubmissionEntryType.CHART_POLAR ||
          item.type === TKSubmissionEntryType.CHART_RADAR
        ) {
          const props = pdf.getImageProperties(
            TKPDFInfosModule.currentChartsBase64[item.chartid]
          );
          const maxWidth = Math.min(columnWidth - 20, 150);
          const width = props.width > maxWidth ? maxWidth : props.width;
          const height = (props.height / props.width) * width;

          const row: RowInput = [];
          row.push({
            content: "",
            styles: {
              minCellHeight: height
            }
          });
          const str = TKPDFInfosModule.currentChartsBase64[item.chartid];
          charts[body.length] = {
            base64: str,
            width: width,
            height: height
          };

          body.push(row);
        }
      }
    }

    return {
      // Content
      head: [
        [
          {
            content: TKGetLocalValue(thematic.nameLabel, this.$i18n.locale),
            styles: {
              valign: "middle",
              halign: "left",
              cellPadding: { left: iconContainerWidth },
              fillColor: TKColors.BACKGROUND,
              textColor: TKColors.DARK_GREY,
              lineColor: TKColors.DARK_GREY,
              lineWidth: 1,
              minCellHeight: headerHeight,
              fontSize: 8
            }
          }
        ]
      ],
      body: body,

      // Position in the document
      startY: startY,
      margin: margins,
      rowPageBreak: "avoid",

      // Style
      theme: "plain",

      // Thematic logo inside the header
      didDrawCell: function(data) {
        if (data.row.section === "head") {
          pdf.addImage(
            iconURL,
            "PNG",
            data.cell.x + iconDisplayX,
            data.cell.y + iconDisplayY,
            iconDisplayWidth,
            iconDisplayHeight
          );
        } else {
          if ((data.row.raw as RowInput).length === 1) {
            if (charts[data.row.index]) {
              const width = charts[data.row.index].width;
              const height = charts[data.row.index].height;
              const x = (data.cell.width - width) / 2;
              const y = (data.cell.height - height) / 2;
              pdf.addImage(
                charts[data.row.index].base64,
                "PNG",
                data.cell.x + x,
                data.cell.y + y,
                width,
                height
              );
            }
          }
        }
      }
    };
  }
}
</script>

<style scoped>
.pdf-document-container {
  width: 0;
  height: 0;
  overflow: hidden;
}

/* A4 = 8.27x11.69" x 72points/inch = 595x842 points */
/* 595x842 points */
.pdf-document {
  background-color: #fff;
  padding: 5mm;
  width: 210mm;
  min-height: 296mm; /* Exact 297mm creates an extra blank page. */
}

.pdf-document-content {
  background-color: #fff;
  height: 100%;
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  row-gap: 3mm;
  overflow: hidden;
}
</style>
