<template>
<div>
    <main-nav></main-nav>
    <div class="main-page container">

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
                                        <span class="add-transaction-total">{{totalPurchaseCost(selectedTransaction) | currency}}</span>
                                        <!-- <input class="input" type="text" disabled="disabled" name="" :value=""> -->
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
                
                <div class="panel is-hidden-tablet mobile-table">
                    <!-- <div class="panel-block is-active">
                        <span class="panel-icon">
                            <i class="fa fa-book"></i>
                        </span>
                        bulma
                    </div> -->
                    <div class="panel-block market-price">
                        <div class="coin-price" v-for="coin in getInvestedCoins">
                            <span class="name">{{coin}}</span><span class="price">{{getCurrentMarketPrice(coin) | currency}}</span>
                        </div>
                    </div>

                    <div class="panel-block transactions" v-if="transactions && allTransactions.length" v-for="transaction in allTransactions" @click.prevent="editTransaction(transaction)">
                        <div class="panel-item">
                            <span class="has-text-weight-bold">{{transaction.coin}}</span><br>
                            <span>{{transaction.purchase_amount}} @ {{transaction.cost_basis | currency}}</span>
                        </div>
                        <div class="panel-item">
                            {{totalPurchaseCost(transaction) | currency}}
                        </div>
                        <!-- <div><b>{{getCurrentMarketPrice(transaction) | currency}} <small class="is-size-7 has-text-grey-light">{{transaction.coin}}</small></b></div> -->
                        <div class="panel-item has-text-right">
                            <div :class="{'is-gain': isMarketUp(transaction), 'is-loss': !isMarketUp(transaction)}">{{getPercentChange(transaction)}}%</div>
                            <div :class="{'is-gain': isGain(transaction), 'is-loss': !isGain(transaction)}">{{getProfits(transaction) | currency}}</div>
                        </div>
                    </div>
                </div>
                
                <table class="table is-fullwidth is-striped is-hidden-mobile">
                    <thead>
                        <tr>
                            <!-- <th v-for="(item, key) in transactions.header">{{item}}</th> -->
                            <th>
                                <span class="th-title">Coin</span>
                            </th>
                            <th><span class="th-title">Date</span></th>
                            <th><span class="th-title">Investment</span></th>
                            <th><span class="th-title">Total Investment</span> <small class="is-size-7 has-text-grey-light">(USD)</small></th>
                            <th><span class="th-title">Market Price</span> <small class="is-size-7 has-text-grey-light">(USD)</small></th>
                            <th><span class="th-title">Profits</span></th>
                            <th><span class="th-title">+/- %</span></th>
                            <th>
                                <a class="button is-small is-success" @click.prevent="addTransation">
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
                            <td>{{transaction.purchase_amount}} <span class="is-size-7">@</span> {{transaction.cost_basis | currency}}</td>
                            <td>{{totalPurchaseCost(transaction) | currency}}</td>
                            <td><b>{{getCurrentMarketPrice(transaction.coin) | currency}} <small class="is-size-7 has-text-grey-light">{{transaction.coin}}</small></b></td>
                            <td :class="{'is-gain': isGain(transaction), 'is-loss': !isGain(transaction)}">{{getProfits(transaction) | currency}}</td>
                            <td :class="{'is-gain': isMarketUp(transaction), 'is-loss': !isMarketUp(transaction)}">{{getPercentChange(transaction)}}%</td>
                            <td class="edit-item is-aligned-middle">
                                <a class="button is-small" @click.prevent="editTransaction(transaction)">
                                    <span class="icon is-small">
                                        <i class="fa fa-pencil"></i>
                                    </span>
                                </a>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div class="total-breakdown">
                    <div class="total-breakdown-columns">
                        <div class="total-breakdown-col breakdown-title">
                            <div class="total-breakdown-item">
                                Total Investment
                            </div>
                            <div class="total-breakdown-item">
                                Gains &amp; Losses
                            </div>
                            <div class="total-breakdown-item">
                                Total Cash Out
                            </div>
                        </div>
                        <div class="total-breakdown-col breakdown-cost">
                            <div class="total-breakdown-item">
                                <span>{{totalInvestment | currency}}</span>
                            </div>
                            <div class="total-breakdown-item">
                                <span>{{totalGainsAndLosses | currency}}</span>
                            </div>
                            <div class="total-breakdown-item">
                                <span><strong>{{totalCashout | currency}}</strong></span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="add-button-container is-hidden-tablet">
                    <button class="button is-success add-button" @click.prevent="addTransation">
                        <span class="icon">
                            <i class="fa fa-plus"></i>
                        </span>
                    </button>
                </div>
            </div>   
        </div>   

    </div>   
