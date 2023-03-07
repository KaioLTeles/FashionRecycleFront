<template>
  <v-row>
    <v-dialog v-model="show" persistent max-width="800px">
      <v-card>
        <v-card-title class="justify-center">
          Cadastro de Produto
          <v-spacer />
          <v-icon medium @click.stop="fechar"> mdi-close </v-icon>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    label="Código Produto"
                    v-model="codigoForm"
                    disabled
                    clearable
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Data de Entrada"
                    v-model="dataCriacaoForm"
                    disabled
                    clearable
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-file-input
                    show-size
                    label="Foto do Produto"
                    accept="image/*"
                    v-model="contentForm"
                    @change="anexarArquivos"
                  ></v-file-input>
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
                        label="Data de aprovação de valor*"
                        :readonly="modoVisualizacao"
                        prepend-icon="fa-calendar-alt"
                        :rules="rules"
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
                  <v-autocomplete
                    dense
                    label="Fornecedor*"
                    :items="listaParceirosResumida"
                    item-value="id"
                    item-text="name"
                    v-model="parceiroForm"
                    :readonly="modoVisualizacao"
                    clearable
                    :rules="rules"
                    :loading="loadingParceiros"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12">
                  <v-select
                    dense
                    label="Item*"
                    :items="listItem"
                    :readonly="modoVisualizacao"
                    item-value="name"
                    item-text="name"
                    v-model="nomeForm"
                    :rules="rules"
                  ></v-select>
                </v-col>
                <v-col cols="12">
                  <v-autocomplete
                    dense
                    label="Marca*"
                    :items="listaMarcas"
                    item-value="id"
                    item-text="name"
                    :rules="rules"
                    :readonly="modoVisualizacao"
                    v-model="marcaForm"
                    clearable
                    :loading="loadingParceiros"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Modelo*"
                    v-model="modeloForm"
                    clearable
                    :readonly="modoVisualizacao"
                    :rules="rules"
                    counter
                    maxlength="200"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Tamanho*"
                    v-model="tamanhoForm"
                    clearable
                    :readonly="modoVisualizacao"
                    v-show="exibirTamanho"
                    counter
                    maxlength="200"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Tamanho(sola)*"
                    v-model="tamanhoSolaForm"
                    clearable
                    :readonly="modoVisualizacao"
                    v-show="exibirTamanhoSola"
                    counter
                    maxlength="200"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Tamanho(BR)*"
                    v-model="tamanhoBrForm"
                    clearable
                    :readonly="modoVisualizacao"
                    v-show="exibirTamanhoSola"
                    counter
                    maxlength="200"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Cor*"
                    :readonly="modoVisualizacao"
                    v-model="corForm"
                    clearable
                    :rules="rules"
                    counter
                    maxlength="200"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Número de Série*"
                    v-model="serieForm"
                    :readonly="modoVisualizacao"
                    clearable
                    counter
                    :rules="rules"
                    maxlength="200"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    label="Detalhamento do Produto*"
                    v-model="situacaoForm"
                    :readonly="modoVisualizacao"
                    counter
                    maxlength="2000"
                    :rules="rules"
                  ></v-textarea>
                </v-col>
                <v-col cols="12">
                  <v-select
                    dense
                    label="Itens que acompanham*"
                    :items="listAcompanhamento"
                    :readonly="modoVisualizacao"
                    item-value="id"
                    :rules="rules"
                    item-text="name"
                    multiple
                    v-model="itemAcompanhamentoForm"
                  ></v-select>
                </v-col>
                <v-col cols="12">
                  <vuetify-money
                    label="Valor do Fornecedor*"
                    v-model="precoParceiroForm"
                    clearable
                    :readonly="modoVisualizacao"
                    v-bind:options="options"
                    :rules="rules"
                  ></vuetify-money>
                </v-col>
                <v-col cols="12">
                  <vuetify-money
                    label="Valor de Venda*"
                    v-model="precoVendaForm"
                    clearable
                    :readonly="modoVisualizacao"
                    v-bind:options="options"
                    :rules="rules"
                  ></vuetify-money>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Margem%"
                    v-model="margemForm"
                    disabled
                    type="number"
                    clearable
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-select
                    dense
                    label="Status*"
                    :items="listStatus"
                    :readonly="modoVisualizacao"
                    item-value="id"
                    item-text="name"
                    v-model="statusForm"
                    :rules="rules"
                  ></v-select>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="info" outlined @click.stop="fechar"> Cancelar </v-btn>
          <v-btn
            v-show="!modoVisualizacao"
            @click="salvar()"
            dark
            color="btnPrimary"
            >Salvar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import {
  BUSCARPRODUTOPORID,
  EMPTYPRODUTO,
  ALTERAROUCRIARPRODUTO,
} from "@/store/types/ProdutoType";

