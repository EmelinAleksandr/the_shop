let _login = 0
let _password = 0
let _email = 0
let val_login = false
let val_email = false

let autorized_user = null

let is_basket = false

function login_input(e){
    _login = e.value.trim()
}

function password_input(e){
    _password = e.value.trim()
    
    let elem = document.querySelector('.password .req')
    if(elem && elem.classList.contains('true'))
        document.querySelector('.password .req').classList.remove('true')
}

function email_input(e){
    _email = e.value.trim()
}

function valid_login(e){
    if( document.querySelector('.login .req').classList.contains('true'))
        document.querySelector('.login .req').classList.remove('true')
        
    $.get('data/data.php', { func: 'is_double_login', ln: e.value.trim() }).done(data => {
        if(data != 0){
            val_login = true
            document.querySelector('.login .double').classList.add('true')
        } else {
            document.querySelector('.login .double').classList.remove('true')
            val_login = false
            _login = e.value.trim()
        }
    })
}

function valid_email(e){
    if( document.querySelector('.email .req').classList.contains('true'))
        document.querySelector('.email .req').classList.remove('true')
        
    $.get('data/data.php', { func: 'is_double_email', email: e.value.trim() }).done(data => {
        if(data != 0){
            val_email = true 
            document.querySelector('.email .double').classList.add('true')
        } else {
            document.querySelector('.email .double').classList.remove('true')
            val_email = false
            _email = e.value.trim()
            
        }
    })
}

function get_user_info(){
    $.get('data/data.php', { func: 'get_user_info', ln: _login, pd: _password }).done(data => {
        let parser = JSON.parse(data)

        if(parser.length > 0){
            autorized_user = parser[0]
            $.get('/templates/template_autorized_user.html').done(data => {
                document.querySelector('#autorized_container').innerHTML = data
                document.querySelector('#login_autorized').innerHTML = autorized_user.login
                if(is_basket){
                   open_basket()
                } else {
                    document.querySelector('#windows').innerHTML = ''
                }
                get_products()
            })
        }
    })
}

function add_user(){
    if(_login == 0 || _login == ''){
        document.querySelector('.login .req').classList.add('true')
    }
    if(_password == 0 || _password == ''){
        document.querySelector('.password .req').classList.add('true')
    }
    if(_email == 0 || _email == ''){
        document.querySelector('.email .req').classList.add('true')
    }

    if(_login == 0 || _password == 0 || _email == 0 || _login == '' || _password == '' || _email == '' || val_login || val_email){
        return
    }
    $.get('data/data.php', { func: 'add_user', ln: _login, pd: _password, email: _email }).done(data => {
        if(data == 200){
            get_user_info()
        }
    })
}

function exit_user(){
    $.get('/templates/template_autorized_btn.html').done(data => {
        autorized_user = null
        document.querySelector('#autorized_container').innerHTML = data
    })
}

function close_autorized() {
    if(is_basket){
        open_basket()
    } else {
        document.querySelector('#windows').innerHTML = ''
    }
    reset()
    
}

function reset(){
    _login = 0
    _password = 0
    _email = 0
    val_login = false
    val_email = false
    is_basket = false
}