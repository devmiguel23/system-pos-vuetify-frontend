<template>
  <v-container class="ma-0 pa-0" fluid>
    <v-card>
      <v-data-table
        :headers="headers"
        :items="products"
        item-key="id"
        :sort-by="['name']"
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
        <!-- PRODUCTO  -->
        <template v-slot:top>
          <v-toolbar flat dense>
            <v-toolbar-title>Productos</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <!-- DIALOG CATEGORIAS  -->
            <!-- FIN DIALOG CATEGORIAS  -->
            <!-- DIALOG PRODUCTO -->
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
                    <span>Nuevo Producto</span>
                  </v-tooltip>
                </div>
              </template>
              <v-card>
                <v-toolbar dark color="primary" dense>
                  <v-btn icon dark @click="close" small>
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                  <v-toolbar-title v-text="formTitle"></v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-toolbar-items>
                    <v-btn
                      :disabled="$v.editedItem.$invalid"
                      :loading="btnLoading"
                      dark
                      text
                      @click="save"
                      small
                    >
                      Guardar
                    </v-btn>
                  </v-toolbar-items>
                </v-toolbar>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col
                        cols="12"
                        sm="2"
                        md="2"
                        lg="2"
                        xl="2"
                        v-if="editedIndex === -1"
                      >
                        <label class="font-weight-bold" for=""
                          >Generar Codigo
                        </label>
                        <v-btn
                          block
                          @click="generateBarCode"
                          color="primary white--text"
                          small
                          ><v-icon>mdi-barcode-scan</v-icon></v-btn
                        >
                      </v-col>
                      <v-col
                        cols="12"
                        sm="3"
                        md="3"
                        lg="3"
                        xl="3"
                        v-if="editedIndex === -1"
                      >
                        <label class="font-weight-bold" for=""
                          >Codigo Barra
                          <span class="error--text">*</span></label
                        >
                        <v-text-field
                          :disabled="inputBarCode"
                          solo
                          required
                          v-model="editedItem.barcode"
                          :hide-details="hideDetails(barcodeErrors.length)"
                          :error-messages="barcodeErrors"
                          @input="$v.editedItem.barcode.$touch()"
                          @blur="$v.editedItem.barcode.$touch()"
                          label="9999999999999"
                          v-mask="'#############'"
                          type="number"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="7" md="7" lg="7" xl="7">
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
                          label="Nombre del producto"
                          type="text"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="4" md="4" lg="4" xl="4">
                        <label class="font-weight-bold" for=""
                          >Referencia Larga</label
                        >
                        <v-text-field
                          solo
                          v-model="editedItem.referencelarge"
                          :hide-details="
                            hideDetails(referencelargeErrors.length)
                          "
                          :error-messages="referencelargeErrors"
                          @input="$v.editedItem.referencelarge.$touch()"
                          @blur="$v.editedItem.referencelarge.$touch()"
                          label="Referencia Larga"
                          type="text"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="4" md="4" lg="4" xl="4">
                        <label class="font-weight-bold" for=""
                          >Referencia Corta</label
                        >
                        <v-text-field
                          solo
                          v-model="editedItem.referencesmall"
                          :hide-details="
                            hideDetails(referencesmallErrors.length)
                          "
                          :error-messages="referencesmallErrors"
                          @input="$v.editedItem.referencesmall.$touch()"
                          @blur="$v.editedItem.referencesmall.$touch()"
                          label="Referencia Corta"
                          type="text"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="4" md="4" lg="4" xl="4">
                        <label class="font-weight-bold" for="">StockMin</label>
                        <v-text-field
                          solo
                          v-model="editedItem.stockmin"
                          :hide-details="hideDetails(stockminErrors.length)"
                          :error-messages="stockminErrors"
                          @input="$v.editedItem.stockmin.$touch()"
                          @blur="$v.editedItem.stockmin.$touch()"
                          label="Stock min."
                          type="number"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="4" md="4" lg="4" xl="4">
                        <label class="font-weight-bold" for="">Categoria</label>
                        <v-select
                          clearable
                          solo
                          v-model="editedItem.idcategory"
                          :items="itemsCategory"
                          item-text="name"
                          item-value="_id"
                          label="Categoria"
                          hide-details
                          no-data-text="No hay Categorias"
                        ></v-select>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
              </v-card>
            </v-dialog>
            <category-component @onEventCagetory="onCategory" />
            <!-- FIN DIALOG PRODUCTO -->
            <!-- DIALOG DELETE  -->
            <v-dialog
              @keydown.esc="closeDelete"
              @keydown.enter="deleteItemConfirm"
              persistent
              v-model="dialogDelete"
              max-width="600px"
            >
              <v-card>
                <v-toolbar dark color="primary" dense>
                  <v-btn icon dark @click="closeDelete" small>
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
                      small
                    >
                      Save
                    </v-btn>
                  </v-toolbar-items>
                </v-toolbar>
              </v-card>
            </v-dialog>
            <!-- FIN DIALOG DELETE  -->
          </v-toolbar>
        </template>
        <!-- FIN PRODUCTO  -->
        <template v-slot:[`item.options`]="{ item }">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                color="success"
                v-bind="attrs"
                v-on="on"
                small
                class="mr-2"
              >
                mdi-chart-areaspline
              </v-icon>
            </template>
            <span>Reportes</span>
          </v-tooltip>
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
          <v-btn color="tertiary white--text" @click="getProducts">
            Actualizar
          </v-btn>
        </template>
        <template v-slot:no-results> Lo que esta buscando no aparece </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>
