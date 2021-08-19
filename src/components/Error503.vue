<template>
    <v-app>
        <v-container fill-height>
            <v-layout row wrap align-center justify-center>
                <v-flex xl8 lg8 md8 sm12 xs12>
                    <v-alert prominent type="error">
                        <v-row align="center">
                            <v-col class="grow">Ha ocurrido algo raro en el servidor, comuniquese con el administrador</v-col>
                            <v-col class="shrink">
                                <v-btn href="/#/">Redirect</v-btn>
                            </v-col>
                        </v-row>
                    </v-alert>
                </v-flex>
            </v-layout>
        </v-container>
    </v-app>
</template>