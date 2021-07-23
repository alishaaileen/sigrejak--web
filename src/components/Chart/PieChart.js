import { Pie, mixins } from "vue-chartjs";
const { reactiveProp } = mixins;

export default {
  extends: Pie,
  mixins: [reactiveProp],
  props: ["chartData", "options"],
  mounted() {
    // this.chartData is created in the mixin.
    // If you want to pass options please create a local options object
    this.renderChart(this.chartData, this.options);
    // this.renderChart(this.chartData,
    //   {
    //     borderWidth: "10px",
    //     hoverBackgroundColor: "red",
    //     hoverBorderWidth: "10px"
    //   },
    //   { responsive: true, maintainAspectRatio: false }
    // );
  }
};
