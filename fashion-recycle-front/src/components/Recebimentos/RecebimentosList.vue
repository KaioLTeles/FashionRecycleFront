<template>
  <div>
    <v-card class="margin-bottom-1-em">
      <v-card-title>
        <v-toolbar-title class="title">Contas a Receber</v-toolbar-title>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <v-col cols="4">
            <v-menu
              v-model="dateInicial.initialMenuDate"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  dense
                  v-model="initialDateFormatted"
                  label="Data Inicial"
                  prepend-icon="fa-calendar-alt"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="dateInicial.initialDate"
                @input="dateInicial.initialMenuDate = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="4">
            <v-menu
              v-model="dateFinal.initialMenuDate"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  dense
                  v-model="finalDateFormatted"
                  label="Data Final"
                  prepend-icon="fa-calendar-alt"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="dateFinal.initialDate"
                @input="dateFinal.initialMenuDate = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="4">
            <v-autocomplete
              dense
              label="Comprador"
              :items="listaDeClientes"
              item-value="id"
              item-text="name"
              v-model="clientForm"
              clearable              
              :loading="loadingCampoCliente"
            ></v-autocomplete>
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
          <v-btn @click="salvar()" dark color="btnPrimary">Salvar</v-btn>
        </v-col>
      </v-card-actions>

      <v-card-text>
        <v-data-table
          :headers="headers"
          item-key="id"
          :items="listaRecebimento"
          :loading="loadingDataTable"
          show-select
          single-select
          v-model="selected"
          class="elevation-1"
        >
        <template v-slot:[`item.status`]="{ item }">
            {{ item.status == true ? "Recebido" : "Em Aberto" }}
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { BUSCARTODOSRECEBIMENTOS, ALTERARRECEBIMENTO } from "@/store/types/PagamentosType";

import { BUSCARLISTACLIENTERESUMIDA } from "@/store/types/ClienteType";

import { SET_MESSAGE } from "@/store/types/NotificationType";

export default {
  components: {},
  data() {
    return {
      headers: [
        { text: "Data da Venda", value: "saleDateFormated" },
        { text: "Comprador", value: "clientName" },
        { text: "Histórico", value: "name" },        
        { text: "Valor", value: "amout" },
        { text: "Data a Receber", value: "recieveDateFormated" },
        { text: "Status", value: "status" },        
      ],
      codigoFilter: "",
      clientForm: 0,
      selected: [],
      fornecedorFilter: null,
      parceiroFilter: null,
      loadingDataTable: false,
      loadingCampoCliente: false,
      dateInicial: {
        todayDate: new Date().toISOString().substr(0, 10),
        initialMenuDate: false,
        initialDate: new Date().toISOString().substr(0, 10),
      },
      dateFinal: {
        todayDate: new Date().toISOString().substr(0, 10),
        initialMenuDate: false,
        initialDate: new Date().toISOString().substr(0, 10),
      },
    };
  },
  methods: {
    salvar() {
      if (this.selected.length > 0) {
        this.alterarStatusRecebimento(this.selected[0].id);

      } else {
        let payload = {
          message: "Nenhum recebimento selecionado!",
          color: "warning",
        };
        this.alertaParaUsuario(payload);
      }
    },
    pesquisar() {
      this.buscarListaDeRecebimento();
    },
    alertaParaUsuario(payload) {
      this.$store.commit(SET_MESSAGE, payload);
    },
    async buscarListaDeRecebimento() {
      let payload = {
        inicialDate: this.dateInicial.initialDate,
        finalDate: this.dateFinal.initialDate,
        idClient: this.clientForm,
      };

      this.loadingDataTable = true;
      await this.$store
        .dispatch(BUSCARTODOSRECEBIMENTOS, payload)
        .then(() => {
          this.loadingDataTable = false;
        })
        .catch((error) => {
          if (error) {
            this.loadingDataTable = false;
            let payload = {
              message: "Ocorreu um erro ao carregar a lista de recebimentos",
              color: "error",
            };
            this.alertaParaUsuario(payload);
          }
        });
    },
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },
    parseDate(date) {
      if (!date) return null;

      const [day, month, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },
    async carregarCampoCiente() {
      this.loadingCampoCliente = true;
      await this.$store
        .dispatch(BUSCARLISTACLIENTERESUMIDA)
        .then(() => {
          this.loadingCampoCliente = false;
        })
        .catch((error) => {
          this.loadingCampoCliente = false;
          if (error) {
            let payload = {
              message: "Ocorreu um erro ao carregar a lista de clientes",
              color: "error",
            };
            this.alertaParaUsuario(payload);
          }
        });
    },
    alterarStatusRecebimento(payload){
        this.$store
        .dispatch(ALTERARRECEBIMENTO, payload)
        .then(() => {
          let payload = {
              message: "Recebimento Alterado com sucesso!",
              color: "success",
            };
            this.alertaParaUsuario(payload);
        })
        .catch((error) => {
          this.loadingCampoCliente = false;
          if (error) {
            let payload = {
              message: "Ocorreu um erro ao alterar o Recebimento",
              color: "error",
            };
            this.alertaParaUsuario(payload);
          }
        });
    }
  },
  created() {
    this.carregarCampoCiente();
  },
  computed: {
    initialDateFormatted: {
      get: function () {
        return this.formatDate(this.dateInicial.initialDate);
      },
      // setter
      set: function (newValue) {
        this.dateInicial.initialDate = newValue;
      },
    },
    finalDateFormatted: {
      get: function () {
        return this.formatDate(this.dateFinal.initialDate);
      },
      // setter
      set: function (newValue) {
        this.dateFinal.initialDate = newValue;
      },
    },
    listaRecebimento() {
      return this.$store.state.PagamentosStore.listRecebimento;
    },
    listaDeClientes() {
      return this.$store.state.ClienteStore.clientListResumida;
    },
  },
};
</script>

<style scoped>
.margin-bottom-1-em {
  margin-bottom: 0.5em;
}
</style>
