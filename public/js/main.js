$(document).ready(function () {
    $('.deletePost').click(function (e) {
        let deleteId = $(this).data('id');
        $.ajax({
            url: `/admin/delete/${deleteId}`,
            type: 'DELETE'
        });
    });
    $('.individualProduct').click(function(e) {
       e.preventDefault();
       let productID = $(this).data('id');
       location.href = `products/single/${productID}`
    });
    $('.remove').click(function(e) {
        e.preventDefault();
        let deleteProductID = $(this).data('id');
        $.ajax({
            url:`/cart/delete-from-cart/${deleteProductID}`,
            type: 'DELETE',
            success: () => {
                location.reload(false);
            }
        });
    });
    $('#cartCheckout').click(function(e) {
        e.preventDefault();
        if ($('#userMail').val() !== '' || $('#userPhone').val() !== '') {
            let handler = PaystackPop.setup({
                key: 'pk_test_995e7ded5c6290da35467fc3dd442829aea4b0ee',
                email: $('#userMail').val(),
                amount: Number($('#totalPrice').text()) * 100,
                metadata: {
                    custom_fields: [
                        {
                            display_name: "Mobile Number",
                            variable_name: "mobile_number",
                            value: $('#userPhone').val()
                        }
                    ]
                },
                callback: (response) => {
                    alert(`Transaction ref is ${response}`);
                },
                onClose: () => {
                    alert('Transaction cancelled');
                }
            });
            handler.openIframe();
        } else {
            alert('Fill the details to continue with the transaction')
        }
    });
});
$(() => {
    var totalPay = [];
    $('.eachProduct').each((index) => {
        let productQty = Number($(`.eachProduct:nth-child(${index + 1}) input`).val());
        let productPrice = Number($(`.eachProduct:nth-child(${index + 1}) span.productPrice`).text());
        $(`.eachProduct:nth-child(${index + 1}) span.subTotalPrice`).text(productPrice * productQty);
        // $(productQty).on('change',() => {
        //     pricePerProduct = $(productPrice) * $(productQty);
        //     totalPay.push(productPrice)
        // });
    });
});