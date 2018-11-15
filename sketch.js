
const buttonNum = 31;

const buttonMapping = {
    0: 'A',
    1: 'B',
    2: 'X',
    3: 'Y',
    4: 'RSL',
    5: 'RSR',
    9: 'PLUS',
    11: 'RA',
    12: 'HOME',
    14: 'R',
    15: 'RT',
    16: 'LEFT',
    17: 'DOWN',
    18: 'UP',
    19: 'RIGHT',
    20: 'LSL',
    21: 'LSR',
    24: 'MINUS',
    26: 'LA',
    29: 'CAPTURE',
    30: 'L',
    31: 'LT'
}



const ssurlp = 'https://spreadsheets.google.com/feeds/list/1g4CAWGxpcj9CbwMNY_A5BGtmSlZ8bbMdexVREEyJXOU/1/public/values?alt=json';
const ssurlloc = 'https://spreadsheets.google.com/feeds/list/1g4CAWGxpcj9CbwMNY_A5BGtmSlZ8bbMdexVREEyJXOU/2/public/values?alt=json';

const exeurl = 'https://script.google.com/macros/s/AKfycbxCm1DwMr4aguILPVMg9-L9Wh5GPT2JijZE_Fe2JDnbFaL6kuE/exec';
const bgpath = 'assets/img/bg.jpg';

const dot = new DOT(400,300);
const recording = new RECORD();
const layout = new LAYOUT();

var timestamp=0;
var basemap={};

function preload() {
  
  loadJSON(ssurlloc, encodeloc);
  loadJSON(ssurlp, encodep);
  layout.setbg(loadImage(bgpath));
  layout.setmap(basemap);
}

function encodeloc(data){
  		let vs = [];

  		for (let i = 0; i < data.feed.entry.length; i+=1) {
    		let p = {   "x": int(data.feed.entry[i].gsx$座標x.$t),
                		"y": int(data.feed.entry[i].gsx$座標y.$t)
            		};
    		let  v= {
                		"position": p,
                		"diameter": int(data.feed.entry[i].gsx$範圍.$t),
                		"descript": data.feed.entry[i].gsx$說明.$t,
            		};
    		vs.push(v);
  		}
  		basemap.location=vs;
}
function encodep(data){
  		let vs = [];

  		for (let i = 0; i < data.feed.entry.length; i+=1) {
  			let rule=[ data.feed.entry[i].gsx$地點1.$t,
                       data.feed.entry[i].gsx$地點2.$t,
                       data.feed.entry[i].gsx$地點3.$t,
                       data.feed.entry[i].gsx$地點4.$t,
                       data.feed.entry[i].gsx$地點5.$t,
                       data.feed.entry[i].gsx$地點6.$t,
                       data.feed.entry[i].gsx$地點7.$t,
                       data.feed.entry[i].gsx$地點8.$t,
                       data.feed.entry[i].gsx$地點9.$t,
                       data.feed.entry[i].gsx$地點10.$t];
            //console.log('assets/img/person/'+);

            //image(ppic, 0, 0, 40, 60);

    		let  v= {	"id": data.feed.entry[i].gsx$瑞安編號.$t,
    					"behavior": data.feed.entry[i].gsx$屬性.$t,
                		"rule": rule,
                		"current": data.feed.entry[i].gsx$現在位置.$t,
                		"pic": data.feed.entry[i].gsx$圖片.$t
            		};
    		vs.push(v);
  		}
  		basemap.person=vs;
}
/*
function encodep(data){
  		let vs = [];

  		for (let i = 0; i < data.feed.entry.length; i+=1) {
    		let p = {   "x": int(data.feed.entry[i].gsx$座標x.$t),
                		"y": int(data.feed.entry[i].gsx$座標y.$t)
            		};
    		let  v= {
                		"position": p,
                		"diameter": int(data.feed.entry[i].gsx$範圍.$t),
                		"descript": data.feed.entry[i].gsx$說明.$t,
            		};
    		vs.push(v);
  		}
  		basemap.location=vs;
}
*/

function setup() {
  //imageMode(CENTER);
  createCanvas(1200,900);
  textAlign(LEFT,CENTER);
  ellipseMode(CENTER);
  //loop();
  //dot=
}

