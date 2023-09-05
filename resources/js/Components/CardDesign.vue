<script setup lang="ts">
defineProps(['card'])
</script>

<template>
    <div class="wrap overflow-clip w-[52px] sm:w-[88px] last:shrink-0 last:w-12 sm:last:w-20" :style="{color: card.color}">
        <div v-if="card.hidden" class="flex w-12 h-16 sm:w-20 sm:h-28 text-2xl sm:text-4xl border-solid border-2 bg-white border-gray-400 rounded-md sm:rounded-lg">
            <div class="flex-1 m-1 sm:m-1.5 bg-gradient-to-tr from-indigo-900 via-indigo-700 to-indigo-900 sm:rounded-sm"></div>
        </div>
        <div v-else class="relative overflow-hidden text-start w-12 h-16 sm:w-20 sm:h-28 text-2xl sm:text-4xl font-bold border-solid border-2 bg-white border-gray-400 rounded-md sm:rounded-lg">
            {{ card.symbol }}
            <div class="absolute -bottom-1 left-6 sm:left-10 -translate-x-1/2" :class="card.name == 'joker' ? 'text-4xl sm:text-7xl sm:bottom-0.5':'text-5xl sm:text-8xl'" :style="card.name == 'joker' ? 'color: red':''">
                {{ card.suitSymbol }}
            </div>
        </div>
    </div>
</template>