let products = []

let filter = {
    price_with: 0,
    price_to: 10000,
    categorie: 1,
    like: false
}

is_registred_user()
get_products()

function open_basket(){
    $.get('/templates/template_basket.html').done(data => {
        document.querySelector('#windows').innerHTML = data
        render_basket()
        if(autorized_user == null){
            $.get('/templates/template_autorized_btn.html').done(data => {
                document.querySelector('.user_infomation').innerHTML = data
                is_basket = true
            })
        } else {
            document.querySelector('.user_infomation').innerHTML =`<p class="login_user">Пользователь: ${autorized_user.login}</p>
                                                                   <p class="score_user">Мои баллы: ${autorized_user.summ}</p>`
            if(basket.length > 0)                                                                   
                document.querySelector('#submit_order').innerHTML = `<div class="btn_submit" onclick="alert('Заказ успешно оформлен!')">Заказать</div>`  
            else
                document.querySelector('#submit_order').innerHTML = ''
        }
    })
}

function open_autorized() {
    $.get('/templates/template_autorized.html').done(data => {
        document.querySelector('#windows').innerHTML = data
    })
}

function redistreted_autorized() {
    $.get('/templates/template_registrated.html').done(data => {
        document.querySelector('#windows').innerHTML = data
    })
}

function is_registred_user(){
    $.get('/templates/template_autorized_btn.html').done(data => {
        document.querySelector('#autorized_container').innerHTML = data
    })
}

function close_autorized() {
    close_window()
    reset()
    get_products()
}

function close_window(){
    document.querySelector('#windows').innerHTML = ''
}

function add_basket(e) {
    let id = e.closest('.item').dataset.id
    let elem = get_element_from_arr(products, id)
    let basket_elem = get_element_from_arr(basket, id)
    if(basket_elem != null){
        basket_elem.quantity++
    } else {
        elem.quantity = 1
        basket.push(elem)
    }
    
    indicator_edit()
}

function get_element_from_arr(arr, id){
    let index = arr.findIndex(i => i.id == id)
    if(index > -1)
        return arr[index]
    else
        return null
}

function indicator_edit() {
    let indicator = document.querySelector('#indicat_basket')

    if (basket.length > 0) {
        let quantity = 0
        basket.forEach(i => {
            quantity += i.quantity
        })
        indicator.innerHTML = quantity
        indicator.classList.add('is_data')
    } else {
        indicator.innerHTML = ''
        indicator.classList.remove('is_data')
    }
}

function get_products(){
    
    let user_id = autorized_user ? autorized_user.id : null
    
    document.querySelector('.content .items').innerHTML = ''
    $.get('data/data.php', { func: 'get_products', user_id: user_id }).done(data => {
        products = JSON.parse(data)
        
        filter.price_with = 0
        filter.price_to = 0
        document.querySelector('input[name="price_with"]').value = filter.price_with
        
        products.forEach(i => {
            if(+i.cost > filter.price_to){
                filter.price_to = +i.cost
                document.querySelector('input[name="price_to"]').value = filter.price_to
            }
            render_products(i)
        })
    })
}

function render_products(i){
    let node = document.createElement('li')
            
            node.classList.add('item')
            node.dataset.id = i.id
            
            node.innerHTML = `<img src="data:image/jpeg;base64,${i.img}" alt="">
                            <div class="description">
                                <div>
                                    <p class="description_caption">${i.name}</p>
                                    <p>${i.description}</p>
                                </div>   
                                <!-- <div class="rating"><img src="" alt=""> <p class="score">4.8</p></div> -->
                            </div>
                            <div class="cost">
                                <p class="bal">${i.cost} баллов</p>
                                <div class="action_container">${autorized_user ? `<p class="like_products_user ${i.is_like ? 'is_like' : ''}" onclick="update_like(this)"></p>` : ''} <p class="btn_add_basket" onclick="add_basket(this)">В корзину</p></div>
                            </div>`
            document.querySelector('.content .items').appendChild(node)
}

function toggle_menu(){
    document.querySelector('#autorized_container .select').classList.toggle('view')
    document.querySelector('#autorized_container .arrow').classList.toggle('up')
}

function show_likes(){
    if(autorized_user != null){
        $.get('data/data.php', { func: 'get_likes', id: autorized_user.id }).done(data => {
            products = JSON.parse(data)
            
            products.forEach(i => {
                render_products(i)
            })
        })
    }
}

function view_menu_filter(){
    document.querySelector('.categories_container').classList.toggle('view')
}

function select_item_menu(id){
    filter.categorie = +id
    document.querySelector('#categorie_select').innerHTML = document.querySelector(`.categore[data-id="${id}"]`).innerText
    view_menu_filter()
}

function in_price_with(e){
    if(e.value < 0){
       e.value = 0
    } else {
        e.value = +e.value
        filter.price_with = e.value
    }
}

function in_price_to(e){
    if(e.value < 0){
        e.value = 0
    } else {
         e.value = +e.value
        filter.price_to = e.value
    }
}

function filtering(e){
    
    document.querySelector('.content .items').innerHTML = ''
    let func = 'get_products'
    let user_id = autorized_user ? autorized_user.id : 0
    
    if(filter.like){
        func = 'get_likes'
    }
    
    
    $.get('data/data.php', { func: func, user_id: user_id }).done(data => {
        products = JSON.parse(data)

        products.forEach(i => {
            let is_render = true
            
            if(+i.cost < filter.price_with){
                is_render = false
            }
            if(+i.cost > filter.price_to){
                is_render = false
            }
            if(filter.categorie != 1){
                if(i.categorie != +filter.categorie){
                    is_render = false
                }
            }
            
            if(is_render == true){
                render_products(i)
            }
        })
    })
}

function update_like(e){
    let id = e.closest('.item').dataset.id
    $.get('data/data.php', { func: 'update_likes', user_id: autorized_user.id, pd_id: id }).done(() => {
        document.querySelector(`.item[data-id="${id}"] .like_products_user`).classList.toggle('is_like')
    })
}

function like_filter(e){
    filter.like = document.getElementById('like_checkbox').checked
}
