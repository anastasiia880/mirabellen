<template>
  <div class="w-100 my-[100px] flex justify-start px-10 md:my-[120px] md:px-20">
    <div class="flex max-w-[320px] flex-col gap-12 md:max-w-[80%]">
      <span class="font-serif text-[36px] text-stone-500 md:text-[40px]">
        Terms & conditions
      </span>
      <ul>
        <li v-for="item in 8" class="flex flex-col gap-4 py-4">
          <p class="text-[14px] font-semibold text-stone-500 md:text-[16px]">
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
            erat, sed diam voluptua. At vero eos et accusam et justo duo dolores
            et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est
            Lorem ipsum dolor sit amet. Stet clita kasd gubergren, no sea
            takimata sanctus est Lorem ipsum dolor sit amet. Stet clita kasd
            gubergren.
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
