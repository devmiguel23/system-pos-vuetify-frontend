<template>
  <v-dialog
    @keydown.esc="closeCategory"
    v-model="dialogCategory"
    max-width="900px"
    persistent
  >
    <template v-slot:activator="{ on, attrs }">
      <v-tooltip bottom>
        <template #activator="{ on: onTooltip }">
          <v-btn
            class="mx-2"
            color="info"
            dark
            v-bind="attrs"
            v-on="{ ...on, ...onTooltip }"
          >
            <v-icon>mdi-table-star</v-icon>
          </v-btn>
        </template>
        <span>Categorias</span>
      </v-tooltip>
    </template>
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="closeCategory">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
      </v-toolbar>

      <v-card-text>
        <v-container>
          <!-- TABLE CATEGORIAS  -->
          <v-data-table
            :search="search"
            :headers="headers"
            :items="categories"
            item-key="_id"
            :sort-by="['name']"
            :sort-desc="[true]"
            class="elevation-1"
            :loading="tableLoading"
            loading-text="Por favor... espere un momento."
            hide-default-footer
            :items-per-page="255"
            :footer-props="{
              itemsPerPageAllText: 'Todo',
              itemsPerPageText: 'Filas por página',
              itemsPerPageOptions: [-1],
              pageText: '{0}-{1} de {2}',
            }"
            dense
          >
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title>Categorias </v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <!-- DIALOG EDIT AND ADD CATEGORIA  -->
                <v-dialog
                  @keydown.esc="close"
                  @keydown.enter="save"
                  persistent
                  v-model="dialog"
                  max-width="600px"
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

                      <v-tooltip bottom>
                        <template #activator="{ on: onTooltip }">
                          <v-btn
                            class="mx-2"
                            color="success"
                            dark
                            v-bind="attrs"
                            v-on="{ ...on, ...onTooltip }"
                          >
                            <v-icon>mdi-plus-circle</v-icon>
                          </v-btn>
                        </template>
                        <span>Nueva Categoria</span>
                      </v-tooltip>
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
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="6" md="6" lg="6" xl="6">
                            <label class="font-weight-bold" for=""
                              >Nombre <span class="error--text">*</span></label
                            >
                            <v-text-field
                              solo
                              required
                              v-model="editedItem.name"
                              :hide-details="hideDetails(nameErrors.length)"
                              :error-messages="nameErrors"
                              @input="$v.editedItem.name.$touch()"
                              @blur="$v.editedItem.name.$touch()"
                              label="Nombre"
                              type="text"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="12" md="12" lg="12" xl="12">
                            <label class="font-weight-bold" for=""
                              >Descripcion
                            </label>
                            <v-textarea
                              solo
                              required
                              v-model="editedItem.description"
                              :hide-details="
                                hideDetails(descriptionErrors.length)
                              "
                              :error-messages="descriptionErrors"
                              @input="$v.editedItem.description.$touch()"
                              @blur="$v.editedItem.description.$touch()"
                              label="Descripcion"
                              type="text"
                            ></v-textarea>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>
                  </v-card>
                </v-dialog>
                <!-- FIN DIALOG EDIT AND ADD CATEGORIA  -->

                <!-- DIALOG DELETE CATEGORIA  -->
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
                          Guardar
                        </v-btn>
                      </v-toolbar-items>
                    </v-toolbar>
                  </v-card>
                </v-dialog>
                <!-- FIN DIALOG DELETE CATEGORIA  -->
              </v-toolbar></template
            >
            <template v-slot:[`item.options`]="{ item }">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    color="info"
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
                  <v-icon
                    color="error"
                    v-bind="attrs"
                    v-on="on"
                    small
                    @click="deleteItem(item)"
                  >
                    mdi-delete
                  </v-icon>
                </template>
                <span>Borrar</span>
              </v-tooltip>
            </template>

            <template v-slot:no-data>
              <v-btn color="tertiary white--text" @click="getCategory">
                Actualizar
              </v-btn>
            </template>
            <template v-slot:no-results>
              Lo que esta buscando no aparece
            </template>
          </v-data-table>
          <!-- FIN TABLA CATEGORIAS  -->
        </v-container></v-card-text
      ></v-card
    >
  </v-dialog>
