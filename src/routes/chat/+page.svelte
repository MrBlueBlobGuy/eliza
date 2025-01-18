<script>
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import { applyAction } from '$app/forms';

    let input = "";
    let messages = writable([]);
    let memory = [];

    async function sendMessage(event) {
        event.preventDefault();

        if (!input.trim()) return;

        messages.update(msgs => [...msgs, { sender: 'user', text: input }]);
        memory.push({ role: 'user', parts: [{ text: input }] });

        const formData = new FormData();
        formData.append('messages', JSON.stringify(memory));

        const res = await fetch('/chat', {
            method: 'POST',
            body: formData,
        });

        const data = await res.json();
        if (data.response) {
            messages.update(msgs => [...msgs, { sender: 'bot', text: data.response }]);
            memory.push({ role: 'model', parts: [{ text: data.response }] });
        }
    }
</script>

<form on:submit={sendMessage}>
    <input type="text" bind:value={input} placeholder="Ask something..." />
    <button type="submit">Send</button>
</form>

<ul>
    {#each $messages as msg}
        <li class={msg.sender}>{msg.text}</li>
    {/each}
</ul>
