var Player = {
	handlers: [],
	owner: 0,
	nameAndRank: '',
	region: '',
	charclass: '',
	background: '',
	guild: 0,
	effects: '',
	guts: 0,
	gutsMax: 0,
	wits: 0,
	witsMax: 0,
	charm: 0,
	charmMax: 0,
	attack: 0,
	defend: 0,
	skill: 0,
	skillFighter: 0,
	skillFighterMax: 0,
	skillMagic: 0,
	skillMagicMax: 0,
	skillTrade: 0,
	skillTradeMax: 0,
	level: 0,
	experience: 0,
	quests: 0,
	questsMax: 0,
	cash: 0,
	rank: 0,
	storage: 0,
	storageMax: 0,
	fame: 0,
	favor: 0,
	skilled: 0,
	cashToday: 0,
	expToday: 0,
	gutsToday: 0,
	witsToday: 0,
	charmToday: 0,
	totalGuts: 0,
	totalWits: 0,
	totalCharm: 0,
	totalSkill: 0,
	totalAttack: 0,
	totalDefend: 0,
	questsToday: 0,
	totalGuildSkills: 0,
	init: () => {
		Socket.on('player-get-incoming', (data) => {
			Player.owner = data.p_owner;
			Player.region = data.p_region;
			Player.charClass = data.p_class;
			Player.background = data.p_background;
			Player.guild = data.p_guild;
			Player.effects = data.p_effects;
			Player.guts = data.p_guts;
			Player.gutsMax = data.p_max_guts;
			Player.wits = data.p_wits;
			Player.witsMax = data.p_max_wits;
			Player.charm = data.p_charm;
			Player.charmMax = data.p_max_charm;
			Player.attack = data.p_attack;
			Player.defend = data.p_defend;
			Player.skill = data.p_skill;
			Player.skillFighter = data.p_skill_fighter;
			Player.skillFighterMax = data.p_skill_fighter_max;
			Player.skillMagic = data.p_skill_magic;
			Player.skillMagicMax = data.p_skill_magic_max;
			Player.skillTrade = data.p_skill_trade;
			Player.skillTradeMax = data.p_skill_trade_max;
			Player.level = data.p_level;
			Player.experience = data.p_experience;
			Player.quests = data.p_quests;
			Player.questsMax = data.p_max_quests;
			Player.cash = data.p_cash;
			Player.rank = data.p_rank;
			Player.storage = data.p_storage;
			Player.storageMax = data.p_max_storage;
			Player.fame = data.p_fame;
			Player.favor = data.p_favor;
			Player.skilled = data.p_skilled;
			Player.nameAndRank = Player.getRankString() + ' ' + User.name;
			
			Player.totalGuildSkills = Player.skillFighter + Player.skillMagic + Player.skillTrade;
			
			console.log("Player", Player);
			
			setTimeout(function(){ Inventory.init(); }, 500);
		});
		
		Socket.on('player-update-incoming', (data) => {
			Player.owner = data.p_owner;
			Player.region = data.p_region;
			Player.charClass = data.p_class;
			Player.background = data.p_background;
			Player.guild = data.p_guild;
			Player.effects = data.p_effects;
			Player.guts = data.p_guts;
			Player.gutsMax = data.p_max_guts;
			Player.wits = data.p_wits;
			Player.witsMax = data.p_max_wits;
			Player.charm = data.p_charm;
			Player.charmMax = data.p_max_charm;
			Player.attack = data.p_attack;
			Player.defend = data.p_defend;
			Player.skill = data.p_skill;
			Player.skillFighter = data.p_skill_fighter;
			Player.skillFighterMax = data.p_skill_fighter_max;
			Player.skillMagic = data.p_skill_magic;
			Player.skillMagicMax = data.p_skill_magic_max;
			Player.skillTrade = data.p_skill_trade;
			Player.skillTradeMax = data.p_skill_trade_max;
			Player.level = data.p_level;
			Player.experience = data.p_experience;
			Player.quests = data.p_quests;
			Player.questsMax = data.p_max_quests;
			Player.cash = data.p_cash;
			Player.rank = data.p_rank;
			Player.storage = data.p_storage;
			Player.storageMax = data.p_max_storage;
			Player.fame = data.p_fame;
			Player.favor = data.p_favor;
			Player.skilled = data.p_skilled;
			Player.nameAndRank = Player.getRankString() + ' ' + User.name;
			
			Player.totalGuildSkills = Player.skillFighter + Player.skillMagic + Player.skillTrade;
			
			Player.buildStats();
		});
	},
	getRankString: () => {
		var title;
        switch(Player.rank){
            default:
            case 0:
                title = "Peasant";
                break;

            case 1:
                title = "Squire";
                break;

            case 2:
                title = "Knight";
                break;

            case 3:
                title = "Captain";
                break;

            case 4:
                title = "Baron";
                break;

            case 5:
                title = "Count";
                break;

            case 6:
                title = "Viscount";
                break;

            case 7:
                title = "Marquis";
                break;

            case 8:
                title = "Earl";
                break;

            case 9:
                title = "Duke";
                break;

            case 10:
                title = "Prince";
                break;

            case 11:
                title = "Viceroy";
                break;

            case 12:
                title = "Regent";
                break;

            case 13:
                title = "Seneschal";
                break;
        }
        return title;
	},
	addEffect: (effect) => {
		return Player.effects += ","+effect;
	},
	hasEffect: (effect) => {
		return Player.effects.includes(effect);
	},
	removeEffect: (effect) => {
		if(Player.effects.includes(effect)){
			Player.effects.replace(effect, '');
			if(Player.effects.startsWith(",")){
				Player.effects.replace(",", "");
			}
		}
		return Player.effects;
	},
	calculate: () => {
		var totals = Inventory.equipment.getTotals();
		
		Player.totalGuts = Player.guts + totals.guts;
		Player.totalWits = Player.wits + totals.wits;
		Player.totalCharm = Player.charm + totals.charm;
		Player.totalAttack = Player.attack + totals.attack;
		Player.totalDefend = Player.defend + totals.defend;
		
		var stat = Player.skill + totals.skill;
		if(Player.hasAbility("Agility")){
			var inc = stat * 0.1;
			skillStat = Math.ceil(stat + inc);
		}else{
			skillStat = stat;
		}
		Player.totalSkill = skillStat;
	},
	buildCharacterSheet: () => {
		Socket.emit('tpl-character', Player.owner);
		Socket.on('tpl-character-result', (data) => {
			var tpl = data.html;
			
			var statObj = {
				data: {
					nameAndRank: Player.nameAndRank,
					guts: (Player.guts == Player.gutsMax) ? Player.guts : Player.guts+"/"+Player.gutsMax,
					wits: (Player.wits == Player.witsMax) ? Player.wits : Player.wits+"/"+Player.witsMax,
					charm: (Player.charm == Player.charmMax) ? Player.charm : Player.charm+"/"+Player.charmMax,
					cash: Player.cash,
					quests: (Player.quests == Player.questsMax) ? Player.quests : Player.quests+"/"+Player.questsMax,
					level: Player.level,
					experience: Player.experience,
					expThreshold: expThresholds[Player.level + 1],
					attack: Player.attack,
					defend: Player.defend,
					skill: Player.skill,
					fighterSkill: Player.skillFighter,
					fighterSkillMax: Player.skillFighterMax,
					magicSkill: Player.skillMagic,
					magicSkillMax: Player.skillMagicMax,
					tradeSkill: Player.skillTrade,
					tradeSkillMax: Player.skillTradeMax,
					head: ($.isEmptyObject(Inventory.equipment.head)) ? "---" : Inventory.equipment.head.getDescription(),
					body: ($.isEmptyObject(Inventory.equipment.body)) ? "---" : Inventory.equipment.body.getDescription(),
					feet: ($.isEmptyObject(Inventory.equipment.feet)) ? "---" : Inventory.equipment.feet.getDescription(),
					right: ($.isEmptyObject(Inventory.equipment.right)) ? "---" : Inventory.equipment.right.getDescription(),
					left: ($.isEmptyObject(Inventory.equipment.left)) ? "---" : Inventory.equipment.left.getDescription(),
					backpack: Player.storage+"/"+Player.storageMax,
					items: Inventory.items
				},
				html: tpl
			};
			console.log(Inventory.items);
			var html = buildTemplate(statObj);
			Game.container.html(html);
		});
	},
	buildStats: () => {
		Socket.emit('tpl-statbar', Player.owner);
		Socket.on('tpl-statbar-result', (data) => {
			var tpl = data.html;
			var statEquipment = "";
			if($.isEmptyObject(Inventory.equipment.weapon)){
				statEquipment = "Fists";
			}else{
				statEquipment = Inventory.equipment.weapon.name;
			}
			
			statEquipment += " & ";
			if($.isEmptyObject(Inventory.equipment.armor)){
				statEquipment += "Underwear";
			}else{
				statEquipment += Inventory.equipment.armor.name;
			}
			
			var statObj = {
				data: {
					nameAndRank: Player.nameAndRank,
					guts: (Player.guts == Player.gutsMax) ? Player.guts : Player.guts+"/"+Player.gutsMax,
					wits: (Player.wits == Player.witsMax) ? Player.wits : Player.wits+"/"+Player.witsMax,
					charm: (Player.charm == Player.charmMax) ? Player.charm : Player.charm+"/"+Player.charmMax,
					cash: Player.cash,
					quests: (Player.quests == Player.questsMax) ? Player.quests : Player.quests+"/"+Player.questsMax,
					level: Player.level,
					experience: Player.experience,
					equippedWeaponAndArmor: statEquipment
				},
				html: tpl
			};
			
			var html = buildTemplate(statObj);
			$('#statBar').html(html);
		});
		
		
	},
	hasEnoughForTransaction: (cost) => {
		if(Player.cash - cost >= 0){
			return false;
		}else{
			return true;
		}
	}
};