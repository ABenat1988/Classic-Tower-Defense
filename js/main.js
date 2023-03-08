class Game {
    constructor() {
        this.map = null;
        this.monsterArray = [];
        this.towerArray = [];
    }

    start() {
        this.map = new Map(wayPointsLevel1, towerPlacementLevel1);

        /*const towerTest = new Tower(1, 200, 10, 23, 8);
        this.towerArray.push(towerTest);
        const towerTest2 = new Tower(1, 10, 5, 5, 12);
        this.towerArray.push(towerTest2);
        const towerTest3 = new Tower(1, 200, 10, 39, 47);
        this.towerArray.push(towerTest3);*/

        setInterval(() => {
            const monster = new Monster("soldier", 5, 1, 1, this.map.wayPoint[0].x, this.map.wayPoint[0].y);
            this.monsterArray.push(monster);
        }, 1750);

        setInterval(() => {
            this.monsterArray.forEach((element) => {
                element.moveMonster();
                this.removeMonster(element);
            });
        }, 20);
    }
    removeMonster(monsterInstance) {
        if (this.map.wayPoint[this.map.wayPoint.length - 1].x * 32 === monsterInstance.positionX && this.map.wayPoint[this.map.wayPoint.length - 1].y * 32 === monsterInstance.positionY) {
            monsterInstance.monsterElm.remove();
            this.monsterArray.shift();
        }
    }
}

class Map {
    constructor(wayPoint, towerPlacement) {
        this.wayPoint = wayPoint;
        this.towerPlacement = towerPlacement
        this.squareDimension = 32;
        this.numberSquareHeigth = 24;
        this.numberSquareHeigth = 40;
        this.createDomElementTowerPlacement();
    }
    createDomElementTowerPlacement() {
        this.towerPlacement.forEach((element) => {
            const divTower = document.createElement('div');
            divTower.setAttribute("class", "placement");
            divTower.style.left = element.x * 32 + "px";
            divTower.style.bottom = element.y * 32 + "px";
            document.getElementById("towers-placement").appendChild(divTower);
        });
    }
}

class Monster {
    constructor(type, health, speed, attack, positionX, positionY) {
        this.type = type;
        this.health = health;
        this.speed = speed;
        this.attack = attack;
        this.monsterElm = null;
        this.positionX = positionX * 32;
        this.positionY = positionY * 32;
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
            case 'speeder':
                this.monsterElm.setAttribute("class", "monster speeder");
                break;
            case 'boss':
                this.monsterElm.setAttribute("class", "monster boss");
                break;
            default:
                this.monsterElm.setAttribute("class", "error");
        }
        this.monsterElm.style.left = this.positionX + "px";
        this.monsterElm.style.bottom = this.positionY + "px";
        document.getElementById("monsters").appendChild(this.monsterElm);
    }
    moveMonster() {
        game.map.wayPoint.forEach((waypoint) => {
            if (waypoint.x * 32 === this.positionX && waypoint.y * 32 === this.positionY) {
                this.movementDirection = waypoint.newDirection;
            }
        });
        switch (this.movementDirection) {
            case 'top':
                this.positionY = this.positionY + 1;
                this.monsterElm.style.bottom = this.positionY + "px";
                break;
            case 'bottom':
                this.positionY = this.positionY - 1;
                this.monsterElm.style.bottom = this.positionY + "px";
                break;
            case 'left':
                this.positionX = this.positionX - 1;
                this.monsterElm.style.left = this.positionX + "px";
                break;
            case 'right':
                this.positionX = this.positionX + 1;
                this.monsterElm.style.left = this.positionX + "px";
                break;
            default:
        }
    }
}