function draw() {
  
  

  let buttonCount = 0;
  //for(let p = 0; p <= buttonNum; p++) {
    //const name = buttonMapping[p] || p;

    /*
    if(isNaN(name)){
      fill(0);
      text(name, 100, 25 * buttonCount + 30);
      noFill();
      ellipse(85, 25 * buttonCount + 30, 13, 13);
      buttonCount++;
    }
    */
  //}

  let gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
  let gamepadArray = [];

  // 尋找控制器
  let orderedGamepads = [];
  
  let joyconR,joyconL, xbox;
  for(let i = 0; i < gamepads.length; i++) {
  	//console.log(gamepads[i]);
    gamepadArray.push(gamepads[i]);
    
   //避免控制器list為null
    if (gamepadArray[i] === null){
    }else{//win10之右控制器id名為  Wireless Gamepad (Vendor: 057e Product: 2007)
      
      if (gamepadArray[i].id === 'Wireless Gamepad (Vendor: 057e Product: 2007)'){
          joyconR = i;
      }else if (gamepadArray[i].id === 'Xbox 360 Controller (XInput STANDARD GAMEPAD)'){
          //console.log('a');
          xbox = i;
          //console.log('a');
      }else{
      	  joyconL = i;
      }
    }
  }
  orderedGamepads.push(gamepadArray[xbox]);
  //orderedGamepads.push(gamepadArray[joyconL]);
  let pressed = [];

    for (let g = 0; g < orderedGamepads.length; g++) {
        const gp = orderedGamepads[g];
        if (!!gp) {
            const axes = gp.axes;
            let arrowX = 200;
            arrowX += g == 0 ? 100 : 0;

            // スティックの位置をマッピング
            fill(0);

            if(axes[2] >0.2 || axes[3] >0.2 || axes[2] <-0.2 || axes[3] <-0.2){
            	dot.move(axes[2],axes[3]);
            // 方向入れる
            /*
            if(axes[axes.length-1] = 1){
              let axesVal = 0;
              console.log(axes);
              if(g == 0){
                axesVal = map(axes[axes.length-1], -1, 1, 0, 7) - 4;
                
                //控制移動
                //dot.move( 1 * sin(radians(axesVal * 360 / 8)), 1 * cos(radians(axesVal * 360 / 8)));
              }
              else {
                axesVal = map(axes[axes.length-1], -1, 1, 0, 7);
                //console.log(3 * cos(radians(axesVal * 360 / 8)));
              }
              let axesTheta = axesVal * 360 / 8;

              //移動

              //dot.move(3 * cos(radians(axesTheta))+ arrowX , 3 * sin(radians(axesTheta))+ 100, 20, 20);
              //ellipse(30 * cos(radians(axesTheta))+ arrowX , 30 * sin(radians(axesTheta))+ 100, 20, 20);
            
            */
            }
            // ニュートラル位置
            else {
            	
            	if (millis()-timestamp > 100){
		            //按鈕
		            for(let i = 0; i < gp.buttons.length; i++) {	
		                if(gp.buttons[i].pressed) {
		                        switch (i) {
		                          case 0: // A
		                              recording.move(dot);
		                            break;
		                          case 3: // Y
		                              recording.export();
		                            break;
		                          case 1: // B
		                              if (recording.mode===0){
		                              	recording.mode=1;
		                              }else{
		                              	recording.mode=0;
		                              }
		                            break;
		                          default:
		                            break;
		                        }

		                }
		           	}
		           	timestamp = millis();
	            }
            }

            
        }
    }

    // drawing
    layout.display();
    recording.display(dot);
    dot.display();
    
}



function getIndex(id) {
  var resultIndex = 0
  for(let i = 0; i < id; i++) {
    const name = buttonMapping[i] || i;
    if(isNaN(name)){
      resultIndex++;
    }
  }

  return resultIndex;
}

