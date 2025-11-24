<template>
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 3.33301V12.6663C12 12.9997 11.6667 13.333 11.3333 13.333H8H4.66667C4.33333 13.333 4 12.9997 4 12.6663V3.33301"
      :stroke="strokeColor" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M2.66663 3.33301H13.3333" :stroke="strokeColor" stroke-width="1.33333" stroke-linecap="round"
      stroke-linejoin="round" />
    <path d="M6.66663 2.6665H9.33329M6.66663 5.99984V10.6665M9.33329 5.99984V10.6665" :stroke="strokeColor"
      stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
</template>

<script lang="ts" setup>
defineProps({
  strokeColor: {
    type: String,
    default: "#8C0707",
  },
});
</script>

<style></style>