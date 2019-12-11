const TILE_SIZE = 60;
const MAP_SIZE = 10;
const MAP_AREA = MAP_SIZE * MAP_SIZE;
const BOMB_PRECENTAGE = 0.10;
/**
Bits
1: hidden
2: Safe Bit
3: BOMB bit
4-7: nearby bombs
 */
const HIDDEN_BIT = 0b0001;
const SAFE_BIT = 0b0010;
const BOMB_BIT = 0b0100;

const BOMB_NEARBY_MASK = 0b111000;

let BOMB_COLOR;
let SAFE_COLOR;
let WORD_COLOR;
let SELECT_COLOR;

let tileLocations = [];


function setup() 
{
   createCanvas(windowWidth, windowHeight);

   BOMB_COLOR = color(255, 0, 0);
   SAFE_COLOR = color(0, 255, 125);
   WORD_COLOR = color(55, 55, 55)
   SELECT_COLOR = color(15, 255, 22)
   HIDDEN_COLOR = color(150)

   //init map
   for(var x = 0; x < MAP_SIZE; x++)
   {
      row = [];
      for(var y = 0; y < MAP_SIZE; y++)
      {
         row.push(0 | HIDDEN_BIT)
      }
      tileLocations.push(row)
   }

   for(var i = 0; i < Math.ceil(MAP_AREA * BOMB_PRECENTAGE); i++)
   {
      let x =  Math.floor(Math.random() * MAP_SIZE);
      let y = Math.floor(Math.random() * MAP_SIZE);
      var currentTile = getTile(x, y);
      setTile(x, y, currentTile | BOMB_BIT);
   }

   //Precalulate the bomb values
   for(var x = 0; x < MAP_SIZE; x++ )
   {
      for(var y = 0; y < MAP_SIZE; y++ )
      {
         var currentTile = getTile(x, y)

         setTile(x, y, currentTile | (nearbyBombCount(x, y) << 4))
      }
   }
   console.log(tileLocations)
}

/**
 * Called every frame
 */
function draw()
{
   // put drawing code here
   //Background (R, G, B)
   background(234, 180, 150);

   textAlign(CENTER, CENTER);

   

   for(var x = 0; x < MAP_SIZE; x++ )
      for(var y = 0; y < MAP_SIZE; y++ )
      {
         // fill(BOMB_COLOR)
         fill(SAFE_COLOR);
         if(isBomb(x, y))
            fill(BOMB_COLOR)
         if(isHidden(x, y))
            fill(HIDDEN_COLOR)
         
        
         if(mouseX < (x+1) * TILE_SIZE && mouseX > (x) * TILE_SIZE
         && mouseY < (y+1) * TILE_SIZE && mouseY > (y) * TILE_SIZE)
         {
            if(mouseIsPressed)
            {
               fill(SELECT_COLOR)
               var currentTile = getTile(x, y)
               setTile(x, y, currentTile & ~HIDDEN_BIT)
               console.log("Updated bit " + getTile(x, y) )
            }
         }

         rect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
         if(!isHidden(x, y) && !isBomb(x, y))
         {
            var currentTile = getTile(x, y)
            var bombCount = (currentTile & BOMB_NEARBY_MASK) >> 4;
            fill(WORD_COLOR)
            text(bombCount, x * TILE_SIZE + (TILE_SIZE/2), y * TILE_SIZE + TILE_SIZE - (TILE_SIZE/2) );
         }
      }
      text(mouseX + " " + mouseY, 50, 50);
}

function windowResized() {
   resizeCanvas(windowWidth, windowHeight);
}

/*
======================================
   FUNCTIONS USED BY THE GAME
======================================
*/

function nearbyBombCount(x, y)
{
   var bombCount = 0;
   for(var offsetX = -1; offsetX < 2; offsetX++)
      for(var offsetY = -1; offsetY < 2; offsetY++)
      {
         //if not the position it's self
         if(offsetX == 0 && offsetY == 0)
            continue;
         if(isBomb(x + offsetX, y + offsetY))
         {
            bombCount++; 
         }
      }
   return bombCount;
}


function setTile(x, y, value)
{
   return tileLocations[y][x] = value;
}

function getTile(x, y)
{
   var row = tileLocations[y];
   if(row == undefined) return null;
   return row[x];
}

function isBomb(x, y)
{
   return this.getTile(x, y) & BOMB_BIT;
}

function isSafe(x, y)
{
   return this.getTile(x, y) & SAFE_BIT;
}

function isHidden(x, y)
{
   return (this.getTile(x, y) & HIDDEN_BIT);
}

function comboUncover(x, y)
{
   for(var offsetX = -1; offsetX < 2; offsetX++)
   for(var offsetY = -1; offsetY < 2; offsetY++)
   {
      //if not the position it's self
      if(offsetX == 0 && offsetY == 0)
         continue;
      if(isBomb(x + offsetX, y + offsetY))
      {
         bombCount++; 
      }
   }
}