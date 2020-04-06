var Inventory = {
	items: [],
	equipment: {},
	numItemsUsable: 0,
	selectedItem: 0,
	lastDumped: 0,
	init: () => {
		Socket.on("inv-get-incoming", (data) => {
			Inventory.equipment = new Equipment();
			for(var i = 0; i < data.length; i++){
				var itmJson = data[i];
				var item = new Item(data[i].i_id, data[i].i_name, data[i].i_region, data[i].i_shop, data[i].i_guts+data[i].pi_guts, data[i].i_wits+data[i].pi_wits, data[i].i_charm+data[i].pi_charm, data[i].i_attack+data[i].pi_attack, data[i].i_defend+data[i].pi_defend, data[i].i_skill+data[i].pi_skill, data[i].i_cost, data[i].i_func, data[i].i_equippable, data[i].pi_qty, data[i].pi_equipped, data[i].pi_identified, data[i].pi_abilities, data[i].i_max_enchants, data[i].pi_times_enchanted, data[i].pi_in_storage, data[i].i_drop_rate, data[i].i_lvl, data[i].i_is_silver, data[i].i_is_crystal);
				if(item.equipped){
					var itemFunctions = item.func.split(":");
					
					if(item.abilities.includes("Bless")){
						Player.addEffect(element);
					}
					
					if(itemFunctions[1] == "head"){
						Inventory.equipment.head = item;
					}
					if(itemFunctions[1] == "body"){
						Inventory.equipment.body = item;
						Inventory.equipment.armor = item;
					}
					if(itemFunctions[1] == "feet"){
						Inventory.equipment.feet = item;
					}
					if(itemFunctions[1] == "right"){
						Inventory.equipment.right = item;
						Inventory.equipment.weapon = item;
					}
					if(itemFunctions[1] == "left"){
						if(Inventory.equipment.weapon == null) {
							Inventory.equipment.weapon = item;
						}
						Inventory.equipment.left = item;
					}
					if(itemFunctions[1] == "both"){
						Inventory.equipment.weapon = item;
						Inventory.equipment.right = item;
						Inventory.equipment.left = item;
					}
				}else{
					Inventory.items.push(item);
				}
			}
			
			console.log(Inventory);
		});
		
		Socket.emit('inv-get', User.id);
	},
	hasItemByName: (name) => {
		var result = Inventory.items.filter(obj => {
			if(obj.name == name){
				return obj;
			}
		});
		if(result.length){
			return true;
		}else{
			return false;
		}
	},
	getItem: (id) => {
		var result = Inventory.items.filter(obj => {
			if(obj.id == id){
				return obj;
			}
		});
		return result;
	},
	addItem: (obj, qty = null) => {
		if(obj.shop == 'trade' || obj.shop == 'gems'){
			if(Inventory.hasItemByName(obj.name)){
				var item = Inventory.getItem(obj.id);
				item.qty = item.qty + (qty != null) ? qty : 1;
			}else{
				Inventory.items.push(obj);
				Player.storage = Player.storage + 1;
			}
		}else{
			Inventory.items.push(obj);
			Player.storage = Player.storage + 1;
		}
	},
	drop: () => {
		if(Inventory.selectedItem != 0){
			Inventory.lastDumped = Inventory.items.filter(obj => {
				if(obj.id == Inventory.selectedItem){
					return obj;
				}
			});
			
			var newItems = Inventory.items.filter(obj => {
				return obj != selectedItem;
			});
			Inventory.items = newItems;
			Player.storage = Player.storage - 1;
		}else{
			// show error modal
		}
	},
	equip: () => {
	
	},
	use: () => {
		if(Inventory.selectedItem != 0){
			var item = Inventory.items.filter(obj => {
				if(obj.id == Inventory.selectedItem){
					return obj;
				}
			});
			var itemFunctions = item.func;
			var functions = itemFunctions.split(",");
			if(itemFunctions.includes("Battle")){
				if(!Player.isInEncounter()){
					// item cannot be used outside battle
				}else{
					if(Inventory.numItemsUsable > 0){
						Inventory.numItemsUsable =  Inventory.numItemsUsable - 1;
					}else{
						// no longer able to use items. increase skill.
					}
				}
			}
			
			
			
			
			if(item.abilities.includes("Bless")){
				Player.addEffect(element);
			}
			
			if(itemFunctions[1] == "head"){
				Inventory.equipment.head = item;
			}
			if(itemFunctions[1] == "body"){
				Inventory.equipment.body = item;
				Inventory.equipment.armor = item;
			}
			if(itemFunctions[1] == "feet"){
				Inventory.equipment.feet = item;
			}
			if(itemFunctions[1] == "right"){
				Inventory.equipment.right = item;
				Inventory.equipment.weapon = item;
			}
			if(itemFunctions[1] == "left"){
				if(Inventory.equipment.weapon == null) {
					Inventory.equipment.weapon = item;
				}
				Inventory.equipment.left = item;
			}
			if(itemFunctions[1] == "both"){
				Inventory.equipment.weapon = item;
				Inventory.equipment.right = item;
				Inventory.equipment.left = item;
			}
		}else{
			// show error modal
		}
	}
};