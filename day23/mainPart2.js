const fs = require('fs');

function buildGraph(input) {
    const graph = new Map();
    
    input.split('\n').forEach(line => {
        const [a, b] = line.split('-');
        if (!graph.has(a)) graph.set(a, new Set());
        if (!graph.has(b)) graph.set(b, new Set());
        graph.get(a).add(b);
        graph.get(b).add(a);
    });
    
    return graph;
}

function isClique(graph, nodes) {
    // Check if every node connects to every other node
    for (let i = 0; i < nodes.length; i++) {
        const neighbors = graph.get(nodes[i]);
        for (let j = 0; j < nodes.length; j++) {
            if (i !== j && !neighbors.has(nodes[j])) {
                return false;
            }
        }
    }
    return true;
}

function findMaximalClique(graph) {
    let maxClique = [];
    const nodes = Array.from(graph.keys());

    // Helper function to extend current clique
    function extend(current, candidates) {
        if (candidates.length === 0) {
            if (current.length > maxClique.length) {
                maxClique = [...current];
            }
            return;
        }

        for (let i = 0; i < candidates.length; i++) {
            const candidate = candidates[i];
            const newCurrent = [...current, candidate];
            
            // Only continue if this is still a valid clique
            if (isClique(graph, newCurrent)) {
                // Filter candidates to those that are connected to all current nodes
                const newCandidates = candidates.slice(i + 1).filter(node => 
                    newCurrent.every(currentNode => 
                        graph.get(currentNode).has(node)
                    )
                );
                extend(newCurrent, newCandidates);
            }
        }
    }

    extend([], nodes);
    return maxClique;
}

function solve(input) {
    const graph = buildGraph(input);
    const maxClique = findMaximalClique(graph);
    return maxClique.sort().join(',');
}

const input = fs.readFileSync('input.txt', 'utf8').trim();
console.log(solve(input));