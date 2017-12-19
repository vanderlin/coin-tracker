import Vue from 'vue'
import firebase from 'firebase'
import auth from '../auth'
import guards from '../guards'
import Router from 'vue-router'
import IndexPage from '@/pages/IndexPage'
import LoginPage from '@/pages/LoginPage'

Vue.use(Router)

const loginWithGoogle = () => {
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/plus.login');
    provider.addScope('profile');
    provider.addScope('email');
    firebase.auth().signInWithRedirect(provider);
}

export default new Router({
	mode: 'history',
  	base: __dirname,
	linkActiveClass: 'is-active',
	routes: [
    	{
			path: '/',
			name: 'index',
			component: IndexPage,
			beforeEnter: guards.requireAuth
    	},

    	{
			path: '/demo',
			name: 'demo',
			component: IndexPage
    	},
    	
    	{
			path: '/login',
			name: 'login',
			component: LoginPage,
			beforeEnter: (to, from, next)=> {
				if (auth.isLoggedIn()) {
					return next('/')
				} 
				return next();
			}
		},
		{
			path: '/auth/google',
			name: 'auth-google',
			component: LoginPage,
			beforeEnter: (to, from, next)=> {
				if (!auth.isLoggedIn()) {
					return loginWithGoogle()
				} 
				else {
					next()
				}
			}
    	},
    	{
			path: '/logout',
			name: 'logout',
			component: IndexPage,
			beforeEnter: (to, from, next) => {
				auth.signout()
			}
    	},

  	]
})
