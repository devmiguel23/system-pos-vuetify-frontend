<template>
  <v-card
    :loading="loadingCard"
    elevation="4"
    width="500"
    min-width="200"
    max-width="400"
  >
    <div class="d-flex flex-column justify-center align-center">
      <v-form @submit.prevent="signIn" class="my-4">
        <label class="font-weight-bold" for="username">Nombre de Usuario</label>
        <v-text-field
          id="username"
          required
          :hide-details="hideDetails(usernameErrors.length)"
          :error-messages="usernameErrors"
          v-model.trim="form.username"
          @input="$v.form.username.$touch()"
          @blur="$v.form.username.$touch()"
          class="mb-3"
          type="text"
          label="Nombre de Usuario"
          solo
        ></v-text-field>
        <label class="font-weight-bold" for="password">Contraseña</label>
        <v-text-field
          id="password"
          :append-icon="eyeShow ? 'mdi-eye' : 'mdi-eye-off'"
          required
          :hide-details="hideDetails(passwordErrors.length)"
          :error-messages="passwordErrors"
          @input="$v.form.password.$touch()"
          @blur="$v.form.password.$touch()"
          v-model.trim="form.password"
          class="mb-3"
          :type="eyeShow ? 'text' : 'password'"
          @click:append="eyeShow = !eyeShow"
          solo
          label="Contraseña"
        ></v-text-field>
        <div class="mt-4 d-flex justify-space-between align-center">
          <v-checkbox
            class="ma-0 pa-0"
            color="secondary"
            label="Recuérdame"
          ></v-checkbox>
        </div>
        <v-btn
          :disabled="$v.$invalid"
          type="submit"
          block
          color="primary"
          elevation="2"
          large
          :loading="btnLoading"
          >Entrar
        </v-btn>
      </v-form>
    </div>
  </v-card>
</template>
<script>
import { validationMixin } from "vuelidate";
import {
  required,
  maxLength,
  minLength,
  helpers,
} from "vuelidate/lib/validators";
const alpha = helpers.regex("alpha", /^[a-zA-Z-0-9- ]*$/);

export default {
  mixins: [validationMixin],
  validations: {
    form: {
      username: {
        required,
        maxLength: maxLength(25),
        minLength: minLength(3),
        alpha,
      },
      password: {
        required,
      },
    },
  },
  name: "Auth-SignIn",
  data: () => ({
    loadingCard: false,
    btnLoading: false,
    eyeShow: false,
    form: {
      username: null,
      password: null,
    },
    defaultform: {
      username: null,
      password: null,
    },
  }),
  methods: {
    async signIn() {
      this.loadingCard = true;
      this.$v.$touch();
      if (!this.$v.$invalid) {
        await this.axios
          .post("/signin", this.form)
          .then((res) => {
            localStorage.setItem("Authorization", res.data.token);
            this.axios.defaults.headers.common["Authorization"] =
              "Bearer " + localStorage.getItem("Authorization");
            Object.assign(this.form, this.defaultform);
            this.$v.$reset();
            setTimeout(() => {
              this.loadingCard = false;
              this.$router.push("/dashboard");
            }, 1000);
          })
          .catch((err) => {
            this.$swal({
              icon: "error",
              title: "Oops...",
              text: err.response.data.message,
            });
          });
      }
    },
    hideDetails(val) {
      if (val <= 0) {
        return true;
      } else {
        return false;
      }
    },
  },
  computed: {
    passwordErrors() {
      const errors = [];
      if (!this.$v.form.password.$dirty) return errors;
      !this.$v.form.password.required && errors.push("Es requerido.");
      return errors;
    },
    usernameErrors() {
      const errors = [];
      if (!this.$v.form.username.$dirty) return errors;
      !this.$v.form.username.required && errors.push("Es requerido.");
      !this.$v.form.username.maxLength &&
        errors.push("Debe tener 25 caracteres como máximo.");
      !this.$v.form.username.minLength &&
        errors.push("Debe tener 3 caracteres como minimo.");
      !this.$v.form.username.alpha &&
        errors.push("Solo es permitido a-z-A-Z-0-9.");
      return errors;
    },
  },
};
</script>