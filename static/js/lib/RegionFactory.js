class RegionFactory{
	static get(shortName){
		var rT;
		if(shortName == "town"){
            rT = new Town();
        }else if(shortName == "fields"){
            rT = new Fields();
        }else if(shortName == "castle"){
            rT = new Castle();
        }else if(shortName == "forest"){
            rT = new Forest();
        }else if(shortName == "mountains"){
            rT = new Mountains();
        }else if(shortName == "mounds"){
            rT = new Mounds();
        }else if(shortName == "docks"){
            rT = new Docks();
        }else if(shortName == "brasil"){
            rT = new Brasil();
        }else if(shortName == "shangala"){
            rT = new Shangala();
        }else if(shortName == "azteca"){
            rT = new Azteca();
        }else if(shortName == "market"){
            rT = new Market();
        } else{
            rT = new Town();
        }
        return rT;
	}
}