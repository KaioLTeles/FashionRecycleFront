<template>
  <div>
    <v-container>
      <v-card color="disabledGrey" outlined> </v-card>

      <div class="text-center ma-2"></div>
      <RelatorioContasAReceber />
    </v-container>
  </div>
</template>

<script>
import RelatorioContasAReceber from "@/components/Relatorios/RelatorioContasAReceber.vue";

export default {
  name: "RelatorioDeContasAReceber",
  components: { RelatorioContasAReceber },
  data() {
    return {};
  },
};
</script>

<style scoped></style>
