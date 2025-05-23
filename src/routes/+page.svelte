<script lang="ts">
    const { data } = $props();
</script>

<h1>Welcome to Himno</h1>
<div>The Homemade RSS Reader</div>
<p>
    Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the
    documentation
</p>

<div class="mt-16 p-8">
    {#if data.items}
        <h1 class="text-3xl">{data.name}</h1>
        <h2>{data.title}</h2>

        <div class="flex flex-col mt-4">
            {#each data.items as article (article.title)}
                <div class="flex">
                    <a href={article.link} class="flex-1/2">
                        {article.title}
                    </a>
                    <span class="flex-1/2">{article.author}</span>
                </div>
            {/each}
        </div>
    {:else}
        <div>Loading</div>
    {/if}
</div>
