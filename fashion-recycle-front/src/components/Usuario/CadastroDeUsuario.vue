<template>
  <div>
    <v-card class="margin-bottom-1-em">
      <v-card-title>
        <v-toolbar-title class="title">Gestão de Usuarios</v-toolbar-title>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>          
          <v-col>
            <v-text-field
              dense
              label="Nome"
              v-model="nomeFilter"
              clearable
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              dense
              label="E-mail"
              v-model="emailFilter"
              clearable
            ></v-text-field>
          </v-col>
        </v-row>
        <v-card-actions>
          <v-btn color="btnPrimary" @click="pesquisar()"> Pesquisar </v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-actions>
        <v-col class="text-right">
          <v-btn @click="criarUsuario()" dark color="btnPrimary">Novo</v-btn>
        </v-col>
      </v-card-actions>

      <v-card-text>
        <v-data-table
          :headers="headers"
          item-key="codigo"
          :items="listaUsuarios"
          :loading="loadingDataTable"
        >
          <template v-slot:[`item.action`]="{ item }">
            <v-icon color="btnPrimary" @click.stop="alterarUsuario(item)"
              >mdi-pencil</v-icon
            >
          </template>
          <template v-slot:[`item.active`]="{ item }">
            <v-simple-checkbox
              v-model="item.active"
              disabled
            ></v-simple-checkbox>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <CadastroDeUsuarioModal
      v-model="mostrarJanela"
      :codigoUsuario="codigoUsuario"
      @resetarcodigoUsuario="resetarcodigoUsuario"
    />
  </div>
</template>

<script>
import CadastroDeUsuarioModal from "./CadastroDeUsuarioModal";

import { BUSCARTODOSOSUSUARIOS } from "@/store/types/UsuarioType";

import { SET_MESSAGE } from "@/store/types/NotificationType";

export default {
  components: { CadastroDeUsuarioModal },
  data() {
    return {
      headers: [
        { text: "Usuario", value: "userName" },
        { text: "Nome", value: "name" }, 
        { text: "Email", value: "email" },        
        { text: "Ativo", value: "active" },
        { text: "Ações", value: "action", sortable: false },
      ],
      mostrarJanela: false,
      nomeFilter: "",
      codigoUsuario: 0,
      emailFilter: "",
      loadingDataTable: false,
    };
  },
  methods: {
    criarUsuario() {
      this.mostrarJanela = true;
    },
    alterarUsuario(item) {
      this.codigoUsuario = item.id;
      this.mostrarJanela = true;
    },
    pesquisar() {
      let payload = {        
        name: this.nomeFilter,
        email: this.emailFilter
      };

      this.loadingDataTable = true;

      this.buscarUsuarios(payload);
    },
    async buscarUsuarios(payload) {
      await this.$store
        .dispatch(BUSCARTODOSOSUSUARIOS, payload)
        .then(() => {
          this.loadingDataTable = false;
        })
        .catch((error) => {
          if (error) {
            this.loadingDataTable = false;
            let payload = {
              message: "Ocorreu um erro ao carregar a lista dos usuarios",
              color: "error",
            };
            this.alertaParaUsuario(payload);
          }
        });
    },
    alertaParaUsuario(payload) {
      this.$store.commit(SET_MESSAGE, payload);
    },
    resetarcodigoUsuario() {
      this.codigoUsuario = 0;
    },
  },
  created() {},
  computed: {
    listaUsuarios() {
      return this.$store.state.UsuarioStore.listaTodosOsUsuarios;
    },
  },
};
</script>

<style scoped>
.margin-bottom-1-em {
  margin-bottom: 0.5em;
}
</style>
