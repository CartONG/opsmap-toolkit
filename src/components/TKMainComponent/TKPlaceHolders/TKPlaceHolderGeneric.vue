<template lang="html">
  <div class="tk-placeholder"></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class TKPlaceHolderGeneric extends Vue {}
</script>

<style scoped>
.tk-placeholder {
  overflow: hidden;
  width: 100%;
  height: 100%;
  opacity: 1;
  background: rgb(243, 243, 243);
  background: linear-gradient(
    90deg,
    rgba(243, 243, 243, 1) 0%,
    rgba(243, 243, 243, 1) 45%,
    rgba(246, 246, 246, 1) 50%,
    rgba(243, 243, 243, 1) 55%,
    rgba(243, 243, 243, 1) 100%
  );
  background-size: 200% 20px;
  animation: place-holder-gradient 1.5s cubic-bezier(0.3, 0, 0.7, 1) infinite;
}

@keyframes place-holder-gradient {
  0% {
    background-position: 100% 50%;
  }
  50% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}
</style>