import { BUSCARLISTAPARCEIRORESUMIDA } from "@/store/types/ParceiroType";

import { BUSCARMARGEMPADRAO } from "@/store/types/PagamentosType";

import { SET_MESSAGE } from "@/store/types/NotificationType";

export default {
  props: ["value", "codigoProduto", "modoVisualizacao"],
  data() {
    return {
      valid: false,
      codigoForm: "0",
      ativoForm: true,
      tamanhoBrForm: "",
      tamanhoForm: "",
      tamanhoSolaForm: "",
      exibirTamanho: false,
      exibirTamanhoSola: false,
      precoVendaForm: 0.0,
      precoParceiroForm: 0.0,
      parceiroForm: 0,
      estoqueForm: 0,
      contentForm: null,
      anexo: null,
      marcaForm: 0,
      itemAcompanhamentoForm: [],
      itemAcompanhamentoFormText: "",
      nomeForm: "",
      statusForm: 0,
      situacaoForm: "",
      dataCriacaoForm: "",
      dataAprovacaoForm: "",
      corForm: "",
      serieForm: "",
      modeloForm: "",
      margemForm: 0,
      idBanco: 0,
      statusRule: [(v) => !!v || "Status é Obrigatório"],
      marcaRule: [(v) => !!v || "Marca do Produto é obrigatório"],
      fornecedorRule: [(v) => !!v || "Fornecedor é obrigatório"],
      options: {
        locale: "pt-BR",
        prefix: "R$",
        suffix: "",
        length: 11,
        precision: 2,
      },
      date: {
        todayDate: new Date().toISOString().substr(0, 10),
        initialMenuDate: false,
        initialDate: new Date().toISOString().substr(0, 10),
      },
      rules: [
        (value) => {
          if (value) return true;

          return "Campo obrigatorio";
        },
      ],
      rulesTamanhoSola: [
        (value) => {
          if (this.exibirTamanhoSola == false || value) return true;

          return "Campo obrigatorio";
        },
      ],
      rulesTamanho: [
        (value) => {
          if (this.exibirTamanho == false || value) return true;

          return "Campo obrigatorio";
        },
      ],
    };
  },
  computed: {
    initialDateFormatted: {
      get: function () {
        return this.formatDate(this.date.initialDate);
      },
      // setter
      set: function (newValue) {
        this.date.initialDate = newValue;
      },
    },
    show: {
      get() {
        this.buscarProduto();
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
    produtoSelecionado() {
      return this.$store.state.ProdutoStore.produtoObjeto;
    },
    listaParceirosResumida() {
      return this.$store.state.ParceiroStore.listaParceiroResumida;
    },
    listaMarcas() {
      return this.$store.state.MarcaStore.marcaList;
    },
    margem() {
      return this.$store.state.PagamentosStore.margemPadrao;
    },
    listStatus() {
      let array = [
        { id: 1, name: "Disponivel" },
        { id: 2, name: "Vendido" },
        { id: 3, name: "Devolvido" },
      ];
      return array;
    },
    listItem() {
      let array = [
        { name: "Alça" },
        { name: "Bolsa" },
        { name: "Carteira" },
        { name: "Cinto" },
        { name: "Lenço" },
        { name: "Roupa" },
        { name: "Sandália" },
        { name: "Sapatilha" },
        { name: "Sapato" },
        { name: "Tênis" },
      ];
      return array;
    },
    listAcompanhamento() {
      let array = [
        { id: 1, name: "Alça curta/de mão removível" },
        { id: 2, name: "Alça longa/crossbody removível" },
        { id: 3, name: "Alça média/de ombro removível" },
        { id: 4, name: "Amostra de couro" },
        { id: 5, name: "Cadeado" },
        { id: 6, name: "Caixa da marca" },
        { id: 7, name: "Capa de chuva" },
        { id: 8, name: "Card" },
        { id: 9, name: "Chave" },
        { id: 10, name: "Dust bag da marca" },
        { id: 11, name: "Dust bag de outra marca" },
        { id: 12, name: "Nota fiscal" },
        { id: 13, name: "Papers" },
        { id: 14, name: "Sacola da marca" },
        { id: 15, name: "Sem dust bag" },
        { id: 16, name: "Outros" },
      ];
      return array;
    },
  },
  created() {
    this.buscarListaDeParceiros();
    this.buscarMargemPadrao();
  },
  methods: {
    anexarArquivos() {
      if (this.contentForm != null || this.contentForm != undefined) {
        let reader = new FileReader();
        this.anexo = [];
        reader.onload = () => {
          var arquivo = {
            nome: this.contentForm.name,
            conteudo: reader.result,
          };
          this.anexo.push(arquivo);
        };
        reader.readAsDataURL(this.contentForm);
      }
    },
    async buscarMargemPadrao() {
      await this.$store.dispatch(BUSCARMARGEMPADRAO).catch((error) => {
        if (error) {
          let payload = {
            message: "Ocorreu um erro ao buscar a margem padrão",
            color: "error",
          };
          this.alertaParaUsuario(payload);
        }
      });
    },
    fechar() {
      this.$emit("resetarCodigoProduto");
      this.$store.commit(EMPTYPRODUTO);
      this.limparCamposForm();
      this.$refs.form.resetValidation();
      this.$refs.form.reset();
      this.show = !this.show;
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
    salvar() {
      if (this.$refs.form.validate()) {
        if (this.precoVendaForm > 0.0 && this.precoParceiroForm > 0.0) {
          console.log(this.precoParceiroForm + "-" + this.precoVendaForm);
          if (
            parseFloat(this.precoParceiroForm) > parseFloat(this.precoVendaForm)
          ) {
            let payload = {
              message:
                "O preço do fornecedor não pode ser maior que o de venda!",
              color: "warning",
            };
            this.alertaParaUsuario(payload);
          } else {
            this.gravarProduto();
          }
        } else {
          let payload = {
            message: "Favor preencher todos os campos Obrigatórios!",
            color: "warning",
          };
          this.alertaParaUsuario(payload);
        }
      }
    },
    gravarProduto() {
      this.itemAcompanhamentoForm.forEach((element) => {
        if (element != null && element != "" && element != undefined) {
          this.itemAcompanhamentoFormText =
            this.itemAcompanhamentoFormText + element + ",";
        }
      });

      console.log(this.anexo);

      let payload = {
        id:
          this.idBanco == "" ||
          this.idBanco == null ||
          this.idBanco == undefined
            ? 0
            : parseInt(this.idBanco),
        name: this.nomeForm,
        amountInventory: 1,
        pricePartner: parseFloat(this.precoParceiroForm),
        priceSale: parseFloat(this.precoVendaForm),
        partnerId: this.parceiroForm,
        active: true,
        productStatus: this.statusForm,
        serialNumber: this.serieForm,
        model: this.modeloForm,
        colour: this.corForm,
        observation: this.situacaoForm,
        brandId: this.marcaForm,
        margim: this.margemForm,
        Content: this.anexo[0].conteudo,
        Size: this.tamanhoForm,
        Size_BR: this.tamanhoBrForm,
        Size_Sola: this.tamanhoSolaForm,
        ItemRelated: this.itemAcompanhamentoFormText,
        ApprovalDate: this.dataAprovacaoForm,
        FileName: this.anexo[0].nome,
      };
      console.log(payload);
      this.$store
        .dispatch(ALTERAROUCRIARPRODUTO, payload)
        .then(() => {
          if (this.idBanco == "0" || this.idBanco == "" || this.idBanco == 0) {
            let payload = {
              message: "Produto criado com sucesso!",
              color: "success",
            };
            this.alertaParaUsuario(payload);
            this.$emit("pesquisar");
            this.fechar();
          } else {
            let payload = {
              message: "Produto alterado com sucesso!",
              color: "success",
            };
            this.alertaParaUsuario(payload);
            this.$emit("pesquisar");
            this.fechar();
          }
        })
        .catch((error) => {
          if (error) {
            let payload = {
              message: "Ocorreu um erro ao criar/alterar o produto",
              color: "error",
            };
            this.alertaParaUsuario(payload);
          }
        });
    },
    alertaParaUsuario(payload) {
      this.$store.commit(SET_MESSAGE, payload);
    },
    async buscarProduto() {
      console.log(this.codigoProduto);
      if (this.codigoProduto != 0) {
        console.log(this.codigoProduto);
        let payload = {
          idProduct: this.codigoProduto,
        };

        await this.$store
          .dispatch(BUSCARPRODUTOPORID, payload)
          .then(() => {
            this.carregarDadosForm();
          })
          .catch((error) => {
            if (error) {
              let payload = {
                message: "Ocorreu um erro ao carregar os dados do produto",
                color: "error",
              };
              this.alertaParaUsuario(payload);
            }
          });
      } else {
        this.$store.commit(EMPTYPRODUTO);
        this.ativoForm = true;
        this.statusForm = 1;
      }
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
              message: "Ocorreu um erro ao carregar a lista de fornecedores",
              color: "error",
            };
            this.alertaParaUsuario(payload);
          }
        });
    },
    carregarDadosForm() {
      this.codigoForm = this.produtoSelecionado.alternativeId;
      this.idBanco = this.produtoSelecionado.id;
      this.nomeForm = this.produtoSelecionado.name;
      this.marcaForm = this.produtoSelecionado.brand;
      this.parceiroForm = this.produtoSelecionado.partnerId;
      this.precoParceiroForm = this.produtoSelecionado.pricePartner;
      this.precoVendaForm = this.produtoSelecionado.priceSale;
      this.ativoForm = this.produtoSelecionado.active;
      this.marcaForm = this.produtoSelecionado.brandId;
      this.statusForm = this.produtoSelecionado.productStatus;
      this.situacaoForm = this.produtoSelecionado.observation;
      this.corForm = this.produtoSelecionado.colour;
      this.serieForm = this.produtoSelecionado.serialNumber;
      this.modeloForm = this.produtoSelecionado.model;
      this.dataCriacaoForm = this.produtoSelecionado.creationDateFormat;
    },
    limparCamposForm() {
      this.codigoForm = "0";
      this.nomeForm = "";
      this.marcaForm = "";
      this.parceiroForm = 0.0;
      this.precoParceiroForm = 0.0;
      this.precoVendaForm = 0.0;
      this.ativoForm = false;
      this.marcaForm = 0;
      this.statusForm = 0;
      this.situacaoForm = "";
      this.corForm = "";
      this.serieForm = "";
      this.modeloForm = "";
      this.dataCriacaoForm = "";
      this.idBanco = 0;
    },
  },
  watch: {
    precoVendaForm() {
      this.margemForm =
        (parseFloat(this.precoVendaForm - parseFloat(this.precoParceiroForm)) /
          parseFloat(this.precoParceiroForm)) *
        100;
    },
    nomeForm() {
      if (
        this.nomeForm == "Alça" ||
        this.nomeForm == "Bolsa" ||
        this.nomeForm == "Carteira" ||
        this.nomeForm == "Cinto" ||
        this.nomeForm == "Lenço"
      ) {
        this.exibirTamanho = true;
        this.exibirTamanhoSola = false;
      } else {
        this.exibirTamanho = false;
        this.exibirTamanhoSola = true;
      }
    },
  },
};
</script>

<style></style>
