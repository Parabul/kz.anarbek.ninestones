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
$.event.special.tap = {
  setup: function() {
    var self = this,
      $self = $(self);

    $self.on('touchstart', function(startEvent) {
      var target = startEvent.target;

      $self.one('touchend', function(endEvent) {
        if (target == endEvent.target) {
          $.event.simulate('tap', self, endEvent);
        }
      });
    });
  }
};


var app = {
    // Application Constructor
    initialize: function() {
        $(document).one('deviceready',function(){
			app.main();
		});
		 $(document).one('ready',function(){
			app.main();
		});
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    main: function() {
		console.log('device ready');
		var width=$(window).width();
		var height=$(window).height();
		
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
			
		$('#ball').on('tap', function() {
			$('#ball').animate({				
				left: (2),
				top: (2)
			}, 2000);
		}); 
    }   
};
