var EarthButtons = []; //these could really be in one array and then parsed after because they have the map they belong to in them, oh well
var CustomButtons = []; //really wouldn't want to have them all available, would just want the active maps buttons available, another reason to keep it to one array that I can empty and refill
var EarthArmies = []; //since it's just getting going hardcoded arrays
var CustomArmies = [];
var activemap = "none";
var readytodraw = false;
var buttonActive = false;

function Button(id, x, y, map, connections, player) {
    this.thevalue = id;
    this.id = map[0] + id;
    this.x = x;
    this.y = y;
    this.h = 20;
    this.w = 40;
    this.map = map;
    this.connections = connections;
    this.text = "Attack " + id;
    this.active = true;
    this.selected = false;
    this.player = player;
}

function Armies(id, player) {
    this.id = id;
    this.value = 10;
    this.player = player;
}

Armies.prototype.dec = function () {
    this.value -= 1;
}

Armies.prototype.print = function () {
    var canvas = document.getElementById("can");
    var ctx = canvas.getContext("2d");
    var btn;

    //which set of array to look in, if there was one array this wouldn't be necesary
    if (activemap == "earth") {
        //have to loop through all the buttons in array to find the one that has the same id as the army id
        for (var i = 0; i < EarthButtons.length; i++) {
            if (this.id == EarthButtons[i].id) {
                btn = EarthButtons[i];
                break;
            }
        }
    }
    else {
        for (var i = 0; i < CustomButtons.length; i++) {
            if (this.id == CustomButtons[i].id) {
                btn = CustomButtons[i];
                break;
            }
        }
    }

    var x = btn.x + 2;
    var y = btn.y + 30;
    var x2 = btn.x + 2 + (this.value.toString().length * 7)

    if (this.id == "e4") {
        y = btn.y - 10;
    }

    //now i have the button, print the stuff under the button stuff
    ctx.beginPath();
    ctx.strokeText(this.value, x, y); //under button
    ctx.strokeText(this.player, x2, y);
    ctx.closePath();


}

Button.prototype.clicked = function () {
    var x = (event.x) ? event.x : event.clientX;
    var y = (event.y) ? event.y : event.clientY;
    var canvas = document.getElementById("can");
    return (x >= this.x + canvas.offsetLeft && x <= this.x + this.w+15 + canvas.offsetLeft && y >= this.y + canvas.offsetTop && y <= this.y + this.h + canvas.offsetTop);
}

Button.prototype.draw = function () {

    if (!this.active) {
        return;
    }

    var can = document.getElementById("can");
    var ctx = can.getContext("2d");

    var army;

    if (this.map == "earth") {
        //have to loop through all the buttons in array to find the one that has the same id as the army id
        for (var i = 0; i < EarthArmies.length; i++) {
            if (this.id == EarthArmies[i].id) {
                army = EarthArmies[i];
                break;
            }
        }
    }
    else {
        for (var i = 0; i < CustomArmies.length; i++) {
            if (this.id == CustomArmies[i].id) {
                army = CustomArmies[i];
                break;
            }
        }
    }

    ctx.beginPath();

    ctx.rect(this.x, this.y, this.w + 15, this.h);
    ctx.stroke();
    ctx.strokeText(this.text, this.x + 2, this.y + 10);
    army.print();
    ctx.closePath();
}

