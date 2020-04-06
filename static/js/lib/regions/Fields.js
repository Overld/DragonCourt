class Fields {
	_id = 2;
	_name = 'The Fields Near Salamander Township';
	_shortName = 'fields';
	_lvl = 1;
	
	constructor(){
	}
	
	get id(){
		return super._id;
	}
	
	set id(id){
		super._id = id;
	}
	
	get name(){
		return super._name;
	}
	
	set name(name){
		super._name = name;
	}
	
	get shortName(){
		return super._shortName;
	}
	
	set shortName(shortName){
		super._shortName = shortName;
	}
	
	get lvl(){
		return super._lvl;
	}
	
	set lvl(lvl){
		super._lvl = lvl;
	}
	
	awakenText(){
		return "You awaken covered in dew in the middle of the town fields.";
	}
	
	build(){
		Socket.emit('tpl-region', 'fields');
		Socket.on('tpl-region-result', (data) => {
			data.data.lvl = Player.lvl;
			var html = buildTemplate(data);
			Game.container.html(html);
		});
	}
}