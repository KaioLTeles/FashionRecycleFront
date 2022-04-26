<template>
  <div>
    <v-card class="margin-bottom-1-em">
      <v-card-title>
        <v-toolbar-title class="title">Contas a Pagar</v-toolbar-title>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <v-col>
            <v-text-field
              dense
              v-model="codigoFilter"
              type="number"
              label="Codigo Pagamento"
              clearable
            ></v-text-field>
          </v-col>
          <v-col>
            <v-autocomplete
              dense
              label="Parceiro"
              :items="listaParceirosResumida"
              item-value="id"
              item-text="name"
              v-model="parceiroFilter"
              clearable
              :loading="loadingParceiros"
            ></v-autocomplete>
          </v-col>
          <v-col>
            <v-autocomplete
              dense
              label="Fornecedor"
              :items="listaParceirosResumida"
              item-value="id"
              item-text="name"
              v-model="fornecedorFilter"
              clearable
              :loading="loadingFornecedor"
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
          <v-btn @click="criarCliente()" dark color="btnPrimary">Novo</v-btn>
        </v-col>
      </v-card-actions>

      <v-card-text>
        <v-data-table
          :headers="headers"
          item-key="codigo"
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
    <CadastrarPagamentoModal
      v-model="mostrarJanela"
      :codigoPagamento="codigoPagamento"
      @resetarCodigoPayment="resetarCodigoPayment"
    />
  </div>
</template>

<script>
import CadastrarPagamentoModal from "./CadastrarPagamentoModal";

import { BUSCARLISTAPARCEIRORESUMIDA } from "@/store/types/ParceiroType";

import { SET_MESSAGE } from "@/store/types/NotificationType";

export default {
  components: { CadastrarPagamentoModal },
  data() {
    return {
      headers: [
        { text: "Código", value: "id" },
        { text: "Fornecedor", value: "name" },
        { text: "Parceiro", value: "email" },
        { text: "Classificação", value: "phoneNumber" },
        { text: "Valor", value: "cpf" },
        { text: "Data Vencimento", value: "active" },
        { text: "Ações", value: "action", sortable: false },
      ],
      codigoFilter: "",
      fornecedorFilter: null,
      parceiroFilter: null,
      loadingDataTable: false,
      mostrarJanela: false,
      codigoPagamento: 0,
      loadingParceiros: false,
      loadingFornecedor: false,
    };
  },
  methods: {
    criarCliente() {
      this.codigoPagamento = 0;
      this.mostrarJanela = true;
    },
    alterCliente(item) {
      this.codigoPagamento = item.id;
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
    alertaParaUsuario(payload) {
      this.$store.commit(SET_MESSAGE, payload);
    },
    resetarCodigoPayment() {
      this.codigoPagamento = 0;
    },
    async buscarListaDeParceiros() {
      this.loadingParceiros = true;
      await this.$store
        .dispatch(BUSCARLISTAPARCEIRORESUMIDA)
        .then(() => {
          this.loadingParceiros = false;
        })
        .catch((error) => {
          if (error) {
            this.loadingParceiros = false;
            let payload = {
              message: "Ocorreu um erro ao carregar a lista de parceiros",
              color: "error",
            };
            this.alertaParaUsuario(payload);
          }
        });
    },
  },
  created() {
    this.buscarListaDeParceiros();
  },
  computed: {
    listaParceirosResumida() {
      return this.$store.state.ParceiroStore.listaParceiroResumida;
    },
  },
};
</script>

<style scoped>
.margin-bottom-1-em {
  margin-bottom: 0.5em;
}
</style>
