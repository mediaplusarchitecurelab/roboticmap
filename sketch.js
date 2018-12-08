
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



const ssurlp = 'https://spreadsheets.google.com/feeds/list/1-StkrwSEzLoA5s3AlcRp0RGJlSyU4_uwf4sz9fOB2yE/4/public/values?alt=json';
const ssurlloc = 'https://spreadsheets.google.com/feeds/list/1-StkrwSEzLoA5s3AlcRp0RGJlSyU4_uwf4sz9fOB2yE/2/public/values?alt=json';
const ssurllocmap = 'https://spreadsheets.google.com/feeds/list/1-StkrwSEzLoA5s3AlcRp0RGJlSyU4_uwf4sz9fOB2yE/3/public/values?alt=json';

const exeurl = 'https://script.google.com/macros/s/AKfycbxCm1DwMr4aguILPVMg9-L9Wh5GPT2JijZE_Fe2JDnbFaL6kuE/exec';
const bgpath = 'assets/img/bg.jpg';

const dot = new DOT(400,300);
const recording = new RECORD();
const layout = new LAYOUT();

var canv;

var timestamp=0;
var basemap={};
//var locmap=[];





// gui params
var numShapes = 20;
var strokeWidth = 4;
var strokeColor = '#00ddff';
var fillColor = [180, 255, 255];
var drawStroke = true;
var drawFill = true;
var radius = 20;
var shape = ['circle', 'triangle', 'square', 'pentagon', 'star'];
var label = 'label';
// gui
var visible = true;
var gui, gui2;
// dynamic parameters
var bigRadius;

var selecteditem=false;
var overloc=false;

var exportval='';

var feedback='';

var locstate =[];
var loccountry =[];
var locplace =[];
var img;

function encodelocmap(data){
      let vs = [];

      for (let i = 0; i < data.feed.entry.length; i+=1) {
        let val=[]
        let vlist = data.feed.entry[i].content.$t.split(',');
        //console.log(vlist.length);
        for(let j=0; j<vlist.length; j+=1){
            let v=vlist[j];
            val.push(int(v.split(': ')[1]));
        }
        vs.push(val);
      }
      //console.log(vs);
      //pmap=vs;
      basemap.locationmap=vs;
}

function encodeloc(data){
      let vallocnum = [];

  		for (let i = 0; i < data.feed.entry.length; i+=1) {
        let v= data.feed.entry[i];
        // state
        if (typeof v.gsx$洲 === 'undefined' || v.gsx$洲 === null){
        }else{
          //console.log(v.gsx$洲.$t);
          locstate.push(v.gsx$洲.$t);
        }
        // country
        if (typeof v.gsx$國 === 'undefined' || v.gsx$國 === null){
        }else{
          loccountry.push(v.gsx$國.$t);
        }
        // place
        if (typeof v.gsx$地點 === 'undefined' || v.gsx$地點 === null){
        }else{
          locplace.push(v.gsx$地點.$t);
        }
        // number
        if (typeof v.gsx$地點編號 === 'undefined' || v.gsx$地點編號 === null){
        }else{
          let vallist = v.gsx$地點編號.$t.split(';');
          //console.log(v.gsx$地點紅.$t);
          vallist.forEach(function(vv,ii){
            let val={
                "locnum": int(vv),
                "r": int(v.gsx$地點紅.$t),
                "g": int(v.gsx$地點綠.$t),
                "b": int(v.gsx$地點藍.$t)
              };
              vallocnum.push(val);
            });
        }
  		}
      //locmap=vs;
  		basemap.location=vallocnum;
}

function encodep(data){
  		let vs = [];

  		for (let i = 0; i < data.feed.entry.length; i+=1) {
  			let r=[     data.feed.entry[i].gsx$可以前往1.$t,
                    data.feed.entry[i].gsx$可以前往2.$t,
                    data.feed.entry[i].gsx$可以前往3.$t,
                    data.feed.entry[i].gsx$可以前往4.$t,
                    data.feed.entry[i].gsx$可以前往5.$t,
                    data.feed.entry[i].gsx$不可前往1.$t,
                    data.feed.entry[i].gsx$不可前往2.$t,
                    data.feed.entry[i].gsx$不可前往3.$t,
                    data.feed.entry[i].gsx$不可前往4.$t,
                    data.feed.entry[i].gsx$不可前往5.$t];
        let okr=[];
        let nr=[];
        r.forEach(function (v,i){
          let val=v.split(';');
          let num = val[0].split(',');
          if (i<5){
            num.forEach(function (vv,ii){
                okr.push({
                  "number":vv,
                  "reason":val[1]
                });
            });
            
          }else{

            num.forEach(function (vv,ii){
                nr.push({
                  "number":vv,
                  "reason":val[1]
                });
            });
          }
        });

    		let  v= {	  "id": int(data.feed.entry[i].gsx$瑞安編號.$t),
    					      "behavior": data.feed.entry[i].gsx$屬性.$t,
                		"okrule": okr,
                    "nonokrule": nr,
                		"currentX": int(data.feed.entry[i].gsx$索引橫.$t),
                    "currentY": int(data.feed.entry[i].gsx$索引直.$t),
                		"pic": data.feed.entry[i].gsx$圖片.$t
            		};

    		vs.push(v);
  		}
      //pmap=vs;
  		basemap.person=vs;
}

