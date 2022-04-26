<template>
  <div>
    <v-card class="margin-bottom-1-em">
      <v-card-title>
        <v-toolbar-title class="title">Cadastro de Clientes</v-toolbar-title>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <v-col>
            <v-text-field
              dense
              v-model="codigoClienteFilter"
              type="number"
              label="Codigo Cliente"
              clearable
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              dense
              v-model="nomeClienteFilter"
              label="Nome Cliente"
              clearable
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              dense
              v-model="cpfClienteFilter"
              label="CPF"
              type="number"
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
          <v-btn @click="criarCliente()" dark color="btnPrimary">Novo</v-btn>
        </v-col>
      </v-card-actions>

      <v-card-text>
        <v-data-table
          :headers="headers"
          item-key="codigo"
          :items="listClientes"
          :loading="loadingDataTable"
        >
          <template v-slot:[`item.action`]="{ item }">
            <v-icon color="btnPrimary" @click.stop="alterCliente(item)"
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
    <CadastroDeClienteModal
      v-model="mostrarJanela"
      :codigoCliente="codigoCliente"
      @resetarCodigoCliente="resetarCodigoCliente"
    />
  </div>
</template>

<script>
import {
  BUSCARTODOSCLIENTES,
  EMPTYBUSCARCLIENTEPELOID,
} from "@/store/types/ClienteType";

import { SET_MESSAGE } from "@/store/types/NotificationType";

import CadastroDeClienteModal from "./CadastroDeClienteModal";

export default {
  components: { CadastroDeClienteModal },
  data() {
    return {
      headers: [
        { text: "Código", value: "id" },
        { text: "Nome", value: "name" },
        { text: "Email", value: "email" },
        { text: "Telefone", value: "phoneNumber" },
        { text: "Cpf", value: "cpf" },
        { text: "Ativo", value: "active" },
        { text: "Ações", value: "action", sortable: false },
      ],
      codigoClienteFilter: "",
      nomeClienteFilter: "",
      cpfClienteFilter: "",
      loadingDataTable: false,
      mostrarJanela: false,
      codigoCliente: 0,
    };
  },
  methods: {
    criarCliente() {
      this.$store.commit(EMPTYBUSCARCLIENTEPELOID);
      this.codigoCliente = 0;
      this.mostrarJanela = true;
    },
    alterCliente(item) {
      this.$store.commit(EMPTYBUSCARCLIENTEPELOID);
      this.codigoCliente = item.id;
      this.mostrarJanela = true;
    },
    pesquisar() {
      let payload = {
        idClient: parseInt(this.codigoClienteFilter),
        nameClient: this.nomeClienteFilter,
        cpfClient: this.cpfClienteFilter,
      };

      this.loadingDataTable = true;

      this.buscarDadosClientes(payload);
    },
    async buscarDadosClientes(payload) {
      await this.$store
        .dispatch(BUSCARTODOSCLIENTES, payload)
        .then(() => {
          this.loadingDataTable = false;
        })
        .catch((error) => {
          if (error) {
            this.loadingDataTable = false;
            let payload = {
              message: "Ocorreu um erro ao carregar os dados de cliente",
              color: "error",
            };
            this.alertaParaUsuario(payload);
          }
        });
    },
    alertaParaUsuario(payload) {
      this.$store.commit(SET_MESSAGE, payload);
    },
    resetarCodigoCliente() {
      this.codigoCliente = 0;
    },
  },
  created() {},
  computed: {
    listClientes() {
      return this.$store.state.ClienteStore.clientList;
    },
  },
};
</script>

<style scoped>
.margin-bottom-1-em {
  margin-bottom: 0.5em;
}
</style>
