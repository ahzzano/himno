<script>
    import { enhance } from "$app/forms";
</script>

Login Time
<form method="POST" action="?/login_acct" use:enhance>
    <input name="username" placeholder="username" class="input" />
    <input
        name="password"
        placeholder="password"
        type="password"
        class="input"
    />

    <button class="btn">submit</button>
</form>