class Tower {
    constructor(power, rateOfFire, range, positionX, positionY) {
        this.power = power;
        this.rateOfFire = rateOfFire;
        this.range = range;
        this.projectilesArray = [];

        this.isTargetAcquired = false;
        this.target = null;

        this.positionX = positionX * 32;
        this.positionY = positionY * 32;
        this.towerElm = null;

        this.createDomElementTower();
        this.checkDistanceMonster();
        this.moveProjectile();
    }
    createDomElementTower() {
        this.towerElm = document.createElement('div');
        this.towerElm.setAttribute("class", "tower");
        this.towerElm.style.left = this.positionX + "px";
        this.towerElm.style.bottom = this.positionY + "px";
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

    checkDistanceMonster() {
        setInterval(() => {
            let distance = 0;
            if (this.isTargetAcquired === false) {
                game.monsterArray.some((monsterElement) => {
                    distance = Math.sqrt(Math.pow(monsterElement.positionX - this.positionX, 2) + Math.pow(monsterElement.positionY - this.positionY, 2));
                    if (distance <= this.range * 32) {
                        this.isTargetAcquired = true;
                        this.target = monsterElement;
                        monsterElement.monsterElm.classList.add("targeted");
                        this.shoot();
                        return true;
                    }
                });
            } else {
                distance = Math.sqrt(Math.pow(this.target.positionX - this.positionX, 2) + Math.pow(this.target.positionY - this.positionY, 2));
                if (distance > this.range * 32) {
                    this.target.monsterElm.classList.remove("targeted");
                    this.isTargetAcquired = false;
                    this.target = null;
                    this.killCurrentProjectiles();

                    return true;
                } else {
                    this.shoot();
                }
            }
        }, 600 - this.rateOfFire);
    }
    shoot() {
        const projectile = new Projectile(this, this.target, this.power);
        this.projectilesArray.push(projectile);
    }

    moveProjectile() {
        setInterval(() => {
            this.projectilesArray.forEach((projectileElement) => {
                if (this.target.positionX - projectileElement.positionX > 0) {
                    projectileElement.positionX++;
                } else {
                    projectileElement.positionX--;
                }
                if (this.target.positionY - projectileElement.positionY > 0) {
                    projectileElement.positionY++;
                } else {
                    projectileElement.positionY--;
                }
                projectileElement.projectileElm.style.bottom = projectileElement.positionY + "px";
                projectileElement.projectileElm.style.left = projectileElement.positionX + "px";
                this.setDamage(projectileElement);
            });
        }, 1);
    }
    setDamage(projectile) {
        if (this.target.positionX === projectile.positionX && this.target.positionY === projectile.positionY) {
            this.target.health -= projectile.damage;
            this.projectilesArray.splice(this.projectilesArray.indexOf(projectile), 1);
            projectile.projectileElm.remove();
            if (this.target.health <= 0) {
                this.target.monsterElm.remove();
                game.monsterArray.splice(game.monsterArray.indexOf(this.target), 1);
                this.isTargetAcquired = false;
                this.target = null;
                this.killCurrentProjectiles();
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

class Projectile {
    constructor(sourceTower, target, damage) {
        this.sourceTower = sourceTower;
        this.positionX = sourceTower.positionX;
        this.positionY = sourceTower.positionY;
        this.projectileElm = null;
        this.target = target;
        this.damage = damage;
        this.createDomElementProjectile();
    }

    createDomElementProjectile() {
        this.projectileElm = document.createElement('div');
        this.projectileElm.setAttribute("class", "projectile");
        this.projectileElm.style.left = this.positionX + "px";
        this.projectileElm.style.bottom = this.positionY + "px";
        document.getElementById("projectiles").appendChild(this.projectileElm);
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
const towerPlacementLevel1 = [
    {
        x: 7,
        y: 4,
        free: true
    },
    {
        x: 7,
        y: 7,
        free: true
    },
    {
        x: 10,
        y: 7,
        free: true
    },
    {
        x: 13,
        y: 7,
        free: true
    },
    {
        x: 5,
        y: 12,
        free: true
    },
    {
        x: 8,
        y: 12,
        free: true
    },
    {
        x: 11,
        y: 12,
        free: true
    },
    {
        x: 6,
        y: 18,
        free: true
    },
    {
        x: 9,
        y: 18,
        free: true
    },
    {
        x: 12,
        y: 18,
        free: true
    },
    {
        x: 23,
        y: 17,
        free: true
    },
    {
        x: 23,
        y: 14,
        free: true
    },
    {
        x: 23,
        y: 11,
        free: true
    },
    {
        x: 23,
        y: 8,
        free: true
    },
    {
        x: 18,
        y: 15,
        free: true
    },
    {
        x: 18,
        y: 12,
        free: true
    },
    {
        x: 18,
        y: 9,
        free: true
    },
    {
        x: 18,
        y: 6,
        free: true
    },
    {
        x: 18,
        y: 3,
        free: true
    },
    {
        x: 23,
        y: 4,
        free: true
    },
    {
        x: 27,
        y: 4,
        free: true
    },
    {
        x: 30,
        y: 4,
        free: true
    },
    {
        x: 33,
        y: 4,
        free: true
    },
    {
        x: 36,
        y: 4,
        free: true
    }
];

//const canvas = document.querySelector('canvas');
//const ctx = canvas.getContext('2d');
const game = new Game();
game.start();

window.addEventListener("click", (evt) => {
    console.log(evt.target.style.left.slice(0, -2)*1/32);
    console.log(evt.target.style.bottom.slice(0, -2)*1/32);
    game.towerArray.push(new Tower(1, 10, 5, evt.target.style.left.slice(0, -2)*1/32, evt.target.style.bottom.slice(0, -2)*1/32));
});