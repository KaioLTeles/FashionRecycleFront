<template>
  <div>
    <v-card class="margin-bottom-1-em">
      <v-card-title>
        <v-toolbar-title class="title">Relatorio de Vendas</v-toolbar-title>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <v-col>
            <v-text-field
              dense
              label="Codigo Venda"
              v-model="marcaFilter"
              clearable
            ></v-text-field>
          </v-col>
          <v-col>
            <v-autocomplete
              dense
              label="Cliente"
              :items="listaDeClientes"
              item-value="id"
              item-text="name"
              v-model="clienteFilter"
              clearable
              :loading="loadingCampoCliente"
            ></v-autocomplete>
          </v-col>
          <v-col>
            <v-autocomplete
              dense
              label="Produto"
              :items="listaProdutosParaVenda"
              item-value="id"
              item-text="name"
              v-model="produtoForm"
              clearable
              return-object
            ></v-autocomplete>
          </v-col>
          <v-col>
            <v-text-field
              dense
              label="Marca"
              v-model="marcaFilter"
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
        </v-row>
        <v-card-actions>
          <v-btn color="btnPrimary" @click="pesquisar()"> Pesquisar </v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-text>
        <v-data-table
          :headers="headers"
          item-key="codigo"
          :items="listaVendasTeste"
          :loading="loadingDataTable"
        >
          <template v-slot:[`item.action`]="{ item }">
            <v-icon color="btnPrimary" @click.stop="alterarProduto(item)"
              >mdi-clipboard-text-search</v-icon
            >
          </template>
          <template v-slot:[`item.ativo`]="{ item }">
            <v-simple-checkbox
              v-model="item.ativo"
              disabled
            ></v-simple-checkbox>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import {
  BUSCARTODOSOSPRODUTOS,
  EMPTYPRODUTO,
  BUSCARPRODUTOSDISPONIVEISPARAVENDA,
} from "@/store/types/ProdutoType";

import { BUSCARLISTACLIENTERESUMIDA } from "@/store/types/ClienteType";

import { BUSCARLISTAPARCEIRORESUMIDA } from "@/store/types/ParceiroType";

export default {
  components: {},
  data() {
    return {
      headers: [
        { text: "Código", value: "cod" },
        { text: "Cliente", value: "cli" },
        { text: "Total da Venda", value: "total" },
        { text: "Forma de Pagamento", value: "pag" },
        { text: "Ativo", value: "ativo" },
        { text: "Data da Venda", value: "data" },
        { text: "Ações", value: "action", sortable: false },
      ],
      mostrarJanela: false,
      loadingDataTable: false,
      loadingParceiros: false,
      codigoFilter: "",
      nomeFilter: "",
      marcaFilter: "",
      parceiroFilter: 0,
      codigoProduto: 0,
      loadingCampoCliente: false,
      listaVendasTeste: [],
    };
  },
  methods: {
    pesquisar() {
      this.listaVendasTeste = this.listaVendas;
    },
    async buscarDadosProduto(payload) {
      await this.$store
        .dispatch(BUSCARTODOSOSPRODUTOS, payload)
        .then(() => {
          this.loadingDataTable = false;
        })
        .catch((error) => {
          if (error) {
            this.loadingDataTable = false;
            let payload = {
              message: "Ocorreu um erro ao carregar os dados de produtos",
              color: "error",
            };
            this.alertaParaUsuario(payload);
          }
        });
    },
    criarProduto() {
      this.$store.commit(EMPTYPRODUTO);
      this.codigoProduto = 0;
      this.mostrarJanela = true;
    },
    alterarProduto(item) {
      this.codigoProduto = item.id;
      this.mostrarJanela = true;
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
    resetarCodigoProduto() {
      this.codigoProduto = 0;
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
              message: "Ocorreu um erro ao carregar os dados do produto",
              color: "error",
            };
            this.alertaParaUsuario(payload);
          }
        });
    },
    async buscarProdutosVenda() {
      await this.$store
        .dispatch(BUSCARPRODUTOSDISPONIVEISPARAVENDA)
        .then(() => {})
        .catch((error) => {
          if (error) {
            let payload = {
              message: "Ocorreu um erro ao carregar a lista de produtos",
              color: "error",
            };
            this.alertaParaUsuario(payload);
          }
        });
    },
  },
  created() {
    this.buscarListaDeParceiros();
    this.carregarCampoCiente();
    this.buscarProdutosVenda();
  },
  computed: {
    listaProdutos() {
      return this.$store.state.ProdutoStore.produtoList;
    },
    listaParceirosResumida() {
      return this.$store.state.ParceiroStore.listaParceiroResumida;
    },
    listaDeClientes() {
      return this.$store.state.ClienteStore.clientListResumida;
    },
    listaProdutosParaVenda() {
      return this.$store.state.ProdutoStore.produtoVendaList;
    },
    listaVendas() {
      let array = [
        {
          cod: "38",
          cli: "Moisa",
          total: "1500",
          pag: "TRANSFERÊNCIA/PIX",
          ativo: true,
          data: "06/04/2022",
        },
        {
          cod: "39",
          cli: "Kalhil",
          total: "3000",
          pag: "TRANSFERÊNCIA/PIX",
          ativo: true,
          data: "06/04/2022",
        },
        {
          cod: "40",
          cli: "Moisa",
          total: "1500",
          pag: "TRANSFERÊNCIA/PIX",
          ativo: true,
          data: "06/04/2022",
        },
        {
          cod: "41",
          cli: "Maneu",
          total: "500",
          pag: "CARTÃO CRÉDITO",
          ativo: true,
          data: "07/04/2022",
        },
        {
          cod: "42",
          cli: "Moisa",
          total: "2000",
          pag: "TRANSFERÊNCIA/PIX",
          ativo: true,
          data: "07/04/2022",
        },
        {
          cod: "43",
          cli: "KAIO BALÃO",
          total: "800",
          pag: "BOLETO",
          ativo: true,
          data: "07/04/2022",
        },
      ];
      return array;
    },
  },
};
</script>

<style scoped>
.margin-bottom-1-em {
  margin-bottom: 0.5em;
}
</style>
