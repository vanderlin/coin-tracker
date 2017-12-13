import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import auth from './auth'
import db from './db'
import axios from 'axios'
import mixins from './mixins'
import filters from './filters'
import directives from './directives'
import components from './components'
import moment from 'moment'

Vue.config.productionTip = false

// register components
for (let key in components) Vue.component(key, components[key])

// filters
Object.keys(filters).forEach((name) => {
	Vue.filter(name, filters[name]);
})

// directive
Object.keys(directives).forEach((name) => {
	Vue.directive(name, directives[name]);
})

// mixins
Vue.mixin(mixins)

// vue + firebase
Vue.use(require('vuefire'))

// make db and http global
Vue.prototype.$db = db
Vue.prototype.$http = axios
Vue.prototype.$moment = moment

var intervalCheckTime = 2000
var isLoadingCoinData = false;
var coinURLs = {
	BTC: 'https://api.coinbase.com/v2/prices/BTC-USD/buy',
	LTC: 'https://api.coinbase.com/v2/prices/LTC-USD/buy',
	ETH: 'https://api.coinbase.com/v2/prices/ETH-USD/buy',
}

function loadCoinPriceData() {
	return new Promise((resolve, reject) => {
		if(!isLoadingCoinData) {
			console.log('laoding latest data');
			const reqs = ['BTC', 'LTC', 'ETH'].map(key => {
	            return axios.get(coinURLs[key])
	        })
	        var btc, ltc
	        axios.all(reqs).then(
	            axios.spread((btcRes, ltcRes, ethRes) => {
	            	var prices = {
	            		BTC: btcRes.data.data,
	            		LTC: ltcRes.data.data,
	            		ETH: ethRes.data.data,
	            	}
					store.commit('prices', prices)
	            	console.log(prices);
	            	isLoadingCoinData = false;
	            })
	        )
			isLoadingCoinData = true;
			resolve(true)
		}
	})
}

loadCoinPriceData().then(() => {

	auth.init().then(() => {
		new Vue({
			store,
			router,
			...App
		}).$mount('#app')
	})

	setInterval(loadCoinPriceData, intervalCheckTime);
})
