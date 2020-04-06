const expThresholds = [0,0,50,69,97,137,192,268,376,527,737,1033,1446,2024,2834,3968,5556,7778,10889,15245,21343,29881,41834,58567,81994,114792,160709,224993,314991,440987,617383,864336,1210070,1694099,2371739,3320434,4648608,6508051,9111272,12755780,17858092,25001329,35001860,49002604,68603645,96045101,134463140,188248392,263547745,368966837,516553563,723174976,1012444950,1417422906,1984392034];

let App = function() {};
App.prototype.start = () => {
	let element = document.createElement('style');
    document.head.appendChild(element);
    let sheet = element.sheet;
    let styles = '@font-face { font-family: "Lombardic"; src: url("/fonts/Lombardic.ttf") format("truetype"); }\n';
    sheet.insertRule(styles, 0);
    styles = '@font-face { font-family: "Jarrow"; src: url("/fonts/Jarrow.ttf") format("truetype"); }';
    sheet.insertRule(styles, 0);
    
    $(document).on($.modal.AFTER_CLOSE, function(event, modal){
        $(modal.$elm[0]).remove();
    });
    
    User.init();
    User.load();
    Chat.init();
    Game.init();
    
    // Game Events
    $(document).on('click', '.shop', function(e){
		e.preventDefault();
		
		var id = $(this).attr('data-id');
		Shop.init(id);
    });
    
    $(document).on('click', '.region-change', function(e){
		e.preventDefault();
		
		var id = $(this).attr('data-id');
		Game.regionChange(id);
    });
    
    $(document).on('click', '#statBarButton', function(e){
		e.preventDefault();
		Player.buildCharacterSheet();
    });
    
    $(document).on('click', '.quest', function(e){
		e.preventDefault();
		
		var loc = $(this).attr('data-id');
		Encounter.init(loc);
    });
    
    // Character Sheet Events
    $(document).on('click', '.character-exit', function(e){
		e.preventDefault();
		
		Game.play();
    });
    
    $(document).on('click', '.character-item-use', function(e){
		e.preventDefault();
		
		if(Inventory.selectedItem != null){
			
		}else{
			
		}
    });
    
    $(document).on('click', '.character-item-info', function(e){
		e.preventDefault();
		
		
    });
    
    $(document).on('click', '.character-item-peer', function(e){
		e.preventDefault();
		
		
    });
    
    $(document).on('click', '.character-item-dump', function(e){
		e.preventDefault();
		
		Inventory.drop();
    });
    
    $(document).on('click', '.character-item-recover', function(e){
		e.preventDefault();
		
		if(Inventory.lastDumped != null){
			
		}else{
			
		}
    });
    
    // Shop Events
    $(document).on('click', '#shopExit', function(e){
		e.preventDefault();
		
		Game.play();
    });
    
    $(document).on('click', '#shopSell', function(e){
		$('#shopBuy').prop('checked', false);
		$(this).prop('checked', true);
		
		Shop.transactionType = 'sell';
		Socket.emit('shop-user-inv-get', Player.owner);
		Socket.on('shop-user-inv-get-result', (data) => {
			console.log(data.data);
			var theItems = [];
			for(var i = 0; i < data.data.items.length; i++){
				var item = new Item(data.data.items[i].i_id, data.data.items[i].i_name, data.data.items[i].i_region, data.data.items[i].i_shop, data.data.items[i].i_guts+data.data.items[i].pi_guts, data.data.items[i].i_wits+data.data.items[i].pi_wits, data.data.items[i].i_charm+data.data.items[i].pi_charm, data.data.items[i].i_attack+data.data.items[i].pi_attack, data.data.items[i].i_defend+data.data.items[i].pi_defend, data.data.items[i].i_skill+data.data.items[i].pi_skill, data.data.items[i].i_cost, data.data.items[i].i_func, data.data.items[i].i_equippable, data.data.items[i].pi_qty, data.data.items[i].pi_equipped, data.data.items[i].pi_identified, data.data.items[i].pi_abilities, data.data.items[i].i_max_enchants, data.data.items[i].pi_times_enchanted, data.data.items[i].pi_in_storage, data.data.items[i].i_drop_rate, data.data.items[i].i_lvl, data.data.items[i].i_is_silver, data.data.items[i].i_is_crystal);
				theItems.push(item);
			}
			data.data.items = theItems;
			var html = buildTemplate(data);
			$('.shop-item-container').html(html);
		});
    });
    
    $(document).on('click', '#shopBuy', function(e){
		$('#shopSell').prop('checked', false);
		$(this).prop('checked', true);
		
		Shop.transactionType = 'buy';
		Socket.emit('shop-inv-get', Shop);
		Socket.on('shop-inv-get-result', (data) => {
			console.log(data);
			var theItems = [];
			for(var i = 0; i < data.data.items.length; i++){
				var item = new Item(data.data.items[i]._id, data.data.items[i]._name, data.data.items[i]._region, data.data.items[i]._shop, data.data.items[i]._guts+data.data.items[i].p_guts, data.data.items[i]._wits+data.data.items[i].p_wits, data.data.items[i]._charm+data.data.items[i].p_charm, data.data.items[i]._attack+data.data.items[i].p_attack, data.data.items[i]._defend+data.data.items[i].p_defend, data.data.items[i]._skill+data.data.items[i].p_skill, data.data.items[i]._cost, data.data.items[i]._func, data.data.items[i]._equippable, data.data.items[i].p_qty, data.data.items[i].p_equipped, data.data.items[i].p_identified, data.data.items[i].p_abilities, data.data.items[i]._max_enchants, data.data.items[i].p_times_enchanted, data.data.items[i].p_in_storage, data.data.items[i]._drop_rate, data.data.items[i]._lvl, data.data.items[i]._is_silver, data.data.items[i]._is_crystal);
				theItems.push(item);
			}
			data.data.items = theItems;
			var html = buildTemplate(data);
			
			$('.shop-item-container').html(html);
		});
    });
    
    $(document).on('click', '#shopTrade', function(e){
		e.preventDefault();
		
		Shop.transaction();
    });
    
    $(document).on('click', '#shopInfo', function(e){
		e.preventDefault();
		
		Shop.info();
    });
    
    $(document).on('click', '#shopPolish', function(e){
		e.preventDefault();
		
		Shop.polish();
    });
    
    $(document).on('click', '#shopIdentify', function(e){
		e.preventDefault();
		
		Shop.identify();
    });
    
    $(document).on('click', '.shop-item', function(e){
		var itmId = $(this).attr('data-id');
		
		Shop.selectedItem = itmId;
		console.log(Shop.selectedItem);
		$(this).siblings().removeClass('shop-item-selected');
		$(this).addClass('shop-item-selected');
    });
};

function buildTemplate(data){
	var template = Handlebars.compile(data.html);
	return template(data.data);
}