<template>
  <div>
    <v-container>
      <v-card color="disabledGrey" outlined> </v-card>

      <div class="text-center ma-2"></div>
      <CadastroDeProdutos />
    </v-container>
  </div>
</template>

<script>
import CadastroDeProdutos from "@/components/Cadastros/CadastroDeProdutos";

export default {
  name: "CadastroDeFornecedorPage",
  components: { CadastroDeProdutos },
  data() {
    return {};
  },
};
</script>

<style scoped></style>
