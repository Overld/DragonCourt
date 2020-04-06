class Trade {
	name = 'Trader\'s Curious Goods';
	blurb = '';
	region = 'town';
	
	constructor(){
		this.blurb = Shop.generateBlurb('trade');
	}
	
	build(){
		
		var data = {
			'type': 'trade',
			'transactions': true,
			'identifyBtn': false,
			'polishBtn': false,
			'infoBtn': true,
			'items': true,
			'title': this.name,
			'blurb': this.blurb,
			'region': this.region
		};
		
		Socket.emit('tpl-shop', data);
		Socket.on('tpl-shop-result', (data) => {
			console.log(data.data.items);
			for(var i = 0; i < data.data.items.length; i++){
				var item = new Item(data.data.items[i].id, data.data.items[i].name, data.data.items[i].region, data.data.items[i].shop, data.data.items[i].guts, data.data.items[i].wits, data.data.items[i].charm, data.data.items[i].attack, data.data.items[i].defend, data.data.items[i].skill, data.data.items[i].cost, data.data.items[i].func, data.data.items[i].equippable, 1000, 0, 1, '', data.data.items[i].max_enchants, data.data.items[i].times_enchanted, data.data.items[i].in_storage, data.data.items[i].drop_rate, 1, 0, 0);
				Shop.items.push(item);
			}
			var html = buildTemplate(data);
			Game.container.html(html);
		});
	}
}