<template>
  <div>
    <v-container>
      <v-card color="disabledGrey" outlined> </v-card>

      <div class="text-center ma-2"></div>
      <CadastroDeFornecedor />
    </v-container>
  </div>
</template>

<script>
import CadastroDeFornecedor from "@/components/Cadastros/CadastroDeFornecedor.vue";

export default {
  name: "CadastroDeFornecedorPage",
  components: { CadastroDeFornecedor },
  data() {
    return {};
  },
};
</script>

<style scoped></style>
