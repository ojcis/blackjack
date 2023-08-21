<script setup lang="ts">
import { reactive } from 'vue';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import LargeButton from '@/Components/LargeButton.vue';
import CardDesign from './Partials/CardDesign.vue';
import { Head } from '@inertiajs/vue3';
import { Game } from '@/Pages/Games/Types/SlotMachine';
import deck from '@/Pages/Games/Types/Deck';

const balance: number = 0;
const bidAmount: number = 0;
const game = reactive(new Game(deck));
</script>

<template>
    <Head title="SlotMachine" />

    <AuthenticatedLayout>
        <template #header>
            <h2 class="font-semibold text-xl text-white leading-tight">Slot machine</h2>
        </template>

        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div class="bg-gray-900 overflow-hidden shadow-sm sm:rounded-lg lg:flex py-4 sm:py-8">
                    <div class="lg:w-3/4 text-center text-lg sm:text-2xl text-white">
                        <div class="flex items-center justify-center">
                            <CardDesign v-for="card in game.line" :card="card"/>
                        </div>
                        <div class="flex items-center justify-center gap-4 uppercase my-2 sm:my-8">
                            <p class="sm:text-3xl">{{ game.winningHand }}</p>
                            <p v-if="game.bid.winnings > 0" class="sm:text-3xl">+{{ game.bid.winnings }}$</p>
                        </div>
                        <input v-model="bidAmount" type="number" min="1" class="mr-1 dark:bg-gray-800 text-center text-lg sm:text-xl w-36 border-gray-300 dark:border-gray-700 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm">
                        <LargeButton @click="game.spin(bidAmount)"> spin </LargeButton>
                    </div>
                    <div class="lg:w-1/4 flex flex-col items-center justify-end gap-2 text-lg sm:text-2xl text-center text-white px-2">
                        <p>Balance: {{ game.balance.value }}$</p>
                        <div class="grid grid-cols-2 lg:grid-cols-1 gap-2">
                            <LargeButton @click="game.insert(100)"> insert </LargeButton>
                            <LargeButton @click="game.withdraw()"> withdraw </LargeButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>