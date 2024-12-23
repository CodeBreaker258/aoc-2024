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

function findConnectedTriples(graph) {
    const triples = new Set();
    
    // For each node
    for (const [node1, neighbors1] of graph) {
        // For each neighbor of first node
        for (const node2 of neighbors1) {
            // For each neighbor of second node
            for (const node3 of graph.get(node2)) {
                // Check if third node connects back to first
                if (node3 !== node1 && graph.get(node3).has(node1)) {
                    // Sort nodes to ensure unique combinations
                    const triple = [node1, node2, node3].sort().join(',');
                    triples.add(triple);
                }
            }
        }
    }
    
    return Array.from(triples);
}

function countTriplesWithT(triples) {
    return triples.filter(triple => 
        triple.split(',').some(node => node.startsWith('t'))
    ).length;
}

function solve(input) {
    const graph = buildGraph(input);
    const triples = findConnectedTriples(graph);
    return countTriplesWithT(triples);
}

const input = fs.readFileSync('input.txt', 'utf8').trim();
console.log(solve(input));