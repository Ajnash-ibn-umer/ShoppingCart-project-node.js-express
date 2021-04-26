


function addToCart(proId){
    console.log('ajax');
    $.ajax({
        type: "get",
        url: "/add-to-cart/"+proId,
        
        success: function (response) {
            alert(response.status)
            if(response.status){
                let badge=  $('#cart-count').html()
                let count =parseInt(badge)+1
                badge= $('#cart-count').html(count)
            }
         
        }
    });
}