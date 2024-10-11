<script setup>
import { ref } from 'vue';

const id = useRoute().params.id;
console.log("id: ", id)
</script>

<template>
  <div>Edit User </div>
</template>
