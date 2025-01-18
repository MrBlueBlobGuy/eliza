<script>
	import '../app.css';
	let { children, data } = $props();
		
	import Header from '../components/header.svelte';

	
    let supabase = data.supabase;
    let session = data.session;

</script>

<Header {session} {supabase}/>
<main>
	{@render children()}
</main>

