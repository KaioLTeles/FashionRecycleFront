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
                    label="Código Pagamento"
                    v-model="codigoForm"
                    disabled
                    clearable
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-autocomplete
                    dense
                    label="Parceiro"
                    :items="listaParceirosResumida"
                    item-value="id"
                    item-text="name"
                    v-model="parceiroForm"
                    clearable
                    :loading="loadingParceiros"
                    return-object
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12">
                  <v-autocomplete
                    dense
                    label="Fornecedor"
                    :items="listaForncedoresResumida"
                    item-value="id"
                    item-text="legalCompanyName"
                    v-model="fornecedorForm"
                    clearable
                    return-object
                    :loading="loadingFornecedor"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12">
                  <v-autocomplete
                    dense
                    label="Tipo de Despesa"
                    :items="listaDeDespesas"
                    item-value="Codigo"
                    item-text="Descricao"
                    v-model="fornecedorForm"
                    clearable
                    return-object
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
                  <v-checkbox v-model="ativoForm" label="Ativo" />
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="info" outlined @click.stop="fechar"> Cancelar </v-btn>
          <v-btn @click="salvar()" dark color="btnPrimary">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import { BUSCARLISTAPARCEIRORESUMIDA } from "@/store/types/ParceiroType";
import { BUSCARLISTAFORNECEDORRESUMIDA } from "@/store/types/FornecedorType";

import { SET_MESSAGE } from "@/store/types/NotificationType";

export default {
  props: ["value", "codigoCliente"],
  data() {
    return {
      valid: false,
      codigoForm: "",
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
    };
  },
  computed: {
    show: {
      get() {
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
        { Codigo: 1, Descricao: "Despesa com Marketing" },
        { Codigo: 2, Descricao: "Despesa com Aluguel" },
        { Codigo: 3, Descricao: "Despesa com Energia Elétrica" },
        { Codigo: 4, Descricao: "Despesa com Materiais de Escritório" },
        { Codigo: 5, Descricao: "Despesa com Funcionários" },
        { Codigo: 6, Descricao: "Despesa com Material de Embalagem" },
        { Codigo: 7, Descricao: "Despesa com Assessoria Jurídica" },
        { Codigo: 8, Descricao: "Receita com Vendas (Comissões)" },
      ];
      return array;
    },
  },
  created() {
    this.buscarListaDeParceiros();
    this.buscarListaDeFornecedores();
  },
  methods: {
    salvar() {
      if (
        (this.parceiroForm != null && this.fornecedorForm != null) ||
        this.fornecedorForm != undefined ||
        this.parceiroForm != undefined
      ) {
        let payload = {
          message:
            "Um pagamento não pode ter um fornecedor e um parceiro selecionado!",
          color: "warning",
        };
        this.alertaParaUsuario(payload);
      } else {
        this.gravarPagamento();
      }
    },
    gravarPagamento() {
      return;
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
    async buscarListaDeFornecedores() {
      this.loadingFornecedor = true;
      await this.$store
        .dispatch(BUSCARLISTAFORNECEDORRESUMIDA)
        .then(() => {
          this.loadingFornecedor = false;
        })
        .catch((error) => {
          if (error) {
            this.loadingFornecedor = false;
            let payload = {
              message: "Ocorreu um erro ao carregar a lista de fornecedores",
              color: "error",
            };
            this.alertaParaUsuario(payload);
          }
        });
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
  watch: {
    parceiroForm(newValue) {
      if (newValue != null || newValue != undefined || newValue != 0) {
        this.fornecedorForm = null;
      }
    },
    fornecedorForm(newValue) {
      if (newValue != null || newValue != undefined || newValue != 0) {
        this.parceiroForm = null;
      }
    },
  },
};
</script>

<style scoped></style>
