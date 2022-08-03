//source for the algorithm: https://levelup.gitconnected.com/finding-the-shortest-path-in-javascript-dijkstras-algorithm-8d16451eea34
let graph = {
	start: { 
        A: 5, 
        B: 2 
    },
	A: { 
        C: 4, 
        D: 2 
    },
	B: { 
        A: 8, 
        D: 2, 
        C: 4
    },
	C: { 
        D: 6, 
        finish: 3 
    },
	D: { 
        finish: 1 
    },
	finish: {},
};

let shortestDistanceNode = (distances, visited) => {
      let shortest = null;

      for (let node in distances) {
          // if no node has been assigned to shortest yet
            // or if the current node's distance is smaller than the current shortest
          let currentIsShortest =
              shortest === null || distances[node] < distances[shortest];
              
          if (currentIsShortest && !visited.includes(node)) {
              shortest = node;
          }
      }
      return shortest;
  };

  let findShortestPath = (graph, startNode, endNode) => {
 
    // track distances from the start node using a hash object
      let distances = {};
    distances[endNode] = "Infinity";
    distances = Object.assign(distances, graph[startNode]);
   // track paths using a hash object
    let parents = { endNode: null };
    for (let child in graph[startNode]) {
     parents[child] = startNode;
    }
     
    // collect visited nodes
      let visited = [];
   // find the nearest node
      let node = shortestDistanceNode(distances, visited);
    
    // for that node:
    while (node) {
    // find its distance from the start node & its child nodes
     let distance = distances[node];
     let children = graph[node]; 
         
    // for each of those child nodes:
         for (let child in children) {
     
     // make sure each child node is not the start node
           if (String(child) === String(startNode)) {
             continue;
          } else {
             // save the distance from the start node to the child node
             let newdistance = distance + children[child];
   // if there's no recorded distance from the start node to the child node in the distances object
   // or if the recorded distance is shorter than the previously stored distance from the start node to the child node
             if (!distances[child] || distances[child] > newdistance) {
   // save the distance to the object
        distances[child] = newdistance;
   // record the path
        parents[child] = node;
       } 
            }
          }  
         // move the current node to the visited set
         visited.push(node);
   // move to the nearest neighbor node
         node = shortestDistanceNode(distances, visited);
       }
     
    // using the stored paths from start node to end node
    // record the shortest path
    let shortestPath = [endNode];
    let parent = parents[endNode];
    while (parent) {
     shortestPath.push(parent);
     parent = parents[parent];
    }
    shortestPath.reverse();
     
    //this is the shortest path
    let results = {
     distance: distances[endNode],
     path: shortestPath,
    };
    console.log(results);
    // return the shortest path & the end node's distance from the start node
      return results;
   };
function createCircle(context =  document.createElement("canvas").getContext("2d") || null , x, y, text, color){
  context.beginPath();
  context.fillStyle = color;
  context.font = "20px Georgia";
  context.lineWidth = 10;
  context.arc(x, y, 75, 0, 2 * Math.PI, false);
  context.fill();
  context.closePath();
  context.fillStyle = "white";
  context.fillText(text, x - ((context.measureText(text).width/2)), y);
}

function drawArrow(
  ctx = document.createElement("canvas").getContext("2d"), 
  x0,y0,x1,y1,aWidth,aLength,arrowEnd, color, pathvalue
  ){
  var dx=x1-x0;
  var dy=y1-y0;
  var angle=Math.atan2(dy,dx);
  var length=Math.sqrt(dx*dx+dy*dy);
  
  ctx.translate(x0,y0);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = 5;
  ctx.moveTo(75,0);
  ctx.lineTo(length - 75,0);
  if(arrowEnd){
      ctx.moveTo(length-aLength - 75,-aWidth);
      ctx.lineTo(length - 75,0);
      ctx.lineTo(length-aLength - 75, aWidth);
  } 
  ctx.stroke();
  ctx.closePath();
  ctx.fillStyle = "white";  
  ctx.fillText(pathvalue, 200 , 30);
  ctx.rotate(-angle);
  ctx.translate(-x0, -y0);
}

const nodes = {
  start: {
    x: 80,
    y: 339,
    text: "Start"
  },
  A: {
    x: 450,
    y: 510,
    text: "A"
  },
  B: {
    x: 450,
    y: 170,
    text: "B"
  },
  C: {
    x: 900,
    y: 170,
    text: "C"
  },
  D: {
    x: 900,
    y: 510,
    text: "D"
  },
  finish: {
    x: 1300,
    y: 339,
    text: "Finish"
  }
};

function draw(){
  var canvas = document.getElementById("graph");
  if(canvas.getContext){
    var ctx = canvas.getContext("2d");
    
    //drawing the nodes
    const keys = Object.keys(nodes);
    for(const variable of keys){
      createCircle(ctx, 
      nodes[variable].x, 
      nodes[variable].y,  
      nodes[variable].text, 
      "#1f1f1f");
    }
    
    //Drawing the arrows
    const graphKeys = Object.keys(graph);
    for(const variable of graphKeys){
      const keyNodeDistances = Object.keys(graph[variable]);;
      for (const variable2 of keyNodeDistances) {
        drawArrow(ctx, 
        nodes[variable].x, 
        nodes[variable].y, 
        nodes[variable2].x, 
        nodes[variable2].y, 
        15, 25, true, "#1f1f1f" ,graph[variable][variable2]);
      }
    }
  }
}

document.getElementById("submitButton").addEventListener("click", startDijkstra);

function startDijkstra(){
  draw();
  var canvas = document.getElementById("graph");

  const chosenStart = document.getElementById("selectStart").value;
  const chosenFinish = document.getElementById("selectFinish").value;
  
  const resultPath = findShortestPath(graph, chosenStart, chosenFinish).path;
  
  if(canvas.getContext){
    var ctx = canvas.getContext("2d");
    const graphKeys = Object.keys(graph);

    for (const i of resultPath) {
      createCircle(ctx,
         nodes[i].x, 
         nodes[i].y, 
         nodes[i].text,
         "green");       
      for(const variable of graphKeys){
        const keyNodeDistances = Object.keys(graph[variable]);;
        if(variable != i) continue;
          for (const variable2 of keyNodeDistances) {
            if(!resultPath.includes(variable2)) continue;
            drawArrow(ctx, 
            nodes[i].x, 
            nodes[i].y, 
            nodes[variable2].x, 
            nodes[variable2].y, 
            15, 25, true, "green" ,graph[variable][variable2]);
          }
      }
    }
  }
}

