<template>
    <v-app>
        <v-container fill-height>
            <v-layout row wrap align-center justify-center>
                <v-flex xl6 lg6 md6 xs12>
                    <div class="animated fadeIn mt-5 mb-5">
                        <loading :active.sync="isLoading" :can-cancel="false" :is-full-page="true"></loading>
                        <v-card>
                            <h3 class="card-header text-center text-white font-weight-bold text-uppercase py-4 light-blue lighten-1">
                                <button type="button" class="close" aria-label="Close" @click="closeSession">
                                    <span aria-hidden="true">×</span>
                                </button>
                                Reporte de Soportes
                            </h3>
                            <div class="card-body mt-5 mx-4">
                                <v-form ref="form" @submit.prevent="generateReporte" autocomplete="off">
                                    <h3 class="text-uppercase">Rango de Fechas:</h3>
                                    <v-divider></v-divider>
                                    <v-layout>
                                        <v-flex xl6 lg6 md6 xs6 class="mx-2">
                                            <v-menu v-model="datePicker.menuFechaIni" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px">
                                                <template v-slot:activator="{ on }">
                                                    <v-text-field v-model="report.fechaInicial" label="Seleccioné Fecha Inicial" prepend-icon="event" readonly v-on="on" :rules="fInicialRules"></v-text-field>
                                                </template>
                                                <v-date-picker v-model="report.fechaInicial" @input="datePicker.menuFechaIni = false"></v-date-picker>
                                            </v-menu>
                                        </v-flex>
                                        <v-flex xl6 lg6 md6 xs6 class="mx-2">
                                            <v-menu v-model="datePicker.menuFechaFin" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px">
                                                <template v-slot:activator="{ on }">
                                                    <v-text-field v-model="report.fechaFinal" label="Seleccioné Fecha Final" prepend-icon="event" readonly v-on="on" :rules="fFinalRules"></v-text-field>
                                                </template>
                                                <v-date-picker v-model="report.fechaFinal" @input="datePicker.menuFechaFin = false"></v-date-picker>
                                            </v-menu>
                                        </v-flex>
                                    </v-layout>
                                    <h3 class="text-uppercase">Tipo de Reporte:</h3>
                                    <v-divider></v-divider>
                                    <v-layout>
                                        <v-flex xl12 lg12 md12 xs12>
                                            <v-select label="Seleccioné" :items="dataForm.data.dataFormReport.consultas" v-model="report.typeCons" :rules="selectRules"></v-select>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout class="mt-2">
                                        <v-flex xl12 lg12 md12 xs12>
                                            <div class="custom-control custom-checkbox">
                                                <input type="checkbox" class="custom-control-input" id="defaultUnchecked" v-model="report.typeReport">
                                                <label class="custom-control-label font-weight-bold" for="defaultUnchecked">Generar Excel</label>
                                            </div>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout>
                                        <v-flex xl12 lg12 md12 xs12 class="mt-5 animated fadeIn" v-show="resServer.view">
                                            <v-alert :type="resServer.type">
                                                {{resServer.message}}
                                            </v-alert>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout align-center justify-center fill-height>
                                        <v-flex xl6 lg6 md6 xs10>
                                            <v-btn type="submit" class="orange darken-1 mt-1 text-white" block>Registrar</v-btn>
                                            <v-btn class="grey darken-4 mt-3 text-white" block>Cancelar</v-btn>
                                        </v-flex>
                                    </v-layout>
                                </v-form>
                                <v-layout>
                                    <v-flex xl12 lg12 md12 xs12>
                                        <div id="divChart" class="mt-2">

                                        </div>
                                    </v-flex>
                                </v-layout>
                            </div>
                            <div class="card-footer footer-copyright text-center py-3 grey lighten-3">
                                © 2019 Copyright
                            </div>
                        </v-card>
                    </div>
                </v-flex>
            </v-layout>
        </v-container>
    </v-app>
</template>
<script>
    import Vue from "vue";
    import gql from "graphql-tag";
    import query from "../query/reporte";
    import DRAW_CHART from "../charts/chart";
    import EXCEL from "../xlsx/excel";
    import Loading from "vue-loading-overlay";
    import swal from "sweetalert2";

    Vue.use(Loading);

    export default {
        data() {
            return {
                report: {
                    fechaInicial: "",
                    fechaFinal: "",
                    typeCons: "",
                    typeReport: false,
                },
                datePicker: {
                    menuFechaIni: false,
                    modalFechaIni: false,
                    menuFechaFin: false,
                    modalFechaFin: false,
                },
                dataForm: {},
                isLoading: true,
                resServer: {
                    view: false,
                    type: "info",
                    message: ""
                },

                selectRules: [
                    v => !!v || "El campo es requerido"
                ],

                fInicialRules: [
                    v => !!v || "El campo es requerido"
                ],

                fFinalRules: [
                    v => !!v || "El campo es requerido"
                ],
            }
        },
        components: {
            Loading,
        },
        async beforeMount() {
            await this.getTypeReportes();
        },
        methods: {
            async getTypeReportes() {
                try {
                    this.dataForm = await this.$apollo.query({
                        query: gql`${query.DATA_REPORTES}`
                    });

                    setInterval(() => {
                        this.isLoading = false;
                    }, 1000);
                } catch(e) {
                    this.$router.push("error");
                }
            },
            
            async generateReporte() {
                if (this.$refs.form.validate()) {
                    if (this.report.fechaInicial < this.report.fechaFinal) {
                        try {
                            this.isLoading = true;
                            this.resServer.view = false;

                            const reporte = await this.$apollo.query({
                                query: gql`${query.NEW_REPORT}`,
                                variables: {
                                    input: {
                                        fInicial: this.report.fechaInicial,
                                        fFinal: this.report.fechaFinal,
                                        typeSoporte: this.report.typeCons
                                    }
                                }
                            });

                             setInterval(() => {
                                this.isLoading = false;
                            }, 6000);
                            
                            if (reporte.data.reporte.length != 0) {
                                if (!this.report.typeReport) {
                                    const COLORS = DRAW_CHART.colorChart(reporte.data.reporte.length);
                                    DRAW_CHART.newChart(reporte, COLORS);
                                } else {
                                    EXCEL.newExcel(reporte.data.reporte); 
                                }

                                this.resetData();
                            } else {
                                this.resServer.view = true;
                                this.resServer.message = "Petición sin resultados, por favor intente con otros valores";
                                this.resServer.type = "info";
                            }
                        } catch(e) {
                            setInterval(() => {
                                this.isLoading = false;
                            }, 6000);

                            this.resServer.view = true;
                            this.resServer.message = "Algo raro paso por aquí!!!";
                            this.resServer.type = "error";
                        }
                    } else {
                        this.resServer.view = true;
                        this.resServer.message = "Rango de fechas invalido, por favor intente con otros valores";
                        this.resServer.type = "error";
                    }
                    
                }
            },

            resetData() {
                this.report.fechaInicial = "";
                this.report.fechaFinal = "";
                this.report.typeCons = "";
                this.report.typeReport = false;
                this.$refs.form.reset();
            },

            closeSession() {
                swal.fire({
                    title: 'Esta Seguro???',
                    text: "Salir de la aplicación",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, salir!!!'
                    }).then((result) => {
                        if (result.value) {
                            this.$session.destroy();
                            localStorage.clear();
                            location.href = "/";    
                        }
                    })
            }
        }
    }
</script>