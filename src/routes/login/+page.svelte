<script>
    import { createClient } from '@supabase/supabase-js';
    import { writable } from 'svelte/store';

    export let data;
    let { supabase, session } = data;
    $: ({ supabase, session } = data);

    let email = '';
    let password = '';
    let loading = writable(false);
    let error = writable('');
    let success = writable('');
    let isLogin = writable(true); // Toggle between login & sign-up

    async function handleAuth() {
        loading.set(true);
        error.set('');
        success.set('');

        let response;
        if ($isLogin) {
            response = await supabase.auth.signInWithPassword({ email, password });
        } else {
            response = await supabase.auth.signUp({ email, password });
        }

        if (response.error) {
            error.set(response.error.message);
        } else {
            success.set($isLogin ? 'Logged in successfully! Redirecting...' : 'Account created! Check your email to confirm.');
            setTimeout(() => location.href = '/', 1500);
        }

        loading.set(false);
    }

    async function loginWithDiscord() {
        loading.set(true);
        error.set('');

        const { error: authError } = await supabase.auth.signInWithOAuth({ provider: 'discord' });

        if (authError) {
            error.set(authError.message);
        }

        loading.set(false);
    }
</script>

<div class="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-[#E04C00]">
    <div class="bg-slate-900 p-8 rounded-lg shadow-lg w-96">
        <h2 class="text-2xl font-bold mb-4 text-center">{ $isLogin ? 'Login' : 'Sign Up' }</h2>

        {#if $error}
            <p class="text-red-500 text-sm text-center mb-2">{$error}</p>
        {/if}

        {#if $success}
            <p class="text-green-500 text-sm text-center mb-2">{$success}</p>
        {/if}

        <input
            type="email"
            placeholder="Email"
            bind:value={email}
            class="w-full px-4 py-2 mb-3 rounded bg-slate-800 text-white border border-slate-700 focus:border-[#E04C00] focus:outline-none"
        />

        <input
            type="password"
            placeholder="Password"
            bind:value={password}
            class="w-full px-4 py-2 mb-4 rounded bg-slate-800 text-white border border-slate-700 focus:border-[#E04C00] focus:outline-none"
        />

        <button
            on:click={handleAuth}
            class="w-full px-4 py-2 rounded bg-[#E04C00] text-white font-bold hover:bg-[#bd4500] transition"
            disabled={$loading}
        >
            {#if $loading}
                Processing...
            {:else}
                { $isLogin ? 'Login' : 'Sign Up' }
            {/if}
        </button>

        <button
            on:click={loginWithDiscord}
            class="w-full mt-2 px-4 py-2 rounded bg-blue-600 text-white font-bold hover:bg-blue-700 transition"
            disabled={$loading}
        >
            Login with Discord
        </button>

        <p class="text-sm text-center mt-4">
            {#if $isLogin}
                Don't have an account? 
                <a on:click={() => isLogin.set(false)} class="text-[#E04C00] cursor-pointer hover:text-[#bd4500]">
                    Sign Up
                </a>
            {:else}
                Already have an account? 
                <a on:click={() => isLogin.set(true)} class="text-[#E04C00] cursor-pointer hover:text-[#bd4500]">
                    Login
                </a>
            {/if}
        </p>
    </div>
</div>
