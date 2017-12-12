<template>
<div class="columns" v-if="prices">
    <div class="column is-10 is-offset-1">

        <div v-if="selectedTransaction" class="modal" :class="{'is-active': showModal}">
            <div class="modal-background transaction-modal" @click.prevent="closeModal"></div>
                <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">Add Transaction</p>
                    <button class="delete" aria-label="close" @click.prevent="closeModal"></button>
                </header>
                <section class="modal-card-body">
                        <div class="field is-grouped">
                            <div class="control">
                                <label class="label">Coin</label>
                                <div class="select">
                                    <select v-model="selectedTransaction.coin">
                                        <option :value="coin" v-for="coin in coins">{{coin}}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="control">
                                <label class="label">Transaction Date</label>
                                <datepicker class="input" placeholder="Transaction date" v-model="selectedTransaction.date" :config="{ dateFormat: 'M j Y' }"></datepicker>
                                <!-- <input class="input" type="date" v-model="selectedTransaction.date"> -->
                            </div>
                        </div>
                        <div class="field is-grouped">
                            <div class="control">
                                <label class="label">Total Coins</label>
                                <input class="input" type="text" v-model="selectedTransaction.purchase_amount">
                            </div>
                            <div class="control">
                                <label class="label">Cost Basis</label>
                                <input class="input" type="text" v-model="selectedTransaction.cost_basis">
                            </div>
                            <div class="control">
                                <label class="label">Total</label>
                                <input class="input" type="text" disabled="disabled" name="" :value="totalPurchaseCost(selectedTransaction) | currency">
                            </div>
                        </div>
                </section>
                <footer class="modal-card-foot">
                    <button class="button is-success" @click.prevent="updateTransaction(selectedTransaction)">Save</button>
                    <button class="button" @click.prevent="closeModal">Cancel</button>
                    <button class="button is-danger" :class="{'is-warning-pulse': confirmDeleteTransaction}" @click.prevent="removeTransaction(selectedTransaction)" v-if="selectedTransaction['.key']">
                        <template v-if="!confirmDeleteTransaction">
                            <span class="icon">
                                <i class="fa fa-trash"></i>
                            </span>
                        </template>
                        <template v-if="confirmDeleteTransaction">
                            Are you sure?
                        </template>
                    </button>
                </footer>
            </div>
        </div>
    
        <table class="table">
            <thead>
                <tr>
                    <!-- <th v-for="(item, key) in transactions.header">{{item}}</th> -->
                    <th>Coin</th>
                    <th>Date</th>
                    <th>Investment (USD)</th>
                    <th>Total Investment (USD)</th>
                    <th>Market Price (USD)</th>
                    <th>+/- %</th>
                    <th>Profits</th>
                    <th>
                        <a class="button is-small" @click.prevent="addTransation">
                            <span class="icon is-small">
                                <i class="fa fa-plus"></i>
                            </span>
                        </a>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="transactions && allTransactions.length" v-for="transaction in allTransactions">
                    <td>{{transaction.coin}}</td>
                    <td>{{transaction.date | dateFormat('ll')}}</td>
                    <td>{{transaction.purchase_amount}} @ {{transaction.cost_basis | currency}}</td>
                    <td>{{totalPurchaseCost(transaction) | currency}}</td>
                    <td><b>{{getCurrentMarketPrice(transaction) | currency}} <small class="is-size-7 has-text-grey-light">{{transaction.coin}}</small></b></td>
                    <td :class="{'is-gain': isMarketUp(transaction), 'is-loss': !isMarketUp(transaction)}">{{getPercentChange(transaction)}}%</td>
                    <td :class="{'is-gain': isGain(transaction), 'is-loss': !isGain(transaction)}">{{getProfits(transaction) | currency}}</td>
                    <td>
                        <a class="button is-small" @click.prevent="editTransaction(transaction)">
                            <span class="icon is-small">
                                <i class="fa fa-pencil"></i>
                            </span>
                        </a>
                    </td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                        <span class="has-text-right">                
                            Total
                        </span>
                        <b class="has-text-left">
                            {{totalGainsAndLosses | currency}}
                        </b>
                    </td>
                </tr>

            </tbody>
        </table>

    </div>   
</div>   
</template>

