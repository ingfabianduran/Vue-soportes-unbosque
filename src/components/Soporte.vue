<template>
    <v-app>
        <v-container fill-height>
            <v-layout row wrap align-center justify-center>
                <v-flex xl6 lg6 md6 sm12 xs12>        
                    <div class="animated fadeIn">
                    <loading :active="isLoading" :can-cancel="false" :is-full-page="true" loader="dots"></loading>
                        <v-form ref="form" @submit.prevent="registrarSoporte" autocomplete="off">
                            <v-card>
                                <h2 class="card-header text-center text-white font-weight-bold text-uppercase py-4 light-blue lighten-1">Nuevo Soporte</h2>
                                <div class="mx-5">
                                    <v-select label="Tipo de Servicio" class="mx-5 my-4" :items="dataForm.data.dataForm.servicios" @change="getLabores" v-model="soporte.servicio" :rules="selectRules" required></v-select>
                                    <v-select label="Técnico" class="mx-5 my-4" :items="dataForm.data.dataForm.tecnicos" v-model="soporte.tecnico" :rules="selectRules" required></v-select>
                                    <v-text-field label="Correo Institucional" class="mx-5 my-4" v-model="soporte.correo" :rules="inputCorreo" required></v-text-field>
                                    <v-select label="Perfil del Solicitante" class="mx-5 my-4" :items="dataForm.data.dataForm.perfiles" v-model="soporte.perfil" :rules="selectRules" required></v-select>
                                    <v-select label="Bloque" class="mx-5 my-4" :items="dataForm.data.dataForm.bloques" v-model="soporte.bloque" :rules="selectRules" required></v-select>
                                    <v-text-field label="Numero del Salón" class="mx-5 my-4" v-model="soporte.salon" :rules="inputSalon" required></v-text-field>
                                    <v-select label="Labor Realizada" class="mx-5 my-4" :loading="isLoadingLabores" :items="labores" v-model="soporte.labor" :disabled="statusLabores" :rules="selectLabores" required></v-select>
                                    <v-select label="Incidente Solucionádo" class="mx-5 my-4" :items="dataForm.data.dataForm.soluciones" v-model="soporte.solucionado" :disabled="statusIncidente" :rules="selectIncidente" required></v-select>
                                </div>
                                <v-layout align-center justify-center fill-height>
                                    <v-flex xl6 lg6 md6 sm8 xs8>
                                        <v-btn type="submit" class="orange darken-1 text-white" block>Registrar</v-btn>
                                        <v-btn class="grey darken-4 my-4 text-white" block>Cancelar</v-btn>
                                    </v-flex>
                                </v-layout>
                                <div class="card-footer text-muted text-center">
                                    <h5 class="font-weight-bolder">¿Eres Admin? Ingresa <a href="/#/session">Aquí!!!</a></h5>
                                </div>
                            </v-card>
                        </v-form>
                    </div>
                </v-flex>
             </v-layout>
        </v-container>
    </v-app>
</template>
<script>
import gql from 'graphql-tag'
import Vue from 'vue';
import Loading from 'vue-loading-overlay';
import swal from "sweetalert2";
import query from "../query/registro";
import VueSession from "vue-session";


Vue.use(Loading);
Vue.use(VueSession);

