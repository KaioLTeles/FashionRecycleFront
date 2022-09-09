<template>
  <div>
    <v-card class="margin-bottom-1-em">
      <v-card-title>
        <v-toolbar-title class="title">Registro de Venda</v-toolbar-title>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <v-col cols="4">
            <v-autocomplete
              dense
              label="Comprador"
              :items="listaDeClientes"
              item-value="id"
              item-text="name"
              v-model="clienteFilter"
              clearable
              return-object
              :loading="loadingCampoCliente"
            ></v-autocomplete>
          </v-col>
          <v-col cols="4">
            <v-autocomplete
              dense
              label="Forma de Pagamento"
              :items="formasPagamento"
              item-value="Codigo"
              item-text="Descricao"
              v-model="formaPagamentoFilter"
              clearable
              return-object
            ></v-autocomplete>
          </v-col>
          <v-col cols="4">
            <v-select
              dense
              label="Nª de Parcelas"
              :items="listaDeParcelas"
              item-value="Codigo"
              item-text="Descricao"
              v-show="showParcelas"
              v-model="parcelasFilter"
            ></v-select>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-actions>
        <v-col class="text-right">
          <v-btn
            @click="adicionarProduto()"
            :disabled="adicionarProdutoDisable"
            dark
            class="inputContainerBtn"
            color="info"
            >Adicionar Produto</v-btn
          >
        </v-col>
      </v-card-actions>

      <v-card-text>
        <v-data-table
          :headers="headers"
          item-key="codigo"
          :items="itemsVenda"
          hide-default-footer
          disable-pagination
        >
          <template v-slot:[`item.action`]="{ item }">
            <span></span>
            <v-icon color="#4693f8" @click.stop="removerProduto(item)"
              >mdi-delete</v-icon
            >
          </template>
        </v-data-table>
        <v-row>
          <v-col cols="12" sm="3" class="margin-left-1-em">
            <v-row>
              <h4 class="colorCardCinza">Valor do Pedido:</h4>
            </v-row>
            <v-row>
              <h2 class="colorCardCinza">
                {{
                  valorDoPedido.toLocaleString("pt-br", {
                    minimumFractionDigits: 2,
                  })
                }}
              </h2>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
      <div class="ma-2"></div>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="info" @click.stop="salvar()">Salvar</v-btn>
      </v-card-actions>
    </v-card>
    <AdicionarProduto v-model="janelaAdicioanrProduto" />
    <!-- Dialog Salvando Pedido Loading -->
    <v-dialog v-model="dialogSaving" hide-overlay persistent width="600px">
      <v-card color="info" dark>
        <v-card-title> Gerando Venda... </v-card-title>
        <v-card-text>
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="vendaCriadaResult" persistent max-width="600px">
      <v-card>
        <v-card-title>
          Pedido de Venda Criado:
          {{ codigoVendaCriado }}
          <v-spacer></v-spacer>
          <v-icon class="mr-2" @click="fecharModalResult()">mdi-close</v-icon>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="info" @click="fecharModalResult()">OK</v-btn>
          <v-btn color="info" @click="imprimirRecibo()">Imprimir Recibo</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div>
      <vue-html2pdf
        :show-layout="false"
        :float-layout="true"
        :enable-download="true"
        :preview-modal="false"
        :paginate-elements-by-height="1400"
        filename="Recibo_Compra_Fashion_Recycle"
        :pdf-quality="2"
        :manual-pagination="false"
        pdf-format="a4"
        pdf-orientation="portrait"
        pdf-content-width="800px"
        ref="html2Pdf"
      >
        <section slot="pdf-content">
          <section
            class="pdf-item"
            style="
              text-align: center;
              margin-top: 25px;
              border: 1px solid black;
              border-collapse: collapse;
            "
          >
            <h4>FASHION RECYCLE</h4>
          </section>
          <section class="pdf-item" style="margin-top: 5px">
            <table style="width: 98%; margin-left: 5px">
              <tbody>
                <tr>
                  <td>PEDIDO DE VENDA Nº {{ codigoVendaCriado }}</td>
                </tr>
                <tr>
                  <td>COMPRADOR: {{ clienteFilter.name }}</td>
                </tr>
                <tr>
                  <td>
                    FORMA DE PAGAMENTO: {{ formaPagamentoFilter.Descricao }}
                  </td>
                </tr>
                <tr>
                  <td>
                    VALOR TOTAL DO PEDIDO R$:
                    {{
                      valorDoPedido.toLocaleString("pt-br", {
                        minimumFractionDigits: 2,
                      })
                    }}
                  </td>
                </tr>
                <tr>
                  <td>DATA DO PEDIDO: {{ today.toLocaleDateString() }}</td>
                </tr>
              </tbody>
            </table>
          </section>
          <section class="pdf-item" style="margin-top: 5px; width: 100%">
            <table style="width: 98%; margin-left: 5px">
              <thead>
                <tr>
                  <th>Qnt</th>
                  <th>Produto</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in itemsVenda" :key="item.sequencia">
                  <td>
                    {{ item.quantidade == undefined ? 0 : item.quantidade }}
                  </td>
                  <td>
                    {{
                      item.descricaoProduto == undefined
                        ? 0
                        : item.descricaoProduto
                    }}
                  </td>
                  <td>
                    {{ item.precoDevenda == undefined ? 0 : item.precoDevenda }}
                  </td>
                </tr>
              </tbody>
            </table>
          </section>
        </section>
      </vue-html2pdf>
    </div>
  </div>
