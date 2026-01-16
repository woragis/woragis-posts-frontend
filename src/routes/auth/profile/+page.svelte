<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth, updateProfile, changePassword } from '$lib';

	let firstName = '';
	let lastName = '';
	let currentPassword = '';
	let newPassword = '';
	let confirmPassword = '';
	let error = '';
	let successMessage = '';
	let isLoading = false;
	let activeTab = 'profile';

	$: if ($auth.user) {
		firstName = $auth.user.firstName || '';
		lastName = $auth.user.lastName || '';
	}

	async function handleUpdateProfile() {
		error = '';
		successMessage = '';
		isLoading = true;

		try {
			await updateProfile({
				firstName,
				lastName
			});
			successMessage = 'Profile updated successfully';
		} catch (err: any) {
			error = err.message || 'Update failed';
		} finally {
			isLoading = false;
		}
	}

	async function handleChangePassword() {
		error = '';
		successMessage = '';

		if (newPassword !== confirmPassword) {
			error = 'New passwords do not match';
			return;
		}

		isLoading = true;

		try {
			await changePassword(currentPassword, newPassword);
			successMessage = 'Password changed successfully';
			currentPassword = '';
			newPassword = '';
			confirmPassword = '';
		} catch (err: any) {
			error = err.message || 'Password change failed';
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="min-h-screen bg-gray-50">
	<div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
		<div class="px-4 py-6 sm:px-0">
			<h1 class="text-3xl font-bold text-gray-900 mb-8">Profile Settings</h1>

			{#if error}
				<div class="mb-4 rounded-md bg-red-50 p-4">
					<p class="text-sm text-red-700">{error}</p>
				</div>
			{/if}

			{#if successMessage}
				<div class="mb-4 rounded-md bg-green-50 p-4">
					<p class="text-sm text-green-700">{successMessage}</p>
				</div>
			{/if}

			<div class="bg-white rounded-lg shadow">
				<div class="border-b border-gray-200">
					<nav class="flex space-x-8 px-6" aria-label="Tabs">
						<button
							on:click={() => (activeTab = 'profile')}
							class={`py-4 px-1 border-b-2 font-medium text-sm ${
								activeTab === 'profile'
									? 'border-blue-500 text-blue-600'
									: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
							}`}
						>
							Profile
						</button>
						<button
							on:click={() => (activeTab = 'password')}
							class={`py-4 px-1 border-b-2 font-medium text-sm ${
								activeTab === 'password'
									? 'border-blue-500 text-blue-600'
									: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
							}`}
						>
							Change Password
						</button>
					</nav>
				</div>

				<div class="px-6 py-6">
					{#if activeTab === 'profile'}
						<form on:submit|preventDefault={handleUpdateProfile} class="space-y-6">
							<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
								<div>
									<label for="firstName" class="block text-sm font-medium text-gray-700">
										First name
									</label>
									<input
										type="text"
										id="firstName"
										bind:value={firstName}
										disabled={isLoading}
										class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
									/>
								</div>

								<div>
									<label for="lastName" class="block text-sm font-medium text-gray-700">
										Last name
									</label>
									<input
										type="text"
										id="lastName"
										bind:value={lastName}
										disabled={isLoading}
										class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
									/>
								</div>
							</div>

							{#if $auth.user}
								<div>
									<label for="email" class="block text-sm font-medium text-gray-700">Email</label>
									<input
										id="email"
										type="email"
										value={$auth.user.email}
										disabled
										class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-gray-500 sm:text-sm"
									/>
								</div>
							{/if}

							<div class="flex justify-end">
								<button
									type="submit"
									disabled={isLoading}
									class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
								>
									{isLoading ? 'Updating...' : 'Update Profile'}
								</button>
							</div>
						</form>
					{:else if activeTab === 'password'}
						<form on:submit|preventDefault={handleChangePassword} class="space-y-6">
							<div>
								<label for="currentPassword" class="block text-sm font-medium text-gray-700">
									Current password
								</label>
								<input
									type="password"
									id="currentPassword"
									bind:value={currentPassword}
									disabled={isLoading}
									class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
								/>
							</div>

							<div>
								<label for="newPassword" class="block text-sm font-medium text-gray-700">
									New password
								</label>
								<input
									type="password"
									id="newPassword"
									bind:value={newPassword}
									disabled={isLoading}
									class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
								/>
							</div>

							<div>
								<label for="confirmPassword" class="block text-sm font-medium text-gray-700">
									Confirm new password
								</label>
								<input
									type="password"
									id="confirmPassword"
									bind:value={confirmPassword}
									disabled={isLoading}
									class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
								/>
							</div>

							<div class="flex justify-end">
								<button
									type="submit"
									disabled={isLoading}
									class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
								>
									{isLoading ? 'Changing...' : 'Change Password'}
								</button>
							</div>
						</form>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
