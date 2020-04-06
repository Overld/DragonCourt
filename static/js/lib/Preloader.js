let Preloader = {
	queue: {},
	callback: {},
	state: {},
	progress: {},
	progressbar: {},
	get: (key) => {
		return Preloader.queue.getResult(key);
	},
	start: (cb) => {
		var $loader = $('<div id="state">Loading...</div><div id="progress">...</div><div id="progressbar"><div class="bar"></div></div>');
		Game.container.append($loader);
		
		Preloader.queue = new createjs.LoadQueue();
		var $progress = $('#progress'),
			$progressbar = $('#progressbar .bar');
		
		Preloader.queue.on('complete', onComplete);
		Preloader.queue.on('error', onError);
		Preloader.queue.on('fileload', onFileLoad);
		Preloader.queue.on('fileprogress', onFileProgress);
		Preloader.queue.on('progress', onProgress);
		
		Preloader.queue.loadManifest([
			{id: 'wall', src: '/images/game/wall1.jpg'},
			{id: 'logo', src: '/images/game/logo.png'},
			{id: 'login', src: '/images/game/buttons/login_normal.png'},
			{id: 'register', src: '/images/game/buttons/register_normal.png'},
			{id: 'box', src: '/images/game/creation_box.png'},
			{id: 'minus', src: '/images/game/buttons/minus_normal.png'},
			{id: 'plus', src: '/images/game/buttons/plus_normal.png'},
			{id: 'done', src: '/images/game/buttons/done_normal.png'},
			{id: 'start', src: '/images/game/buttons/start_normal.png'},
			{id: 'chat', src: '/images/game/buttons/c_normal.png'},
			{id: 'leave_guild', src: '/images/game/buttons/leave_guild_normal.png'},
			{id: 'player', src: '/images/game/buttons/player_normal.png'},
			{id: 'basilisk', src: '/images/game/monsters/basilisk.jpg'},
			{id: 'berzerker', src: '/images/game/monsters/berzerker.jpg'},
			{id: 'boar', src: '/images/game/monsters/boar.jpg'},
			{id: 'centaur', src: '/images/game/monsters/centaur.jpg'},
			{id: 'dragon', src: '/images/game/monsters/dragon.jpg'},
			{id: 'elf', src: '/images/game/monsters/elf.jpg'},
			{id: 'fanatic', src: '/images/game/monsters/fanatic.jpg'},
			{id: 'gang', src: '/images/game/monsters/gang.jpg'},
			{id: 'giant', src: '/images/game/monsters/giant.jpg'},
			{id: 'giant_goat', src: '/images/game/monsters/giant_goat.jpg'},
			{id: 'gladiator', src: '/images/game/monsters/gladiator.jpg'},
			{id: 'goblin', src: '/images/game/monsters/goblin.jpg'},
			{id: 'goblin_champion', src: '/images/game/monsters/goblin_champion.jpg'},
			{id: 'goblin_gate_guard', src: '/images/game/monsters/goblin_gate_guard.jpg'},
			{id: 'goblin_party', src: '/images/game/monsters/goblin_party.jpg'},
			{id: 'goblin_queen', src: '/images/game/monsters/goblin_queen.jpg'},
			{id: 'golem', src: '/images/game/monsters/golem.jpg'},
			{id: 'gryphon', src: '/images/game/monsters/gryphon.jpg'},
			{id: 'gypsy', src: '/images/game/monsters/gypsy.jpg'},
			{id: 'halbediers', src: '/images/game/monsters/halbediers.jpg'},
			{id: 'harpy', src: '/images/game/monsters/harpy.jpg'},
			{id: 'hektor', src: '/images/game/monsters/hektor.jpg'},
			{id: 'hoodlum', src: '/images/game/monsters/hoodlum.jpg'},
			{id: 'mage', src: '/images/game/monsters/mage.jpg'},
			{id: 'medusa', src: '/images/game/monsters/medusa.jpg'},
			{id: 'mercenary', src: '/images/game/monsters/mercenary.jpg'},
			{id: 'merchant', src: '/images/game/monsters/merchant.jpg'},
			{id: 'merchants', src: '/images/game/monsters/merchants.jpg'},
			{id: 'ninja', src: '/images/game/monsters/ninja.jpg'},
			{id: 'orc', src: '/images/game/monsters/orc.jpg'},
			{id: 'panda', src: '/images/game/monsters/panda.jpg'},
			{id: 'peasant', src: '/images/game/monsters/peasant.jpg'},
			{id: 'plague_warrior', src: '/images/game/monsters/plague_warrior.jpg'},
			{id: 'rodent', src: '/images/game/monsters/rodent.jpg'},
			{id: 'samurai', src: '/images/game/monsters/samurai.jpg'},
			{id: 'serpent', src: '/images/game/monsters/serpent.jpg'},
			{id: 'shogun', src: '/images/game/monsters/shogun.jpg'},
			{id: 'siren', src: '/images/game/monsters/siren.jpg'},
			{id: 'snot', src: '/images/game/monsters/snot.jpg'},
			{id: 'soldier', src: '/images/game/monsters/soldier.jpg'},
			{id: 'sphinx', src: '/images/game/monsters/sphinx.jpg'},
			{id: 'treasury_guard', src: '/images/game/monsters/treasury_guard.jpg'},
			{id: 'troll', src: '/images/game/monsters/troll.jpg'},
			{id: 'unicorn', src: '/images/game/monsters/unicorn.jpg'},
			{id: 'warlock', src: '/images/game/monsters/warlock.jpg'},
			{id: 'wizard', src: '/images/game/monsters/wizard.jpg'},
			{id: 'worm', src: '/images/game/monsters/worm.jpg'},
			{id: 'wyvern', src: '/images/game/monsters/wyvern.jpg'},
			{id: 'npc_armor', src: '/images/game/npc/armor.jpg'},
			{id: 'npc_court', src: '/images/game/npc/court.jpg'},
			{id: 'npc_diner', src: '/images/game/npc/diner.jpg'},
			{id: 'npc_healer', src: '/images/game/npc/healer.jpg'},
			{id: 'npc_magic', src: '/images/game/npc/magic.jpg'},
			{id: 'npc_smithy', src: '/images/game/npc/smithy.jpg'},
			{id: 'npc_tavern', src: '/images/game/npc/tavern.jpg'},
			{id: 'npc_trade', src: '/images/game/npc/trade.jpg'},
			{id: 'npc_weapons', src: '/images/game/npc/weapons.jpg'},
			{id: 'castle_gate', src: '/images/game/regions/castle_gate.jpg'},
			{id: 'clan_hall', src: '/images/game/regions/clan_hall.jpg'},
			{id: 'court', src: '/images/game/regions/court.jpg'},
			{id: 'forest_trail', src: '/images/game/regions/forest_trail.jpg'},
			{id: 'mounds_to_fields', src: '/images/game/regions/mounds_to_fields.jpg'},
			{id: 'region_azteca', src: '/images/game/regions/region_azteca.jpg'},
			{id: 'region_brasil', src: '/images/game/regions/region_brasil.jpg'},
			{id: 'region_shangala', src: '/images/game/regions/region_shangala.jpg'},
			{id: 'to_castle', src: '/images/game/regions/to_castle.jpg'},
			{id: 'to_docks', src: '/images/game/regions/to_docks.jpg'},
			{id: 'to_fields', src: '/images/game/regions/to_fields.jpg'},
			{id: 'to_forest', src: '/images/game/regions/to_forest.jpg'},
			{id: 'to_mounds', src: '/images/game/regions/to_mounds.jpg'},
			{id: 'to_mountains', src: '/images/game/regions/to_mountains.jpg'},
			{id: 'to_town', src: '/images/game/regions/to_town.jpg'},
			{id: 'warrens', src: '/images/game/regions/warrens.jpg'},
			{id: 'armor', src: '/images/game/shops/armor.jpg'},
			{id: 'diner', src: '/images/game/shops/diner.jpg'},
			{id: 'gem_exchange', src: '/images/game/shops/gem_exchange.jpg'},
			{id: 'healer', src: '/images/game/shops/healer.jpg'},
			{id: 'magic', src: '/images/game/shops/magic.jpg'},
			{id: 'post_office', src: '/images/game/shops/post_office.jpg'},
			{id: 'smithy', src: '/images/game/shops/smithy.jpg'},
			{id: 'storage', src: '/images/game/shops/storage.jpg'},
			{id: 'tavern', src: '/images/game/shops/tavern.jpg'},
			{id: 'trade', src: '/images/game/shops/trade.jpg'},
			{id: 'weapons', src: '/images/game/shops/weapons.jpg'},
			{id: 'abandoned_mine', src: '/images/game/abandoned_mine.jpg'},
			{id: 'axe', src: '/images/game/axe.png'},
			{id: 'c', src: '/images/game/c_icon.png'},
			{id: 'docks_quest', src: '/images/game/docks_quest.jpg'},
			{id: 'dunjeons', src: '/images/game/dunjeons.jpg'},
			{id: 'exit_game', src: '/images/game/exit_game.jpg'},
			{id: 'fields_quest', src: '/images/game/fields_quest.jpg'},
			{id: 'mountain_quest', src: '/images/game/mountain_quest.jpg'},
			{id: 'mountians_exit', src: '/images/game/mountains_exit.jpg'},
			{id: 'player', src: '/images/game/player.png'},
			{id: 'rest', src: '/images/game/rest.jpg'},
			{id: 'treasury', src: '/images/game/treasury.jpg'},
			{id: 'webfont', src: 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js'}
		]);
		
		function onComplete(event){
			console.log('Complete', event);
			$progressbar.addClass('complete');
			
			$loader.remove();
			
			cb();
		}
		
		function onError(event){
			console.log('Error', event);
		}
		
		function onFileLoad(event){
			console.log('File loaded', event);
		}
		
		function onFileProgress(event){
			console.log('File progress', event);
		}
		
		function onProgress(event){
			var progress = Math.round(event.loaded * 100);
  
			console.log('General progress', Math.round(event.loaded) * 100, event);
			$progress.text(progress + '%');
			$progressbar.css({
				'width': progress + '%'
			});
		}
	}
};