<template>
  <v-row>
    <v-dialog v-model="show" persistent max-width="800px">
      <v-card>
        <v-card-title class="justify-center">
          Cadastro de Usuario
          <v-spacer />
          <v-icon medium @click.stop="fechar"> mdi-close </v-icon>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    label="Usuario"
                    v-model="usuarioForm"
                    disabled
                    clearable
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Nome*"
                    v-model="nomeForm"
                    :rules="nomeRule"
                    clearable
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="E-mail*"
                    v-model="emailForm"
                    :rules="emailRule"
                    clearable
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Nova Senha"
                    :type="showPassword ? 'text' : 'password'"
                    prepend-icon="mdi-lock"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showPassword = !showPassword"
                    v-model="novaSenhaForm"                    
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Nova Senha Confirmação"
                    :type="showPassword ? 'text' : 'password'"
                    prepend-icon="mdi-lock"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showPassword = !showPassword"
                    v-model="novaSenhaConfirmForm"                    
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
import { BUSCARUSERPELOID, EMPTYUSER } from "@/store/types/UsuarioType";

import { SET_MESSAGE } from "@/store/types/NotificationType";

export default {
  props: ["value", "codigoUsuario"],
  data() {
    return {
      nomeRule: [(v) => !!v || "Nome é Obrigatório"],
      emailRule: [(v) => !!v || "E-mail é obrigatório"],
      valid: false,
      usuarioForm: "",
      nomeForm: "",
      emailForm: "",
      novaSenhaForm: "",
      novaSenhaConfirmForm: "",
      ativoForm: true,
      showPassword: false
    };
  },
  computed: {
    show: {
      get() {
        this.buscarParceiro();
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
    UsuarioSelecionado() {
      return this.$store.state.UsuarioStore.usuarioObj;
    },
  },
  methods: {
    fechar() {
      this.$emit("resetarcodigoUsuario");
      this.$store.commit(EMPTYUSER);
      this.limparCamposForm();
      this.$refs.form.resetValidation();
      this.$refs.form.reset();
      this.show = !this.show;
    },
    salvar() {
      if (this.$refs.form.validate()) {
        if (
          this.novaSenhaForm != "" &&
          this.novaSenhaForm != null &&
          this.novaSenhaForm != undefined &&
          this.novaSenhaConfirmForm != "" &&
          this.novaSenhaConfirmForm != null &&
          this.novaSenhaConfirmForm != undefined
        ) {
          if (this.novaSenhaForm == this.novaSenhaConfirmForm) {
            this.gravarParceiro();
          } else {
            let payload = {
              message: "As senhas estão diferentes!",
              color: "warning",
            };
            this.alertaParaUsuario(payload);
          }
        }
      } else {
        let payload = {
          message: "Favor preencher todos os campos!",
          color: "warning",
        };
        this.alertaParaUsuario(payload);
      }
    },
    gravarParceiro() {},
    alertaParaUsuario(payload) {
      this.$store.commit(SET_MESSAGE, payload);
    },
    async buscarParceiro() {
      if (this.codigoUsuario != 0) {
        let payload = {
          id: this.codigoUsuario,
        };

        await this.$store
          .dispatch(BUSCARUSERPELOID, payload)
          .then(() => {
            this.carregarDadosForm();
          })
          .catch((error) => {
            if (error) {
              let payload = {
                message: "Ocorreu um erro ao carregar os dados do Usuario",
                color: "error",
              };
              this.alertaParaUsuario(payload);
            }
          });
      }
    },
    carregarDadosForm() {
      this.usuarioForm = this.UsuarioSelecionado.userName;
      this.nomeForm = this.UsuarioSelecionado.name;
      this.emailForm = this.UsuarioSelecionado.email;
      this.ativoForm = this.UsuarioSelecionado.active;
    },
    limparCamposForm() {
      this.codigoForm = 0;
      this.nomeForm = "";
      this.emailForm = "";
      this.telefoneForm = "";
      this.cpfForm = "";
      this.enderecoForm = "";
      this.numeroForm = "";
      this.cepForm = "";
      this.ativoForm = false;
    },
  },
};
</script>

<style></style>
