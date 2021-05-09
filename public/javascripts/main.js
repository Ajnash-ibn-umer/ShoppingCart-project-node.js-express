




function addToCart(proId) {
    console.log('ajax');
    $.ajax({
        type: "get",
        url: "/add-to-cart/" + proId,

        success: function (response) {
            alert('prouduct added to cart')
            if (response.status) {
                let badge = $('#cart-count').html()
                let count = parseInt(badge) + 1
                badge = $('#cart-count').html(count)
            }

        }
    });
}


function quantityChange(cartId, proId, count) {

    $.ajax({

        url: "/changecount",
        data: {
            cart: cartId,
            proid: proId,
            count: count
        },
        method: 'post',
        success: function (response) {
            let c = count
            console.log(c);
            let quantity = parseInt(document.getElementById(proId).innerHTML)
            console.log('quantity' + quantity);
            if (quantity - 1 === 1 && c === -1) {
                document.getElementById('a' + proId).style.display = "none";

            } else {
                document.getElementById('a' + proId).style.display = "flex";
            }

            let counts = parseInt(quantity) + parseInt(count)
            document.getElementById(proId).innerHTML = counts
            console.log(response.total);
            document.getElementById('total').innerHTML = response.total


        }
    });

}



function removeProduct(item, cart) {
    $.ajax({
        type: "post",
        url: "/remove-product",
        data: {
            proId: item,
            cartId: cart
        },

        success: function (response) {
            let result = confirm('Do you want to Delete This Product?')
            if (result) {
                location.reload()
                alert('product deleted')

            }
        }
    });
}

$('#form-checkout').submit((e) => {
    e.preventDefault()
    console.log($('#form-checkout').serialize())
   
    
    $.ajax({
        method: "post",
        url: "/checkout-form",
        data: $('#form-checkout').serialize(),
        dataType: 'json',
        success: function (response) {
            if (response.status==='Placed') {
                console.log(response.orderId);
                location.href='/checkout'
                
            }else if (response.status==='created') {
                razorPayment(response)
                console.log('razor area');
            }
           
        }
    });
})
function razorPayment(order){
    console.log('razorpayment processing');
    var options = {
        "key": "rzp_test_xTMzE2ppbSJYDl", // Enter the Key ID generated from the Dashboard
        "amount": order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "Ajnash Corp",
        "description": "Test Transaction",
        "image": "https://example.com/your_logo",
        "order_id": order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": function (response){
            // alert(response.razorpay_payment_id);
            // alert(response.razorpay_order_id);
            // alert(response.razorpay_signature)

            verifyPayment(response,order)
        },
        "prefill": {
            "name": "Gaurav Kumar",
            "email": "gaurav.kumar@example.com",
            "contact": "9999999999"
        },
        "notes": {
            "address": "Razorpay Corporate Office"
        },
        "theme": {
            "color": "#3399cc"
        }
    };
    var rzp1 = new Razorpay(options);

    rzp1.on('payment.failed', function (response){
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
});

rzp1.open();
}

function verifyPayment(payment,order){

    $.ajax({
        type: "post",
        url: "/verifyPayment",
        data: {
            payment,
            order
        },
        
        success: function (response) {
            if (response.status) {
                location.href='/checkout'
            }else{
                alert('payment failed')
            }
        }
    });
}