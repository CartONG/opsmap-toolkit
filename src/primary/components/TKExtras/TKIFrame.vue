<template lang="html">
  <div class="tk-iframe-container">
    <iframe id="tk-iframe" :src="url"></iframe>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({})
export default class TKIFrame extends Vue {
  @Prop()
  readonly url!: string;
}
</script>

<style scoped>
.tk-iframe-container {
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  overflow: hidden;
  min-height: 800px;
}

#tk-iframe {
  border: 2px solid #f1f3f3;
  box-sizing: border-box;
  flex-grow: 1;
  margin: 0;
  padding: 0;
}
</style>
