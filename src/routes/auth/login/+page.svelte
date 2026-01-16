<script lang="ts">
	import { goto } from '$app/navigation';
	import { loginUser, auth } from '$lib';

	let email = '';
	let password = '';
	let error = '';
	let isLoading = false;

	async function handleLogin() {
		error = '';
		isLoading = true;

		try {
			await loginUser(email, password);
			await goto('/dashboard');
		} catch (err: any) {
			error = err.message || 'Login failed';
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
	<div class="max-w-md w-full space-y-8">
		<div>
			<h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to Posts</h2>
		</div>

		{#if error}
			<div class="rounded-md bg-red-50 p-4">
				<p class="text-sm text-red-700">{error}</p>
			</div>
		{/if}

		<form class="mt-8 space-y-6" on:submit|preventDefault={handleLogin}>
			<input type="hidden" name="remember" value="true" />

			<div class="rounded-md shadow-sm -space-y-px">
				<div>
					<label for="email-address" class="sr-only">Email address</label>
					<input
						id="email-address"
						name="email"
						type="email"
						autocomplete="email"
						required
						class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
						placeholder="Email address"
						bind:value={email}
						disabled={isLoading}
					/>
				</div>

				<div>
					<label for="password" class="sr-only">Password</label>
					<input
						id="password"
						name="password"
						type="password"
						autocomplete="current-password"
						required
						class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
						placeholder="Password"
						bind:value={password}
						disabled={isLoading}
					/>
				</div>
			</div>

			<div>
				<button
					type="submit"
					disabled={isLoading}
					class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
				>
					{isLoading ? 'Signing in...' : 'Sign in'}
				</button>
			</div>

			<div class="text-center">
				<a href="/auth/register" class="text-sm text-blue-600 hover:text-blue-500">
					Don't have an account? Register
				</a>
			</div>
		</form>
	</div>
</div>
