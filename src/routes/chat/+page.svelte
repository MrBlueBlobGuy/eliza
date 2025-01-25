<script>
    import { writable } from 'svelte/store';
    let input = "";
    let messages = writable([]);
    let memory = [];

    export let data; 
    let { supabase, session } = data
    $: ({ supabase, session } = data)

    async function sendMessage(event) {
    event.preventDefault();
    if (!input.trim()) return;

    // Update the UI immediately
    messages.update(msgs => [...msgs, { sender: 'user', text: input }]);
    memory.push({ role: 'user', parts: [{ text: input }] });

    const formData = new FormData();
    formData.append('messages', JSON.stringify(memory)); // Ensure memory is a JSON string

    try {
        const res = await fetch('/chat', {
            method: 'POST',
            body: formData,
        });

        const data = await res.json();
        if (data.response) {
            const botResponse = data.response.trim();
            messages.update(msgs => [...msgs, { sender: 'bot', text: botResponse }]);
            memory.push({ role: "model", parts: [{ text: botResponse }] }); 
        }


        input = "";
    } catch (err) {
        console.error("❌ Error sending message:", err);
    }
}

</script>


{#if session}
    <div class="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white px-4 py-10">
        <h2 class="text-2xl font-bold text-[#E04C00] mb-4">Chat with Eliza</h2>

        <div class="w-full max-w-3xl bg-slate-900 p-6 rounded-lg shadow-md">
            <ul class="chat-box overflow-y-auto max-h-80 space-y-3 p-4 bg-slate-800 rounded-md">
                {#each $messages as msg}
                    <li class="p-3 rounded-lg text-white max-w-3/4"
                        class:bot={msg.sender === "bot"}
                        class:user={msg.sender === "user"}>
                        <span class="font-semibold">{msg.sender === "user" ? "You" : "Eliza"}:</span> {msg.text}
                    </li>
                {/each}
            </ul>

            <form on:submit|preventDefault={sendMessage} method="POST" action="/chat">
                <input type="text" bind:value={input} placeholder="Ask something..." 
                    class="w-full px-4 py-2 rounded bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-[#E04C00]" />
                <button type="submit" 
                    class="px-5 py-2 bg-[#E04C00] text-white rounded hover:bg-[#bd4500] transition">
                    Send
                </button>
            </form>            
        </div>
    </div>
{:else}
    <div class="flex flex-col items-center justify-center min-h-screen text-white">
        <p class="text-lg">You must be logged in to chat.</p>
        <a href="/login" class="text-[#E04C00] underline">Login</a>
    </div>
{/if}

<style>
    .chat-box {
        min-height: 300px;
    }
    .user {
        background-color: #374151;
        text-align: right;
        align-self: flex-end;
    }
    .bot {
        background-color: #E04C00;
        align-self: flex-start;
    }
</style>
