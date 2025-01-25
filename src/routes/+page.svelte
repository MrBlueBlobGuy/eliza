<script>
    import { goto } from '$app/navigation';

    function goToChat() {
        goto('/chat'); // Redirect to the chat page
    }
</script>

<div class="bg-slate-950 text-[#E04C00] min-h-screen flex flex-col items-center justify-center px-4">
    <h1 class="text-4xl font-bold mb-6">Welcome to Eliza</h1>
    <p class="text-lg text-center max-w-xl">Your AI therapist, ready to help you navigate your thoughts and emotions.</p>

    <!-- Go to Chat Button -->
    <button on:click={goToChat} 
        class="mt-6 px-6 py-3 bg-[#E04C00] text-white rounded-lg hover:bg-[#bd4500] transition text-lg font-semibold">
        Go to Chat
    </button>

    <div class="mt-16 max-w-2xl">
      <h2 class="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
      <div class="space-y-4">
        <div>
          <h3 class="text-xl font-semibold">What is the Freemium model?</h3>
          <p class="text-lg">Eliza offers a free tier with essential features, while premium users gain access to deeper insights, advanced conversation analysis, and personalized therapy tools.</p>
        </div>
        <div>
          <h3 class="text-xl font-semibold">How is my data kept safe and confidential?</h3>
          <p class="text-lg">We prioritize your privacy. Conversations are encrypted, and we do not share your data with third parties. You have full control over your information and can delete your data at any time.</p>
        </div>
      </div>
    </div>
</div>
