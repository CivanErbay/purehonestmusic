<template>
  <DefaultGrid :no-spacing="true" class="gap-x-4 xl:gap-x-6">
    <!-- Zentriert: 10 Spalten (2–12) -->
    <div class="xl:col-start-2 xl:col-end-12">
      <section class="w-full">
        <!-- Titel im Stil deiner Datumstitel (leicht angepasst) -->
        <p
          class="md:text-2xl font-semibold mb-4 sticky top-0 z-10 pt-4 pb-2 fs-mobile-13"
          style="
            display:flex; align-items:center;
            -webkit-backdrop-filter: blur(30px);
            backdrop-filter: blur(30px);
            background-color: rgba(19, 19, 19, 0.6);
            width:100%;
            will-change: opacity, transform;
          "
        >
          <span class="text-current">Newsletter&nbsp;•&nbsp;</span>
          <span class="underline text-[#E77000]">Genres wählen & anmelden</span>
        </p>

        <!-- Formular -->
        <SubscribeForm class="w-full max-w-xl" />
      </section>
    </div>
  </DefaultGrid>
</template>

<script setup lang="ts">
// Falls DefaultGrid NICHT global registriert ist, importiere es hier:
// import DefaultGrid from '~/components/DefaultGrid.vue'
</script>
