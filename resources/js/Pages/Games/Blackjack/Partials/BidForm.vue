<script setup lang="ts">
import LargeButton from '@/Components/LargeButton.vue';

defineProps<{
    amount: number;
    buttonName: string;
    max: number;
    min: number;
}>();

defineEmits(['click', 'update:amount'])
</script>

<template>
    <section>
        <input :value="amount" @input="$emit('update:amount', ($event.target as HTMLInputElement).valueAsNumber)" type="number" :min="min" :max="max" class="mr-1 sm:mr-2 dark:bg-gray-800 text-center text-lg sm:text-xl w-32 sm:w-48 border-gray-300 dark:border-gray-700 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm">
        <LargeButton @click="$emit('click')"> {{ buttonName }} </LargeButton>
    </section>
    <div class="text-sm sm:text-lg">
    </div>
</template>