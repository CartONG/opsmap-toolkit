<template>
  <div class="pdf-document-container">
    <div class="pdf-document" ref="pdf-document">
      <div class="pdf-document-content">
        <TKSubmissionToPDFHeader :appConfig="appConfig" />
        <div class="header-separator"></div>
        <TKSubmissionToPDFHeadlines :appConfig="appConfig" :dataset="dataset" />
        <TKSubmissionToPDFIndicators
          :appConfig="appConfig"
          :dataset="dataset"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { TKOpsmapConfiguration } from "@/domain";
import { TKDatasetFilterer } from "@/domain/survey/TKDatasetFilterer";
import { Component, Vue, Prop } from "vue-property-decorator";
import { TKSubmissionVisualizerOptions } from "../TKSubmissionVisualizer";
import jsPDF from "jspdf";
import autoTable, {
  MarginPaddingInput,
  RowInput,
  UserOptions
} from "jspdf-autotable";

import { TKComputeExportFilename } from "@/domain/export/TKExportCommon";
import TKSubmissionToPDFHeader from "./TKSubmissionToPDFHeader.vue";
import TKSubmissionToPDFHeadlines from "./TKSubmissionToPDFHeadlines.vue";
import TKSubmissionToPDFIndicators from "./TKSubmissionToPDFIndicators.vue";

import { TKGetLocalValue } from "@/domain/ui/TKLabel";
import { TKIconUrl } from "@/domain/ui/TKIcons";
import { TKSubmissionThematic } from "@/domain/survey/TKSubmissionThematic";
import { TKTrafficLightValues } from "@/domain/fdf/TKTrafficLightValues";
import { TKPDFInfos } from "@/domain/survey/TKPDFInfos";

@Component({
  components: {
    TKSubmissionToPDFHeader,
    TKSubmissionToPDFHeadlines,
    TKSubmissionToPDFIndicators
  }
})
export default class TKSubmissionToPDF extends Vue {
  @Prop()
  readonly visualizerOptions!: TKSubmissionVisualizerOptions;

  @Prop()
  readonly dataset!: TKDatasetFilterer;

  @Prop()
  readonly appConfig!: TKOpsmapConfiguration;

  @Prop()
  readonly pdfInfos!: TKPDFInfos;

  mounted() {
    this.exportToPDF();
  }

  // ////////////////////////////////////////////////////////////////////////////////////////////////
  // EXPORT TO PDF
  // ////////////////////////////////////////////////////////////////////////////////////////////////
  /* eslint-disable @typescript-eslint/no-explicit-any */
  exportToPDF() {
    if (
      this.appConfig &&
      this.dataset &&
      this.dataset.currentCamp &&
      this.dataset.currentSubmission
    ) {
      const documentTitle = TKComputeExportFilename(this.dataset, "pdf");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4"
      });

      ///
      const submission = this.dataset.currentSubmission;
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
            const SPACING = 15;
            const TOTAL_SPACING_COUNT = 2 + this.pdfInfos.pdfColumnCount - 1;
            const TOTAL_SPACING = TOTAL_SPACING_COUNT * SPACING;

            const COLUMN_WIDTH = Math.round(
              (PAGE_WIDTH - TOTAL_SPACING) / this.pdfInfos.pdfColumnCount
            );

            const margins = [];
            for (let i = 0; i < this.pdfInfos.pdfColumnCount; i++) {
              margins.push({
                left: SPACING + (COLUMN_WIDTH + SPACING) * i,
                right:
                  PAGE_WIDTH -
                  COLUMN_WIDTH -
                  (SPACING + (COLUMN_WIDTH + SPACING) * i)
              });
            }

            const NONAUTOTABLECONTENTHEIGHT = 280;
            const drawPosition: Array<{
              startY: number;
              pageNumber: number;
            }> = [];

            for (let i = 0; i < this.pdfInfos.pdfColumnCount; i++) {
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
              indexColumn++;
              if (indexColumn === this.pdfInfos.pdfColumnCount) {
                indexColumn = 0;
              }
            }
            pdf.save(documentTitle);
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
    const headerHeight = 35;

    const iconURL = TKIconUrl(thematic.iconFileName);

    const iconProps = pdf.getImageProperties(iconURL);

    const iconContainerWidth = 35;
    const iconDisplayHeight = 15;

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
      if (item.type === "text") {
        let color = "#000000";
        switch (item.trafficLightColor) {
          case TKTrafficLightValues.OK:
            color = "#157815";
            break;
          case TKTrafficLightValues.WARNING:
            color = "#ffcc00";
            break;
          case TKTrafficLightValues.DANGER:
            color = "#cc7000";
            break;
          case TKTrafficLightValues.CRITICAL:
            color = "#cc0a00";
            break;
        }

        const row: RowInput = [];
        row.push({
          content: TKGetLocalValue(item.fieldLabel, this.$i18n.locale),
          styles: {
            halign: "left",
            fontSize: 9
          }
        });
        row.push({
          content: TKGetLocalValue(item.answerLabel, this.$i18n.locale),
          styles: {
            halign: "right",
            textColor: color,
            fontSize: 9,
            fontStyle: "bold"
          }
        });
        body.push(row);
      } else {
        if (
          item.type === "age_pyramid" ||
          item.type === "doughnut" ||
          item.type === "polar"
        ) {
          const props = pdf.getImageProperties(
            this.pdfInfos.currentChartsBase64[item.chartid]
          );
          const maxWidth = Math.min(columnWidth - 20, 150);
          const width = props.width > maxWidth ? maxWidth : props.width;
          const height = (props.height / props.width) * width;

          const row: RowInput = [];
          row.push({
            content: "",
            colSpan: 2,
            styles: {
              minCellHeight: height
            }
          });
          const str = this.pdfInfos.currentChartsBase64[item.chartid];
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
            colSpan: 2,
            styles: {
              valign: "middle",
              halign: "left",
              cellPadding: { left: iconContainerWidth },
              fillColor: "#f1f3f3",
              textColor: "#428fdf",
              minCellHeight: headerHeight,
              fontSize: 10
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
      alternateRowStyles: {
        fillColor: "#F9F9F9"
      },

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

/* SEPARATOR *********************************************************/
.header-separator {
  border: 0;
  height: 0;
  border-top: 1px solid #428fdf22;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}
</style>
