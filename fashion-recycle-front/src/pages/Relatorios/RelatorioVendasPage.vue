<template>
  <div>
    <v-container>
      <v-card color="disabledGrey" outlined> </v-card>

      <div class="text-center ma-2"></div>
      <RelatorioVendas />
    </v-container>
  </div>
</template>

<script>
import RelatorioVendas from "@/components/Relatorios/RelatorioVendas.vue";

export default {
  name: "RelatorioVendasPage",
  components: { RelatorioVendas },
  data() {
    return {};
  },
};
</script>

<style scoped></style>
