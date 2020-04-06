var Shop =  {
	type: '',
	selectedItem: 0,
	transactionType: 'buy',
	data: {},
	items: [],
	init: (id) => {
		Shop.type = id;
		switch(id){
            case "trade":
                Shop.data =  new Trade();
			break;

            case "armor":
                Shop.data =  new Armor();
			break;

            case "weapons":
                Shop.data =  new Weapons();
			break;

            case "tavern":
                Shop.data =  new Tavern();
			break;

            case "healer":
                Shop.data =  new Healer();
			break;

            case "court":
                Shop.data =  new Court();
			break;

            case "post_office":
                Shop.data =  new PostOffice();
			break;

            case "smithy":
                Shop.data =  new Smithy();
			break;

            case "guild":
                Shop.data =  new Skill();
			break;

            case "gems":

			break;

            case "diner":

			break;

            case "storage":
                Shop.data =  new Storage();
			break;

            case "den":

			break;

            case "inn":

			break;
        }
        Player.buildStats();
        Shop.data.build();
	},
	generateBlurb: (id) => {
		var blurbs = Blurbs[id],
			i = Math.floor(Math.random()*blurbs.length);
		
		return blurbs[i];
	},
	polish: () => {
		if(Shop.selectedItem){
			if(Shop.transactionType == 'buy'){
				// only player inventory
			}else{
				if(Player.hasEnoughForTransaction(40)){
					var item = Inventory.getItem(Shop.selectedItem);
					item.polish();
				}else{
					DC.modal("error", "<strong>You still have enough Marks to purchase.</strong>", {});
				}
			}
		}else{
			DC.modal("error", "<strong>You select an item first.</strong>", {});
		}
	},
	identify: () => {
		if(Shop.selectedItem){
			if(Shop.transactionType == 'buy'){
				// only player inventory
			}else{
				if(Player.hasEnoughForTransaction(40)){
					var item = Inventory.getItem(Shop.selectedItem);
					item.identify();
				}else{
					DC.modal("error", "<strong>You still have enough Marks to purchase.</strong>", {});
				}
			}
		}else{
			DC.modal("error", "<strong>You select an item first.</strong>", {});
		}
	},
	transaction: () => {
		if(Shop.selectedItem){
			console.log(Shop.selectedItem);
			if(Shop.transactionType == 'buy'){
				Shop.buy();
			}else{
				Shop.sell();
			}
		}else{
			DC.modal("error", "<strong>You select an item first.</strong>", {});
		}
	},
	info: () => {
		if(Shop.selectedItem){
			
		}else{
			DC.modal("error", "<strong>You select an item first.</strong>", {});
		}
	},
	buy: () => {
		var item = Shop.getItem(Shop.selectedItem);
		item.qty = 1;
		
		if(Player.hasEnoughForTransaction(item.cost)){
			Player.cash = Player.cash-item.cost;
			Player.cashToday = Player.cashToday-item.cost;
			
			Inventory.addItem(item);
			Socket.emit('shop-buy', {id: Player.owner, itm: item});
			Socket.on('shop-buy-result', (data) => {
				DC.modal("error", "<strong>You have successfully purchased 1 "+data+".</strong>", {});
				Socket.emit('player-update', Player);
				
			});
		}else{
			DC.modal("error", "<strong>You still have enough Marks to purchase.</strong>", {});
		}
	},
	sell: () => {
		
	},
	getItem: (id) => {
		var result = Shop.items.filter(obj => {
			if(obj.id == id){
				return obj;
			}
		});
		return result;
	},
	buildSellItems: (data) => {
		console.log(data);
	}
};