export default {
    data() {
        return {
            dataForm: {},
            labores: [],
            isLoading: true,
            isLoadingLabores: false,
            statusLabores: true,
            statusIncidente: true,
            
            soporte: {
                servicio: "",
                tecnico: "",
                correo: "",
                perfil: "",
                bloque: "",
                salon: "",
                labor: "",
                solucionado: "",
            },

            selectRules: [
                v => !!v || "El campo es requerido"
            ],
            inputCorreo: [
                v => !!v || "El campo es requerido"
            ],
            selectLabores: [
                v => {
                    if (!this.statusLabores) {
                        if (v.length === 0) {
                            return 'El campo es requerido';
                        }
                    }
                }
            ],
            selectIncidente: [
                v => {
                    if (!this.statusIncidente) {
                        if (v.length === 0) {
                            return 'El campo es requerido';
                        }
                    }
                }
            ],
            inputSalon: [
                v => !!v || "El campo es requerido",
                v => {
                    
                    if (this.soporte.bloque != "Bloque L") {
                        if (v.length <= 2 || v.length >= 5) {
                            return 'Minimo 3, maximo 4 caracteres';
                        }
                    }
                }
            ]
        }
    },
    components: {
        Loading
    },
    async beforeMount() {
        await this.getDataForm();
    },
    methods: {

        async getDataForm() {
            try {
                this.dataForm = await this.$apollo.query({
                    query: gql`${query.DATA_FORM}`
                });

                setInterval(() => {
                    this.isLoading = false;
                }, 1000);
            } catch(e) {
                this.$router.push("error");
            }
        },

        async getLabores() {
            if (this.soporte.servicio === "Soporte" || this.soporte.servicio === "Mantenimiento") {
                try {
                    this.isLoadingLabores = true;
                    
                    const listaLabores = await this.$apollo.query({
                        query: gql`${query.LABORES}`,
                        variables: {
                            typeSuport: this.soporte.servicio
                        }
                    });
                    
                    this.labores = listaLabores.data.labores.labores;
                    this.statusLabores = false;

                    if (this.soporte.servicio === "Soporte") this.statusIncidente = false;
                    else this.statusIncidente = true;

                    setInterval(() => {
                        this.isLoadingLabores = false;
                    }, 1000);
                } catch(e) {
                    await this.createAlert("Oh oh!!!", "Algo raro paso por aquí!!!", "error");
                }
            }
            else {
                this.registrarIncidente();
            }
        },

        async registrarIncidente() {
            const {value: text} = await swal.fire({
                type: "warning",
                title: "Nuevo Incidente",
                text: `${this.soporte.servicio}`,
                input: 'textarea',
                inputPlaceholder: 'Registre el incidente....',
                inputAttributes: {
                    'aria-label': 'Registre el incidente....'
                },
                confirmButtonText: "Enviar",
                showCancelButton: true,
                inputValidator: (value) => {
                    return !value && 'Por favor registre algo!!!'
                },
            })

            if (text) {
                try {
                    this.isLoading = true;
                    const nuevoCorreo = await this.$apollo.mutate({
                        mutation: gql`${query.SEND_EMAIL_OPC}`,
                        variables: {
                            input: {
                                type: this.soporte.servicio,
                                desc: text
                            }
                        }
                    });

                    if (nuevoCorreo.data.sendEmailAdd.state) {
                        await this.createAlert("Good!!!", nuevoCorreo.data.sendEmailAdd.message, "success").then(() => {
                            location.reload();
                        });
                    } else {
                        await this.createAlert("Oh oh!!!", nuevoCorreo.data.sendEmailAdd.message, "error");
                    }
                } catch(e) {
                    await this.createAlert("Oh oh!!!", "Algo raro paso por aquí!!!", "error");
                }
            } else {
                location.reload();
            }
        },

        async registrarSoporte() {
            if (this.$refs.form.validate()) {
                try {
                    this.isLoading = true;
                    
                    const nuevoSoporte = await this.$apollo.mutate({
                        mutation: gql`${query.NEW_SUPPORT}`,
                        variables: {
                            input: {
                                servicio: this.soporte.servicio,
                                tecnico: this.soporte.tecnico,
                                solicitante: this.soporte.correo,
                                perfil: this.soporte.perfil,
                                bloque: this.soporte.bloque,
                                salon: this.soporte.salon,
                                labor: this.soporte.labor,
                                solucionado: this.soporte.solucionado
                            }
                        }
                    });

                    setInterval(() => {
                        this.isLoading = false;
                    }, 6000);
                    
                    if (nuevoSoporte.data.createSoporte.state) {
                        await this.createAlert("Good!!!", nuevoSoporte.data.createSoporte.message, "success").then(() => {
                            location.reload();
                        });
                    } else {
                        await this.createAlert("Oh oh!!!", nuevoSoporte.data.createSoporte.message, "error");
                    }
                } catch(e) {
                    await this.createAlert("Oh oh!!!", "Algo raro paso por aquí!!!", "error");
                }
            }
        },

        async createAlert(title, message, type) {
            try {
                const alert = await swal.fire(title, message, type);
                return alert;
            } catch (e) {
                console.log(e);
            }
        }
    }
}
</script>