<script>
export default {
    name: 'App',
    props: {},
    data() {
        return {
            confirmDeleteTransaction: false,
            showModal: false,
            transactions: null,
            coins: ['BTC', 'LTC', 'ETH'],
            selectedTransaction: null
            /*transactions: {
                data: [
                    {
                        coin: 'LTC',
                        date: new Date(),
                        cost_basis: 373.68,
                        purchase_amount: 1.0,
                    }
                ]
            }*/
        }
    },
    components: {

    },
    methods: {
        isGain(transaction) {
            var pct = parseFloat(this.getPercentChange(transaction))
            return pct > 0.0
        },
        isMarketUp(transaction) {
            var cp = parseFloat(this.getCurrentMarketPrice(transaction))
            var pp = parseFloat(transaction.cost_basis)
            return pp < cp
        },
        getCurrentMarketPrice(transaction) {
            return parseFloat(this.prices[transaction.coin].amount)
        },
        totalPurchaseCost(transaction) {
            var total = parseFloat(transaction.purchase_amount * transaction.cost_basis);
            return total;
        },
        getPercentChange(transaction) {
            var costBasis = transaction.cost_basis
            var marketPrice = this.getCurrentMarketPrice(transaction)
            if (costBasis == 0) {
                return 0
            }
            var diff = ((marketPrice - costBasis) / costBasis) * 100
            return diff.toFixed(2)
        },
        getProfits(transaction) {
            var marketPrice = this.getCurrentMarketPrice(transaction)
            var totalCoins = transaction.purchase_amount;
            if (totalCoins == 0) {
                return 0
            }
            // original cost of investment
            var originalPrice = transaction.cost_basis * totalCoins;
            var currentPrice = totalCoins * marketPrice;
            var diff = currentPrice - originalPrice;
            return diff
        },
        transactionDate(transaction) {
            return this.$moment(transaction.date)
        },
        editTransaction(transaction) {
            this.showModal = true
            this.selectedTransaction = transaction
        },
        updateTransaction(transaction) {
            console.log(transaction);
            var payload = {
                coin: transaction.coin,
                date: this.$moment(transaction.date).toDate().getTime(),
                cost_basis: transaction.cost_basis,
                purchase_amount: transaction.purchase_amount,
            }

            if (!transaction['.key']) {
                console.log('this is a new transaction');
                this.$db.ref(`transactions/${this.authID}`).push(payload)
            } 
            else {
                
                this.$db.ref(`transactions/${this.authID}/${transaction['.key']}`).update(payload)
            }
            this.showModal = false
            this.selectedTransaction = null
        },
        closeModal() {
            this.showModal = false
            this.selectedTransaction = null
            this.confirmDeleteTransaction = false;
        },
        addTransation() {
            this.showModal = true

            var transaction = {
                coin: 'BTC',
                date: (new Date()).getTime(),
                cost_basis: 0,
                purchase_amount: 0,
            }

            this.selectedTransaction = transaction
        },
        removeTransaction(transaction) {
            if(!this.confirmDeleteTransaction) {
                this.confirmDeleteTransaction = true;
            }
            else if(this.confirmDeleteTransaction) {
                this.$db.ref(`transactions/${this.authID}/${transaction['.key']}`).remove()
                console.log('remove transaction', transaction['.key']);
                this.closeModal();
            }
        }

    },
    computed: {
        totalGainsAndLosses() {
            var t = 0
            for (var i = 0; i < this.allTransactions.length; i++) {
                t += this.getProfits(this.allTransactions[i])
            }   
            return t
        },
        allTransactions() {
            var tx = []
            if(this.transactions) {
                for(var t in this.transactions) {
                    if(t != '.key') {
                        this.transactions[t]['.key'] = t
                        tx.push(this.transactions[t])
                    }
                }
            }
            return tx
        }
    },
    watch: {
        transactions(val) {
            if(val['.value'] === null) {
                this.transactions = {}
            }
        }
    },
    created() {
    },
    mounted() {
        this.$bindAsObject('transactions', this.$db.ref(`transactions/${this.authID}`))
    }
}
</script>

<style lang="scss">
@import '~bulma';
@import '../styles/variables';

.is-gain {
    color: green;
    font-weight: bold;
}
.is-loss {
    color: red;
}
.modal-card {
    max-height: calc(100vh - 100px);
    height: calc(100vh - 100px);
}
.main-page {
    margin-top: 50px;
}
.is-warning-pulse {
    background-color: $red-color;
    animation: warningPulse 1.5s
    ease-in-out
    0s
    alternate
    infinite
    none
    running;
}

@keyframes warningPulse {
  0% {
    background-color: $red-color;
  }
  50% {
    background-color: $red-dark-color;
  }
  100 {
    background-color: $red-color;
  }
}
</style>