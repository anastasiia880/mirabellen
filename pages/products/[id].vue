<template>
  <div class="w-100 grid md:grid-cols-2">
    <div class="mt-[100px] flex items-start justify-center p-6">
      <img
        class="md:max-w-[500px]"
        src="/images/product-image.jpeg"
        alt="product-image"
      />
    </div>
    <div class="bg-white md:relative md:h-[900px] md:bg-[#fcf9f7]">
      <div
        class="flex flex-col p-4 md:absolute md:bottom-20 md:left-20 md:max-w-[345px] md:gap-4"
      >
        <div class="flex flex-row justify-between md:flex-col">
          <div
            class="max-w-[178px] text-wrap font-serif text-2xl text-stone-500 md:text-[40px]"
          >
            Hydration 50ml
          </div>
          <span
            class="flex justify-end text-[20px] font-semibold text-stone-500 md:pt-[150px]"
          >
            39€
          </span>
        </div>
        <div class="flex flex-col gap-4 font-semibold text-stone-500">
          <button class="my-4 bg-black p-2 text-stone-50 md:my-0 md:w-[345px]">
            Add to bag
          </button>
          <span>Hydration cream 50ml</span>
          <p>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
            erat, sed diam voluptua. At vero eos et accusam et justo duo dolores
            et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est
            Lorem ipsum dolor sit amet.
          </p>
          <span> Vegan, Made in France </span>
          <img
            width="52"
            height="26"
            src="/icons/product.svg"
            alt="product-icon"
          />
        </div>
      </div>
    </div>
  </div>
  <div class="w-100 bg-white p-4 md:p-[120px]">
    <span class="font-bold text-stone-500">More</span>
    <div class="no-scrollbar flex gap-4 overflow-x-scroll py-4">
      <div v-for="(item, index) in 10">
        <nuxt-link :to="`/products/${index + 1}`">
          <img
            class="max-w-[160px]"
            src="/images/product-image.jpeg"
            alt="product-image"
          />
          <div class="pt-2 text-xs font-semibold text-stone-500">
            Product {{ index + 1 }}
          </div>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script setup></script>
