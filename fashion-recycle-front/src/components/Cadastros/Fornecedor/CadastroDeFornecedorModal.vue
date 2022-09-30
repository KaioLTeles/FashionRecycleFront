<template>
  <v-row>
    <v-dialog v-model="show" persistent max-width="800px">
      <v-card>
        <v-card-title class="justify-center">
          Cadastro de Fornecedor
          <v-spacer />
          <v-icon medium @click.stop="fechar"> mdi-close </v-icon>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    label="Código Fornecedor"
                    v-model="codigoForm"
                    disabled
                    clearable
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Razão Social*"
                    v-model="razaoForm"
                    :rules="razaoRule"
                    clearable
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Nome Fantasia*"
                    v-model="fantasiaForm"
                    :rules="fantasiaRule"
                    clearable
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="CNPJ"
                    v-model="cnpjForm"
                    v-mask="'##.###.###/####-##'"
                    :rules="cnpjRule"
                    clearable
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Email*"
                    v-model="emailForm"
                    clearable
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Telefone*"
                    v-model="telefoneForm"
                    v-mask="'(##) #####-####'"
                    clearable
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Endereço"
                    v-model="enderecoForm"
                    clearable
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Complemento"
                    v-model="numeroForm"
                    clearable
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="CEP"
                    v-model="cepForm"
                    v-mask="'#####-###'"
                    clearable
                  ></v-text-field>
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
import {
  BUSCARFORNECEDORPORID,
  ALTERAROUCRIARFORNECEDOR,
  EMPTYFORNECEDOR,
} from "@/store/types/FornecedorType";

import { SET_MESSAGE } from "@/store/types/NotificationType";

export default {
  props: ["value", "codigoFornecedor"],
  data() {
    return {
      razaoRule: [(v) => !!v || "Razão Social é Obrigatório"],
      fantasiaRule: [(v) => !!v || "Nome Fantasia é Obrigatório"],
      cnpjRule: [(v) => !!v || "CNPJ é obrigatório"],
      valid: false,
      codigoForm: "0",
      razaoForm: "",
      fantasiaForm: "",
      emailForm: "",
      telefoneForm: "",
      cpfForm: "",
      cnpjForm: "",
      enderecoForm: "",
      numeroForm: "",
      cepForm: "",
      ativoForm: true,
    };
  },
  computed: {
    show: {
      get() {
        this.buscarFornecedor();
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
    fornecedorSelecionado() {
      return this.$store.state.FornecedorStore.fornecedorObjeto;
    },
  },
  methods: {
    fechar() {
      this.$emit("resetarCodigoFornecedor");
      this.$store.commit(EMPTYFORNECEDOR);
      this.limparCamposForm();
      this.$refs.form.resetValidation();
      this.$refs.form.reset();
      this.show = !this.show;
    },
    salvar() {
      if (this.$refs.form.validate()) {
        this.gravarFornecedor();
      } else {
        let payload = {
          message: "Favor preencher todos os campos!",
          color: "warning",
        };
        this.alertaParaUsuario(payload);
      }
    },
    gravarFornecedor() {
      const payload = {
        id:
          this.codigoForm == "" ||
          this.codigoForm == null ||
          this.codigoForm == undefined
            ? 0
            : parseInt(this.codigoForm),
        companyName: this.fantasiaForm,
        legalCompanyName: this.razaoForm,
        phoneNumber:
          this.phoneNumber == ""
            ? ""
            : this.telefoneForm
                .replace("(", "")
                .replace(")", "")
                .replace("-", "")
                .replace(" ", ""),
        email: this.emailForm,
        cnpj:
          this.cnpjForm == ""
            ? ""
            : this.cnpjForm
                .replace(".", "")
                .replace(".", "")
                .replace("-", "")
                .replace("/", ""),
        address: this.enderecoForm,
        streetNumber: this.numeroForm,
        cep: this.cepForm == "" ? "" : this.cepForm.replace("-", ""),
        active: this.ativoForm,
      };
      this.$store
        .dispatch(ALTERAROUCRIARFORNECEDOR, payload)
        .then(() => {
          if (this.codigoForm == "0" || this.codigoForm == "") {
            let payload = {
              message: "Fornecedor criado com sucesso!",
              color: "success",
            };
            this.alertaParaUsuario(payload);
            this.fechar();
          } else {
            let payload = {
              message: "Fornecedor alterado com sucesso!",
              color: "success",
            };
            this.alertaParaUsuario(payload);
            this.fechar();
          }
        })
        .catch((error) => {
          if (error) {
            let payload = {
              message: "Ocorreu um erro ao criar o Parceiro",
              color: "error",
            };
            this.alertaParaUsuario(payload);
          }
        });
    },
    alertaParaUsuario(payload) {
      this.$store.commit(SET_MESSAGE, payload);
    },
    async buscarFornecedor() {
      if (this.codigoFornecedor != 0) {
        let payload = {
          idProvider: this.codigoFornecedor,
        };

        await this.$store
          .dispatch(BUSCARFORNECEDORPORID, payload)
          .then(() => {
            this.carregarDadosForm();
          })
          .catch((error) => {
            if (error) {
              let payload = {
                message: "Ocorreu um erro ao carregar os dados do fornecedor",
                color: "error",
              };
              this.alertaParaUsuario(payload);
            }
          });
      }
    },
    carregarDadosForm() {
      this.codigoForm = this.fornecedorSelecionado.id;
      this.razaoForm = this.fornecedorSelecionado.legalCompanyName;
      this.fantasiaForm = this.fornecedorSelecionado.companyName;
      this.emailForm = this.fornecedorSelecionado.email;
      this.telefoneForm = this.fornecedorSelecionado.phoneNumber;
      this.cnpjForm = this.fornecedorSelecionado.cnpj;
      this.enderecoForm = this.fornecedorSelecionado.address;
      this.numeroForm = this.fornecedorSelecionado.streetNumber;
      this.cepForm = this.fornecedorSelecionado.cep;
      this.ativoForm = this.fornecedorSelecionado.active;
    },
    limparCamposForm() {
      this.codigoForm = "0";
      this.razaoForm = "";
      this.fantasiaForm = "";
      this.emailForm = "";
      this.telefoneForm = "";
      this.cnpjForm = "";
      this.enderecoForm = "";
      this.numeroForm = "";
      this.cepForm = "";
      this.ativoForm = false;
    },
  },
};
</script>

<style></style>
