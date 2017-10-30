writing to myself:


这是一个模拟买卖股票的demo。包括股票的买入、卖出，以及账户余额。

## 组件构成

* 根组件：App
* Header组件
* Home组件，用来展示首页内容
* 用来买股票的Stocks组件，以及它的子组件Stock
* 用来抛售手头股票的Portfolio组件，以及它的子组件Stock

## 路由

什么是路由？  
--路由是uri和组件的键值对，定义了输入什么样的uri,展示什么样的组件。

如何定义路由？


```
export const routes = [
    {path: '/', component: Home},
    {path: '/portfolio', component: Portfolio},
    {path: '/stocks', component:Stocks }
];
```
Vue如何处理路由？


```
import Vue from 'vue'
import App from './App.vue'

import VueRouter from 'vue-router'
import { routes } from './routes'
import store from './store/store';

//先让Vue知道
Vue.use(VueRouter);

//再配置
const router = new VueRouter({
    mode: 'history',
    routes: routes
});

//最后让Vue使用上路由
new Vue({
  el: '#app',
  router: router,
  store,
  render: h => h(App)
})
```

也就是，通过`Vue.Use()`注册路由，然后把路由的一个实例交给Vue的实例。

## 状态

Vue是如何使用状态的？  
--和路由类似，首先通过`Vue.Use(Vuex)`注册Vuex组件，然后通过Vuex的工厂方法`Vuex.Store({})`来生成Vuex状态实例。


```
import Vue from 'vue';
import Vuex from 'vuex';
import stocks from './modules/stocks';
import portfolio from './modules/portfolio';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        stocks,
        portfolio
    }
});
```

再把Vuex的实例交给Vue实例，是在main.js中完成。


```
new Vue({
  el: '#app',
  router: router,
  store,
  render: h => h(App)
})
```

需要维护哪些状态呢？  
--需要分组件来讲，Stocks组件需要维护一个stock的数组，Portofolio组件需要维护一个stock组件的数组以及账户余额。

## App根组件

展示Header组件：


```
<app-header></app-header>

components: {
    appHeader: Header
}
```

展示路由包含的组件：

```
<router-view></router-view>
```

初始化Stocks组件需要的数据。


```
created(){
    this.$store.dispatch('initStocks');
}

// 需要触发store中的一个initStocks方法，这个initStocks方法在哪里呢？
// 在Stocks组件对应的module里

import stocks from '../../data/stocks';

const state = {
    stocks: []
};

const mutations = {
    'SET_STOCKS'(state, stocks) {
        state.stocks = stocks;
    }
};

const actions = {
    initStocks: ({commit}) => {
        commit('SET_STOCKS', stocks);
    }
};

```

## Header组件

路由导航是通过router-link组件来实现的。

```
<router-link to="/portfolio" activeClass="active" tag="li"><a>Portfolio</a></router-link>
<router-link to="/stocks" activeClass="active" tag="li"><a>Stocks</a></router-link>
```
显示余额是通过computed来实现的。


```
computed: {
    funds(){
        return this.$store.getters.funds;
    }
}

//store中的getters的funds从哪里来呢？
//放在了Portfolio对应的module里了。

const state = {
    funds: 10000,
    stocks:[]
};


const getters = {
  funds(state){
      return state.funds;
  }
};

```

## Home组件

显示账户余额，也是从从computed中来。


```
computed: {
    funds() {
        return this.$store.getters.funds;
    }
}
```

## Stocks组件

它的使命就是接受一个数组，再交给子Stock组件来实现。


```
<template>
    <div>
        <app-stock v-for="stock in stocks" :stock="stock"></app-stock>
    </div>
</template>


<script>
    import Stock from './Stock.vue';
    export default {
        components: {
            appStock: Stock
        },
        computed: {
            stocks(){
                return this.$store.getters.stocks;
            }
        }
    }
</script>

// 这里的store中的gettes中的stocks从哪里来呢？
// 一定是在Stocks对应的module里。

const state = {
    stocks: []
};

const getters = {
    stocks: state => {
        return state.stocks;
    }
};
```

## Stock组件

显示stock股票的名称和价格。这是最简单的。

```
{{stock.name}} {{stock.price}}
props: ['stock']
```
输入数量的input

* 如果数量的数量大于库存的数量就应该让input周边红色显示，并且禁用购买按钮，并且在按钮上动态设置显示内容
* 如果数量小于或等于零，禁用购买按钮
* 如果输入的数量不是整型，禁用购买按钮


