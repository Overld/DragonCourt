class Town {
	_id = 1;
	_name = 'Main Street in Salamander Township';
	_shortName = 'town';
	_lvl = 1;
	
	constructor(){
	}
	
	awakenText(){
		var placeRested = '';
		var text = "You awaken at the tavern, ";
		switch(placeRested){
			default:
				text += "and head down to break your fast.";
			break;
			
			case "floor":
				text += "aching head to toe from sleeping on the hard wooden floor. You slowly " +
						"move around and break your fast.";
			break;
			
			case "room":
				text += "feeling a good measure better than you did before. You get ready and " +
						"head down to break your fast.";
			break;
			
			case "suite":
				text += "feeling like a million marks. You rub your eyes, stretch, and head down " +
						"to break your fast.";
			break;
		}
		return text;
	}
	
	build(){
		Socket.emit('tpl-region', 'town');
		Socket.on('tpl-region-result', (data) => {
			var html = buildTemplate(data);
			Game.container.html(html);
		});
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
}