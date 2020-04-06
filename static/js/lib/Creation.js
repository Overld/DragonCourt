var Creation = {
	freePoints: 25,
	charClass: 'peasant',
	lastPointsUsed: 0,
	init: function(cb){
		Socket.emit('tpl-creation', null);
		Socket.on('tpl-creation-result', (data) => {
			var html = buildTemplate(data);
			Game.container.html(html);
			
			Creation.freePoints = parseInt($('#freePts').text());
			
			$(document).on('click', '.creationStatClick', function(e){
				e.preventDefault();
				
				var type = $(this).attr('data-type');
				var inc = $(this).attr('data-inc');
				
				Creation.statClick(type, inc);
			});
			
			$(document).on('mouseup', '.creationClass', function(e){
				e.preventDefault();
				
				var type = $(this).val();
		
				if(Creation.lastPointsUsed > 0){
					var addedBack = Creation.freePoints + Creation.lastPointsUsed;
					console.log(addedBack);
					Creation.pointChange(addedBack);
					Creation.lastPointsUsed = 0;
				}
				
				var query,
					cost = 1,
					error,
					cause;
				
				$('.creationClass').prop('checked', false);
				if(!$('#' + type +'CreationClass').is(':checked')){
					$('#' + type +'CreationClass').prop('checked', true);
				}
				switch(type){
					case 'peasant':
						cost = 0;
					break;
					
					case 'noble':
						cost = 12;
						$("#nobleCreationClass").prop('checked', true);
					break;
					
					case 'warrior':
						cost = 8;
						$("#warriorCreationClass").prop('checked', true);
					break;
					
					case 'wizard':
						cost = 9;
						$("#wizardCreationClass").prop('checked', true);
					break;
					
					case 'trader':
						cost = 10;
						$("#traderCreationClass").prop('checked', true);
					break;
				}
				
				Creation.lastPointsUsed = cost;
				query = (Creation.freePoints - cost < 0);
				error = "You do not have enough free points!";
				cause = Creation.freePoints - cost;

				if(query){
					DC.modal("error", "<strong>"+error+"</strong>", {});
				}else{
					Creation.charClass = type;
					Creation.pointChange(cause);
				}
			});
			
			$(document).on('click', '#creationSubmit', function(e){
				e.preventDefault();
				
				if(parseInt($('#freePts').text()) > 0){
					DC.modal("error", "<strong>You still have free points to distribute.</strong>", {});
					return;
				}
				
				var guts = parseInt($('#gutsStat').text());
				var wits = parseInt($('#witsStat').text());
				var charm = parseInt($('#charmStat').text());
				var cash = parseInt($('#cashStat').text());
				var bg = $('#background').text();
				
				var createObj = {
					id: User.id,
					guts: guts,
					wits: wits,
					charm: charm,
					cash: cash,
					charClass: Creation.charClass,
					bg: bg
				};
				
				console.log(createObj);
				
				Socket.emit('player-create', createObj);
			});
		});
		
		Socket.on('player-create-incoming', (data) => {
			Socket.emit('game-start', null);
			User.hasChar = 1;
			Socket.emit('user-update', User);
		});
    },
    statClick: function(type, inc){
		var statPts = parseInt($('#'+type+'Stat').text());
		var cost = 1,
			error,
			cause,
			effect,
			add;
		
		if(type == "guts" || type == "wits" || type == "charm"){
			cost = 3;
		}
		
		if(inc == "plus"){
			query = (Creation.freePoints - cost < 0);
            error = "You do not have enough free points!";
            cause = Creation.freePoints - cost;
            if(type == "cash"){
                add = 25;
            }else{
                add = 1;
            }
            effect = statPts + add;
		}else{
			if(type == "cash"){
                add = 25;
            }else{
                add = 1;
            }
            query = (statPts - add < 0);
            error = "You cannot reduce a stat below 0!";
            cause = Creation.freePoints + cost;
            effect = statPts - add;
		}
		
		if(query){
            DC.modal("error", "<strong>"+error+"</strong>", {});
        }else{
            $('#'+type+'Stat').text(effect);
            Creation.pointChange(cause);
        }
    },
    pointChange: function(amt){
		Creation.freePoints = amt;
		$('#freePts').text(Creation.freePoints);
    }
};