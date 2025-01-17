<template>
	<div class="alhimic">
		<Alchimick />
	</div>
</template>

<script>
import Alchimick from "../../../components/radialMenu/Alchimick.vue";

export default {
	components: {
		Alchimick,
	},
};
</script>

<style lang="less">
	.alhimic {
		position: absolute;
		width: 100%;
		max-width: 700px;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%)
	}
</style>
