$(document).ready(function () {
    $('.deletePost').click(function (e) {
        let deleteId = $(this).data('id');
        $.ajax({
            url: `/admin/delete/${deleteId}`,
            type: 'DELETE'
        });
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
(function (w, d) {
    w.HelpCrunch = function () { w.HelpCrunch.q.push(arguments) }; w.HelpCrunch.q = [];
    function r() { var s = document.createElement('script'); s.async = 1; s.type = 'text/javascript'; s.src = 'https://widget.helpcrunch.com/'; (d.body || d.head).appendChild(s); }
    if (w.attachEvent) { w.attachEvent('onload', r) } else { w.addEventListener('load', r, false) }
})(window, document)

HelpCrunch('init', 'fabrixrus', {
    applicationId: 4677,
    applicationSecret: 'lXwc352WDGpUxiZeNqn/AsjZdoqJvpkZquOZ85a6PgcGIgaIco7XrxnRIt1JjW1evr5DUCXAor0+9/JwuUhBZg=='
});

HelpCrunch('showChatWidget');
$(() => {
    var totalPay = [];
    $('.eachProduct').each((index) => {
        let productQty = $(`.eachProduct:nth-child(${index + 1}) input`);
        let pricePerProduct = $(`.eachProduct:nth-child(${index + 1}) span.subTotalPrice`);
        let productPrice = $(`.eachProduct:nth-child(${index + 1}) span.productPrice`);
        totalPay += Number($('.eachProduct span.subTotalPrice').text());
        pricePerProduct.text(productPrice.text() * productQty.val());
        $(`.eachProduct:nth-child(${index + 1}) input`).on('change',() => {
            pricePerProduct.text(productPrice.text() * productQty.val());
            totalPay.push(productPrice.text())
        });
    });
});