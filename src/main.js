import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import {ApolloClient, ApolloLink, InMemoryCache, HttpLink} from "apollo-boost";
import VueApollo from "vue-apollo";

const httpLink = new HttpLink({
  uri: "http://127.0.0.1:5000/graphql"
});

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem("jwt");
  operation.setContext({
    headers: {
      "x-token": token ? `${token}` : ''
    }
  });

  return forward(operation);
});

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

Vue.use(VueApollo)

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  apolloProvider,
  render: h => h(App)
}).$mount('#app')
