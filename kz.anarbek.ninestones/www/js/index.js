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
 * specific language governing permissions and limitations
 * under the License.
 */
function appReady(){
		console.log('device ready');
		var width=$(window).width();
		var height=$(window).height();
		console.log({height:height,width:width});
		$('#game-info').height(height/6);
		$('#board').height(height);
		$('#board').width(width);
		ballDiameter=(width-10*3)/9/3;
		$("#ball").height(ballDiameter);
		$("#ball").width(ballDiameter);
		$("#ball").css('border-radius',width);
		
		$('#ball').animate({				
				left: (width-2-ballDiameter),
				top: (height-2-ballDiameter)
			}, 2000);
			
		$('#ball').on('click', function() {
			$('#ball').animate({				
				left: (2),
				top: (2)
			}, 2000);
		}); 
}
document.addEventListener("deviceready", appReady, false);



