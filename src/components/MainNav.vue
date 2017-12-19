<template>
		<nav class="navbar is-mobile is-transparent" role="navigation" aria-label="main navigation">
			<div class="navbar-menu">
				
				<div class="navbar-start">
					<a class="navbar-item" v-if="authenticated">
						<figure class="user-photo">
							<img :src="authProfile.photoURL">
						</figure>
					</a>			
					<router-link :to="{path: '/login'}"class="navbar-item" v-if="!authenticated">
						Login
					</router-link>			
				</div>

				<div class="navbar-end">
					<router-link :to="{path: '/logout'}"class="navbar-item" v-if="authenticated">
						<span>Sign out</span>
						<span class="icon">
							<i class="fa fa-sign-out"></i>
                        </span>
                    </router-link>
				</div>
			</div>
		</nav>
</template>

<script>
export default {
    name: 'MainNav',
    props: {},
    data() {
        return {
        }
    },
    components: {
    },
    methods: {
    },
    computed: {
    },
    watch: {
    },
    created() {
    },
    mounted() {
    }
}
</script>

<style scoped lang="scss">
.user-photo {
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
.navbar.is-mobile {
	
	.navbar-item {
		display: flex;
		align-items: center;
		text-transform: uppercase;
	}

	.navbar,
	.navbar-menu,
	.navbar-start,
	.navbar-end {
		align-items: stretch;
		display: flex;
		padding: 0;
	}

	.navbar-menu {
		box-shadow: none;
		flex-grow: 1;
		flex-shrink: 0;
	}
	.navbar-start {
		justify-content: flex-start;
		margin-right: auto;
	}
	.navbar-end {
		justify-content: flex-end;
		margin-left: auto;
	}
}
</style>