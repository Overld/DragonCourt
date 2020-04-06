class Mountains {
	_id = 6;
	_name = "High Crags of the Fenris Mountains";
	_shortName = "mountains";
	_lvl = 8;
	
	constructor(){
	}
	
	get id(){
		return this.id;
	}
	
	set id(id){
		this.id = id;
	}
	
	get name(){
		return this.name;
	}
	
	set name(name){
		this.name = name;
	}
	
	get shortName(){
		return this.shortName;
	}
	
	set shortName(shortName){
		this.shortName = shortName;
	}
	
	get lvl(){
		return this.lvl;
	}
	
	set lvl(lvl){
		this.lvl = lvl;
	}
	
	awakenText(){
		return "You awaken moments before rolling off the edge of a cliff! You shake off a moment of panic.";
	}
	
	build(){
		
	}
}