<script>
// import moment from "moment";
import { validationMixin } from "vuelidate";
import {
  required,
  maxLength,
  minLength,
  decimal,
  helpers,
} from "vuelidate/lib/validators";
const alpha = helpers.regex("alpha", /^[a-zA-Z-0-9- ]*$/);

export default {
  mixins: [validationMixin],
  validations: {
    editedItem: {
      barcode: {
        required,
        decimal,
      },
      name: {
        required,
        alpha,
        maxLength: maxLength(100),
        minLength: minLength(1),
      },
      referencelarge: {
        alpha,
        maxLength: maxLength(50),
        minLength: minLength(1),
      },
      referencesmall: {
        alpha,
        maxLength: maxLength(25),
        minLength: minLength(1),
      },
      stockmin: {
        decimal,
      },
    },
  },
  name: "Dashboard-Product",
  components: {
    CategoryComponent: () =>
      import("@/components/product/CategoryComponent.vue"),
  },
  data: () => ({
    selectBoxCategory: null,
    itemsCategory: [],
    search: null,
    tableLoading: false,
    btnLoading: false,
    btnDLoading: false,
    headers: [
      {
        text: "Codigo Barra",
        align: "start",
        value: "barcode",
      },
      { text: "Descripción", sortable: true, value: "name" },
      { text: "Referencia", value: "referencelarge" },
      { text: "Ref Corta", value: "referencesmall" },
      { text: "Categoria", value: "categoryname" },
      { text: "Stock min.", value: "stockmin" },
      { text: "Compra", value: "buy" },
      { text: "Venta", value: "sale" },
      { text: "Stock", value: "stock" },
      { text: "Opciones", align: "end", value: "options", sortable: false },
    ],
    inputBarCode: false,
    products: [],
    dialog: false,
    dialogDelete: false,
    editedIndex: -1,
    editedItem: {
      barcode: null,
      name: null,
      referencelarge: null,
      referencesmall: null,
      stockmin: 0,
      idcategory: null,
      categoryname: null,
    },
    defaultItem: {
      barcode: null,
      name: null,
      referencelarge: null,
      referencesmall: null,
      stockmin: 0,
      idcategory: null,
      categoryname: null,
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
    this.getProducts();
  },
  methods: {
    onCategory(value) {
      this.itemsCategory = value;
    },
    generateBarCode() {
      this.inputBarCode = true;
      this.editedItem.barcode =
        Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
    },
    editItem(item) {
      this.inputBarCode = true;
      this.editedIndex = this.products.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      this.editedIndex = this.products.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.deleteProduct(this.editedItem);
    },
    close() {
      this.$v.$reset();
      this.btnLoading = false;
      this.tableLoading = false;
      this.dialog = false;
      this.inputBarCode = false;
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
    save() {
      if (!this.$v.$invalid) {
        if (this.editedIndex > -1) this.updateProduct(this.editedItem);
        else this.createProduct(this.editedItem);
      }
    },

    async getProducts() {
      this.products = [];
      this.tableLoading = true;
      await this.axios
        .get("/product")
        .then(async (res) => {
          this.products = res.data;
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
    },
    async createProduct(data) {
      this.tableLoading = true;
      this.btnLoading = true;
      this.$v.$touch();
      if (!this.$v.$invalid) {
        await this.axios
          .post("/product", data)
          .then((res) => {
            this.products.push(res.data);
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
    async updateProduct(data) {
      this.tableLoading = true;
      this.btnLoading = true;
      this.$v.$touch();
      if (!this.$v.$invalid) {
        if (data.idcategory == null) data.categoryname = null;
        await this.axios
          .put(`/product/${data._id}`, data)
          .then((res) => {
            Object.assign(this.products[this.editedIndex], res.data);
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
    async deleteProduct(data) {
      this.tableLoading = true;
      this.btnDLoading = true;
      await this.axios
        .delete(`/product/${data._id}`)
        .then(() => {
          this.products.splice(this.editedIndex, 1);
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
    stockminErrors() {
      const errors = [];
      if (!this.$v.editedItem.stockmin.$dirty) return errors;
      !this.$v.editedItem.stockmin.decimal &&
        errors.push("El codigo de barra solo permite numeros.");
      return errors;
    },
    referencesmallErrors() {
      const errors = [];
      if (!this.$v.editedItem.referencesmall.$dirty) return errors;
      !this.$v.editedItem.referencesmall.maxLength &&
        errors.push("La descripcion debe tener 100 caracteres como máximo.");
      !this.$v.editedItem.referencesmall.minLength &&
        errors.push("La descripcion debe tener 1 caracteres como minimo.");
      !this.$v.editedItem.referencesmall.alpha &&
        errors.push("Solo es permitido a-z-A-Z-0-9.");
      return errors;
    },
    referencelargeErrors() {
      const errors = [];
      if (!this.$v.editedItem.referencelarge.$dirty) return errors;
      !this.$v.editedItem.referencelarge.maxLength &&
        errors.push("La descripcion debe tener 100 caracteres como máximo.");
      !this.$v.editedItem.referencelarge.minLength &&
        errors.push("La descripcion debe tener 1 caracteres como minimo.");
      !this.$v.editedItem.referencelarge.alpha &&
        errors.push("Solo es permitido a-z-A-Z-0-9.");
      return errors;
    },
    nameErrors() {
      const errors = [];
      if (!this.$v.editedItem.name.$dirty) return errors;
      !this.$v.editedItem.name.required &&
        errors.push("El nombre es requerido.");
      !this.$v.editedItem.name.maxLength &&
        errors.push("El nombre debe tener 100 caracteres como máximo.");
      !this.$v.editedItem.name.minLength &&
        errors.push("El nombre debe tener 1 caracteres como minimo.");
      !this.$v.editedItem.name.alpha &&
        errors.push("Solo es permitido a-z-A-Z-0-9.");
      return errors;
    },
    barcodeErrors() {
      const errors = [];
      if (!this.$v.editedItem.barcode.$dirty) return errors;
      !this.$v.editedItem.barcode.required &&
        errors.push("El codigo de barra es requerido.");
      !this.$v.editedItem.barcode.decimal &&
        errors.push("El codigo de barra solo permite numeros.");
      return errors;
    },
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Producto" : "Editar Producto";
    },
  },
};
</script>