Button.prototype.onclick = function () {
    //unselecting button, reset text and selections
    if ((this.selected) && (this.text == "Chosen")) {
        this.text = "Attack " + this.id;
        this.selected = false;
        buttonActive = false;
        for (var ii = 0; ii < CustomButtons.length; ii++) {
            CustomButtons[ii].active = true;
        }
        for (var ii = 0; ii < EarthButtons.length; ii++) {
            EarthButtons[ii].active = true;
        }
    }
    else { //this chunk says that this is the chose button, if it's the chosen button follow the map and disable all buttons except connections that are stored in the object
        if (buttonActive == false) { //this makes sure that you can't select another button while one is active. if one is already active though then treat it like an attack
            this.text = "Chosen";
            buttonActive = true;


            for (var i = 0; i < EarthButtons.length; i++) { //run through and disable all except current. not efficient but a start
                EarthButtons[i].active = false;

                if (this.map == "earth") {
                    if (activemap == "earth") { //just making sure the current button and map match to know which set to modify 
                        //have to compare the id value to the connection value, not the index

                        if (this.connections.indexOf(EarthButtons[i].thevalue * 1) > -1) { //index based derp, *1 to convert to int instead of string
                            EarthButtons[i].active = true;
                        }

                    }

                }

            }

            for (var i = 0; i < CustomButtons.length; i++) {
                CustomButtons[i].active = false;

                if (this.map == "custom") {
                    if (activemap == "custom") { //just making sure the current button and map match to know which set to modify 
                        //have to compare the id value to the connection value, not the index

                        if (this.connections.indexOf(CustomButtons[i].thevalue * 1) > -1) { //index based derp, *1 to convert to int instead of string
                            CustomButtons[i].active = true;
                        }

                    }

                }

            }

            this.active = true; //reactivate current and all that are connections, this hase to be at the bottom because the loops disable it. fun little fact
        }
        else { //there was already one active so this must be an attack
            var enemyarmy;
            var myarmy;

            //the army length and the button length are the same or this wouldn't work, need a better way to relate them
            //right now a 'button' is the land mass so that should really be able to hold the army object too
            if (this.map == "earth") {
                for (var i = 0; i < EarthArmies.length; i++) {
                    if (this.id == EarthArmies[i].id) {
                        enemyarmy = EarthArmies[i];
                    }

                    //button.selected is only for the one that was clicked. won't be available so only using text
                    if (EarthButtons[i].text == "Chosen") {
                        myarmy = EarthArmies[i];
                    }

                }
            }
            else {
                for (var i = 0; i < CustomArmies.length; i++) {
                    if (this.id == CustomArmies[i].id) {
                        enemyarmy = CustomArmies[i];
                    }

                    if (CustomButtons[i].text == "Chosen") {
                        myarmy = CustomArmies[i];
                    }
                }
            }

            if (myarmy.player == enemyarmy.player) {
                //don't let it attack yourself
                return;
            }

            if (myarmy.value > 2) { 
                //need a rng here (among other things)
                enemyarmy.dec();
            }

            if (enemyarmy.value < 1){
                enemyarmy.player = myarmy.player;
                myarmy.dec();
                enemyarmy.value = 1;
            }
            

        }

    }

}

function ClearCanvas() {
    var canvas = document.getElementById("can");
    var ctx = canvas.getContext("2d");

    ctx.save();

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.restore();
}

function DrawAll() {
    var canvas = document.getElementById("can");
    var ctx = canvas.getContext("2d");
    readytodraw = false;

    if (activemap == "earth") {
        var img = new Image();

        img.onload = function () {
            ctx.drawImage(img, 0, 0, 600, 600);

            for (var i = 0; i < EarthButtons.length; i++) {
                EarthButtons[i].draw();
            }
        }
        img.src = "Images/earthmap.jpg";

    }

    else if (activemap == "custom") {
        var img = new Image();
        
        img.onload = function () {
            ctx.drawImage(img, 0, 0, 600, 600);

            for (var i = 0; i < CustomButtons.length; i++) {
                CustomButtons[i].draw();
            }
        }
        img.src = "Images/custommap.jpg";

    }

}

function MouseDown(e) {

    if (activemap == "earth") { 
        for (var i = 0; i < EarthButtons.length; i++) {
            var button = EarthButtons[i];
            if (button.clicked()) { //have to put in another check for if it's already the selected button another click puts it back
                button.selected = true;
                button.onclick();
            }
            else {
                button.selected = false;
            }
        }

    }
    else if (activemap == "custom"){
         for (var i = 0; i < CustomButtons.length; i++) {
             var button = CustomButtons[i];
             if (button.clicked()) { //have to put in another check for if it's already the selected button another click puts it back
                 button.selected = true;
                 button.onclick();
             }
             else {
                 button.selected = false;
             }
        }
     }

 }

 function MouseUp(e) {
     ClearCanvas();
     DrawAll();

 }

 function Reset() {
     for (var i = 0; i < EarthButtons.length; i++) {
         EarthButtons[i].active = true;
         EarthButtons[i].selected = false;
         EarthButtons[i].text = "Attack " + EarthButtons[i].id;
     }
     for (var i = 0; i < CustomButtons.length; i++) {
         CustomButtons[i].active = true;
         CustomButtons[i].selected = false;
         CustomButtons[i].text = "Attack " + CustomButtons[i].id;
     }
     buttonActive = false;

 }