```
<input 
    type="number"
    class="form-control"
    placeholder="Quantity"
    v-model="quantity"
    :class="{danger: insufficientFunds}">
<button 
    class="btn btn-success"
    @click="buyStock"
    :disabled="insufficientFunds || quantity <= 0 || !isInt(quantity)">{{insufficientFunds? 'Insufficient Funds' : 'Buy'}}</button>
    
data(){
    return {
        quantity: 0
    }
},
computed: {
    insufficientFunds(){
        return this.quantity * this.stock.price > this.funds;
    },
    funds(){
        return this.$store.getters.funds;
    }
},
methods: {
    isInt(n) {
        return n % 1 === 0;
    }
}
```

购买按钮。就是搜集当前股票的id,price和quantity，再触发store中的方法。


```
methods: {
    buyStock(){
        const order = {
            stockId: this.stock.id,
            stockPrice: this.stock.price,
            quantity: this.quantity
        };
        console.log(order);
        this.$store.dispatch('buyStock', order);
        this.quantity = 0;
    }
}

//这个buyStock方法在哪里呢？
//buyStock对应的action方法被定义在了Stocks对应的module里了。

const actions = {
    buyStock: ({commit}, order) => {
        commit('BUY_STOCK',order);
    }
};

//这里的BUY_STOCK的mutation被定义在哪里呢？
//被定义在了Portfolio对应的module里了。

const mutations = {
    'BUY_STOCK'(state, {stockId, quantity, stockPrice}){
        const record = state.stocks.find(e => e.id == stockId);
        if(record){
            record.quantity += quantity;
        } else {
            state.stocks.push({
                id: stockId,
                quantity: quantity
            });
        }
        state.funds -= stockPrice * quantity;
    }
};

```

## Portfolio组件


```
<template>
   <div>
       <app-stock v-for="stock in stocks" :stock="stock"></app-stock>
   </div>
    
</template>


<script>
    import { mapGetters } from 'vuex';
    import Stock from './Stock.vue';
    
    export default {
        computed: {
            ...mapGetters({
                stocks: 'stockPortfolio'
            })
        },
        components: {
            appStock: Stock
        }
    }
</script>

//这里的stocks从state里的getters中的stockPortfolio中来。


const getters = {
  stockPortfolio(state, getters){
      return state.stocks.map(stock => {
          const record = getters.stocks.find(e => e.id == stock.id);
          return {
              id: stock.id,
              quantity: stock.quantity,
              name: record.name,
              price: record.price
          }
      });
  }
};
```
## Portfolio组件对应的Stock组件


```
{{ stock.name }}
{{ stock.price }}
{{ stock.quantity}}
<input type="number"
                        class="form-control"
                        placeholder="Quantity"
                        v-model="quantity"
                        :class="{danger:insufficientQuantity}">
                        
<button 
                       class="btn btn-success"
                       @click="sellStock"
                       :disabled="insufficientQuantity || quantity <= 0 || !isInt(quantity)">
                        {{insufficientQuantity ? 'Not enough Stocks': 'Sell'}}
                    </button>
                    
<script>
    import {mapActions} from 'vuex';
    export default {
        props: ['stock'],
        data() {
            return {
                quantity: 0
            }
        },
        computed: {
            insufficientQuantity(){
                return this.quantity > this.stock.quantity;
            }
        },
        methods: {
            ...mapActions({
                placeSellOrder: 'sellStock'
            }),
            sellStock(){
                const order = {
                    stockId: this.stock.id,
                    stockPrice:this.stock.price,
                    quantity: this.quantity
                };
                this.placeSellOrder(order);
        
                this.quantity = 0;
            },
            isInt(n) {
                return n % 1 === 0;
            }
        }
    }
</script>

//这里的sellStock是Portfolio对应的module的一个action

const mutations = {
    'SELL_STOCK'(state, {stockId, quantity, stockPrice}){
        const record = state.stocks.find(e => e.id == stockId);
        if(record.quantity > quantity){
            record.quantity -= quantity;
        } else {
            //如果购买的数量大于现有的数量，就把当前数组中的这个对象删除
            state.stocks.splice(state.stocks.indexOf(record), 1);
        }
        state.funds += stockPrice * quantity;
    }
};

const actions = {
    sellStock({commit}, order){
        commit('SELL_STOCK', order);
    }
};
```











































