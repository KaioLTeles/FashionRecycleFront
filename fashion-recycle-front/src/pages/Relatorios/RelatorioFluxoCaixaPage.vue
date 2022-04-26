<template>
  <div>
    <v-container>
      <v-card color="disabledGrey" outlined> </v-card>

      <div class="text-center ma-2"></div>
      <RelatorioFluxoCaixa />
    </v-container>
  </div>
</template>

<script>
import RelatorioFluxoCaixa from "@/components/Relatorios/RelatorioFluxoCaixa.vue";

export default {
  name: "CadastroDeClientePage",
  components: { RelatorioFluxoCaixa },
  data() {
    return {};
  },
};
</script>

<style scoped></style>
