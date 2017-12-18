<template>
	<div class="app">
		<router-view></router-view>
    </div>
</template>

<script>
export default {
    name: 'App',
    methods: {
    	addTransaction(e) {
    		console.log(e);
    	}
    }
}
</script>

<style lang="scss">
@import './styles/main.scss';
</style>
