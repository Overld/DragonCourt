class Azteca {
	id = 9;
	name = 'Azteca';
	shortName = 'azteca';
	lvl = 20;
	
	constructor(id, name, shortName, lvl){
		this.id = id;
		this.name = name;
		this.shortName = shortName;
		this.lvl = lvl;
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
		return "";
	}
	
	build(){
		
	}
}