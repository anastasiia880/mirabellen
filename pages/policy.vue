<template>
  <div class="w-100 my-[100px] flex justify-center md:my-[200px]">
    <div class="flex max-w-[320px] flex-col md:max-w-[640px]">
      <span class="font-serif text-[36px] text-stone-500 md:text-[40px]">
        Privacy Policy
      </span>
      <div v-for="item in 4" class="flex flex-col gap-4 py-4">
        <span
          class="text-[16px] font-semibold uppercase text-stone-500 md:text-[18px]"
        >
          Information selected
        </span>
        <p class="text-[14px] font-semibold text-stone-500 md:text-[16px]">
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
          nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
          sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
          rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem
          ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur
          sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
          dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam
          et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea
          takimata sanctus est Lorem ipsum dolor sit amet.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup></script>
