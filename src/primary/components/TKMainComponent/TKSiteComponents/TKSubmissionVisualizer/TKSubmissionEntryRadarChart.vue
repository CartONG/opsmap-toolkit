<template lang="html">
  <canvas :id="ctx" :height="height"> </canvas>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

import { v4 } from "uuid";
import { TKSubmissionEntryRadar } from "@/domain/survey/TKSubmissionEntry";
import { TKGetLocalValue } from "@/domain/utils/TKLabel";

import {
  Chart,
  ChartConfiguration,
  Legend,
  LineElement,
  PointElement,
  RadarController,
  RadialLinearScale,
  Title,
  Tooltip
} from "chart.js";
import TKPDFInfosModule from "@/store/modules/pdfinfos/TKPDFInfosModule";
import { TKColors } from "@/domain/utils/TKColors";

Chart.register(
  RadarController,
  RadialLinearScale,
  Legend,
  LineElement,
  PointElement,
  Title,
  Tooltip
);

@Component
export default class TKSubmissionItemRadarChart extends Vue {
  @Prop()
  readonly entry!: TKSubmissionEntryRadar;

  // charts
  chart!: Chart;
  readonly ctx = v4();
  readonly height = 300;

  readonly color = TKColors.CHART_COLOR_1;

  mounted() {
    if (this.entry) {
      const config: ChartConfiguration = {
        type: "radar",
        data: {
          labels: this.generateLabels(),
          datasets: [
            {
              data: this.generateValues(),
              backgroundColor: this.color
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
          scales: {
            r: {
              ticks: {
                color: TKColors.SECONDARY
              },
              display: true,
              pointLabels: {
                callback: function(label: string, index: number): string {
                  return label.length > 25
                    ? label.substring(0, 25) + "..."
                    : label;
                }
              }
            }
          },
          font: {
            family: "Arial",
            size: 11
          },
          layout: {
            padding: 0
          },
          plugins: {
            title: {
              display: true,
              text: TKGetLocalValue(this.entry.title, this.$i18n.locale),
              font: {
                family: "Arial",
                size: 12
              }
            },
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function(tooltipItem): string {
                  tooltipItem.label.replace("NaN", "-");
                  return tooltipItem.label;
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