function DOT(x,y){
  this.x = x;
  this.y = y;
  this.diameter = 15;

  this.move = function(dx,dy){
    this.x+=dx;
    this.y+=dy;
  }

  this.display = function(){
    
    noStroke();
    fill(200, 0, 0);
    ellipse(this.x, this.y, this.diameter, this.diameter);
  }
}
function LAYOUT(){
	this.bg;
	this.map;
	

	this.setbg=function(bg){
		this.bg=bg;
	}
	this.setmap=function(map){
		this.map=map;
	}
	this.display =function(){
		background(this.bg);
		for(let i=0;i<this.map.location.length;i+=1){
				let val = this.map.location[i];
				noStroke();
	          	fill(200, 0, 200,50);
				ellipse(val.position.x,val.position.y,val.diameter,val.diameter);
			}
		for(let i=0;i<this.map.person.length;i+=1){
				let val = this.map.person[i];
				let p = int(split(val.current,'地點')[1]);

				noStroke();
	          	fill(50, 50, 50);
				ellipse(this.map.location[p].position.x,this.map.location[p].position.y,20,20);
			}
		/*
		
		if (typeof this.map.location === 'undefined'){}
		else{
			console.log(this.map.location);
			for(let i=0;i<this.map.location.length;i+=1){
				let val = this.map.location[i];
				noStroke();
	          	fill(200, 0, 200,50);
				ellipse(val.position.x,val.position.y,val.diameter,val.diameter);
			}
		}
		*/
	}
}

function RECORD(){
  this.history = [];
  this.upload = false;
  //this.exportstamp = 0;
  this.mode = 0;

  this.move = function(dot){
    //console.log(dot.x);
    if (this.history.length === 0){
      this.history.push({
        positionx: dot.x,
        positiony: dot.y,
        action:"move",
        //timestamp:millis()
      });
      //console.log(this.history[0].timestamp);
    }else{
      //let ms = this.history[this.history.length-1].timestamp;
      //console.log(this.history.length);
      //if (millis()-ms > 300){

        this.history.push({
          positionx: dot.x,
          positiony: dot.y,
          action:"move",
          //timestamp:millis()
        });

      //}
    }
    //console.log(this.history.length);
  };
  this.display = function(dot){

      for (let i=0;i<this.history.length;i+=1) {
          noStroke();
          fill(200, 0, 200,50);
          ellipse(this.history[i].positionx, this.history[i].positiony, 20, 20);
          //console.log('a');
          if (i>0){
            
            strokeWeight(5);
            stroke(200,0,200,50);
            line(this.history[i].positionx, this.history[i].positiony,this.history[i-1].positionx, this.history[i-1].positiony);
            
          }
      }
    //text
    noStroke();
    fill(0);
    text('按下 B 切換模式', 100,  730);
    fill(180,50,50);
    switch (this.mode){
    	case 0:
  			text('目前模式：實時操作', 100,  760);
  			text('請挪動左類比搖桿，觀察手臂與游標的關係', 150,  790);
  			break;
  		case 1:
  			text('目前模式：規劃操作', 100,  760);
  			text('請挪動左類比搖桿', 150,  790);
  			text('點擊 A 規劃點位，點擊 Y 執行路徑', 150,  820);
  			break;
    }

    if (millis()%1000<100){
    	//console.log(dot.x);
    	if (this.mode===0){
    		//執行upload
    		/*
    		let psstr = dot.x+','+dot.y+',0,0';
	    		let exportout = {
	                  data: psstr,
	                  sheetUrl: 'https://docs.google.com/spreadsheets/d/108xNAjSV8PCimIzfbbyYG2FrsNYRVl64vfxrwd-omCg/edit?usp=sharing',
	                  sheetTag: '手臂位置'
	          	};
	    		$.get(exeurl, exportout);
    		
    		
			*/
		}
    }
  }
  this.export = function(){
    if (this.upload){
      alert('uploaded!!');
      this.upload = false;
      //this.exportstamp = millis();
    }else{

      //if (millis()-this.exportstamp > 300){
        let psjson ={};
          let psstr = "";

          for (let i=0;i<this.history.length;i+=1) {
            
            if (i!=this.history.length-1){
              psstr+=this.history[i].positionx+","+this.history[i].positiony+","+this.mode+",1;"
            }else{
            	psstr+= this.history[i].positionx+","+this.history[i].positiony+","+this.mode+',0';
            }
          }
          //print(psstr);
          // 輸出到spreadsheet
          /*
          var exportout = {
                  data: psstr,
                  sheetUrl: 'https://docs.google.com/spreadsheets/d/108xNAjSV8PCimIzfbbyYG2FrsNYRVl64vfxrwd-omCg/edit?usp=sharing',
	              sheetTag: '手臂位置'
          };
          $.get(exeurl, exportout);
          */
          alert('請觀察手臂運動');
          this.history = [];
     //}

    }
  }
}