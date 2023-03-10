class Game {
    constructor(money, heart) {
        this.map = null;
        this.monsterArray = [];
        this.towerArray = [];
        this.money = money;
        this.heart = heart;
        this.waveCounter = 0;
    }

    start() {
        //creation of map object and stats values
        this.map = new Map(wayPointsLevel1, towerSpotLevel1, wavesLevel1, 32, 24, 40);
        this.updateBoardText("#coin span", this.money);
        this.updateBoardText("#heart span", this.heart);
        this.updateBoardText("#heart span", this.heart);
        this.updateBoardText("#current-wave", this.waveCounter);
        this.updateBoardText("#total-waves", this.map.waveslist.length);
    }
    launch() {
        //manage movement of monsters
        setInterval(() => {
            this.monsterArray.forEach((monsterElementInterval) => {
                monsterElementInterval.moveMonster();
                this.removeMonsterEndofWay(monsterElementInterval);
            });
        }, 20);

        //check distance between each tower & each monster
        setInterval(() => {
            this.towerArray.forEach((towerElementDistance) => {
                let distance = 0;
                if (towerElementDistance.isTargetAcquired === false) { //case tower without target
                    this.monsterArray.some((monsterElement) => { //test every monster, stop when target acquired
                        distance = Math.sqrt(Math.pow(monsterElement.positionX - towerElementDistance.positionX, 2) + Math.pow(monsterElement.positionY - towerElementDistance.positionY, 2));
                        if (distance <= towerElementDistance.range * this.map.squareDimension) {
                            towerElementDistance.isTargetAcquired = true;
                            towerElementDistance.target = monsterElement;
                            monsterElement.monsterElm.classList.add("targeted");
                            towerElementDistance.shoot();
                            return true;
                        }
                    });
                } else { //case tower with target
                    distance = Math.sqrt(Math.pow(towerElementDistance.target.positionX - towerElementDistance.positionX, 2) + Math.pow(towerElementDistance.target.positionY - towerElementDistance.positionY, 2));
                    if (distance > towerElementDistance.range * this.map.squareDimension) { //check if target out of range
                        towerElementDistance.target.monsterElm.classList.remove("targeted");
                        towerElementDistance.isTargetAcquired = false;
                        towerElementDistance.target = null;
                        towerElementDistance.killCurrentProjectiles();
                    } else {
                        towerElementDistance.shoot();
                    }
                }
            });
        }, 500);
        //manage movement of projectiles
        setInterval(() => {
            this.towerArray.forEach((towerElementMoveProjectile) => {
                towerElementMoveProjectile.projectilesArray.forEach((projectileElement) => {
                    if (projectileElement.target.positionX - projectileElement.positionX > 0) {
                        projectileElement.positionX++;
                    } else {
                        projectileElement.positionX--;
                    }
                    if (projectileElement.target.positionY - projectileElement.positionY > 0) {
                        projectileElement.positionY++;
                    } else {
                        projectileElement.positionY--;
                    }
                    projectileElement.projectileElm.style.bottom = projectileElement.positionY - projectileElement.width / 2 + "px";
                    projectileElement.projectileElm.style.left = projectileElement.positionX - projectileElement.width / 2 + "px";
                    towerElementMoveProjectile.setDamage(projectileElement);
                });
            });
        }, 5);
    }
    updateBoardText(target, value) {
        document.querySelector(target).innerText = value;
    }
    spendMoney(cost) {
        if (this.money - cost >= 0) {
            this.money -= cost;
            this.updateBoardText("#coin span", this.money)
            return true
        } else {
            return false;
        }
    }
    earnMoney(revenu) {
        this.money += revenu;
        this.updateBoardText("#coin span", this.money);
    }
    checkGameOver() {
        if (this.heart <= 0) {
            window.location.href = "./gameover.html";
        }
    }
    checkVictory() {
        if (this.waveCounter === game.map.waveslist.length && this.monsterArray.length === 0) {
            window.location.href = "./victory.html";
        }
    }
    increaseWave() {
        this.waveCounter++;
        this.updateBoardText("#wave-counter span", this.waveCounter);
    }
    createTower(event) {
        this.towerArray.push(new BlueTower(event.target.dataset.positionX, event.target.dataset.positionY));
    }
    removeMonsterEndofWay(monsterInstance) { //when monster arrive end of the way, remove life based on attack's monster and check Game Over
        if (this.map.wayPoint[this.map.wayPoint.length - 1].x * this.map.squareDimension + this.map.squareDimension / 2 === monsterInstance.positionX && this.map.wayPoint[this.map.wayPoint.length - 1].y * this.map.squareDimension + this.map.squareDimension / 2 === monsterInstance.positionY) {
            this.heart -= monsterInstance.attack;
            this.checkGameOver();
            this.updateBoardText("#heart span", this.heart);
            monsterInstance.monsterElm.remove();
            this.monsterArray.shift();
        }
    }
}