function ClickEarth() {
  
    activemap = "earth";
    Reset();

    ClearCanvas();
    DrawAll();
}

function ClickCustom() {
    
    activemap = "custom";
    Reset();

    ClearCanvas();
    DrawAll();
}

function f() {
   //to start hardcoded button positions, all hardcoded but later would want hitbox on whole image
    var e1 = new Button("1", 230, 50, "earth", [2, 3, 4], "blue");
    var e2 = new Button("2", 140, 240, "earth", [1 ,3 ,5], "red");
    var e3 = new Button("3", 330, 260, "earth", [1,2,5,6,7], "yellow");
    var e4 = new Button("4", 475, 235, "earth", [1,7], "blue");
    var e5 = new Button("5", 170, 430, "earth", [2,3], "red");
    var e6 = new Button("6", 390, 460, "earth", [3,7], "green");
    var e7 = new Button("7", 465, 375, "earth", [3,4,6], "yellow");

    var c1 = new Button("1", 30, 10, "custom", [2, 4], "red");
    var c2 = new Button("2", 290, 10, "custom", [1, 3, 5, 6], "red");
    var c3 = new Button("3", 500, 10, "custom", [2, 6], "blue");
    var c4 = new Button("4", 40, 225, "custom", [1, 5, 7], "blue");
    var c5 = new Button("5", 250, 275, "custom", [2,4,6,8,9],"green");
    var c6 = new Button("6", 420, 240, "custom", [2,3,5,9,10], "red");
    var c7 = new Button("7", 20, 440, "custom", [4, 8], "blue");
    var c8 = new Button("8", 180, 440, "custom", [5, 7, 9], "yellow");
    var c9 = new Button("9", 340, 440, "custom", [5, 6, 8, 10], "yellow");
    var c10 = new Button("10", 530, 440, "custom", [6, 9], "green");

    EarthButtons.push(e1);
    EarthButtons.push(e2);
    EarthButtons.push(e3);
    EarthButtons.push(e4);
    EarthButtons.push(e5);
    EarthButtons.push(e6);
    EarthButtons.push(e7);

    CustomButtons.push(c1);
    CustomButtons.push(c2);
    CustomButtons.push(c3);
    CustomButtons.push(c4);
    CustomButtons.push(c5);
    CustomButtons.push(c6);
    CustomButtons.push(c7);
    CustomButtons.push(c8);
    CustomButtons.push(c9);
    CustomButtons.push(c10);

    //hardcoded player info
    //separate armies as there as different numbers of places
    var ca1 = new Armies(c1.id, c1.player);
    var ca2 = new Armies(c2.id, c2.player);
    var ca3 = new Armies(c3.id, c3.player);
    var ca4 = new Armies(c4.id, c4.player);
    var ca5 = new Armies(c5.id, c5.player);
    var ca6 = new Armies(c6.id, c6.player);
    var ca7 = new Armies(c7.id, c7.player);
    var ca8 = new Armies(c8.id, c8.player);
    var ca9 = new Armies(c9.id, c9.player);
    var ca10 = new Armies(c10.id, c10.player);

    var ea1 = new Armies(e1.id, e1.player);
    var ea2 = new Armies(e2.id, e2.player);
    var ea3 = new Armies(e3.id, e3.player);
    var ea4 = new Armies(e4.id, e4.player);
    var ea5 = new Armies(e5.id, e5.player);
    var ea6 = new Armies(e6.id, e6.player);
    var ea7 = new Armies(e7.id, e7.player);

    EarthArmies.push(ea1);
    EarthArmies.push(ea2);
    EarthArmies.push(ea3);
    EarthArmies.push(ea4);
    EarthArmies.push(ea5);
    EarthArmies.push(ea6);
    EarthArmies.push(ea7);

    CustomArmies.push(ca1);
    CustomArmies.push(ca2);
    CustomArmies.push(ca3);
    CustomArmies.push(ca4);
    CustomArmies.push(ca5);
    CustomArmies.push(ca6);
    CustomArmies.push(ca7);
    CustomArmies.push(ca8);
    CustomArmies.push(ca9);
    CustomArmies.push(ca10);
        
    var can = document.getElementById("can");
    can.onmousedown = MouseDown;
    can.onmouseup = MouseUp;

}