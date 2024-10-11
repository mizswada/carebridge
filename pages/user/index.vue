<script setup>
definePageMeta({
  title: "User Management",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>User Listing</div>
</template>