class Map {
    constructor(wayPoint, towerspot, waveslist, squareDimension, numberSquareHeigth, numberSquareWidth) {
        this.wayPoint = wayPoint;
        this.towerspot = towerspot;
        this.waveslist = waveslist;
        this.squareDimension = squareDimension;
        this.numberSquareHeigth = numberSquareHeigth;
        this.numberSquareWidth = numberSquareWidth;
        this.createDomElementMap();
        this.createDomElementTowerSpot();
    }
    createDomElementMap() {
        const mapDom = document.getElementById("map-area")
        mapDom.style.height = this.squareDimension * this.numberSquareHeigth + "px";
        mapDom.style.width = this.squareDimension * this.numberSquareWidth + "px";
    }
    createDomElementTowerSpot() {
        this.towerspot.forEach((element) => {
            const divTower = document.createElement('div');
            divTower.setAttribute("class", "spot");
            divTower.dataset.positionX = element.x;
            divTower.dataset.positionY = element.y;
            divTower.style.width = this.squareDimension * 2 + "px";
            divTower.style.height = this.squareDimension * 2 + "px";
            divTower.style.left = element.x * this.squareDimension + "px";
            divTower.style.bottom = element.y * this.squareDimension + "px";
            document.getElementById("tower-spots").appendChild(divTower);
        });
    }
}

class Monster {
    constructor(type, health, attack, revenu, width, positionX, positionY) {
        this.type = type;
        this.health = health;
        this.attack = attack;
        this.revenu = revenu;
        this.monsterElm = null;
        this.alreadyDestroyed = false;
        this.positionX = positionX * game.map.squareDimension + game.map.squareDimension / 2;
        this.positionY = positionY * game.map.squareDimension + game.map.squareDimension / 2;
        this.width = width;
        this.movementDirection = null;
        this.createDomElementMonster();
    }
    createDomElementMonster() {
        this.monsterElm = document.createElement('div');
        this.monsterElm.setAttribute("class", "monster");
        switch (this.type) {
            case 'soldier':
                this.monsterElm.setAttribute("class", "monster soldier");
                break;
            case 'tank':
                this.monsterElm.setAttribute("class", "monster tank");
                break;
            case 'boss':
                this.monsterElm.setAttribute("class", "monster boss");
                break;
            default:
                this.monsterElm.setAttribute("class", "error");
        }
        this.monsterElm.style.width = this.width + "px";
        this.monsterElm.style.height = this.width + "px";
        this.monsterElm.style.left = this.positionX - this.width / 2 + "px";
        this.monsterElm.style.bottom = this.positionY - this.width / 2 + "px";
        document.getElementById("monsters").appendChild(this.monsterElm);
    }
    moveMonster() {
        game.map.wayPoint.forEach((waypoint) => {
            if (waypoint.x * game.map.squareDimension + game.map.squareDimension / 2 === this.positionX && waypoint.y * game.map.squareDimension + game.map.squareDimension / 2 === this.positionY) {
                this.movementDirection = waypoint.newDirection;
            }
        });
        switch (this.movementDirection) {
            case 'top':
                this.positionY = this.positionY + 1;
                this.monsterElm.style.bottom = this.positionY - this.width / 2 + "px";
                break;
            case 'bottom':
                this.positionY = this.positionY - 1;
                this.monsterElm.style.bottom = this.positionY - this.width / 2 + "px";
                break;
            case 'left':
                this.positionX = this.positionX - 1;
                this.monsterElm.style.left = this.positionX - this.width / 2 + "px";
                break;
            case 'right':
                this.positionX = this.positionX + 1;
                this.monsterElm.style.left = this.positionX - this.width / 2 + "px";
                break;
            default:
        }
    }
}
class Soldier extends Monster {
    constructor(positionX, positionY) {
        super('soldier', 5, 1, 10, 20, positionX, positionY);
    }
}
class Tank extends Monster {
    constructor(positionX, positionY) {
        super('tank', 20, 2, 30, 26, positionX, positionY);
    }
}
class Boss extends Monster {
    constructor(positionX, positionY) {
        super('boss', 15, 5, 40, 32, positionX, positionY);
    }
}

