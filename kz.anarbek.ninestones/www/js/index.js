/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions && limitations
 * under the License.
 */
 
var FIRST=1;
var SECOND=2;
var waitingUserStep=false;
var specialCell={
	1:0,
	2:0
}
var historySteps="";
function initBalls(){
	var cnt=1;
	for(var player=1;player<3;player++){	
		for(var cell=1;cell<10;cell++){
			for(var i=1;i<10;i++){
				$('#cell-'+player+'-'+cell).append('<div class="ball" cell="'+cell+'" player="'+player+'" id="ball'+(cnt++)+'"></div>');
			}
		}
	}
}

function getNextCell(cell,player){

	if(player == FIRST && cell == 9){
		return {player: SECOND,cell:1}
    }else if (player == FIRST){
        return {player: FIRST,cell:parseInt(cell)+1}
    }else if (player == SECOND && cell == 9){
        return {player:FIRST,cell:1}
    }else if (player == SECOND){
        return {player:SECOND,cell:parseInt(cell)+1}
    }
}

function getNextCellObj(obj){
	var player=obj.player;
	var cell=obj.cell;
	return getNextCell(cell,player);
}

function moveBallToCell(ball, cellInfo){
	if((parseInt(specialCell[1],10)==parseInt(cellInfo.cell,10))&&(2==parseInt(cellInfo.player,10))){
		ball.fadeOut(500,function(){	
			ball.remove();
		});
		return;
	}
	if((parseInt(specialCell[2],10)==parseInt(cellInfo.cell,10))&&(1==parseInt(cellInfo.player,10))){
		ball.fadeOut(500,function(){	
			ball.remove();
		});
		return;
	}

	var oldX=ball.offset().left;
	var oldY=ball.offset().top;
	
	ball.appendTo(getCellByInfo(cellInfo));
	
	var newX=ball.offset().left;
	var newY=ball.offset().top;
	
	var x=oldX-newX;
	var y=oldY-newY;
	ball.animate({ translate3d: x+'px, '+y+'px, 0px'}, 0,'linear',function(){
		ball.animate({ translate3d: '0px, 0px, 0px'}, 1000, 'linear');
	});
		
	
}

function getCellInfo(self){
	return {player:self.attr('player'),cell:self.attr('cell')}
}

function getCellByInfo(obj){
	return $('#cell-'+(obj.player)+'-'+obj.cell);
}

function makeStep(stepCell){
	var my_media = new Media('/android_asset/www/sound/click.mp3',
            // success callback
             function () { console.log("playAudio():Audio Success"); },
            // error callback
             function (err) { console.log("playAudio():Audio Error: " + err); }
    );
           // Play audio
    my_media.play();

	var stepCellInfo=getCellInfo(stepCell);
	historySteps=historySteps+";"+stepCellInfo.cell;
	$('.ball').css('background-color','green');
	var cellBalls=stepCell.children('.ball');
	cellBalls.css('background-color','yellow');
	handSize=cellBalls.length;
	var nextCell;
	var currentCell=getCellInfo(stepCell);
	var cnt=0;
	cellBalls.each(function(){
		cnt++;
		if(handSize==1)
			currentCell=getNextCellObj(currentCell);
		
		ball=$(this);
		moveBallToCell(ball,currentCell);
		
		
		if(cnt==handSize){	
			
			var finalCell=getCellByInfo(currentCell);
			var finalCellInfo=getCellInfo(finalCell);
			var finalCellBalls=finalCell.children('.ball');
			
			if(stepCellInfo.player!=finalCellInfo.player){	
				if (finalCellBalls.length % 2 == 0) {
					finalCellBalls.fadeOut(500,function(){	
						finalCellBalls.remove();
					});
				} else if (finalCellBalls.length == 3 && specialCell[stepCellInfo.player] === 0) {					
					specialCell[stepCellInfo.player]=finalCellInfo.cell;					
					finalCellBalls.fadeOut(500,function(){	
						finalCellBalls.remove();
					});
					finalCell.css('background-color','#ff7518');
				}
			
				
			}
			
		}
		currentCell=getNextCellObj(currentCell);
	});
}

function appReady(){
		initBalls();
		
		$('#reload-game').click(function(){
			$.blockUI({ message: 'Создаем новую игру' }); 
			location.reload(); 
		});
		
		var width=$(window).width();
		var height=$(window).height();
		
		$('#game-info').height(height/6);	
		$('.player-side').height(5*height/12-4);
		$('#board').height(height);
		$('#board').width(width);
		
		
		ballDiameter=(width-10*3)/9/4-1;
		balls=$(".ball");
		balls.height(ballDiameter);
		balls.width(ballDiameter);
		balls.css('border-radius',ballDiameter);


		waitingUserStep=true;
		$('.cell').on('click', function() {
			if(!waitingUserStep) 
				return;
			waitingUserStep=false;
			var stepCell=$(this);
			
			makeStep(stepCell);
			setTimeout(function(){
				$.blockUI({ message: 'Ждем ход соперника' }); 
				
				$.ajax({
					type: 'GET',
					url: 'http://game-ninestones.rhcloud.com/game',
					// data to be added to query string:
					data: { history: historySteps },
					// type of data we are expecting in return:
					dataType: 'json',
					timeout: 30000,
					success: function(data){
						var cellNumber=data.aiStep.cellNumber;
						console.log("aiStep: "+cellNumber);
						$('#score-data').html(data.gameState.board.score.firstPlayerScore+' - '+data.gameState.board.score.secondPlayerScore);
						$.unblockUI();
						makeStep($('#cell-1-'+cellNumber));
						waitingUserStep=true;
					},
					error: function(xhr, type){
						$.unblockUI();
						
					}
				});
			
			},1800);
		}); 
		
}
//document.addEventListener("deviceready", appReady, false);

$(document).ready(appReady);

