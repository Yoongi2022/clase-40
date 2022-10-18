class Game {
  constructor() {}

  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data) {
      gameState = data.val();
    });
  }
  update(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  start() {
    player = new Player();
    playerCount = player.getCount();

    form = new Form();
    form.display();

    car1 = createSprite(width / 2 - 50, height - 100);
    car1.addImage("car1", car1_img);
    car1.scale = 0.07;

    car2 = createSprite(width / 2 + 100, height - 100);
    car2.addImage("car2", car2_img);
    car2.scale = 0.07;

    cars = [car1, car2];
    fuels = new Group();
    powerCoins = new Group();
    this.addSprites(fuels,4,fuelImage,0.02);
    this.addSprites(powerCoins,18,powerCoinImage,0.09);
  
  }
  addSprites(spritegroup,numberofsprites,spriteimage,scale){ //función q contiene el nombre del grupo
    for(var i = 0; i < numberofsprites; i++){ 
      var x,y;
      x = random(width/2 + 150, width/2 - 150);
      y = random(- height* 4.5, height -400);
      var sprite = createSprite(x,y);
      sprite.addImage("sprite",spriteimage);
      sprite.scale = scale;
      spritegroup.add(sprite)
    }
  }

  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");
  }

  play() {
    this.handleElements();

    Player.getPlayersInfo();

    if (allPlayers !== undefined) {
      image(track, 0, -height * 5, width, height * 6);

      // indice del arreglo
      var index = 0;
      for (var plr in allPlayers) {
        // Agrega 1 al índice en cada ciclo
        index = index + 1;

        // Usa datos de la base de datos para mostrar los autos en dirección x e y
        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;

        cars[index - 1].position.x = x;
        cars[index - 1].position.y = y;

        // C38  AA
        if (index === player.index) {
          stroke(10);
          fill("red");
          ellipse(x, y, 60, 60);

          this.handleFuel(index);
          this.handlePowerCoins(index);

        }
      }

      // Manipulación de eventos de teclado
      if (keyIsDown(UP_ARROW)) {
        player.positionY += 10;
        player.update();
      }

      drawSprites();
    }
  }

  handleFuel(index) {
    // Agregando combustible
    cars[index - 1].overlap(fuels,function(collector,collected){
      player.fuels = 185;
      collected.remove();
    })

  }

  handlePowerCoins(index) {
    // Agregando monedas
    cars[index -1].overlap(powerCoins,function(collector,collected){
      player.score += 21;
      player.update(); //se estará actualizando
      collected.remove(); //una vez que se haya recolectado el tanque de la moneda, se elimine
    })
}
}