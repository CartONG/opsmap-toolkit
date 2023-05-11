<template lang="html">
  <canvas :id="ctx" :height="height"> </canvas>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import {
  ArcElement,
  Chart,
  ChartConfiguration,
  DoughnutController,
  Legend,
  Title,
  Tooltip
} from "chart.js";
import { v4 } from "uuid";
import { TKSubmissionEntryDoughnut } from "@/domain/survey/TKSubmissionEntry";
import { TKGetLocalValue } from "@/domain/utils/TKLabel";
import TKPDFInfosModule from "@/store/modules/pdfinfos/TKPDFInfosModule";
import { TKColors } from "@/domain/utils/TKColors";

Chart.register(DoughnutController, ArcElement, Legend, Title, Tooltip);

@Component
export default class TKSubmissionItemDoughnutChart extends Vue {
  @Prop()
  readonly entry!: TKSubmissionEntryDoughnut;

  // charts
  chart!: Chart;
  readonly ctx = v4();
  readonly height = 300;
  readonly colors = [
    TKColors.CHART_COLOR_6,
    TKColors.CHART_COLOR_7,
    TKColors.CHART_COLOR_8,
    TKColors.CHART_COLOR_4,
    TKColors.CHART_COLOR_5
  ];

  mounted() {
    if (this.entry) {
      const config: ChartConfiguration = {
        type: "doughnut",
        data: {
          labels: this.generateLabels(),
          datasets: [
            {
              data: this.generateValues(),
              backgroundColor: this.colors
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          elements: {
            arc: {
              borderColor: TKColors.DARK_GREY,
              borderWidth: 2
            }
          },
          font: {
            family: "Arial",
            size: 11
          },
          layout: {
            padding: 10
          },
          plugins: {
            legend: {
              position: "bottom",
              align: "start",
              reverse: true,
              labels: {
                boxWidth: 15,
                color: TKColors.SECONDARY,
                font: {
                  family: "Arial",
                  size: 11
                }
              }
            },
            tooltip: {
              callbacks: {
                label: function(tooltipItem): string {
                  return tooltipItem.label.replace("NaN", "-");
                }
              },
              bodyFont: {
                family: "Arial",
                size: 11
              }
            }
          },
          animation: {
            onComplete: this.updateBase64data
          }
        }
      };

      if (this.chart) {
        this.chart.destroy();
      }
      this.chart = new Chart(this.ctx, config);
    }
  }

  updateBase64data() {
    TKPDFInfosModule.currentChartsBase64[
      this.entry.chartid
    ] = this.chart.toBase64Image("image/png", 1);
  }

  @Watch("entry")
  onEntryChanged() {
    // Update labels and data Labels
    this.chart.data.labels = this.generateLabels();
    this.chart.data.datasets[0].data = this.generateValues();

    this.chart.update();
  }

  @Watch("$root.$i18n.locale")
  onLocalChanged() {
    this.chart.data.labels = this.generateLabels();
    this.chart.update();
  }

  generateValues(): Array<number> {
    if (this.entry) {
      return this.entry.entries.map(item => item.value);
    } else {
      return [];
    }
  }

  generateLabels(): Array<string> {
    if (this.entry) {
      return this.entry.entries.map(
        item =>
          TKGetLocalValue(item.label, this.$root.$i18n.locale) +
          " " +
          item.value.toString().replace("NaN", "-")
      );
    } else {
      return [];
    }
  }
}
</script>