</div>   
</template>

<script>
export default {
    name: 'App',
    props: {
    },
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
            var cp = parseFloat(this.getCurrentMarketPrice(transaction.coin))
            var pp = parseFloat(transaction.cost_basis)
            return pp < cp
        },
        isProfitGain() {
            var tgl = this.totalGainsAndLosses
            return tgl > 0
        },
        getCurrentMarketPrice(coin) {
            return parseFloat(this.prices[coin].amount)
        },
        totalPurchaseCost(transaction) {
            var total = parseFloat(transaction.purchase_amount * transaction.cost_basis);
            return total;
        },
        getPercentChange(transaction) {
            var costBasis = transaction.cost_basis
            var marketPrice = this.getCurrentMarketPrice(transaction.coin)
            if (costBasis == 0) {
                return 0
            }
            
            var pct = ((marketPrice - costBasis) / costBasis) * 100
            return pct.toFixed(2)
        },
        getProfits(transaction) {
            var marketPrice = this.getCurrentMarketPrice(transaction.coin)
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
        getInvestedCoins() {
            var coins = {}
            for (var i = 0; i < this.allTransactions.length; i++) {
                coins[this.allTransactions[i].coin] = true;
            }   
            return Object.keys(coins);
        },
        totalGainsAndLosses() {
            var t = 0
            for (var i = 0; i < this.allTransactions.length; i++) {
                t += this.getProfits(this.allTransactions[i])
            }   
            return parseFloat(t)
        },
        totalInvestment() {
            var t = 0
            for (var i = 0; i < this.allTransactions.length; i++) {
                t += this.totalPurchaseCost(this.allTransactions[i])
            }   
            return parseFloat(t)
        },
        totalCashout() {
            var ti = this.totalInvestment
            var tp = this.totalGainsAndLosses;
            return parseFloat(ti + tp)
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
@import '../styles/variables';
@import '~bulma/sass/utilities/mixins';
.table {
    .button {
        border-radius: 50%;
    }
}
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
    @include mobile {
        margin-top: 0px;
    }
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
.add-transaction-total {
    line-height: 36px;
}
.is-aligned-middle {
    vertical-align: middle !important;
}

.total-breakdown {

    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    padding: 10px; 
    .total-breakdown-columns {
        display: flex;
    }
    .total-breakdown-col {
        height: 100%;
        display: flex;
        flex-direction: column;
        margin-bottom: 10px;
        padding-right: 10px;
        &:last-child {
            padding-right: 0px;
        }
        .breakdown-cost {
            text-align: right;
        }
        .total-breakdown-item {
            display: flex;
            flex: 1;
            justify-content: flex-end;
        }
    }
}

th .th-title {
    font-size: 13px;
    text-transform: uppercase;
}


.mobile-table {
    .panel-item {
        flex: 1;
        font-size: 13px;
    }
    .transactions {
        display: flex;
    }
    .market-price {
        background-color: #eee;
        display: flex;
        justify-content: center;
        .coin-price {
            flex: 1;
            display: flex;
            justify-content: center;
            font-size: 11px;
            .name {
                margin-right: 5px; 
            }
            .price {
                font-weight: bold;
            }
        }
    }
}

.field.is-grouped {
    @include mobile {
        flex-direction: column;
        & > .control:not(:last-child) {
            margin-right: 0;
            margin-bottom: 0.75rem;
        }
    }
}

.add-button-container {
    width: 100%;
    padding: 100px;
    display: flex;
    justify-content: center; 
    .button.is-success:focus:not(:active), .button.is-success.is-focused:not(:active) {
        box-shadow: none;
    }
    button {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: none;
        background-color: red;
    }
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