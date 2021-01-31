// este arquivo serve para animar apenas os dados das tabelas ao cadastrar uma nova transação
setTimeout(function(){
    const datas = document.querySelectorAll('tbody tr, thead tr')
    const dataTr = document.querySelectorAll('#data-table tbody tr')

    // variáveis para animação dos dados
    let i = 0
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

    // animação dos dados das tabelas
    setInterval(function () {
        if(datas[i]){
            datas[i].style.animation = `up ${tempoDatas}s`
            datas[i].style.opacity = 1
            datas[i].style.opacity = Hover.hoverMouse()
            tempoDatas += 0.5
            i++
        }
    })
}, 350)