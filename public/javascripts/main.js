




function addToCart(proId){
    console.log('ajax');
    $.ajax({
        type: "get",
        url: "/add-to-cart/"+proId,
        
        success: function (response) {
            alert('prouduct added to cart')
            if(response.status){
                let badge=  $('#cart-count').html()
                let count =parseInt(badge)+1
                badge= $('#cart-count').html(count)
            }
         
        }
    });
}


function quantityChange(cartId,proId,count){
    
$.ajax({
  
    url: "/changecount",
    data: {
       cart: cartId,
       proid: proId,
       count: count
    },
  method:'post',
    success: function (response) {
        let c=response.count
        console.log(c);
        let quantity=parseInt( document.getElementById(proId).innerHTML)
        if (quantity-1===1 && c===-1 ) {
            $('#minus-btn').css({'display':'none'})
            
        }else  {
            $('#minus-btn').css({'display':'flex'})
        }
         
        let counts =parseInt(quantity)+parseInt(count)
        document.getElementById(proId).innerHTML=counts
       

    }
});

}



function removeProduct(item,cart){
    $.ajax({
        type: "post",
        url: "/remove-product",
        data:{
            proId:item,
            cartId:cart
        },
       
        success: function (response) {
            let result=confirm('Do you want to Delete This Product?')
            if (result) {
                location.reload()
                alert('product deleted')
                
            }
        }
    });
}