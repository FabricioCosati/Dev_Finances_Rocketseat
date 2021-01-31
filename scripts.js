
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

        loadScript.scriptNoAnimate()
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

const App = {
    init(){
        
        Transaction.all.forEach(DOM.addTransactions)

        DOM.updateBalance()

        Storage.set(Transaction.all)

    },
    reload(){

        DOM.clearTransactions()

        App.init()
    }
}

const loadScript = {
    loadScript(){
        const script = document.getElementsByClassName("scriptAnimate")
        const head= document.getElementsByTagName('head')[0];
        const newScript= document.createElement('script')
 
        script[0].parentNode.removeChild(script[0])
        newScript.src = 'animateDatas.js'
        newScript.classList.add('scriptAnimate')
        newScript.innerHTML = "defer"
        head.appendChild(newScript)
     },
 
     scriptNoAnimate(){
         const script = document.getElementsByClassName("scriptAnimate")
         const head= document.getElementsByTagName('head')[0];
         const newScript= document.createElement('script')
 
         script[0].parentNode.removeChild(script[0])
 
         newScript.src = 'noAnimateDatas.js'
         newScript.classList.add('scriptAnimate')
         newScript.innerHTML = "defer"
         head.appendChild(newScript)
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
            loadScript.loadScript()

        } catch (error) {
            alert(error)
        }
    }
}

App.init()