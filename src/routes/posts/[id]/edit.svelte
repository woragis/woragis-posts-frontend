<script lang="ts">
	import { onMount } from 'svelte';
	import { editImage } from '$lib/api/creative';
	import { page } from '$app/stores';

	let prompt = '';
	let file: File | null = null;
	let preview = '';
	let uploading = false;
	let resultUrl = '';

	let postId: string = '';
	$: postId = $page.params?.id ?? '';

	function handleFile(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			file = input.files[0];
			const reader = new FileReader();
			reader.onload = () => {
				preview = reader.result as string;
			};
			reader.readAsDataURL(file);
		}
	}

	async function submit() {
		if (!postId) return;
		uploading = true;
		try {
			let b64: string | undefined;
			if (file) {
				const arr = await file.arrayBuffer();
				const u8 = new Uint8Array(arr);
				const base64 = btoa(String.fromCharCode(...Array.from(u8)));
				b64 = base64;
			}
			// Note: editImage requires an assetId. You may need to select which asset to edit.
			// For now, this is a placeholder. In production, pass the actual assetId.
			const assetId = ''; // TODO: Get from user or props
			if (!assetId) {
				alert('Please select an asset to edit');
				return;
			}
			const res = await editImage(postId, assetId, prompt || '', undefined, b64);
			resultUrl = res.assetId || '';
		} catch (err) {
			console.error(err);
			alert('Failed to edit image');
		} finally {
			uploading = false;
		}
	}
</script>

<h2>Edit Post Image</h2>

<div>
	<label for="prompt">Prompt</label>
	<input
		id="prompt"
		bind:value={prompt}
		placeholder="Describe edits (e.g., 'make background transparent')"
	/>
</div>

<div>
	<label for="image">Upload image</label>
	<input id="image" type="file" accept="image/*" on:change={handleFile} />
	{#if preview}
		<img class="preview" src={preview} alt="preview" />
	{/if}
</div>

<div>
	<button on:click={submit} disabled={uploading}>{uploading ? 'Processing…' : 'Edit Image'}</button>
</div>

{#if resultUrl}
	<div>
		<h3>Result</h3>
		<img src={resultUrl} alt="result" class="preview" />
	</div>
{/if}

<style>
	.preview {
		max-width: 360px;
		max-height: 240px;
	}
</style>
