
function onLoad(){
    AnimationScript.AnimateAll()
}

const Storage = {
    get(){
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || [] 
    },
    set(transactions){
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
    }
}

const Transaction = {
    all: Storage.get(),

    add(transaction){
        Transaction.all.push(transaction)

        App.reload()
    },

    remove(index){
        Transaction.all.splice(index, 1)

        AnimationScript.AnimateDatas(0)
        App.reload()
    },

    income(){
        //pegar o valor 
        let income = 0
        // para cada transação
        Transaction.all.forEach(transaction => {
            // que for maior que 0
            if(transaction.amount > 0){
                //somar com uma variavel
                transaction.amount = Number(transaction.amount)
                income += transaction.amount
            }
        })
        // retornar essa variável
        return income
    },

    expense(){
        let expense = 0
        // para cada transação
        Transaction.all.forEach(transaction => {
            // pegar o valor das transações que forem menores que 0
            if(transaction.amount < 0) {
                // somar em uma variavel 
                transaction.amount = Number(transaction.amount)
                expense += transaction.amount
            }
        })
        // retornar a variavel
        return expense
    },

    total(){
        return Transaction.income() + Transaction.expense()
    }
}

const DOM = {
    transactionContainer: document.querySelector('#data-table tbody'),

    addTransactions(transaction, index){
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHtmlTransactions(transaction, index)
        tr.dataset.index = index

        DOM.transactionContainer.appendChild(tr)
    },

    innerHtmlTransactions(transaction, index) { 
        const cssClass = transaction.amount < 0 ? "expense" : "income"
        const amount = Utils.currencyFormat(transaction.amount)

        const html = `
            <td class="description">${transaction.description}</td>
            <td class=${cssClass}>${amount}</td>
            <td class="date">${transaction.date}</td>
            <td><img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt=""></td>
        `

        return html
    }, 

    updateBalance(){
        document.getElementById('displayIncome').innerHTML = Utils.currencyFormat(Transaction.income())
        document.getElementById('displayExpense').innerHTML = Utils.currencyFormat(Transaction.expense())
        document.getElementById('displayTotal').innerHTML = Utils.currencyFormat(Transaction.total())
    },

    clearTransactions(){
        DOM.transactionContainer.innerHTML = ""
    },

    Modal() {
        document.querySelector('.modal-overlay').classList.toggle('active')
    }
}

const Utils = {
    currencyFormat(value){
        const signal = Number(value) < 0 ? "-" : ""
        
        value = String(value).replace(/\D/g, "")
        
        value = (Number(value) / 100)

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })
        return signal + value
    },

    formatAmount(amount){
        amount = (Number(amount.replace(/\,/g, ".")) * 100).toFixed(0)
        return amount
    },

    formatDate(date){
        date = date.split("-")
        return `${date[2]}/${date[1]}/${date[0]}`
    }
}

newDatas = []
oldDatas = []

const App = {
    init(){

        
        if(newDatas.length != 0){
            if (JSON.stringify(Transaction.all) !== JSON.stringify(newDatas)){
                Transaction.all = newDatas
                newDatas = []
            }
            else{
                newDatas = []
            }
        }
        
        Transaction.all.forEach(function(transaction, index){
            DOM.addTransactions(transaction, index)
        })
        
        DOM.updateBalance()
        
        Storage.set(Transaction.all)

    },
    reload(){

        DOM.clearTransactions()

        App.init()
    }
}

