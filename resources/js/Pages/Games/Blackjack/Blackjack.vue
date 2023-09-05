<script setup lang="ts">
import { reactive, ref } from 'vue';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import LargeButton from '@/Components/LargeButton.vue';
import SymbolButton from '@/Components/SymbolButton.vue';
import Rules from './Partials/Rules.vue';
import HandForm from './Partials/HandForm.vue';
import BidForm from './Partials/BidForm.vue';
import { Head } from '@inertiajs/vue3';
import { Game } from './Ts/Blackjack';
import deck from './Ts/Deck';

let showRules = ref(false);
let bidAmount: number = 0;
let insurance: number = 0;
const game = reactive(new Game(deck));

</script>

<template>
    <Head title="Blackjack" />

    <AuthenticatedLayout>
        <template #header>
            <h2 class="font-semibold text-xl text-white leading-tight"> Blackjack </h2>
        </template>

        <div class="py-2 sm:py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div class="relative bg-gray-900 overflow-hidden shadow-sm sm:rounded-lg lg:flex">
                    <div class="relative lg:w-3/4 text-center text-lg sm:text-2xl font-semibold text-white bg-center bg-cover" style="background-image: url('https://github.com/ojcis/blackjack/assets/112757458/2923d3ab-7752-4941-9363-22f8023b5bd5')">
                        <h1 class="pt-2">Dealer Hand</h1>
                        <div class="flex items-center justify-center sm:p-4 p-2 h-28 sm:h-48">
                            <HandForm :hand="game.dealerHand" :count="0"/>
                        </div>
                        <h1 class="pt-2">Your Hand{{ game.splitHandCount > 0 ? 's':'' }}</h1>
                        <div class="flex items-center justify-center sm:p-4 p-2 h-28 sm:h-48">
                            <HandForm v-for="hand in game.playerHands" :hand="hand" :count="game.splitHandCount">
                                <LargeButton v-if="hand.canSplit" @click="game.split(hand)" class="absolute bottom-6 sm:bottom-10 left-1/2 transform -translate-x-1/2">Split</LargeButton>
                            </HandForm>
                        </div>
                        <div class="flex items-center justify-center text-center pb-4">
                            <section>
                                <BidForm v-if="game.insuranceForm" @click="game.continue(insurance)" v-model:amount="insurance" button-name="insure" :min="1" :max="bidAmount/2"/>
                                <section v-else-if="game.activeGame">
                                    <LargeButton @click="game.hit(game.playerHands[game.activeHandId])" :disable="game.disableButton" class="mr-1 sm:mr-2"> Hit </LargeButton>
                                    <LargeButton @click="game.stand(game.playerHands[game.activeHandId])" :disable="game.disableButton" class="mr-1 sm:mr-2"> Stand </LargeButton>
                                    <LargeButton v-if="game.doubleButton" @click.once="game.double(game.playerHands[game.activeHandId])">Double</LargeButton>
                                </section>
                                <BidForm v-else @click="game.start(bidAmount)" v-model:amount="bidAmount" button-name="bid" :min="2" :max="500"/>
                                <p class="text-sm sm:text-xl text-red-500 h-4 pt-0.5">{{ game.bid.error }}</p>
                            </section>
                        </div>
                        <SymbolButton @click="showRules = true" class="absolute -bottom-2 sm:bottom-0 left-0 sm:left-2">?</SymbolButton>
                    </div>
                    <div class="lg:w-1/4 grid grid-cols-2 lg:grid-cols-1 items-end justify-center text-lg sm:text-2xl text-white text-center py-2">
                        <div>
                            <h1 class="sm:p-2 text-xl sm:text-3xl font-semibold"> {{ game.message }} </h1>
                            <div>
                                <div v-if="game.bid.handsBids.length > 1">
                                    <p v-for="(bid, index) of game.bid.handsBids">{{index+1}}. hands bid: {{ bid }}$</p>
                                </div>
                                <p v-else-if="game.bid.handsBids[0] > 0">Bid: {{ game.bid.handsBids[0] }}$</p>
                                <p v-if="game.bid.insurance.value > 0">{{ game.bid.insurance.mesaage }}</p>
                            </div>
                        </div>
                        <div class="text-sm sm:text-xl text-end lg:text-center">
                            <p> Average: {{ game.averageWinnings>0 ? '+' : '' }}{{ game.averageWinnings}}$ </p>
                            <p> Your balance: {{ game.balance }}$ </p>
                        </div>
                    </div>
                    <Rules v-if="showRules" @close="showRules = false"/>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>