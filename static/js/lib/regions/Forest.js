class Forest {
	id = 4;
	name = 'The Depths of the Arcane Forest';
	shortName = 'forest';
	lvl = 8;
	
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
		return "You awaken with leaves on your face.";
	}
	
	build(){
		
	}
}