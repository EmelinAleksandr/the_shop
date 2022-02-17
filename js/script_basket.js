basket = []

function close_basket(){
    close_window()
}

function up_quantity(e){
    let id = e.closest('.position').dataset.id

    if(id > 0){
        let index = basket.findIndex(i => i.id == id)
        
        basket[index].quantity++
        summ_position(id, index)
        all_summ()
        indicator_edit()
    }
}

function down_quantity(e){
    let id = e.closest('.position').dataset.id

    if(id > 0){
        let index = basket.findIndex(i => i.id == id)
        
        if(basket[index].quantity == 1){
            
            document.querySelector(`.position[data-id="${basket[index].id}"]`).remove()
            basket.splice(index, 1)
            
            if(basket.length == 0){
                document.querySelector('#submit_order').innerHTML = ''
            }
        } else {
            basket[index].quantity--
            summ_position(id, index)
        }
        indicator_edit()
        all_summ()
        
    }
}

function summ_position(id, index){
    document.querySelector(`.position[data-id="${id}"] .quantity`).innerHTML = basket[index].quantity
    document.querySelector(`.position[data-id="${id}"] .summ_position`).innerHTML = basket[index].quantity * basket[index].cost
}

function all_summ(){
    let all_summ = 0
    
    if(basket.length > 0){
        let arr_summ = basket.map(i => i.cost * i.quantity)
        
        arr_summ.forEach(i => {
            all_summ += i
        })
    }
   
    document.querySelector(`.footer_basket .summ_order`).innerHTML = 'ИТОГО: ' + all_summ
}

function render_basket(){
    basket.forEach(i => {
        let node = document.createElement('li')
        
        node.classList.add('position')
        node.dataset.id = i.id
        node.innerHTML =  `<img img src="data:image/jpeg;base64,${i.img}" class="img_position">
                <div class="info_position">
                <p class="name_position">${i.name}</p>
                <p class="cost_position">Цена за шт. ${i.cost} баллов</p>
                </div>
                <div class="content_position">
                    <p class="edit_quantity">
                        <span class="down_quantity" onclick="down_quantity(this)">-</span>
                        <span class="quantity">${i.quantity}</span>
                        <span class="up_quantity" onclick="up_quantity(this)">+</span>
                    </p>
                    <p class="summ_position">${i.cost*i.quantity}</p>
                </div>`
        document.querySelector('.positions').appendChild(node)
    })
    all_summ()
}