class Tower {
    constructor(power, range, positionX, positionY) {
        this.power = power;
        this.range = range;
        this.cost = 50;
        this.projectilesArray = [];
        this.isTargetAcquired = false;
        this.target = null;
        this.positionX = positionX * game.map.squareDimension + game.map.squareDimension;
        this.positionY = positionY * game.map.squareDimension + game.map.squareDimension;
        this.width = 2;
        this.towerElm = null;
        this.createDomElementTower();
    }
    createDomElementTower() {
        this.towerElm = document.createElement('div');
        this.towerElm.setAttribute("class", "tower");
        this.towerElm.style.width = this.width * game.map.squareDimension + "px";
        this.towerElm.style.height = this.width * game.map.squareDimension + "px";
        this.towerElm.style.left = this.positionX - this.width * game.map.squareDimension / 2 + "px";
        this.towerElm.style.bottom = this.positionY - this.width * game.map.squareDimension / 2 + "px";
        document.getElementById("towers").appendChild(this.towerElm);
        //this.displayRange()
    }
    /*displayRange() {
        ctx.beginPath();
        ctx.arc(this.positionX + 1, 768 - this.positionY, this.range * 32, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.globalAlpha = 0.54;
        ctx.fill();
        ctx.closePath();
    }*/
    shoot() {
        const projectile = new Projectile(this, this.target);
        this.projectilesArray.push(projectile);
    }
    setDamage(projectile) {
        if (this.target.positionX === projectile.positionX && this.target.positionY === projectile.positionY) {
            this.target.health -= projectile.damage;
            if (this.projectilesArray.indexOf(projectile) != -1) {
                this.projectilesArray.splice(this.projectilesArray.indexOf(projectile), 1);
            }
            projectile.projectileElm.remove();
            if (this.target.health <= 0) {
                if (this.target.alreadyDestroyed === false) {
                    game.earnMoney(this.target.revenu);
                    this.target.alreadyDestroyed = true;
                }
                this.killCurrentProjectiles();
                if (game.monsterArray.indexOf(this.target) != -1) {
                    game.monsterArray.splice(game.monsterArray.indexOf(this.target), 1);
                    game.checkVictory();
                }
                this.isTargetAcquired = false;
                this.target.monsterElm.remove();
            }
        }
    }
    killCurrentProjectiles() {
        this.projectilesArray.forEach((projectileElement) => {
            projectileElement.projectileElm.remove();
        });
        this.projectilesArray = [];
    }
}
class BlueTower extends Tower {
    constructor(positionX, positionY) {
        super(1, 5, positionX, positionY);
    }
}