function preload() {
  
  loadJSON(ssurlloc, encodeloc);
  loadJSON(ssurlp, encodep);
  loadJSON(ssurllocmap, encodelocmap);
}


function setup() {
  //imageMode(CENTER);
  createCanvas(1200,900);
  // after loading
  layout.setbg(loadImage(bgpath));
  layout.setmap(basemap);

  textAlign(LEFT,CENTER);
  ellipseMode(CENTER);
  // Calculate big radius
  bigRadius = height / 3.0;
/*
  // Create Layout GUI
  gui = createGui('P5 GUI');
  gui.addGlobals('numShapes', 'bigRadius', 'shape', 'label', 'radius',
  'drawFill', 'fillColor', 'drawStroke', 'strokeColor', 'strokeWidth');
*/
}

function draw() {

  let buttonCount = 0;
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

function mouseReleased(){
  if (selecteditem.type === 'PERSON'){

    if (overloc){
      //console.log(overloc);
      selecteditem.setLocid(overloc);
    }else{
      //console.log('dd');
    }
  }
  selecteditem=false;
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
    /*
    noStroke();
    fill(200, 0, 0);
    ellipse(this.x, this.y, this.diameter, this.diameter);
    */
  }
}
/*
function LOCMAP(map){
  this.map=map;
  
  this.display = function(){
      for(let i=0;i<this.map.length;i+=1){
        for(let j=0;j<this.map[i].length;j+=1){

        }
      }
  }

}
*/
function LOCDOT(xid,yid,st,w=15,h=15,c=color(100,100,100,100),ls='',lc='',lp=''){
  this.xid=xid;
  this.yid=yid;
  this.status=st;

  this.w= w;
  this.h= h;
  this.d= this.h*0.8;
  this.colordot=c;

  this.x=(this.xid+0.5)*this.w;
  this.y=(this.yid+0.5)*this.h;
  this.lux=this.x-(this.w/2);
  this.luy=this.y-(this.h/2);

  this.state=ls;
  this.country=lc;
  this.place=lp;

  this.over=false;
  //this.status=0;
  //console.log('a');
  
  this.setW=function(w){
    this.w=w;
    this.d=this.w*0.8;
    this.x=(this.xid+0.5)*this.w;
    this.lux=this.x-(this.w/2);
  }
  this.setH=function(h){
    this.w=h;
    this.y=(this.yid+0.5)*this.h;
    this.luy=this.y-(this.h/2);
  }
  this.setD=function(d){
    this.d=d;
  }
  this.setC=function(c){
    this.colordot=c;
  }
  this.setdesc=function(ls,lc,lp){
    this.state=ls;
    this.country=lc;
    this.place=lp;
  }
  /* 
    status = 0 >>   不出現
    status = 1-9 >> 地點
    status > 10 >>  上有人
    
  */
  this.locmapEvent = function(st){
    if (st === 0){}
    else{
      this.over = collidePointRect(mouseX,mouseY,this.lux,this.luy,this.w, this.h);
      fill(0);
      if (this.over){
        overloc=this; 
        text(this.state+'-'+this.country+'-'+this.place, this.x,this.y+this.d);
        noStroke();
        fill(50, 0, 50,225);
            
      }else{
        //text(this.descript, this.x+this.diameter,  this.y-(this.diameter/2));

        noStroke();
        fill(this.colordot);
        /*
        switch (this.status){
          case 1:
            fill(200, 200, 0,100);
            break;
          case 2:
            fill(200, 0, 200,100);
            break;
          case 3:
            fill(100, 0, 200,100);
            break;
          case 4:
            fill(200, 100, 0,100);
            break;
          case 5:
            fill(100, 0, 100,100);
            break;
          case 6:
            fill(200, 0, 0,100);
            break;
          case 7:
            fill(0, 0, 200,100);
            break;
          default:
            fill(200, 200, 200,100);
            break;
        }
        */
      }
      ellipse(this.x,this.y,this.d,this.d);
    }
  }

  this.display = function(){
    this.locmapEvent(this.status);
    
  }

}

