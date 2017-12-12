<template>
	<div class="app">
		<nav class="navbar is-transparent" role="navigation" aria-label="main navigation">
			<div class="navbar-menu">
				<div class="navbar-start">
					<!-- navbar items -->
				</div>

				<div class="navbar-end">
					<a class="navbar-item">
						<figure class="user-photo">
							<img :src="authProfile.photoURL">
						</figure>
					</a>
					<router-link :to="{path: '/logout'}"class="navbar-item">logout</router-link>
					<!-- navbar items -->
				</div>
			</div>
		</nav>
	    <div class="container">
			<router-view class="main-page"></router-view>
	    </div>
    </div>
</template>

<script>
export default {
    name: 'App'
}
</script>

<style lang="scss">
@import './styles/main.scss';
.user-photo {
	background-color: red;
	width: 32px;
	height: 32px;
	img {
		width: 100%;
		min-height: 100%;
		overflow: hidden;
		border-radius: 50%;
		margin-bottom: 0;
		padding-bottom: 0;
	}
}
.navbar.is-transparent {
	background-color: transparent;
}
</style>
