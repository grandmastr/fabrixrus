
$(document).ready(function() {
    $('.deletePost').click(function(e) {
        let deleteId = $(this).data('id');
        $.ajax({
            url: `/admin/delete/${deleteId}`,
            type: 'DELETE',
        });
        window.location('/admin');
    });
});