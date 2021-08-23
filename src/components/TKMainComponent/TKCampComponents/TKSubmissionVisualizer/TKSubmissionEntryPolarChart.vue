<template lang="html">
  <div>
    <canvas :id="ctx" :height="height"> </canvas>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

import { v4 } from "uuid";
import { TKSubmissionEntryPolar } from "@/domain/survey/TKSubmissionEntry";
import { TKGetLocalValue } from "@/domain/ui/TKLabel";

import {
  Chart,
  ChartConfiguration,
  Legend,
  PolarAreaController,
  RadialLinearScale,
  Title,
  Tooltip
} from "chart.js";
import { TKPDFInfos } from "@/domain/survey/TKPDFInfos";

Chart.register(PolarAreaController, RadialLinearScale, Legend, Title, Tooltip);

@Component
export default class TKSubmissionItemPolarChart extends Vue {
  @Prop()
  readonly entry!: TKSubmissionEntryPolar;

  @Prop()
  readonly pdfInfos!: TKPDFInfos;

  // charts
  chart!: Chart;
  readonly ctx = v4();
  readonly height = 300;
  readonly colors = [
    "rgba(255, 51, 92, 0.5)",
    "rgba(18, 191, 206, 0.5)",
    "rgba(198, 236, 174, 0.5)",
    "#642b50",
    "#8b9376",
    "#b2916c"
  ];

  mounted() {
    if (this.entry) {
      const config: ChartConfiguration = {
        type: "polarArea",
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
              borderColor: "#d8d8d8",
              borderWidth: 1
            }
          },
          scales: {
            r: {
              ticks: {
                backdropColor: "#f1f3f3"
              },
              display: true
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
              position: "bottom",
              align: "start",
              reverse: true,
              labels: {
                boxWidth: 15,
                font: {
                  family: "Arial",
                  size: 11
                }
              }
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
    this.pdfInfos.currentChartsBase64[
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
