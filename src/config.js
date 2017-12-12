module.exports = {
	app_name: process.env.APP_NAME,
	firebase: {
		apiKey: process.env.FIREBASE_API_KEY,
	    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    	projectId:  process.env.FIREBASE_PROJECT_ID,
	    databaseURL: process.env.FIREBASE_DATABASE_URL,
	    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
	    messagingSenderId: process.env.FIREBASE_MESSAGE_SENDER_ID
	}
}