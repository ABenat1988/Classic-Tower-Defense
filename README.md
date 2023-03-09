

# PROJECT IRONHACK | TOWER DEFENSE


## Introduction

this game has been created for the first project of IronHack WebDev Bootcamp (week 3).
this a classic Tower defense made in JS,CSS, HTML
<br><br>
- - - -
## game's operation
<br>
### goal
you need to surive to 15 waves of ennemy.

each ennemy who arrives at the end of the path makes damages.
**if your life reach 0, you die.**


**nb**: to restart the game, you need to load the index.html page (no back button on victory and defeat pages)

<br><br>

### ennemy

| Ennemy | life | damage | value |
| ------------- | ------------- | ------------- | ------------- |
| ![](./images/enemi-soldier-bg.png) | 5 | 1 | 10 |
| ![](./images/enemi-tank-bg.png) | 20 | 2 | 30 |
| ![](./images/enemi-boss-bg.png) | 15 | 5 | 40 |

<br><br>

### tower

| tower | range | damage | value | rate of fire
| ------------- | ------------- | ------------- | ------------- | ------------- |
| ![](./images/tower-animated.gif) | 5 | 1 | 50 | 10 |


<br><br><br>
- - - -
## main Class
<br><br>
**Game**
<br><br>
**Map**

list of Properties 

 * wayPoint _(needs to be given)_
    * Array of object that list all point where ennemies will have to change direction
        * X coordinate
        * Y coordinate
        * new direction for the ennemy
    * the spawn and end for the path are included
 * towerspot _(needs to be given)_
    * Array of object that list all point wher a tower can be place
        * X coordinate
        * Y coordinate
 * waveslist _(needs to be given)_
    * nested Arrays that store the content of each wave. each array is one wave. 
    * 2 values are stored:
        * number: time (in millesecond) before the next ennemy
        * string: type ennemy that needs to be created (soldier, tank or boss)
 * squareDimension _(needs to be given)_
    * size (in px) of one square in the map
 * numberSquareHeigth _(needs to be given)_
    * number of squares that composes the height of the map
 * numberSquareWidth _(needs to be given)_
    * number of squares that composes the width of the map

list of methods

* createDomElementMap
    * size (in px) the div that will contain the map, based on **numberSquareHeigth**, **numberSquareWidth** and **squareDimension**
* createDomElementTowerSpot
    * create one div for each spot of tower and add the correct **left** and **bottom** values. Based on **towerspot** array

<br><br>
**Tower**

list of Properties

* power _(needs to be given)_
    * number of damage each projectile of that tower makes
* range _(needs to be given)_
    * distance under which a tower can reach an enemy (in square)
* positionX _(needs to be given)_
    * value in X axis where the tower will be place (at the creation of the object, the value is in square and is changed to pixel after)
    * that value refers to the center of the element
* positionY _(needs to be given)_
    * value in Y axis where the tower will be place (at the creation of the object, the value is in square and is changed to pixel after)
    * that value refers to the center of the element
* cost
    * the value that will be subtracted from the money of the player
* projectilesArray
    * array that will contain the projectile object the tower will shoot
* isTargetAcquired
    * boolean which indicates if the tower has a target or not
* target
    * refer to the ennemy object the tower has as target
* width
    * 
* towerElm


list of methods

* createDomElementTower
    * create a div for the tower and add the correct **left** and **bottom** values, based on **positionX** and **PositionY**
* shoot
    * create a new projectile object and add it on projectilesArray 
* setDamage
    * check if position of a projectile is equal to the position of the targeted ennemy. In that case, reduce health of the ennemy base on tower's damage
    * remove the current projectile from the tower's array and remove from the dom
        * **a test is made to make sure that the projectile has not been already removed**
    * test the health of the ennemy. In that case, add money based on ennemy's value, set alreadyDestroyed propertie (of the ennemy) to True. 
        * **a test is made to make sure that the ennemy is not already killed (and avoid give money multiple times)**
    * kill the rest of projectiles
    * remove the ennemy from the main ennemy's array and remove it from the dom
        * **a test is made to make sure that the ennemy has not been already removed**
* killCurrentProjectiles
    * remove other projectile of the array from the DOM and clean the array
<br><br>
**Monster**
<br><br>
**Projectile**
<br><br>
## code algorithm
## next features
## Credits & Resources