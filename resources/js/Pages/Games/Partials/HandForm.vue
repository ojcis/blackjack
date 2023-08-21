<script setup lang="ts">
import CardDesign from './CardDesign.vue';

defineProps(['hand', 'count']);

</script>

<template>
    <div class="relative flex flex-col items-center sm:px-1 pt-2 rounded-2xl" :class="count == 0 ? 'w-2/3' : count == 1 ? 'w-1/2' : count == 2 ? 'w-1/3' : 'w-1/4'">
        <div class="container flex justify-center py-1 px-0.5 sm:py-2 sm:px-1 rounded-xl">
                <CardDesign v-for="card in hand.cards" :card="card"/>
        </div>
        <p v-if="hand.value != 0" class="text-lg sm:text-2xl uppercas text-white w-24 sm:w-44" :class="hand.active ? ' border-t-4 sm:border-t-8 border-red-600' : ''"> 
            {{ hand.message }} ({{ hand.value }})
        </p>
        <slot/>
    </div>
</template>