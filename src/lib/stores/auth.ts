import { writable } from 'svelte/store';
import { authClient } from '../api/auth';
import type { User } from '../api/auth/types';

interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
}

const initialState: AuthState = {
	user: null,
	isAuthenticated: false,
	isLoading: false,
	error: null
};

export const auth = writable(initialState);

export const initializeAuth = async () => {
	auth.update((state) => ({ ...state, isLoading: true }));

	try {
		if (authClient.isAuthenticated()) {
			const user = await authClient.getCurrentUser();
			auth.set({
				user,
				isAuthenticated: true,
				isLoading: false,
				error: null
			});
		} else {
			auth.set(initialState);
		}
	} catch (error: any) {
		auth.set({
			...initialState,
			error: error.message || 'Failed to initialize auth'
		});
	}
};

export const loginUser = async (email: string, password: string) => {
	auth.update((state) => ({ ...state, isLoading: true, error: null }));

	try {
		const response = await authClient.login({ email, password });
		auth.set({
			user: response.user,
			isAuthenticated: true,
			isLoading: false,
			error: null
		});
		return response;
	} catch (error: any) {
		auth.update((state) => ({
			...state,
			isLoading: false,
			error: error.message || 'Login failed'
		}));
		throw error;
	}
};

export const registerUser = async (data: any) => {
	auth.update((state) => ({ ...state, isLoading: true, error: null }));

	try {
		const response = await authClient.register(data);
		auth.set({
			user: response.user,
			isAuthenticated: true,
			isLoading: false,
			error: null
		});
		return response;
	} catch (error: any) {
		auth.update((state) => ({
			...state,
			isLoading: false,
			error: error.message || 'Registration failed'
		}));
		throw error;
	}
};

export const logoutUser = async () => {
	auth.update((state) => ({ ...state, isLoading: true }));

	try {
		await authClient.logout();
		auth.set(initialState);
	} catch (error: any) {
		auth.update((state) => ({
			...state,
			isLoading: false,
			error: error.message || 'Logout failed'
		}));
		throw error;
	}
};

export const updateProfile = async (data: any) => {
	try {
		const user = await authClient.updateProfile(data);
		auth.update((state) => ({
			...state,
			user
		}));
		return user;
	} catch (error: any) {
		auth.update((state) => ({
			...state,
			error: error.message || 'Profile update failed'
		}));
		throw error;
	}
};

export const changePassword = async (oldPassword: string, newPassword: string) => {
	try {
		await authClient.changePassword({ oldPassword, newPassword });
		return true;
	} catch (error: any) {
		auth.update((state) => ({
			...state,
			error: error.message || 'Password change failed'
		}));
		throw error;
	}
};