class Projectile {
    constructor(sourceTower, target) {
        this.positionX = sourceTower.positionX;
        this.positionY = sourceTower.positionY;
        this.projectileElm = null;
        this.width = 10;
        this.target = target;
        this.damage = sourceTower.power;
        this.createDomElementProjectile();
    }
    createDomElementProjectile() {
        this.projectileElm = document.createElement('div');
        this.projectileElm.setAttribute("class", "projectile");
        this.projectileElm.style.width = this.width + "px";
        this.projectileElm.style.height = this.width + "px";
        this.projectileElm.style.left = this.positionX - this.width / 2 + "px";
        this.projectileElm.style.bottom = this.positionY - this.width / 2 + "px";
        document.getElementById("projectiles").appendChild(this.projectileElm);
    }
}








//const canvas = document.querySelector('canvas');
//const ctx = canvas.getContext('2d');

window.addEventListener("click", (evt) => {
    if (evt.target.className === "spot" && game.spendMoney(50)) {
        game.createTower(evt);
    }
    if (evt.target.id === "next-wave-button") {
        if (game.waveCounter < game.map.waveslist.length) {
            game.increaseWave();
            createAndWait(game.map.waveslist, game.waveCounter, 0);
        }

    }
});

async function createAndWait(waveArray, waveNumber, step) {
    await new Promise(r => setTimeout(r, waveArray[waveNumber - 1][step]));
    let monster
    switch (waveArray[waveNumber - 1][step + 1]) {
        case 'soldier':
            monster = new Soldier(game.map.wayPoint[0].x, game.map.wayPoint[0].y);
            game.monsterArray.push(monster);
            break;
        case 'tank':
            monster = new Tank(game.map.wayPoint[0].x, game.map.wayPoint[0].y);
            game.monsterArray.push(monster);
            break;
        case 'boss':
            monster = new Boss(game.map.wayPoint[0].x, game.map.wayPoint[0].y);
            game.monsterArray.push(monster);
            break;
        default:
    }
    if (step < waveArray[waveNumber - 1].length) {
        step += 2;
        return createAndWait(waveArray, waveNumber, step);
    } else {
        return;
    }
}

