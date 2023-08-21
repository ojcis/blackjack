<script setup lang="ts">
import { reactive } from 'vue';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import LargeButton from '@/Components/LargeButton.vue';
import HandForm from './Partials/HandForm.vue';
import { Head } from '@inertiajs/vue3';
import { Game } from '@/Pages/Games/Types/Blackjack';
import deck from './Types/BlackjackDeck';

const bidAmount: number = 0;
const game = reactive(new Game(deck));

</script>

<template>
    <Head title="Blackjack" />

    <AuthenticatedLayout>
        <template #header>
            <h2 class="font-semibold text-xl text-white leading-tight">Blackjack</h2>
        </template>

        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div class="bg-gray-900 overflow-hidden shadow-sm sm:rounded-lg lg:flex">
                    <div class="lg:w-3/4 text-center text-lg sm:text-2xl text-white bg-center bg-contain" style="background-image: url(https://static.vecteezy.com/system/resources/previews/006/325/236/original/poker-table-green-cloth-on-dark-background-illustration-free-vector.jpg)">
                        <h1 class="pt-2">House Hand</h1>
                        <div class="flex items-center justify-center sm:p-4 p-2 h-28 sm:h-48">
                            <HandForm :hand="game.houseHand" :count="0"/>
                        </div>
                        <h1 class="pt-2">Your Hand{{ game.splitHandCount > 0 ? 's':'' }}</h1>
                        <div class="flex items-center justify-center sm:p-4 p-2 h-28 sm:h-48">
                            <HandForm v-for="hand in game.playerHands" :hand="hand" :count="game.splitHandCount">
                                <LargeButton v-if="hand.canSplit && game.canSplit" @click="game.split(hand)" class="absolute bottom-4 sm:bottom-10 left-1/2 transform -translate-x-1/2">Split</LargeButton>
                            </HandForm>
                        </div>
                        <div class="flex items-center justify-center text-center pb-4">
                            <section>
                                <section v-if="game.activeGame">
                                    <LargeButton @click="game.hit(game.playerHands[game.activeHandId])" :disable="game.disableButton" class="mr-2"> Hit </LargeButton>
                                    <LargeButton @click="game.stay(game.playerHands[game.activeHandId])" :disable="game.disableButton"> Stay </LargeButton>
                                </section>
                                <section v-else>
                                    <input v-model="bidAmount" type="number" min="1" :max="game.balance" class="mr-1 dark:bg-gray-800 text-center text-lg sm:text-xl w-36 border-gray-300 dark:border-gray-700 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm">
                                    <LargeButton @click="game.start(bidAmount)" :disable="game.disableButton"> bid </LargeButton>
                                </section>
                                <p class="text-red-500">{{ game.bid.error }}</p>
                            </section>
                        </div>
                    </div>
                    <div class="lg:w-1/4 grid items-end justify-center text-lg sm:text-2xl text-white px-2">
                        <h1 class="text-center text-xl sm:text-3xl font-semibold"> {{ game.message }} <small v-if="game.splitHandCount > 0 && game.activeGame"><br> (each hand) </small></h1>
                        <div class="text-center pb-5">
                            <p> Average: {{ game.averageWinnings>0 ? '+' : '' }}{{ game.averageWinnings}}$ </p>
                            <p> Your balance: {{ game.balance }}$ </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
./Types/Deck./Types/CardComponents