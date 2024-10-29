<script setup>
definePageMeta({
  title: "User Management",
  middleware: ["auth"],
  requiresAuth: true,
});

import { useUserStore } from "~/stores/user";
    
    const userStore = useUserStore();
    const id = userStore.userId;

</script>

<template>
  {{ userStore.roles[0] }}
  <div>User Listing</div>
</template>