</template>

<script>
import AdicionarProduto from "./AdicionarProduto";
import VueHtml2pdf from "vue-html2pdf";

import { BUSCARLISTACLIENTERESUMIDA } from "@/store/types/ClienteType";

import {
  REMOVERPRODUTODALISTA,
  REALIZARVENDA,
  EMPTYVENDAS,
} from "@/store/types/VendasType";

import { SET_MESSAGE } from "@/store/types/NotificationType";

export default {
  components: { AdicionarProduto, VueHtml2pdf },
  data() {
    return {
      headers: [
        { text: "Sequencia", value: "sequencia" },
        { text: "Codigo Produto", value: "idProduto" },
        { text: "Descrição Produto", value: "descricaoProduto" },
        { text: "Quantidade", value: "quantidade" },
        { text: "Valor do Produto", value: "precoDevenda" },
        { text: "Ações", value: "action", sortable: false },
      ],
      valorDoPedido: 0,
      adicionarProdutoDisable: true,
      formaPagamentoFilter: 0,
      clienteFilter: 0,
      loadingCampoCliente: true,
      itensDoPedidoList: [],
      janelaAdicioanrProduto: false,
      codigoProduto: 0,
      dialogSaving: false,
      vendaCriadaResult: false,
      today: new Date(),
      parcelasFilter: 0,
      showParcelas: false,
    };
  },
  methods: {
    generateReport() {
      this.$refs.html2Pdf.generatePdf();
    },
    imprimirRecibo() {
      this.generateReport();
    },
    adicionarProduto() {
      this.codigoProduto = 0;
      this.janelaAdicioanrProduto = true;
    },
    alterarProduto(item) {
      this.codigoProduto = item.codigo;
      this.janelaAdicioanrProduto = true;
    },
    removerProduto(item) {
      let index = this.itemsVenda.indexOf(item.sequencia);
      this.$store.commit(REMOVERPRODUTODALISTA, index);
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
    alertaParaUsuario(payload) {
      this.$store.commit(SET_MESSAGE, payload);
    },
    salvar() {
      if (
        this.clienteFilter == 0 ||
        this.clienteFilter == null ||
        this.clienteFilter == undefined ||
        this.formaPagamentoFilter == 0 ||
        this.formaPagamentoFilter == null ||
        this.formaPagamentoFilter == undefined
      ) {
        let payload = {
          message: "Favor selecionar o cliente e forma de pagamento!",
          color: "warning",
        };
        this.alertaParaUsuario(payload);
      } else if (this.itemsVenda.length == 0) {
        let payload = {
          message: "Favor adicionar produtos para venda!",
          color: "warning",
        };
        this.alertaParaUsuario(payload);
      } else if (this.valorDoPedido == 0) {
        let payload = {
          message: "Não é permitido realizar vendas com valor zerado!",
          color: "warning",
        };
        this.alertaParaUsuario(payload);
      } else if ((this.formaPagamentoFilter.Codigo == 4 || this.formaPagamentoFilter.Codigo == 5) && this.parcelasFilter == 0) {
        let payload = {
          message: "Favor inserir o número de parcelas!",
          color: "warning",
        };
        this.alertaParaUsuario(payload);
      } else {
        let payload = {
          sale: {
            IdClient: this.clienteFilter.id,
            AmountSale: this.valorDoPedido,
            IdPaymentMethod: this.formaPagamentoFilter.Codigo,
            Observation: "Teste",      
            NumberInstallments: this.parcelasFilter
          },
          saleItems: [],
        };

        this.itemsVenda.forEach((element) => {
          let item = {
            IdProduct: element.idProduto,
            IdPartner: element.idParceiro,
            PriceSale: element.precoDevenda,
            Amount: element.quantidade,            
          };
          payload.saleItems.push(item);
        });

        this.dialogSaving = true;
        this.criarVenda(payload);
      }
    },
    async criarVenda(payload) {
      await this.$store
        .dispatch(REALIZARVENDA, payload)
        .then(() => {
          this.dialogSaving = false;
          this.vendaCriadaResult = true;
        })
        .catch((error) => {
          this.dialogSaving = false;
          if (error) {
            let payload = {
              message: "Ocorreu um erro ao realizar a Venda",
              color: "error",
            };
            this.alertaParaUsuario(payload);
          }
        });
    },
    fecharModalResult() {
      this.limparDadosTela();
      this.vendaCriadaResult = false;
    },
    limparDadosTela() {
      this.$store.dispatch(EMPTYVENDAS);
      this.clienteFilter = 0;
      this.formaPagamentoFilter = 0;
      this.valorDoPedido = 0;
    },
  },
  created() {
    this.$store.dispatch(EMPTYVENDAS);
    this.carregarCampoCiente();
  },
  watch: {
    clienteFilter(newValue) {
      if (newValue == undefined || newValue == null || newValue == 0) {
        this.adicionarProdutoDisable = true;
        return;
      } else {
        this.adicionarProdutoDisable = false;
      }
    },
    formaPagamentoFilter(newValue) {
      if (newValue == undefined || newValue == null || newValue == 0) {
        this.adicionarProdutoDisable = true;
        return;
      } else {
        this.adicionarProdutoDisable = false;
      }

      if (newValue.Codigo == 4 || newValue.Codigo == 5) {
        this.showParcelas = true;
      } else {
        this.showParcelas = false;
      }
    },
    itemsVenda() {
      if (this.itemsVenda.length > 0) {
        let total = 0;
        this.itemsVenda.forEach((element) => {
          total =
            total +
            parseFloat(element.precoDevenda) * parseInt(element.quantidade);
        });
        this.valorDoPedido = total;
      }
    },
  },
  computed: {
    formasPagamento() {
      let array = [
        { Codigo: 5, Descricao: "CHEQUE" },
        { Codigo: 2, Descricao: "CARTÃO CRÉDITO" },
        { Codigo: 3, Descricao: "CARTÃO DÉBITO" },
        { Codigo: 4, Descricao: "TRANSFERÊNCIA/PIX" },
      ];
      return array;
    },
    listaDeClientes() {
      return this.$store.state.ClienteStore.clientListResumida;
    },
    itemsVenda() {
      return this.$store.state.VendasStore.listaItensVenda;
    },
    codigoVendaCriado() {
      return this.$store.state.VendasStore.codigoVendaCriada;
    },
    listaDeParcelas() {
      let array = [
        { Codigo: 0, Descricao: "-" },
        { Codigo: 1, Descricao: "1x" },
        { Codigo: 2, Descricao: "2x" },
        { Codigo: 3, Descricao: "3x" },
        { Codigo: 4, Descricao: "4x" },
        { Codigo: 5, Descricao: "5x" },
        { Codigo: 6, Descricao: "6x" },
        { Codigo: 7, Descricao: "7x" },
        { Codigo: 8, Descricao: "8x" },
        { Codigo: 9, Descricao: "10x" },
        { Codigo: 10, Descricao: "11x" },
        { Codigo: 11, Descricao: "12x" },
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
.margin-left-1-em {
  margin-left: 1em;
  margin-top: 2em;
  font-size: 20px;
}
.inputContainerBtn {
  margin-right: 0px !important;
}
.colorCardCinza {
  color: rgba(0, 0, 0, 0.6) !important;
}
.inputContainer {
  padding-top: 2px;
  padding-bottom: 0px;
}
table,
th,
td {
  border: 1px solid black;
  border-collapse: collapse;
}
th,
td {
  padding: 5px;
}
th {
  text-align: left;
}
</style>
