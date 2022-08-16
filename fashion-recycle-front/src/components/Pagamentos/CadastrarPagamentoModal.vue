<template>
  <v-row>
    <v-dialog v-model="show" persistent max-width="800px">
      <v-card>
        <v-card-title class="justify-center">
          Cadastrar Pagamento
          <v-spacer />
          <v-icon medium @click.stop="fechar"> mdi-close </v-icon>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    label="Histórico"
                    v-model="historicoForm"
                    clearable
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-autocomplete
                    dense
                    label="Tipo de Despesa"
                    :items="listaDeDespesas"
                    item-value="Codigo"
                    item-text="Descricao"
                    v-model="tipoDespesaForm"
                    clearable
                    :loading="loadingFornecedor"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Valor do Pagamento"
                    v-model="valorForm"
                    type="number"
                    clearable
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-menu
                    v-model="date.initialMenuDate"
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
                        label="Data do Vencimento"
                        prepend-icon="fa-calendar-alt"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="date.initialDate"
                      @input="date.initialMenuDate = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12">
                  <v-checkbox v-model="pagoForm" label="Pagamento Liquidado" />
                </v-col>
                <v-col cols="12">
                  <v-checkbox v-model="pagRecorrentForm" label="Pagamento Recorrente" />
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="info" outlined @click.stop="fechar"> Cancelar </v-btn>
          <v-btn @click="salvar()" dark color="btnPrimary">Salvar</v-btn>
          <v-btn @click="remover()" dark color="error">Remover</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import { SET_MESSAGE } from "@/store/types/NotificationType";

import {
  CRIAROUALTERARPAGAMENTO,
  BUSCARPAGAMENTOPORID,
  REMOVERPAGAMENTO,
} from "@/store/types/PagamentosType";

export default {
  props: ["value", "codigoPagamento"],
  data() {
    return {
      valid: false,
      codigoForm: 0,
      parceiroForm: null,
      fornecedorForm: null,
      valorForm: 0,
      ativoForm: false,
      loadingFornecedor: false,
      loadingParceiros: false,
      date: {
        todayDate: new Date().toISOString().substr(0, 10),
        initialMenuDate: false,
        initialDate: new Date().toISOString().substr(0, 10),
      },
      historicoForm: "",
      tipoDespesaForm: 0,
      pagoForm: false,
      pagRecorrentForm: false
    };
  },
  computed: {
    show: {
      get() {
        this.buscarPagamento();
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
    listaParceirosResumida() {
      return this.$store.state.ParceiroStore.listaParceiroResumida;
    },
    listaForncedoresResumida() {
      return this.$store.state.FornecedorStore.listaFornecedorResumida;
    },
    initialDateFormatted: {
      get: function () {
        return this.formatDate(this.date.initialDate);
      },
      // setter
      set: function (newValue) {
        this.date.initialDate = newValue;
      },
    },
    listaDeDespesas() {
      let array = [
        { Codigo: 1, Descricao: "Custo com Comissão de Venda" },
        { Codigo: 2, Descricao: "Custo com Material de Embalagem" },
        { Codigo: 3, Descricao: "Custo Mercadoria Vendida" },
        { Codigo: 4, Descricao: "Despesa com Aluguel" },
        { Codigo: 5, Descricao: "Despesa com Assessoria Contábil" },
        { Codigo: 6, Descricao: "Despesa com Assessoria Jurídica" },
        { Codigo: 7, Descricao: "Despesa com Energia Elétrica" },
        { Codigo: 8, Descricao: "Despesa com Funcionários" },
        { Codigo: 9, Descricao: "Despesa com Marketing" },
        { Codigo: 10, Descricao: "Despesa com Materiais de Escritório" },
        { Codigo: 11, Descricao: "Despesa com Limpeza e Conservação" },
        { Codigo: 12, Descricao: "Receita com Vendas (Comissões)" },
      ];
      return array;
    },
    pagamentoSelecionado() {
      return this.$store.state.PagamentosStore.pagamentoObj;
    },
  },
  created() {},
  methods: {
    remover() {
      let payload = this.codigoPagamento;

      this.$store
        .dispatch(REMOVERPAGAMENTO, payload)
        .then(() => {
          this.loadingParceiros = false;
          let payload = {
            message: "Pagamento removido com sucesso!",
            color: "success",
          };
          this.alertaParaUsuario(payload);
          this.fechar();
        })
        .catch((error) => {
          if (error) {
            this.loadingParceiros = false;
            let payload = {
              message: "Ocorreu um erro ao remover pagamento",
              color: "error",
            };
            this.alertaParaUsuario(payload);
          }
        });
    },
    salvar() {
      if (this.valorForm == 0) {
        let payload = {
          message: "Um pagamento não pode ter um valor de pagamento zerado!",
          color: "warning",
        };
        this.alertaParaUsuario(payload);
      } else {
        this.gravarPagamento();
      }
    },
    gravarPagamento() {
      let payload = {
        id: this.codigoForm,
        name: this.historicoForm,
        idPaymentType: this.tipoDespesaForm,
        amount: this.valorForm,
        paymentDate: this.date.initialDate,
        paymentMade: this.pagoForm,
        recurringPayment: this.pagRecorrentForm
      };

      this.$store
        .dispatch(CRIAROUALTERARPAGAMENTO, payload)
        .then(() => {
          this.loadingParceiros = false;
          let payload = {
            message: "Pagamento cadastrado/alterado com sucesso!",
            color: "success",
          };
          this.alertaParaUsuario(payload);
          this.fechar();
        })
        .catch((error) => {
          if (error) {
            this.loadingParceiros = false;
            let payload = {
              message: "Ocorreu um erro ao criar/alterar pagamento",
              color: "error",
            };
            this.alertaParaUsuario(payload);
          }
        });
    },
    async buscarPagamento() {
      if (this.codigoPagamento != 0) {
        let payload = {
          idPayment: this.codigoPagamento,
        };

        await this.$store
          .dispatch(BUSCARPAGAMENTOPORID, payload)
          .then(() => {
            this.carregarDadosForm();
          })
          .catch((error) => {
            console.log(error)
            if (error) {
              let payload = {
                message: "Ocorreu um erro ao carregar os dados do pagamento",
                color: "error",
              };
              this.alertaParaUsuario(payload);
            }
          });
      }
    },
    fechar() {
      this.$emit("resetarCodigoPayment");
      this.limparCamposForm();
      this.$refs.form.resetValidation();
      this.$refs.form.reset();
      this.show = !this.show;
    },
    limparCamposForm() {
      this.codigoForm = "0";
      this.parceiroForm = 0;
      this.fornecedorForm = 0;
      this.valorForm = 0;
      this.ativoForm = false;
      this.historicoForm = "";
    },
    carregarDadosForm() {
      this.codigoForm = this.pagamentoSelecionado.id;
      this.valorForm = this.pagamentoSelecionado.amount;
      this.historicoForm = this.pagamentoSelecionado.name;
      this.tipoDespesaForm = this.pagamentoSelecionado.paymenyType.id;
      this.pagoForm = this.pagamentoSelecionado.paymentMade
      this.date.initialDate = this.pagamentoSelecionado.paymentDateFormated
      this.pagRecorrentForm = this.pagamentoSelecionado.recurringPayment
      ;
    },
    alertaParaUsuario(payload) {
      this.$store.commit(SET_MESSAGE, payload);
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
  },
  watch: {},
};
</script>

<style scoped></style>
