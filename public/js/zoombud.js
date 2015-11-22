$(document).ready(function () {
    $('#userSubmit').click(function () {
        var payload = {
            email: $('#email').val(),
            password: $('#password').val(),
            is_admin: $('#is_admin').val()
        };
        $.ajax({
            url: "/admin/users/add",
            type: "POST",
            contentType: "application/json",
            processData: false,
            data: JSON.stringify(payload),
            complete: function (data) {
                $('#output').html(data.responseText);
            }
        });
    });
    
    $('#storeSubmit').click(function () {
        var payload = {
            name: $('#name').val(),
            contact_name: $('#contact_name').val(),
            contact_email: $('#contact_email').val(),
            contact_phone: $('#contact_phone').val(),
            address1: $('#address1').val(),
            address2: $('#address2').val(),
            city: $('#city').val(),
            state: $('#state').val(),
            zip: $('#zip').val()
        };
        $.ajax({
            url: "/admin/stores/add",
            type: "POST",
            contentType: "application/json",
            processData: false,
            data: JSON.stringify(payload),
            complete: function (data) {
                $('#output').html(data.responseText);
            }
        });
    });
    $('#storeEditSubmit').click(function () {
        var payload = {
            store_id: $('#store_id').val(),
            name: $('#name').val(),
            contact_name: $('#contact_name').val(),
            contact_email: $('#contact_email').val(),
            contact_phone: $('#contact_phone').val(),
            address1: $('#address1').val(),
            address2: $('#address2').val(),
            city: $('#city').val(),
            state: $('#state').val(),
            zip: $('#zip').val()
        };
        $.ajax({
            url: "/admin/stores/edit/" + $('#store_id').val(),
            type: "POST",
            contentType: "application/json",
            processData: false,
            data: JSON.stringify(payload),
            complete: function (data) {
                $('#output').html(data.responseText);
            }
        });
    });
    
    $('#productSubmit').click(function () {
        var payload = {
            store_id: $('#store_id').val(),
            product_name: $('#product_name').val(),
            product_desc: $('#product_desc').val(),
            price: $('#price').val(),
            sale_price: $('#sale_price').val()
        };
        $.ajax({
            url: "/admin/stores/products/add",
            type: "POST",
            contentType: "application/json",
            processData: false,
            data: JSON.stringify(payload),
            complete: function (data) {
                $('#output').html(data.responseText);
            }
        });
    });
    $('#productEditSubmit').click(function () {
        var payload = {
            product_id: $('#product_id').val(),
            strain_id: $('#strain_id').val(),
            product_name: $('#product_name').val(),
            product_desc: $('#product_desc').val(),
            price: $('#price').val(),
            sale_price: $('#sale_price').val()
        };
        $.ajax({
            url: "/admin/stores/products/edit/" + $('#product_id').val(),
            type: "POST",
            contentType: "application/json",
            processData: false,
            data: JSON.stringify(payload),
            complete: function (data) {
                $('#output').html(data.responseText);
            }
        });
    });
    
    var mjStrains = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      identify: function(obj) { return obj.team; },
      /*prefetch: '/all-strains.json',*/
      remote: {
        url: '/admin/strains/lookup/%QUERY',
        wildcard: '%QUERY'
      }
    });

    $('#strain.typeahead').typeahead(null, {
      name: 'strains',
      display: 'name',
      source: mjStrains
    }).on('typeahead:select', function(ev, suggestion) {
        $('#strain_id').val(suggestion.strain_id);
        //console.log(suggestion.strain_id);
        //$('#hidden-input').val(d[resultList.indexOf(suggestion)].id);
    });
});