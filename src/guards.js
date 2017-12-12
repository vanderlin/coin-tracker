import auth from './auth'
import store from './store'
const Guads = {

	// basic auth - just checks that a user is logged in
	requireAuth: function(to, from, next) {
		if (!auth.isLoggedIn()) {
	    	next({
	      		path: '/login'
	    	})
	  	} else {
	  		next();
	  	}
	}
}

export default Guads;
