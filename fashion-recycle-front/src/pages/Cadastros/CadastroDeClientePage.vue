<template>
  <div>
    <v-container>
      <v-card color="disabledGrey" outlined> </v-card>

      <div class="text-center ma-2"></div>
      <CadastroDeCliente />
    </v-container>
  </div>
</template>

<script>
import CadastroDeCliente from "@/components/Cadastros/Cliente/CadastroDeCliente.vue";

export default {
  name: "CadastroDeClientePage",
  components: { CadastroDeCliente },
  data() {
    return {};
  },
};
</script>

<style scoped></style>
