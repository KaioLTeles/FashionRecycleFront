<template>
  <v-container class="fill-height" fluid style>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card width="400" class="mx-auto mt-10 elevation-12">
          <v-card-title class="justify-center">
            <img width="200" height="200" src="@/assets/logo.png" />
            <img />
          </v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                label="Usuario"
                prepend-icon="mdi-account-circle"
                v-model="matricula"
                :rules="loginRules"
                @keypress.enter="logar"
              />
              <v-text-field
                :type="showPassword ? 'text' : 'password'"
                label="Senha"
                prepend-icon="mdi-lock"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
                v-model="senha"
                :rules="senhaRules"
                @keypress.enter="logar"
              />
              <v-btn
                block
                color="#4693f8"
                @click="logar"
                :loading="logarLoading"
                >Entrar</v-btn
              >
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {
  AUTENTICAR,
  /*ENVIA_CHAVE_ACESSO,
    INSERE_MATRICULA,*/
  GET_SESSION_EXPIRED,
  SET_SESSION_EXPIRED,
} from "@/store/types/UsuarioType";
import { SET_MESSAGE } from "@/store/types/NotificationType";
import { mapState } from "vuex";

export default {
  name: "Login-page",
  data() {
    return {
      showPassword: false,
      matricula: "",
      senha: "",
      valid: false,
      loginRules: [],
      senhaRules: [],
      logarLoading: false,
    };
  },
  created() {
    this.$store.dispatch(GET_SESSION_EXPIRED).then((response) => {
      if (response) {
        let payload = {
          message: "Sessão Expirada, favor realize login novamente!",
          color: "error",
        };
        this.$store.commit(SET_MESSAGE, payload);
        this.$store.dispatch(SET_SESSION_EXPIRED, false);
      }
    });
  },
  methods: {
    async logar() {
      this.loginRules = [(v) => !!v || "A Matricula é obrigatória"];
      this.senhaRules = [(v) => !!v || "A Senha é obrigatória"];
      await this.$refs.form.validate();
      if (this.valid) {
        this.logarLoading = true;
        const loginModel = {
          username: this.matricula,
          password: this.senha,
        };
        this.$store
          .dispatch(AUTENTICAR, loginModel)
          .then((response) => {
            this.logarLoading = false;
            if (response.loginStatus == 2) {
              let payload = {
                message: "Usuario ou senha incorreto!",
                color: "error",
              };
              this.$store.commit(SET_MESSAGE, payload);
            } else if (response.loginStatus == 3) {
              let payload = {
                message: "Usuario bloqueado!",
                color: "error",
              };
              this.$store.commit(SET_MESSAGE, payload);
            } else if (response.loginStatus == 1) {
              this.logarLoading = false;
              this.$router.push("/");
            }
          })
          .catch(() => {
            this.logarLoading = false;
          });
      }
    },
    goEsqueciMinhaSenha() {
      this.$router.push("/esqueci-minha-senha");
    },
  },
  computed: {
    ...mapState({
      usuario: (state) => state.UsuarioStore,
    }),
  },
};
</script>
<style>
.link {
  color: #6d96bd !important;
}
</style>
