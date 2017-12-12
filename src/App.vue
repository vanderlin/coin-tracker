<template>
    <div class="container">
	<nav class="navbar" role="navigation" aria-label="main navigation">
		<div class="navbar-menu">
			<div class="navbar-start">
				<!-- navbar items -->
			</div>

			<div class="navbar-end">
				<a class="navbar-item">
					<figure class="image is-32x32 user-photo">
						<img :src="authProfile.photoURL">
					</figure>
				</a>
				<router-link :to="{path: '/logout'}"class="navbar-item">logout</router-link>
				<!-- navbar items -->
			</div>
		</div>
	</nav>
	<router-view class="main-page"></router-view>
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
	border-radius: 50%;
	img {
		overflow: hidden;
		display: flex;
		border-radius: 50%;
		margin-bottom: 0;
		padding-bottom: 0;
	}
}

</style>
