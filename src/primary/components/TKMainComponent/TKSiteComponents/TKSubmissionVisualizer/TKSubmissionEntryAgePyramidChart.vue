<template lang="html">
  <canvas :id="ctx" :height="height"></canvas>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  ChartConfiguration,
  Legend,
  LinearScale,
  Title,
  Tooltip
} from "chart.js";
import { TKSubmissionEntryAgePyramid } from "@/domain/survey/TKSubmissionEntry";
import { TKColors } from "@/domain/utils/TKColors";
import { v4 } from "uuid";
import { TKGetLocalValue } from "@/domain/utils/TKLabel";
import TKPDFInfosModule from "@/store/modules/pdfinfos/TKPDFInfosModule";

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  Legend,
  LinearScale,
  Title,
  Tooltip
);

@Component
export default class TKSubmissionItemAgePyramidChart extends Vue {
  @Prop()
  readonly entry!: TKSubmissionEntryAgePyramid;

  // charts
  chart!: Chart;
  readonly ctx = v4();

  height = 0;
  readonly barthickness = 15;

  // TODO : make this nice. translate, style customizable, etc.

  beforeMount() {
    if (this.entry) {
      this.height =
        this.entry.malesEntries.length * (this.barthickness - 1) + 240; // This is magic !
    }
  }

  mounted() {
    if (this.entry) {
      const config: ChartConfiguration = {
        type: "bar",
        data: {
          labels: this.generateLabels(),
          datasets: [
            {
              label: this.$root.$i18n.t("charts.female").toString(),
              data: this.generateFemalesDataset(),
              backgroundColor: TKColors.CHART_COLOR_1,
              barThickness: this.barthickness,
              minBarLength: 1,
              borderWidth: 2,
              borderColor: TKColors.DARK_GREY
            },
            {
              label: this.$root.$i18n.t("charts.male").toString(),
              data: this.generateMalesDataset(),
              backgroundColor: TKColors.CHART_COLOR_2,
              barThickness: this.barthickness,
              minBarLength: 1,
              borderWidth: 2,
              borderColor: TKColors.DARK_GREY
            }
          ]
        },
        options: {
          indexAxis: "y", // Make bar horizontal !
          responsive: true,
          maintainAspectRatio: false,
          font: {
            family: "Arial",
            size: 11
          },
          layout: {
            padding: 0
          },
          scales: this.generateScales(),
          plugins: {
            legend: {
              position: "bottom",
              reverse: true,
              labels: {
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
                  const value = Math.abs(Number(tooltipItem.raw));
                  let label = tooltipItem.dataset.label;
                  label = value > 1 ? label + "s" : label;
                  if (!label?.endsWith(":")) {
                    label += ":";
                  }
                  return label + value.toString();
                },
                title: function(tooltipItems): string {
                  const sum = tooltipItems.reduce(function(
                    accumulateur,
                    valeurCourante
                  ): number {
                    return accumulateur + Math.abs(Number(valeurCourante.raw));
                  },
                  0);
                  let label = tooltipItems[0].label;
                  if (!label?.endsWith(":")) {
                    label += ":";
                  }
                  return label + " " + sum.toString();
                }
              },
              titleFont: {
                family: "Arial",
                size: 11
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
    this.chart.data.datasets[0].data = this.generateFemalesDataset();
    this.chart.data.datasets[1].data = this.generateMalesDataset();

    this.chart.update();
  }

  @Watch("$root.$i18n.locale")
  onLocalChanged() {
    if (this.chart.options.plugins && this.chart.options.plugins.title) {
      this.chart.options.plugins.title.text = TKGetLocalValue(
        this.entry.title,
        this.$i18n.locale
      );
    }

    this.chart.data.datasets[0].label = this.$root.$i18n
      .t("charts.female")
      .toString();

    this.chart.data.datasets[1].label = this.$root.$i18n
      .t("charts.male")
      .toString();

    if (this.chart.config.options) {
      this.chart.config.options.scales = this.generateScales();
    }

    this.chart.update();
  }

  generateLabels(): Array<string> {
    if (this.entry) {
      return this.entry.femalesLabels.map(item =>
        item.en
          .replace("Females ", "")
          .replace("(", "")
          .replace(")", "")
      );
    } else {
      return [];
    }
  }

  generateMalesDataset(): Array<number> {
    if (this.entry) {
      return this.entry.malesEntries.map(item => -1 * item);
    } else {
      return [];
    }
  }

  generateFemalesDataset(): Array<number> {
    if (this.entry) {
      return this.entry.femalesEntries;
    } else {
      return [];
    }
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */

  generateScales(): any {
    return {
      x: {
        ticks: {
          callback: (value: string): string => {
            let mynumber = 0;
            if (typeof value === "string") {
              mynumber = parseInt(value);
            } else if (typeof value === "number") {
              mynumber = value;
            }
            mynumber = mynumber < 0 ? 0 - mynumber : mynumber;
            return mynumber.toString();
          },
          color: TKColors.SECONDARY
        },
        title: {
          align: "end",
          color: TKColors.DARK_GREY,
          display: true,
          text: this.$root.$i18n.t("charts.titleX").toString()
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          display: false
        },
        stacked: true,
        ticks: {
          color: TKColors.SECONDARY
        },
        title: {
          align: "end",
          color: TKColors.DARK_GREY,
          display: true,
          text: this.$root.$i18n.t("charts.titleY").toString()
        }
      }
    };
  }
}
</script>
