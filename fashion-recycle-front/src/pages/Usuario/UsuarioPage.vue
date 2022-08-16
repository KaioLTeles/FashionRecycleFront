<template>
  <div>
    <v-container>
      <v-card color="disabledGrey" outlined> </v-card>

      <div class="text-center ma-2"></div>
      <CadastroDeUsuario />
    </v-container>
  </div>
</template>

<script>
import CadastroDeUsuario from "@/components/Usuario/CadastroDeUsuario";

export default {
  components: { CadastroDeUsuario },
  data() {
    return {};
  },
};
</script>

<style scoped></style>
