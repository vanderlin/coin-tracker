var _ = require('lodash')
var moment = require('moment')
var firebase = require('firebase')
export default {
	computed: {
		authenticated() {
			return this.$store.state.authProfile !== null
		},
		authID() {
			return this.$store.state.authProfile.uid
		},
		authProfile() {
			return this.$store.state.authProfile
		},
		prices() {
			return this.$store.state.prices
		}
	},
	methods: {
		firebaseTimestamp() {
			return firebase.database.ServerValue.TIMESTAMP
		},
		signin() {
            this.$router.push({name: 'login'})
        },
        signout() {
            this.$router.push({name: 'logout'})
        },
        // helper for firebase values
        parseValue(val) {
            return val || ""
        }
	}
}
