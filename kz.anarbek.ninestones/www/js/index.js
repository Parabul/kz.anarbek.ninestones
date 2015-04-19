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

function moveBallToCell(ball, cell){
	ball.appendTo(getCellByInfo(cell));
}

function getCellInfo(self){
	return {player:self.attr('player'),cell:self.attr('cell')}
}

function getCellByInfo(obj){
	return $('#cell-'+(obj.player)+'-'+obj.cell);
}

function appReady(){
		console.log('device ready');
		initBalls();
		
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

		//$('.ball').on('click', function() {
		//	$(this).appendTo('#cell-1-3');
		//}); 
		waitingUserStep=true;
		$('.cell').one('click', function() {
			//if(!waitingUserStep)	return;
			waitingUserStep=false;
			var stepCell=$(this);
			var stepCellInfo=getCellInfo($(this));
			
			console.log($(this).attr('cell'));
			cellBalls=$(this).children('.ball');
			handSize=cellBalls.length;
			var nextCell;
			var currentCell=getCellInfo($(this));
			var cnt=0;
			cellBalls.each(function(){
				cnt++;
				if(handSize==1)
					currentCell=getNextCellObj(currentCell);
				
				ball=$(this);
				moveBallToCell(ball,currentCell);
				
				
				if(cnt==handSize){	
					console.log('finalCell');
					
					var finalCell=getCellByInfo(currentCell);
					var finalCellInfo=getCellInfo(finalCell);
					console.log(finalCell);
					var finalCellBalls=finalCell.children('.ball');
					console.log(finalCellBalls.length);
					if((finalCellBalls.length %2 == 0) && (stepCellInfo.player!=finalCellInfo.player)){	
						finalCellBalls.appendTo($('#kazan-'+stepCellInfo.player));
					}
					
				}
				currentCell=getNextCellObj(currentCell);
			});
			
		}); 
		
}
//document.addEventListener("deviceready", appReady, false);

$(document).ready(appReady);

