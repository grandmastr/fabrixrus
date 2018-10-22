/* Product Options Js */
jQuery(document).ready(function(){
	
		//var ajax_url = product_options_list.ajax_url;
        // var data ={ action: "get_product_id",  product_id:8288    };
		// jQuery.post(ajaxurl, data, function (response){
				 // $('#key').html(response);
				// });
 
	jQuery('.sale_product.slide .shop-products').each(function(){ 
	
		var product_options = product_options_sale.atts;
		var navigation = true; 
		var pagination = true; 
		if (parseInt(product_options.navigation)!==1) {  navigation = false } ;
		if (parseInt(product_options.pagination)!==1)  pagination = false ; 
		var owljt = jQuery(this).addClass('owl-carousel owl-theme').owlCarousel({ 
			addClassActive: true,
			loop: product_options.loop,
			autoplay: product_options.auto,
			smartSpeed: product_options.speed,
			nav : navigation, 
			dots : pagination,
			center: product_options.center,
			responsiveClass: true,
			responsive : {
				0: {
					nav : false,
					items: product_options.item_mobile,
				},
				480: {
					nav : false,
					items: product_options.item_tablet
				},
				768: { 
					items: product_options.item_small
				},
				992: { 
					items: product_options.item_desktop
				}, 
				1200: {
					items: product_options.items
				}, 
				1500: {
					items: product_options.item_large
				}
			}
		});
 
	});
	
	
	jQuery('.list_product.slide .shop-products').each(function(){ 
	
		var product_options = product_options_list.atts;
		
		var navigation = true; 
		var pagination = true; 
		if (parseInt(product_options.navigation)!==1) {  navigation = false } ;
		if (parseInt(product_options.pagination)!==1)  pagination = false ;
		var owljt = jQuery(this).addClass('owl-carousel owl-theme').owlCarousel({ 
			addClassActive: true,
			loop: product_options.loop,
			autoplay: product_options.auto,
			smartSpeed: product_options.speed,
			nav : navigation, 
			dots : pagination,
			responsiveClass: true,
			responsive : {
				0: {
					nav : false,
					items: product_options.item_mobile,
				},
				480: {
					nav : false,
					items: product_options.item_tablet
				},
				768: { 
					items: product_options.item_small
				},
				992: { 
					items: product_options.item_desktop
				}, 
				1200: {
					items: product_options.items
				}, 
				1500: {
					items: product_options.item_large
				}
			}
		});
 
	});
	
	
	jQuery('.best_selling_products.slide .shop-products').each(function(){ 
	
		var product_options = product_options_selling.atts;
		
		var navigation = true; 
		var pagination = true; 
		if (parseInt(product_options.navigation)!==1) {  navigation = false } ;
		if (parseInt(product_options.pagination)!==1)  pagination = false ;
		var owljt = jQuery(this).addClass('owl-carousel owl-theme').owlCarousel({ 
			addClassActive: true,
			loop: product_options.loop,
			autoplay: product_options.auto,
			smartSpeed: product_options.speed,
			nav : navigation, 
			dots : pagination,
			responsiveClass: true,
			responsive : {
				0: {
					nav : false,
					items: product_options.item_mobile,
				},
				480: {
					nav : false,
					items: product_options.item_tablet
				},
				768: { 
					items: product_options.item_small
				},
				992: { 
					items: product_options.item_desktop
				}, 
				1200: {
					items: product_options.items
				}, 
				1500: {
					items: product_options.item_large
				}
			}
		});
 
	});
	
	jQuery('.recent_products.slide .shop-products').each(function(){ 
	
		var product_options = product_options_recent.atts;
		
		var navigation = true; 
		var pagination = true; 
		if (parseInt(product_options.navigation)!==1) {  navigation = false } ;
		if (parseInt(product_options.pagination)!==1)  pagination = false ;
		var owljt = jQuery(this).addClass('owl-carousel owl-theme').owlCarousel({ 
			addClassActive: true,
			loop: product_options.loop,
			autoplay: product_options.auto,
			smartSpeed: product_options.speed,
			nav : navigation, 
			dots : pagination,
			responsiveClass: true,
			responsive : {
				0: {
					nav : false,
					items: product_options.item_mobile,
				},
				480: {
					nav : false,
					items: product_options.item_tablet
				},
				768: { 
					items: product_options.item_small
				},
				992: { 
					items: product_options.item_desktop
				}, 
				1200: {
					items: product_options.items
				}, 
				1500: {
					items: product_options.item_large
				}
			}
		});
 
	});
	
	jQuery('.featured_products.slide .shop-products').each(function(){ 
	
		var product_options = product_options_featured.atts;
		
		var navigation = true; 
		var pagination = true; 
		if (parseInt(product_options.navigation)!==1) {  navigation = false } ;
		if (parseInt(product_options.pagination)!==1)  pagination = false ;
		var owljt = jQuery(this).addClass('owl-carousel owl-theme').owlCarousel({ 
			addClassActive: true,
			loop: product_options.loop,
			autoplay: product_options.auto,
			smartSpeed: product_options.speed,
			nav : navigation, 
			dots : pagination,
			responsiveClass: true,
			responsive : {
				0: {
					nav : false,
					items: product_options.item_mobile,
				},
				480: {
					nav : false,
					items: product_options.item_tablet
				},
				768: { 
					items: product_options.item_small
				},
				992: { 
					items: product_options.item_desktop
				}, 
				1200: {
					items: product_options.items
				}, 
				1500: {
					items: product_options.item_large
				}
			}
		});
 
	});
	
	jQuery('.category_product.slide .shop-products').each(function(){ 
	
		var product_options = product_options_category.atts;
		
		var navigation = true; 
		var pagination = true; 
		if (parseInt(product_options.navigation)!==1) {  navigation = false } ;
		if (parseInt(product_options.pagination)!==1)  pagination = false ;
		var owljt = jQuery(this).addClass('owl-carousel owl-theme').owlCarousel({ 
			addClassActive: true,
			loop: product_options.loop,
			autoplay: product_options.auto,
			smartSpeed: product_options.speed,
			nav : navigation, 
			dots : pagination,
			responsiveClass: true,
			responsive : {
				0: {
					nav : false,
					items: product_options.item_mobile,
				},
				480: {
					nav : false,
					items: product_options.item_tablet
				},
				768: { 
					items: product_options.item_small
				},
				992: { 
					items: product_options.item_desktop
				}, 
				1200: {
					items: product_options.items
				}, 
				1500: {
					items: product_options.item_large
				}
			}
		});
 
	});
	
	jQuery('.categories_product.slide .shop-products').each(function(){ 
	
		var product_options = product_options_categories.atts;
		
		var navigation = true; 
		var pagination = true; 
		if (parseInt(product_options.navigation)!==1) {  navigation = false } ;
		if (parseInt(product_options.pagination)!==1)  pagination = false ;
		var owljt = jQuery(this).addClass('owl-carousel owl-theme').owlCarousel({ 
			addClassActive: true,
			loop: product_options.loop,
			autoplay: product_options.auto,
			smartSpeed: product_options.speed,
			nav : navigation, 
			dots : pagination,
			responsiveClass: true,
			responsive : {
				0: {
					nav : false,
					items: product_options.item_mobile,
				},
				480: {
					nav : false,
					items: product_options.item_tablet
				},
				768: { 
					items: product_options.item_small
				},
				992: { 
					items: product_options.item_desktop
				}, 
				1200: {
					items: product_options.items
				}, 
				1500: {
					items: product_options.item_large
				}
			}
		});
 
	});
	
	
	
	
}); 