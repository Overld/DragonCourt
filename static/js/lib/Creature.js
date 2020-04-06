class Creature {
	_id = 0;
	_name = '';
	_guts = 0;
	_wits = 0;
	_exp = 0;
	_fame = 0;
	_abilities = '';
	_option = '';
	_items = '';
	_level = 0;
	_fighterSkillCt = 0;
	_magicSkillCt = 0;
	_traderSkillCt = 0;
	
	constructor(id, name, guts, wits, exp, fame, abilities, option, region, items, level){
		this._id = id;
        this._name = name;
        this._guts = guts;
        this._wits = wits;
        this._exp = exp;
        this._fame = fame;
        this._option = option;
        this._region = region;
        this._items = items;
        this._level = level;
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
	
	get region(){
		return this._region;
	}
	
	set region(region){
		this._region = region;
	}
	
	get guts(){
		return this._guts;
	}
	
	set guts(guts){
		this._guts = guts;
	}
	
	get wits(){
		return this._wits;
	}
	
	set wits(wits){
		this._wits = wits;
	}
	
	get exp(){
		return this._attack;
	}
	
	set attack(attack){
		this._attack = attack;
	}
	
	get defend(){
		return this._defend;
	}
	
	set defend(defend){
		this._defend = defend;
	}
	
	get skill(){
		return this._skill;
	}
	
	set skill(skill){
		this._skill = skill;
	}
	
	get cost(){
		return this._cost;
	}
	
	set cost(cost){
		this._cost = cost;
	}
	
	get func(){
		return this._func;
	}
	
	set func(func){
		this._func = func;
	}
	
	get equippable(){
		return this._equippable;
	}
	
	set equippable(equippable){
		this._equippable = equippable;
	}
	
	get qty(){
		return this._qty;
	}
	
	set qty(qty){
		this._qty = qty;
	}
	
	get equipped(){
		return this._equipped;
	}
	
	set equipped(equipped){
		this._equipped = equipped;
	}
	
	get identified(){
		return this._identified;
	}
	
	set identified(identified){
		this._identified = identified;
	}
	
	get abilities(){
		return this._abilities;
	}
	
	set abilities(abilities){
		this._abilities = abilities;
	}
	
	get maxEnchants(){
		return this._maxEnchants;
	}
	
	set maxEnchants(maxEnchants){
		this._maxEnchants = maxEnchants;
	}
	
	get timesEnchanted(){
		return this._timesEnchanted;
	}
	
	set timesEnchanted(timesEnchanted){
		this._timesEnchanted = timesEnchanted;
	}
	
	get inStorage(){
		return this._inStorage;
	}
	
	set inStorage(inStorage){
		this._inStorage = inStorage;
	}
	
	get dropRate(){
		return this._dropRate;
	}
	
	set dropRate(dropRate){
		this._dropRate = dropRate;
	}
	
	get lvl(){
		return this._lvl;
	}
	
	set lvl(lvl){
		this._lvl = lvl;
	}
	
	get isSilver(){
		return this._isSilver;
	}
	
	set isSilver(isSilver){
		this._isSilver = isSilver;
	}
	
	get isCrystal(){
		return this._isCrystal;
	}
	
	set isCrystal(isCrystal){
		this._isCrystal = isCrystal;
	}
	
	addAbility(ability){
		return this._abilities += ","+ability;
    }
    
    hasAbility(ability){
		return this._abilities.includes(ability);
    }
    
    removeAbility(ability){
		if(this._abilities.includes(ability)){
			this._abilities.replace(ability, '');
			if(this._abilities.startsWith(",")){
				this._abilities.replace(",", "");
			}
		}
		return this._abilities;
    }
    
    getDescription(forName = false){
		var itemDescription = '',
			funcParts = this._func.split(":");
		if(funcParts[0] == "Weapon" || funcParts[0] == "Armor"){
			if(this.hasAbility("Rust")){
				itemDescription += "@";
			}
			itemDescription += this._name;
			if(this._identified){
				itemDescription += "["+this._attack+"a, "+this._defend+"d]";
			}
		}else{
			if(forName){
                itemDescription = this._name;
            }else{
                itemDescription = this._func;
            }
		}
		return itemDescription;
    }
    
    identify(){
		this._identified = 1;
    }
    
    polish(){
		if(this.hasAbility("Rust")){
			this.removeAbility("Rust");
		}
    }
}