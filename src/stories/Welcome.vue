<template>
  <button class="my-button">
    <slot></slot>
  </button>
</template>

<docs>
What am I doing, say docs!
</docs>

<notes>
I'm notes
</notes>

<info>
I'm info
</info>

<style scoped>
.my-button {
  border: 1px solid none;
  background-color: pink;
  padding: 5px 12px;
  font-size: 16px;
}
</style>