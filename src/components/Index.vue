<template>
    <div>
        <v-app>
            <v-container fill-height>
                <v-layout row wrap align-center justify-center>
                    <v-flex xl4 lg4 md4 xs12>
                        <loading :active="isLoading" :can-cancel="false" :is-full-page="true"></loading>
                        <div class="animated fadeIn">
                            <div class="card">
                                <h3 class="card-header light-blue lighten-1 text-white text-center py-4">
                                    <strong>Sign In</strong>
                                </h3>
                                <div class="card-body">
                                    <v-form ref="form" @submit.prevent="logIn" autocomplete="off">
                                        <v-text-field prepend-icon="person" label="Usuario" class="mx-5 my-4" v-model="login.usuario" :rules="formLoginRules" required></v-text-field>
                                        <v-text-field prepend-icon="security" label="Password" type="password" class="mx-5 my-4" v-model="login.password" :rules="formLoginRules" required></v-text-field>
                                        <v-btn type="submit" class="orange darken-1 text-white" block>Sing In</v-btn>
                                    </v-form>
                                    <v-alert :type="resLogin.typeLogin" class="mt-5 animated fadeIn" outlined text v-show="resLogin.isLogin">
                                        {{resLogin.textLogin}}
                                    </v-alert>
                                </div>   
                                <div class="card-footer footer-copyright text-center py-3 grey lighten-3">
                                    © 2019 Copyright
                                </div>
                            </div>
                        </div>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-app>
    </div>
</template>
<script>
    import Vue from 'vue';
    import Loading from 'vue-loading-overlay';
    import gql from "graphql-tag";
    import query from "../query/sesion";
    import VueSession from "vue-session";

    Vue.use(Loading);
    Vue.use(VueSession);

    export default {
        components: {
            Loading
        },
        data() {
            return {
                login: {
                    usuario: "",
                    password: "",
                },
                isLoading: true,
                formLoginRules: [
                    v=> !!v || "El campo es requerido"
                ],
                resLogin: {
                    isLogin: false,
                    typeLogin: "error",
                    textLogin: ""
                }
            }
        },
        mounted() {
            setInterval(() => {
                this.isLoading = false;
            }, 1000);
        }, 
        methods:
        {
            async logIn() {
                if (this.$refs.form.validate()) {
                    try {
                        this.isLoading = true;
                        const session = await this.$apollo.query({
                            query: gql`${query.SESSION}`, 
                            variables: {
                                input: {
                                    usuario: this.login.usuario,
                                    password: this.login.password
                                }
                            }
                        });

                        setInterval(() => {
                            this.isLoading = false;
                        }, 6000); 

                        this.resLogin.isLogin = true;
                        this.resLogin.typeLogin = session.data.login.resLogin;
                        this.resLogin.textLogin = session.data.login.message;

                        if (session.data.login.status) {
                            setInterval(() => {
                                this.$session.start();
                                window.localStorage.setItem("jwt", session.data.login.token);
                                this.$router.push("main");
                                
                            }, 3000);
                        } else {
                            this.resetForm();
                        }
                    } catch(e) {
                        setInterval(() => {
                            this.isLoading = false;
                        }, 6000);
                        
                        this.resLogin.isLogin = true;
                        this.resLogin.typeLogin = "error";
                        this.resLogin.textLogin = "Algo raro paso por aquí!!!";
                    }
                }
            }, 

            resetForm() {
                this.login.usuario = "";
                this.login.password = "";
                this.$refs.form.reset();
            }
        }
    }
</script>