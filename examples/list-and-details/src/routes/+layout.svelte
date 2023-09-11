<script lang="ts">
	import './global.css';
</script>

<div class="layout">
	<slot />
</div>

<style>
	.layout {
		max-width: 1024px;
		height: 100%;
		margin-inline: auto;
	}
</style>