</template>
<script>
import { validationMixin } from "vuelidate";
import { required, helpers } from "vuelidate/lib/validators";
const alpha = helpers.regex("alpha", /^[a-zA-Z-0-9- ]*$/);
export default {
  mixins: [validationMixin],
  validations: {
    editedItem: {
      name: {
        required,
        alpha,
      },
      description: {
        alpha,
      },
    },
  },
  name: "Dashboard-Product-Component",
  data: () => ({
    search: null,
    tableLoading: false,
    btnLoading: false,
    btnDLoading: false,
    headers: [
      {
        text: "Nombre",
        align: "start",
        value: "name",
        sortable: true,
      },
      { text: "Descripción", value: "description" },
      { text: "Opciones", align: "end", value: "options", sortable: false },
    ],
    categories: [],
    dialog: false,
    dialogDelete: false,
    dialogCategory: false,
    editedIndex: -1,
    editedItem: {
      name: null,
      description: null,
    },
    defaultItem: {
      name: null,
      description: null,
    },
  }),
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    dialogCategory(val) {
      val || this.closeCategory();
    },
  },

  created() {
    this.getCategory();
  },
  methods: {
    editItem(item) {
      this.editedIndex = this.categories.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      this.editedIndex = this.categories.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.deleteCategory(this.editedItem);
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
    closeDelete() {
      this.tableLoading = false;
      this.btnDLoading = false;
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    closeCategory() {
      this.dialogCategory = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    save() {
      if (this.editedIndex > -1) this.updateCategory(this.editedItem);
      else this.createCategory(this.editedItem);
    },
    async getCategory() {
      this.categories = [];
      this.tableLoading = true;
      await this.axios
        .get("/categories")
        .then((res) => {
          this.categories = res.data;
          this.tableLoading = false;
        })
        .catch((err) => {
          if (err.response.status == 401) {
            this.$swal({
              icon: "error",
              title: "Oops...",
              text: "La sesion expiro, debe iniciar sesión otra vez.",
            });
          } else {
            err.response.status == 500
              ? this.$swal({
                  icon: "error",
                  title: "Oops...",
                  text: `
                Error interno en el servidor,
                Valor: ${err.response.data.message.value}. \n
                path: ${err.response.data.message.path} \n
                `,
                })
              : this.$swal({
                  icon: "error",
                  title: "Oops...",
                  text: err.response.data.message,
                });
          }
        });
      this.$emit("onEventCagetory", this.categories);
    },
    async createCategory(data) {
      this.tableLoading = true;
      this.btnLoading = true;
      this.$v.$touch();
      if (!this.$v.$invalid) {
        await this.axios
          .post("/categories", data)
          .then((res) => {
            this.categories.push(res.data);
            this.close();
          })
          .catch((err) => {
            if (err.response.status == 401) {
              this.$swal({
                icon: "error",
                title: "Oops...",
                text: "La sesion expiro, debe iniciar sesión otra vez.",
              });
            } else {
              err.response.status == 500
                ? this.$swal({
                    icon: "error",
                    title: "Oops...",
                    text: `
                Error interno en el servidor,
                Valor: ${err.response.data.message.value}. \n
                path: ${err.response.data.message.path} \n
                `,
                  })
                : this.$swal({
                    icon: "error",
                    title: "Oops...",
                    text: err.response.data.message,
                  });
            }
          });
      }
    },
    async updateCategory(data) {
      this.tableLoading = true;
      this.btnLoading = true;
      this.$v.$touch();
      if (!this.$v.$invalid) {
        await this.axios
          .put(`/categories/${data._id}`, data)
          .then((res) => {
            Object.assign(this.categories[this.editedIndex], res.data);
            this.close();
          })
          .catch((err) => {
            if (err.response.status == 401) {
              this.$swal({
                icon: "error",
                title: "Oops...",
                text: "La sesion expiro, debe iniciar sesión otra vez.",
              });
            } else {
              err.response.status == 500
                ? this.$swal({
                    icon: "error",
                    title: "Oops...",
                    text: `
                Error interno en el servidor,
                Valor: ${err.response.data.message.value}. \n
                path: ${err.response.data.message.path} \n
                `,
                  })
                : this.$swal({
                    icon: "error",
                    title: "Oops...",
                    text: err.response.data.message,
                  });
            }
          });
      }
    },
    async deleteCategory(data) {
      this.tableLoading = true;
      this.btnDLoading = true;
      await this.axios
        .delete(`/categories/${data._id}`)
        .then(() => {
          this.categories.splice(this.editedIndex, 1);
          this.closeDelete();
        })
        .catch((err) => {
          if (err.response.status == 401) {
            this.$swal({
              icon: "error",
              title: "Oops...",
              text: "La sesion expiro, debe iniciar sesión otra vez.",
            });
          } else {
            err.response.status == 500
              ? this.$swal({
                  icon: "error",
                  title: "Oops...",
                  text: `
                Error interno en el servidor,
                Valor: ${err.response.data.message.value}. \n
                path: ${err.response.data.message.path} \n
                `,
                })
              : this.$swal({
                  icon: "error",
                  title: "Oops...",
                  text: err.response.data.message,
                });
          }
        });
    },
    hideDetails(val) {
      return val <= 0 ? true : false;
    },
  },

  computed: {
    nameErrors() {
      const errors = [];
      if (!this.$v.editedItem.name.$dirty) return errors;
      !this.$v.editedItem.name.required &&
        errors.push("El nombre es requerido.");
      !this.$v.editedItem.name.alpha &&
        errors.push("Solo es permitido a-z-A-Z-0-9.");
      return errors;
    },
    descriptionErrors() {
      const errors = [];
      if (!this.$v.editedItem.description.$dirty) return errors;
      !this.$v.editedItem.description.alpha &&
        errors.push("Solo es permitido a-z-A-Z-0-9.");
      return errors;
    },
    formTitle() {
      return this.editedIndex === -1 ? "Nueva Categoria" : "Editar Categoria";
    },
  },
};
</script>