function PERSON(linklocdot){
  this.type='PERSON';
  this.layout=layout;
  this.linklocdot=linklocdot;
  //console.log(locmap);
  this.x = this.linklocdot.x;
  this.y = this.linklocdot.y;

  this.diameter = 30;
  this.diametertol = 15;

  this.over=false;
  this.selected=false;
  this.id=0;
  this.behavior='';
  this.rule={};
  this.pic='';
  this.printoutdata='';

  this.setRule = function(okrule,nonokrule){
    this.rule.okrule=okrule;
    this.rule.nonokrule=nonokrule;
  }
  this.setId = function(id){
    this.id=id;
  }

  this.checkmove = function(linklocdot){

    
    return str;
  }


  this.setLocid = function(linklocdot){
    let str='';
    // old
    this.printoutdata= this.linklocdot.x + ',' + this.linklocdot.y+ ',';
    console.log(linklocdot.status);
    if (int(linklocdot.status)===8000){
        str = this.behavior + ' 不可前往海洋';
        this.x = this.linklocdot.x;
        this.y = this.linklocdot.y;
    }else{
    
        let movecheck = true;
        
        for (let i = 0;i<this.rule.nonokrule.length;i+=1){
          let valr = this.rule.nonokrule[i];
          //console.log(valr);
          //console.log(linklocdot.status);

          if ( int(valr.number) === int(linklocdot.status)){
            str = this.behavior + ' 不可前往 ' + linklocdot.state + '-' + linklocdot.country + '-'  + linklocdot.place + '\n' + valr.reason;
            movecheck = false;
            this.x = this.linklocdot.x;
            this.y = this.linklocdot.y;
            break;
          }
        }
        // 若可前進

        if (movecheck){ 
          str = this.behavior + ' 將前往 ' + linklocdot.state + '-' + linklocdot.country + '-'  + linklocdot.place + '\n';

          for (let i = 0;i<this.rule.nonokrule.length;i+=1){

            let valr = this.rule.okrule[i];

            if ( int(valr.number) === int(linklocdot.status)){
              console.log(valr.reason);
              str = this.behavior + ' 將前往 ' + linklocdot.state + '-' + linklocdot.country + '-'  + linklocdot.place + '\n' + valr.reason;
              movecheck = true;

            }
          }
          //console.log('a');
          
          // new
          this.linklocdot=linklocdot;
          this.x = this.linklocdot.x;
          this.y = this.linklocdot.y;
          this.printoutdata+= this.x + ',' + this.y;
          // 輸出到spreadsheet   
              var exportout = {
                      data: this.printoutdata,
                      sheetUrl: 'https://docs.google.com/spreadsheets/d/1K2TH2v8jS_jixtg_2Z-Lm6VMTd7RujcplWWi9t624Ac/edit?usp=sharing',
                    sheetTag: 'action'
              };
              $.get(exeurl, exportout);
        }
    }
    alert(str);

 /*   
    console.log(this.rule);

    this.locid=locid;
    this.x = this.locmap.location[this.locid].position.x;
    this.y = this.locmap.location[this.locid].position.y;
*/
  //console.log(overloc.x+','+overloc.y);
  }
  this.setBehavior = function(be){
    this.behavior=be;
  }
  this.setPic = function(pic){
    this.pic=pic;
  }
  this.mosueEvent = function(){
    this.over = collidePointCircle(mouseX,mouseY,this.x,this.y,this.diameter+this.diametertol);

    if (this.over){
      image(this.pic,20,620,240,240);
      noStroke();
      fill(200, 0, 0);
      text(this.behavior, this.x,  this.y-this.diameter);
      this.diametertol = 8;
      if (mouseIsPressed){
        this.x=mouseX;
        this.y=mouseY;
        selecteditem=this;  
      }
    }else{
      noStroke();
      fill(50, 50, 50);
      this.diametertol = 0;
    }
  }

  this.display = function(){
    this.mosueEvent();
    
    ellipse(this.x, this.y, this.diameter+this.diametertol, this.diameter+this.diametertol);
  }
}