const wayPointsLevel1 = [
    {
        x: 5,
        y: 0,
        newDirection: 'top'
    },
    {
        x: 5,
        y: 10,
        newDirection: 'right'
    },
    {
        x: 14,
        y: 10,
        newDirection: 'top'
    },
    {
        x: 14,
        y: 16,
        newDirection: 'left'
    },
    {
        x: 5,
        y: 16,
        newDirection: 'top'
    },
    {
        x: 5,
        y: 20,
        newDirection: 'right'
    },
    {
        x: 26,
        y: 20,
        newDirection: 'bottom'
    },
    {
        x: 26,
        y: 6,
        newDirection: 'left'
    },
    {
        x: 21,
        y: 6,
        newDirection: 'top'
    },
    {
        x: 21,
        y: 17,
        newDirection: 'left'
    },
    {
        x: 17,
        y: 17,
        newDirection: 'bottom'
    },
    {
        x: 17,
        y: 2,
        newDirection: 'right'
    },
    {
        x: 39,
        y: 2,
        newDirection: 'end'
    }
];
const towerSpotLevel1 = [
    {
        x: 7,
        y: 4
    },
    {
        x: 7,
        y: 7
    },
    {
        x: 10,
        y: 7
    },
    {
        x: 13,
        y: 7
    },
    {
        x: 5,
        y: 12
    },
    {
        x: 8,
        y: 12
    },
    {
        x: 11,
        y: 12
    },
    {
        x: 6,
        y: 18
    },
    {
        x: 9,
        y: 18
    },
    {
        x: 12,
        y: 18
    },
    {
        x: 23,
        y: 17
    },
    {
        x: 23,
        y: 14
    },
    {
        x: 23,
        y: 11
    },
    {
        x: 23,
        y: 8
    },
    {
        x: 18,
        y: 15
    },
    {
        x: 18,
        y: 12
    },
    {
        x: 18,
        y: 9
    },
    {
        x: 18,
        y: 6
    },
    {
        x: 18,
        y: 3
    },
    {
        x: 23,
        y: 4
    },
    {
        x: 27,
        y: 4
    },
    {
        x: 30,
        y: 4
    },
    {
        x: 33,
        y: 4
    },
    {
        x: 36,
        y: 4
    }
];
const wavesLevel1 = [
    [1750, "soldier", 1500, "soldier", 1500, "soldier", 1500, "soldier", 1500, "soldier", 1000, "soldier", 1000, "soldier", 800, "soldier", 800, "soldier", 800, "soldier"],
    [1750, "soldier", 1500, "soldier", 1500, "tank", 1500, "soldier", 1500, "soldier", 1500, "tank", 1500, "soldier", 1500, "soldier", 1500, "soldier", 1500, "tank"],
    [1750, "soldier", 1500, "tank", 1500, "tank", 1500, "soldier", 1500, "soldier", 1500, "tank", 1500, "soldier", 1500, "soldier", 1500, "soldier", 1500, "tank"],
    [1750, "soldier", 1500, "soldier", 1500, "tank", 1500, "soldier", 1500, "soldier", 1500, "tank", 1500, "soldier", 1500, "soldier", 1500, "boss", 1500, "tank"],
    [1750, "soldier", 1500, "soldier", 1500, "tank", 1500, "soldier", 1500, "soldier", 1500, "tank", 1500, "soldier", 1500, "soldier", 1500, "soldier", 1500, "tank"],
    [1750, "soldier", 1500, "soldier", 1500, "boss", 1500, "soldier", 1500, "tank", 1500, "tank", 1500, "soldier", 1500, "soldier", 1500, "soldier", 1500, "tank"],
    [1750, "boss", 1500, "soldier", 1500, "tank", 1500, "soldier", 1500, "soldier", 1500, "tank", 1500, "soldier", 1500, "soldier", 1500, "soldier", 1500, "tank"],
    [1750, "tank", 1500, "boss", 1500, "tank", 1500, "boss", 1500, "soldier", 1500, "tank", 1500, "soldier", 1500, "soldier", 1500, "soldier", 1500, "tank"],
    [1750, "tank", 1500, "boss", 1500, "tank", 1500, "boss", 1500, "soldier", 1500, "tank", 1500, "soldier", 1500, "soldier", 1500, "soldier", 1500, "tank"],
    [1750, "tank", 1500, "boss", 1500, "tank", 1500, "boss", 1500, "soldier", 1500, "tank", 1500, "soldier", 1500, "soldier", 1500, "soldier", 1500, "tank"],
    [1750, "tank", 1500, "boss", 1500, "tank", 1500, "boss", 1500, "soldier", 1500, "tank", 1500, "soldier", 1500, "soldier", 1500, "soldier", 1500, "tank"],
    [1750, "tank", 1500, "boss", 1500, "tank", 1500, "boss", 1500, "soldier", 1500, "tank", 1500, "soldier", 1500, "soldier", 1500, "soldier", 1500, "tank"],
    [1750, "tank", 1500, "boss", 1500, "tank", 1500, "boss", 1500, "soldier", 1500, "tank", 1500, "soldier", 1500, "soldier", 1500, "soldier", 1500, "tank"],
    [1750, "tank", 1500, "boss", 1500, "tank", 1500, "boss", 1500, "soldier", 1500, "tank", 1500, "soldier", 1500, "soldier", 1500, "soldier", 1500, "tank"],
    [1750, "tank", 1500, "boss", 1500, "tank", 1500, "boss", 1500, "soldier", 1500, "tank", 1500, "soldier", 1500, "soldier", 1500, "soldier", 1500, "tank"]
];

const game = new Game(100, 10);
game.start();
game.launch();

