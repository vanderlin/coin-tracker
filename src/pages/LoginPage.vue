<template>
<section class="hero is-fullheight">
	<div class="hero-head">
		
	</div>

	<!-- Hero content: will be in the middle -->
	<div class="hero-body">
		<div class="container has-text-centered">
			<h1 class="title">
				Coin Pile
			</h1>
			<h2 class="subtitle">
				Track your coins — and that is it.
			</h2>
			<div>
				<router-link :to="{path: '/auth/google'}">
					<img src="../assets/img/btn_google_signin_light_normal_web@2x.png" alt="">
				</router-link>
			</div>
		</div>
	</div>

  <!-- Hero footer: will stick at the bottom -->
  <div class="hero-foot">
    
  </div>
</section>
</template>

<script>
export default {
    name: 'LoginPage',
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

</style>