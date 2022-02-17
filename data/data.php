<?php
    if(isset($_GET["func"])){
        $func = strip_tags($_GET["func"]);
        switch($func){
            case 'get_user_info': 
                if(isset($_GET["ln"]) && isset($_GET["pd"])){
                    $login = $_GET["ln"];
                    $password = $_GET["pd"];
                    
                    get_user_info($login, $password);
                }
                break;
            case 'get_products': 
                if(isset($_GET["user_id"])){
                    get_products(strip_tags($_GET["user_id"]));
                }
                else{
                    get_products(null);
                }
                break;
            case 'is_double_login': 
                if(isset($_GET["ln"]))
                    is_double_login(strip_tags($_GET["ln"]));
                break;
            case 'is_double_email': 
                if(isset($_GET["email"]))
                    is_double_email(strip_tags($_GET["email"]));
                break;
            case 'add_user': 
                if(isset($_GET["ln"]) && isset($_GET["pd"]) && isset($_GET["email"])){
                    $login = strip_tags($_GET["ln"]);
                    $password = strip_tags($_GET["pd"]);
                    $email = strip_tags($_GET["email"]);
                    
                    add_user($login, $password, $email);
                }
                break;
            case 'update_likes':
                if(isset($_GET["user_id"]) && isset($_GET["pd_id"])){
                    $user_id = strip_tags($_GET["user_id"]);
                    $pd_id = strip_tags($_GET["pd_id"]);
                    
                    update_likes($user_id, $pd_id);
                }
                break;
            case 'get_likes': 
                if(isset($_GET["user_id"])){
                    get_likes(strip_tags($_GET["user_id"]));
                }
            break;
        }
    }
    
    function get_user_info($login, $password){
        $conn = new mysqli("localhost", "emeliniq_wp1", "9q&7Fje6", "emeliniq_wp1");
        $procedure = 'call get_user("'.$login.'","'.$password.'")';
        $data = $conn->query($procedure);
        $arr = [];
        foreach($data as $row){
            array_push($arr, $row);
        }
        echo json_encode($arr);
        mysqli_free_result($data);
        mysqli_close($conn);
    }
    
    function get_products($user_id){
        $conn = new mysqli("localhost", "emeliniq_wp1", "9q&7Fje6", "emeliniq_wp1");
        $procedure = 'call get_products("'.$user_id.'")';
        $data = $conn->query($procedure);
        $arr = [];
        foreach($data as $row){
            $row["img"] = base64_encode($row['img']);
            array_push($arr, $row);
        }
        echo json_encode($arr);
        mysqli_free_result($data);
        mysqli_close($conn);
        /*$conn = new conect_db('call get_products()');
        $arr = [];
        foreach($conn->data as $row){
            array_push($arr, $row);
        }
        echo json_encode($arr);*/
        
    }
    
    function is_double_login($login){
        $conn = new mysqli("localhost", "emeliniq_wp1", "9q&7Fje6", "emeliniq_wp1");
        $procedure = 'call is_double_login("'.$login.'")';
        $data = $conn->query($procedure);
        $arr = [];
        foreach($data as $row){
            array_push($arr, $row['is_double']);
        }
        echo $arr[0];
        mysqli_free_result($data);
        mysqli_close($conn);
        
    }
    
    function is_double_email($email){
        $conn = new mysqli("localhost", "emeliniq_wp1", "9q&7Fje6", "emeliniq_wp1");
        $procedure = 'call is_double_email("'.$email.'")';
        $data = $conn->query($procedure);
        $arr = [];
        foreach($data as $row){
            array_push($arr, $row['is_double']);
        }
        echo $arr[0];
        mysqli_free_result($data);
        mysqli_close($conn);
    }
    
    function add_user($login, $password, $email){
        $conn = new mysqli("localhost", "emeliniq_wp1", "9q&7Fje6", "emeliniq_wp1");
        $procedure = 'call add_user("'.$login.'", "'.$password.'", "'.$email.'")';
        $data = $conn->query($procedure);
        echo json_encode(200);
        mysqli_free_result($data);
        mysqli_close($conn);
    }
    
    function get_likes($user_id){
        $conn = new mysqli("localhost", "emeliniq_wp1", "9q&7Fje6", "emeliniq_wp1");
        $procedure = 'call get_likes("'.$user_id.'")';
        $data = $conn->query($procedure);
        $arr = [];
        foreach($data as $row){
            $row["img"] = base64_encode($row['img']);
            array_push($arr, $row);
        }
        echo json_encode($arr);
        mysqli_free_result($data);
        mysqli_close($conn);
    }
    
    function update_likes($user_id, $product_id){
        $conn = new mysqli("localhost", "emeliniq_wp1", "9q&7Fje6", "emeliniq_wp1");
        $procedure = 'call update_likes("'.$user_id.'", "'.$product_id.'")';
        $data = $conn->query($procedure);
        echo json_encode(200);
        mysqli_free_result($data);
        mysqli_close($conn);
    }
    
?>