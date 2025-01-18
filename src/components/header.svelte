<script>
    export let session;
    export let supabase;
    

    async function signOut() {
        await supabase.auth.signOut();
        location.reload(); // Refresh page after logout
    }
</script>

<nav class="pb-10 pt-5 flex flex-row items-center">
    <!-- Logo and Title -->
    <span>
        <a href="/" class="flex flex-row items-center">
            <img src="https://fav.farm/☀" class="scale-50 m-0" alt="Logo">
            <h1 class="text-lg font-bold m-0 text-[#E04C00]">Eliza</h1>
        </a>
    </span>

    <!-- Navigation Links -->
    <span class="flex flex-row items-center ml-auto">
        <a href="/about" class="no-underline hover:text-[#bd4500] ml-3 text-lg">About</a>

        {#if !session}
            <!-- Show login/signup when user is NOT logged in -->
            <a href="/login" class="no-underline hover:text-[#bd4500] ml-3 text-lg bg-slate-700 px-2 py-1 rounded">Login</a>
        {:else}
            <!-- Show logout when user IS logged in -->
            <button on:click={signOut} class="ml-3 text-lg bg-red-600 px-2 py-1 rounded text-white hover:bg-red-700">
                Logout
            </button>
        {/if}
    </span>
</nav>
