var generation = 0;
var population = [];    //Each population is 50 individuals
var population2 = [];
var individuals = 50;
var phrase = "";
var possibleCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ";
var mutationProbability = 1.5;
var sumFitness = 0;
var maxPossibleFitness;
var running  = false;
var bestFit = "";
var bestFitness = 0;
//Elements on the page
var buttonStop;
var buttonReset;
var inputPhrase;
var pointsGraph = [];

function setup() {
  createCanvas(300,300);

  inputPhrase = createInput("");
  inputPhrase.position(310, 10);

  buttonStop = createButton("START");
  buttonStop.mousePressed(startStop);
  buttonStop.position(310,50);

  buttonReset = createButton("RESET");
  buttonReset.mousePressed(resetEvolution);
  buttonReset.position(310,90);

  // createRandomPopulation();
  // calculateFitness();
  // console.log(population);

  setInterval(show, 500);
  show();
}

function draw() {
  if (running){
  // text("Text: " + phrase, 10, 75);

  // calculateFitness(); //Calculates the fitness of the population
    for(var t = 0; t<50; t++){reproduction(t);}  //50 reproductions

    population = population2;
    population2 = [];
    calculateFitness(); //Calculates fitness of the new population
  // plotGraph();

  // console.log(population);
  // console.log("New population generated");

    checkIfDone();

    generation++;

    if (generation % 50){
    pointsGraph.push(sumFitness); //Adds a point of the graph
    }
  }

}

function show(){
  background(0);
  fill(255,255,255);
  text("Generation: " + generation, 10, 15);
  text("Sum fitness: " + sumFitness, 10, 30);
  text("Max fitness: " + maxPossibleFitness, 10, 45);
  text("Text: " + phrase, 10, 60);
  text("Best fit: " + bestFit, 10, 75);

  plotGraph();
}




function Cell(i, d){
  this.id = i;
  this.dna = d;
  this.parent1 = "";
  this.parent2 = "";
  this.fitness = 0;
  this.probabilityReproduction = 0;
}

function startStop(){
  if (!running){
    if (phrase == ""){
      if (inputPhrase.value() != ""){
        phrase = inputPhrase.value();
        createRandomPopulation();
        calculateFitness();
        console.log(population);
      } else {return;}
    }
  }
  running = !running;
  if (running){
    buttonStop.html("STOP");
  } else {
    buttonStop.html("START");
  }
}

function resetEvolution(){
  running = false;
  generation = 0;
  phrase = "";
  population = [];
  population2 = [];
  sumFitness = 0;
  bestFit = "";
  bestFitness = 0;
  pointsGraph = [];
  maxPossibleFitness = 0;
  buttonStop.html("START");
}

function plotGraph(){
  var x = 0;

  if (phrase != ""){maxPossibleFitness = phrase.length * individuals;} else {return;}

  var off = Math.floor(pointsGraph.length / 300); //Offset
  for (var p = off * 300; p<pointsGraph.length; p++){ //For each point
    var normalized = Math.floor(pointsGraph[p] / maxPossibleFitness * 210);
    fill(255,255,255);
    rect(0,300-210, 300, 3);
    rect(x, 300-normalized, 10, 300);
    x++;

  }

}

function checkIfDone(){
  for (var i = 0; i<50; i++){
    if (population[i].dna == phrase){
      running = false;
      console.log(population);

    }
  }
}

function reproduction(id){
  var parent1 = chooseParent();
  var parent2 = chooseParent();
  var dna = crossOver(parent1.dna, parent2.dna);
  dna = mutation(dna);
  var newCell = new Cell(id, dna);
  newCell.parent1 = parent1.dna;
  newCell.parent2 = parent2.dna;

  population2.push(newCell);
}

function chooseParent(){
  //Selection

  // var selection = random(1,100) / 100;
  // var sumPF = 0;
  //
  // for (var i = 0; i<50; i++){
  //   sumPF += population[i].probabilityReproduction;
  //   // console.log(population[i].fitness);
  //   // console.log("Ind" + String(sumF) + "---"+ String(selection));
  //   if (sumPF>selection){
  //     // console.log("Parent: "+i)
  //     return population[i];
  //     break;
  //   }
  // }

  //Pool selection
  var pool = [];  //Creation of the pool
  for (var i = 0; i<50; i++){
    for (var c = 0; c<population[i].fitness;c++){
      pool.push(population[i]);
    }
  }

  //pick one element from the pool
  var rnd = Math.floor(random(0, pool.length));
  // console.log(pool[rnd]);
  return pool[rnd];

}

function crossOver(dna1, dna2){
  var dnaFinal = "";

  var gFToSelect = Math.floor(random(1,3)); //First gene of the new dna
  if (gFToSelect == 1){
    dnaFinal = dna1.charAt(0);
  } else {
    dnaFinal = dna2.charAt(0);
  }

  for (var i = 1; i<phrase.length; i++){
    var gToSelect = Math.floor(random(1,3));
    if (gToSelect == 1){
      dnaFinal += dna1.charAt(i);
    } else if (gToSelect == 2){
      dnaFinal += dna2.charAt(i);
    }
  }
  return dnaFinal;
}

function mutation(dna){
  var dnaFinal = "";  //The dna after mutation

  var m = Math.floor(random(1, 100));   //First gene of the new dna
  if (m<mutationProbability){
    dnaFinal = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
  } else {
    dnaFinal = dna.charAt(0);
  }

  for (var i = 1; i<phrase.length; i++){
    m = random(1, 100);
    if (m<mutationProbability){
      dnaFinal += possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
    } else {
      dnaFinal += dna.charAt(i);
    }
  }
  // console.log(dnaFinal);
  return dnaFinal;
  // return dna;
}

function calculateProbabilityOfReproduction(){
  var max = 0;
  var indexMax = 0;

  for (var i = 0; i<50;i++){
    population[i].probabilityReproduction = population[i].fitness / sumFitness;
    if (population[i].fitness > max){ //Gets the best fit
      max = population[i].fitness;
      indexMax = i;
    }
  }

  bestFit = population[indexMax].dna;
}

function calculateFitness(){
  sumFitness = 0;
  for (var i = 0; i<50; i++){ //For each cell of the population
    var cell = population[i];  //Gets the cell
    var f = 0;  //Starts from fitness = 0

    for (var c = 0; c<phrase.length; c++){ //For each character
      if (cell.dna.charAt(c)==phrase.charAt(c)){f++;}
    }
    cell.fitness = f;  //Saves the fitness in the cell
    sumFitness += f;  //Calculates the sum of all fitness values
  }

  calculateProbabilityOfReproduction();
}

function createRandomPopulation(){
  for (var i = 0; i<50; i++){ //Creates 50 cells
    var dna = "";
    for (var c = 0; c<phrase.length; c++){  //Creates a random gene for each character of the phrase
        dna += possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
    }

    dna = dna.split('undefined').join('');  //Cleans the dna from undefined

    var cell = new Cell(i, dna);
    population.push(cell);
  }
}