const Form = {
    description: document.getElementById('description'),
    amount: document.getElementById('amount'),
    date: document.getElementById('date'),

    formGetValues(){
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validateFields(){
        let {description, amount, date} = Form.formGetValues()

        if(description.trim() === "" || amount.trim() === "" || date.trim() === ""){
            throw new Error("Por favor, preencha todos os campos!")
        }
    },

    formatValues(){
        let {description, amount, date} = Form.formGetValues()
        return {
            description,
            amount: Utils.formatAmount(amount),
            date: Utils.formatDate(date)
        }
    },

    clearForm(){
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event){
        event.preventDefault()

        try {
            //pegar os dados [x]
            //validar os dados (verificar se todos os campos foram preenchidos) [x]
            Form.validateFields()
            //formatar os dados [x]
            const transaction = Form.formatValues()
            //salvar os dados [x]
            Transaction.add(transaction)
            //apagar os dados do formulário [x]
            Form.clearForm()
            //fechar o modal [x]
            DOM.Modal()
            //atualizar os dados [x]
            AnimationScript.AnimateDatas(0.8)

        } catch (error) {
            alert(error)
        }
    }
}

const AnimationScript = {

    AnimateAll(){
        const cards = document.querySelectorAll('.card');
        const datas = document.querySelectorAll('tbody tr, thead tr')

        // variáveis para animação de balance
        let i = 0
        let tempoCards = 0.4

        // variáveis para animação dos dados
        let j = 0
        let tempoDatas = 0.8

        // animação dos cards principais
        setInterval(function() {
            if(cards[i]){
                cards[i].style.animation = `slide ${tempoCards}s`
                tempoCards += 0.3
                i++
            }
        })

        // animação dos dados das tabelas
        setTimeout(function() {
            setInterval(function () {
                if(datas[j]){
                    datas[j].style.animation = `up ${tempoDatas}s`
                    datas[j].style.opacity = 1
                    datas[j].style.opacity = AnimationScript.HoverMouse()
                    tempoDatas += 0.5
                    j++
                }
            })
        }, 350)
    },
    
    AnimateDatas(timeout){
        // este arquivo serve para animar apenas os dados das tabelas ao cadastrar uma nova transação
        setTimeout(function(){
            const datas = document.querySelectorAll('tbody tr, thead tr')
            const dataTr = document.querySelectorAll('#data-table tbody tr')

            // variáveis para animação dos dados
            let i = 0
            let tempoDatas = timeout

            // animação dos dados das tabelas
            setInterval(function () {
                if(datas[i]){
                    if(timeout == 0){
                        datas[i].style.animation = `up ${timeout}s`
                    }
                    else{
                        datas[i].style.animation = `up ${tempoDatas}s`
                    }
                    datas[i].style.opacity = 1
                    datas[i].style.opacity = AnimationScript.HoverMouse()
                    tempoDatas += 0.5
                    i++
                }
            })
        })
    },

    HoverMouse(){
        const dataTr = document.querySelectorAll('#data-table tbody tr')

        // reduzir opacidade ao passar o mouse em cima dos dados das tabelas
        for(let data of dataTr){
            data.addEventListener("mouseout", function(){
                data.style.opacity = 1
            })
            data.addEventListener("mouseenter", function(){
                data.style.opacity = 0.8
            })
        }
    }
}

const OrderBy = {
    
    orderDescription(){
        oldDatas = []
        if(Transaction.all.length != newDatas.length){
            
            for(item of Transaction.all){
                oldDatas.push(item)
            }
            
            for(item of Transaction.all){
                newDatas.push(item)
            }
            
            newDatas.sort(function(a, b){
                return a.description.toLowerCase().localeCompare(b.description.toLowerCase())
               
            })
            
            if(JSON.stringify(Transaction.all) == JSON.stringify(newDatas)){ 
                newDatas.sort(function(a, b){
                    return b.description.toLowerCase().localeCompare(a.description.toLowerCase())
                }) 
            }
            
            App.reload()
            AnimationScript.AnimateDatas(0)
        }
    },

    orderAmount(){
        oldDatas = []
        if(Transaction.all.length != newDatas.length){
            for(item of Transaction.all){
                oldDatas.push(item)
            }

            for(item of Transaction.all){
                newDatas.push(item)
            }

            newDatas.sort(function(a, b){
                return parseFloat(b.amount) - parseFloat(a.amount);
            }) 

            if(JSON.stringify(Transaction.all) == JSON.stringify(newDatas)){ 
                newDatas.sort(function(a, b){
                    return parseFloat(a.amount) - parseFloat(b.amount);
                }) 
            }

            App.reload()
            AnimationScript.AnimateDatas(0)
        }
    },

    orderDate(){
        oldDatas = []
        if(Transaction.all.length != newDatas.length){
            for(item of Transaction.all){
                oldDatas.push(item)
            }

            for(item of Transaction.all){
                newDatas.push(item)
            }

            newDatas.sort(function(a, b){
                var dateA = a.date.split('/').reverse().join(),
                dateB = b.date.split('/').reverse().join();
                return dateA > dateB ? -1 : (dateA > dateB ? 1 : 0);
            }) 

            if(JSON.stringify(Transaction.all) == JSON.stringify(newDatas)){ 
                newDatas.sort(function(a, b){
                    var dateA = a.date.split('/').reverse().join(),
                    dateB = b.date.split('/').reverse().join();
                    return dateA < dateB ? -1 : (dateA > dateB ? 1 : 0);
                }) 
            }

            App.reload()
            AnimationScript.AnimateDatas(0)
        }
    }
}

App.init()