function LAYOUT(){
  this.bg;
  this.map={};
  this.pmap=[];
  this.locmap=[];
  this.xbound=1;
  this.ybound=1;
  this.locw=1;
  this.loch=1;

  this.setbg=function(bg){
    this.bg=bg;
  }

  this.setmap=function(map){
    this.map=map;
    // LOCATION
    /*
    for(let i=0;i<this.map.location.length;i+=1){

        let val = new LOCATION(i,this.map);
        val.setDiameter(this.map.location[i].diameter);
        val.setPic(this.map.location[i].pic);
        
        this.locmap.push(val);
    }
    */
    // LOCATIONMAP
    this.ybound = this.map.locationmap.length;
    this.loch = height/this.ybound;
    this.xbound = this.map.locationmap[0].length;
    this.locw = width/this.xbound;

    for(let i=0;i<this.ybound;i+=1){
        
        for(let j=0;j<this.xbound;j+=1){
          let locn = map.locationmap[i][j];
          //console.log(int(locn/10)%100);
          this.locmap.push(new LOCDOT(j,i,locn,this.locw,this.loch,this.getColor(locn),locstate[int(locn/1000)-1],loccountry[int(locn/10)%100-1],locplace[int(locn)%10]));
        }
    }
    // PERSON
    for(let i=0;i<this.map.person.length;i+=1){
        let locidx = int(this.map.person[i].currentX);
        let locidy = int(this.map.person[i].currentY);
        //console.log(this.locmap[locidx+this.xbound*locidy]);
        

        let val = new PERSON(this.locmap[locidx+this.xbound*locidy]);
        val.setRule( this.map.person[i].okrule, this.map.person[i].nonokrule);
        val.setId(this.map.person[i].id);
        val.setBehavior(this.map.person[i].behavior);

        pimg= loadImage(this.map.person[i].pic); 

        val.setPic(pimg);

        
        this.pmap.push(val);
    }
  }
  this.getColor = function(locnum){
    let c = color(200,50,50,50);
    //console.log(this.map.location.locnum);
    for(let i=0;i<this.map.location.length;i+=1){
      let v = this.map.location[i];
      //console.log(locnum);
      if (int(v.locnum)===int(locnum)){
        c=color(v.r,v.g,v.b,50);
        break;
      }
    }
    return c;
  }

  this.getIndexlocdot =function(xid,yid){
    return this.locmap[xid+yid*xbound];
  }
  this.display =function(){
    background(225);
    for(let i=0;i<this.locmap.length;i+=1){
        let val = this.locmap[i];
        val.display();
      }
    
    for(let i=0;i<this.pmap.length;i+=1){
        let val = this.pmap[i];
        val.display();
      }
    fill(50);
    text('超完美工作機器人-瑞安，\n'+
         '於2013年被生產，\n'+
         '由於在人類世界工作大不易，\n'+
         '因此開始拓展地域版圖，\n'+
         '開啟隱藏版功能，成為現今多款機型。\n'+
         '看更多5分鐘介紹影片\n\n'+
         'https://www.youtube.com/watch?v=nLAfAYSb66k', 920,  820);
    
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

    noStroke();
    fill(0);
    text(feedback, 100,  130);
/*
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
		}
    }
*/
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

/*

// check for keyboard events
function keyPressed() {
  switch(key) {
    // type [F1] to hide / show the GUI
    case 'p':
      visible = !visible;
      if(visible) gui.show(); else gui.hide();
      break;
  }
}


// draw a regular n-gon with n sides
function ngon(n, x, y, d) {
  beginShape();
  for(var i = 0; i < n; i++) {
    var angle = TWO_PI / n * i;
    var px = x + sin(angle) * d / 2;
    var py = y - cos(angle) * d / 2;
    vertex(px, py);
  }
  endShape(CLOSE);
}


// draw a regular n-pointed star
function star(n, x, y, d1, d2) {
  beginShape();
  for(var i = 0; i < 2 * n; i++) {
    var d = (i % 2 === 1) ? d1 : d2;
    var angle = PI / n * i;
    var px = x + sin(angle) * d / 2;
    var py = y - cos(angle) * d / 2;
    vertex(px, py);
  }
  endShape(CLOSE);
}

function LOCATION(id,locmap){
  this.type='LOCATION';
  this.id=id;
  this.locmap=locmap;
  //console.log(locmap);
  this.x = this.locmap.location[this.id].position.x;
  this.y = this.locmap.location[this.id].position.y;

  this.diameter = 15;

  this.over=false;
  this.descript = '';
  this.pic='';

  this.setDiameter = function(d){
    this.diameter=d;
  }
  this.setPic = function(pic){
    this.pic=pic;
  }
  this.setDescript = function(dis){
    this.descript=dis;
  }
  this.personEvent = function(){
    this.over = collidePointCircle(mouseX,mouseY,this.x,this.y,this.diameter);
    fill(0);
    if (this.over){
      text(this.descript, this.x+this.diameter,  this.y-(this.diameter/2));
      noStroke();
      fill(200, 200, 0,120);
      overloc=this;     
    }else{
      text(this.descript, this.x+this.diameter,  this.y-(this.diameter/2));
      noStroke();
      fill(200, 200, 0,30);
    }
    

    if (this.over){
      noStroke();
      fill(200, 0, 0);
      this.diametertol = 8;
      if (mouseIsPressed){
        this.x=mouseX;
        this.y=mouseY;
        selecteditem=this;  
      }
    }else{
      noStroke();
      fill(50, 50, 50);
      this.diametertol = 0;
    }
  }

  this.display = function(){
    this.personEvent();
    
    ellipse(this.x, this.y, this.diameter, this.diameter);
  }
}


*/