<script>
import { Line, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: Line,
  props: {
    chartdata: {
      type: Object,
      default: null
    },
    options: {
      type: Object,
      default: null
    }
  },
  mixins: [reactiveProp],
  data() {
    return {
      gradient: null,
      gradient2: null
    };
  },
  methods: {
    render() {
      this.renderChart();
    }
  }
};
</script>
