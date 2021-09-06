<template>
  <v-container class="ma-0 pa-0" fluid>
    <v-card>
      <v-data-table
        :headers="headers"
        :items="users"
        item-key="id"
        :sort-by="['username']"
        :sort-desc="[false, true]"
        multi-sort
        :search="search"
        :loading="tableLoading"
        loading-text="Por favor... espere un momento."
        class="elevation-1"
        dense
        :items-per-page="20"
        :footer-props="{
          itemsPerPageAllText: 'Todo',
          itemsPerPageText: 'Filas por página',
          itemsPerPageOptions: [10, 20, 50, 100, -1],
          pageText: '{0}-{1} de {2}',
        }"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Usuarios</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-dialog
              @keydown.esc="close"
              @keydown.enter="save"
              persistent
              v-model="dialog"
              max-width="900px"
            >
              <template v-slot:activator="{ on, attrs }">
                <div class="d-flex justify-center align-center">
                  <v-text-field
                    class="mx-4"
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Buscar"
                    single-line
                    hide-details
                    solo
                    dense
                  ></v-text-field>
                  <v-btn color="primary" dark v-bind="attrs" v-on="on">
                    Nuevo Producto
                  </v-btn>
                </div>
              </template>
              <v-card>
                <v-toolbar dark color="primary">
                  <v-btn icon dark @click="close">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                  <v-toolbar-title v-text="formTitle"></v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-toolbar-items>
                    <v-btn
                      :disabled="$v.$invalid"
                      :loading="btnLoading"
                      dark
                      text
                      @click="save"
                    >
                      Guardar
                    </v-btn>
                  </v-toolbar-items>
                </v-toolbar>
                <v-card-text>
                  <v-container> </v-container>
                </v-card-text>
              </v-card>
            </v-dialog>

            <v-dialog
              @keydown.esc="closeDelete"
              @keydown.enter="deleteItemConfirm"
              persistent
              v-model="dialogDelete"
              max-width="600px"
            >
              <v-card>
                <v-toolbar dark color="primary">
                  <v-btn icon dark @click="closeDelete">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                  <v-toolbar-title
                    >Seguro que desea deshabilitar este
                    registro?</v-toolbar-title
                  >
                  <v-spacer></v-spacer>
                  <v-toolbar-items>
                    <v-btn
                      dark
                      text
                      :loading="btnDLoading"
                      @click="deleteItemConfirm"
                    >
                      Save
                    </v-btn>
                  </v-toolbar-items>
                </v-toolbar>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:[`item.options`]="{ item }">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-bind="attrs" v-on="on" small class="mr-2 success--text">
                mdi-shield-key
              </v-icon>
            </template>
            <span>Permisos</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                v-bind="attrs"
                v-on="on"
                small
                class="mr-2"
                @click="editItem(item)"
              >
                mdi-pencil
              </v-icon>
            </template>
            <span>Editar</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-bind="attrs" v-on="on" small @click="deleteItem(item)">
                mdi-delete
              </v-icon>
            </template>
            <span>Borrar</span>
          </v-tooltip>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="getUsers"> Actualizar </v-btn>
        </template>
        <template v-slot:no-results> Lo que esta buscando no aparece </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>
<script>
import moment from "moment";
import { validationMixin } from "vuelidate";
import {
  email,
  required,
  maxLength,
  minLength,
  helpers,
} from "vuelidate/lib/validators";
const alpha = helpers.regex("alpha", /^[a-zA-Z-0-9- ]*$/);
export default {
  mixins: [validationMixin],
  validations: {
    editedItem: {
      username: {
        required,
        alpha,
        maxLength: maxLength(25),
        minLength: minLength(1),
      },
      email: {
        required,
        email,
      },
      fullname: {
        alpha,
        maxLength: maxLength(25),
      },
      phonenumber: {
        maxLength: maxLength(50),
      },
      aid: {
        maxLength: maxLength(25),
      },
    },
  },
  name: "Dashboard-Users",
  data: () => ({
    search: null,
    tableLoading: false,
    btnLoading: false,
    btnDLoading: false,
    headers: [
      {
        text: "Nombre de Usuario",
        align: "start",
        value: "username",
      },
      { text: "Correo", value: "email" },
      { text: "Nombre Completo", value: "fullname" },
      { text: "Telefono", value: "phonenumber" },
      { text: "Cedula", value: "aid" },
      { text: "Fecha", value: "createdDate" },
      { text: "Opciones", align: "end", value: "options", sortable: false },
    ],
    users: [],
    dialog: false,
    dialogDelete: false,
    dialogSaveLoading: false,
    editedIndex: -1,
    editedItem: {
      username: null,
      email: null,
      fullname: null,
      phonenumber: null,
      aid: 0,
    },
    defaultItem: {
      username: null,
      email: null,
      fullname: null,
      phonenumber: null,
      aid: 0,
    },
  }),
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
  created() {
    this.getUsers();
  },
  methods: {
    async getUsers() {
      this.users = [];
      this.tableLoading = true;
      await this.axios
        .get("/users")
        .then((res) => {
          if (!res.data[1].permission) {
            this.$swal({
              icon: "error",
              title: "Oops...",
              text: res.data.msg,
            });
          } else {
            res.data[0].forEach((e) => {
              e.createdDate = moment(e.createdDate).format("yyyy-MM-DD");
              this.users.push(e);
            });
          }
          this.tableLoading = false;
        })
        .catch((err) => {
          this.$swal({
            icon: "error",
            title: "Oops...",
            text: err.response.data.msg,
          });
        });
    },
    hideDetails(val) {
      if (val <= 0) {
        return true;
      } else {
        return false;
      }
    },
    save() {
      if (this.editedIndex > -1) this.updateUsers(this.editedItem);
      else this.createUsers(this.editedItem);
    },
    closeDelete() {
      this.tableLoading = false;
      this.btnDLoading = false;
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    close() {
      this.$v.$reset();
      this.btnLoading = false;
      this.tableLoading = false;
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    deleteItemConfirm() {
      this.deleteUsers(this.editedItem);
    },
    deleteItem(item) {
      this.editedIndex = this.users.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    editItem(item) {
      this.editedIndex = this.users.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Usuario" : "Editar Usuario";
    },
  },
};
</script>