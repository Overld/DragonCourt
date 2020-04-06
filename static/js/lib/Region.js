class Region {
	_id = 0;
	_name = '';
	_shortName = '';
	_lvl = 0;
	
	constructor(id, name, shortName, lvl){
		this._id = id;
		this._name = name;
		this._shortName = shortName;
		this._lvl = lvl;
	}
	
	get id(){
		return this._id;
	}
	
	set id(id){
		this._id = id;
	}
	
	get name(){
		return this._name;
	}
	
	set name(name){
		this._name = name;
	}
	
	get shortName(){
		return this._shortName;
	}
	
	set shortName(shortName){
		this._shortName = shortName;
	}
	
	get lvl(){
		return this._lvl;
	}
	
	set lvl(lvl){
		this._lvl = lvl;
	}
}