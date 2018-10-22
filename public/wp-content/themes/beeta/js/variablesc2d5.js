 
		var beeta_brandnumber = 6,
			beeta_brandscrollnumber = 2,
			beeta_brandpause = 3000,
			beeta_brandanimate = 2000;
		var beeta_brandscroll = false;
							beeta_brandscroll = true;
					var beeta_categoriesnumber = 6,
			beeta_categoriesscrollnumber = 2,
			beeta_categoriespause = 3000,
			beeta_categoriesanimate = 2000;
		var beeta_categoriesscroll = 'false';
					var beeta_blogpause = 3000,
			beeta_bloganimate = 2000;
		var beeta_blogscroll = false;
							beeta_blogscroll = false;
					var beeta_testipause = 3000,
			beeta_testianimate = 2000;
		var beeta_testiscroll = false;
							beeta_testiscroll = true;
					var beeta_catenumber = 6,
			beeta_catescrollnumber = 2,
			beeta_catepause = 3000,
			beeta_cateanimate = 700;
		var beeta_catescroll = false;
					var beeta_menu_number = 9;
		var beeta_sticky_header = false;
							beeta_sticky_header = true;
			
		jQuery(document).ready(function(){
			jQuery("#ws").focus(function(){
				if(jQuery(this).val()=="Search product..."){
					jQuery(this).val("");
				}
			});
			jQuery("#ws").focusout(function(){
				if(jQuery(this).val()==""){
					jQuery(this).val("Search product...");
				}
			});
			jQuery("#wsearchsubmit").on('click',function(){
				if(jQuery("#ws").val()=="Search product..." || jQuery("#ws").val()==""){
					jQuery("#ws").focus();
					return false;
				}
			});
			jQuery("#search_input").focus(function(){
				if(jQuery(this).val()=="Search..."){
					jQuery(this).val("");
				}
			});
			jQuery("#search_input").focusout(function(){
				if(jQuery(this).val()==""){
					jQuery(this).val("Search...");
				}
			});
			jQuery("#blogsearchsubmit").on('click',function(){
				if(jQuery("#search_input").val()=="Search..." || jQuery("#search_input").val()==""){
					jQuery("#search_input").focus();
					return false;
				}
			});
		});
		