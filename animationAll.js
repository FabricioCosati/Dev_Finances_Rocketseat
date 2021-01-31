const cards = document.querySelectorAll('.card');
const datas = document.querySelectorAll('tbody tr, thead tr')
const dataTr = document.querySelectorAll('#data-table tbody tr')

// variáveis para animação de balance
let i = 0
let tempoCards = 0.4

// variáveis para animação dos dados
let j = 0
let tempoDatas = 0.8

// reduzir opacidade ao passar o mouse em cima dos dados das tabelas
const Hover = {
    hoverMouse(){
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

// animação dos cards principais
const animateCards = setInterval(function () {
    if(cards[i]){
        cards[i].style.animation = `slide ${tempoCards}s`
        tempoCards += 0.3
        i++
    }
}, 0)

// animação dos dados das tabelas
const animateDatas = setTimeout(function(){
    setInterval(function () {
        if(datas[j]){
            datas[j].style.animation = `up ${tempoDatas}s`
            datas[j].style.opacity = 1
            datas[j].style.opacity = Hover.hoverMouse()
            tempoDatas += 0.5
            j++
        }
    }, 0);
}, 350)