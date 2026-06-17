#!/usr/bin/env node
/**
 * Full Understand pipeline: extract-structure.mjs → graph builder → merge
 * Skips Phase 1/1.5 (already have scan + batches), runs Phase 2-7.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, resolve } from 'path';
import { execSync } from 'child_process';

const PROJECT_ROOT = resolve('C:/Users/Admin/Desktop/Website 3D/studio-3d');
const SKILL_DIR = resolve('C:/Users/Admin/.understand-anything/repo/understand-anything-plugin/skills/understand');
const INTER = join(PROJECT_ROOT, '.understand-anything/intermediate');
const TMP = join(PROJECT_ROOT, '.understand-anything/tmp');

// Ensure dirs
for (const d of [INTER, TMP]) {
  if (!existsSync(d)) mkdirSync(d, { recursive: true });
}

// Load data
const batches = JSON.parse(readFileSync(join(INTER, 'batches.json'), 'utf8'));
const scan = JSON.parse(readFileSync(join(INTER, 'scan-result.json'), 'utf8'));
const importMap = scan.importMap || {};

console.log(`[Phase 2/7] Analyzing files — ${batches.totalFiles} files in ${batches.totalBatches} batches...`);

// ======== STEP 1: Run extract-structure.mjs for each batch ========
const extractResults = [];

for (let i = 0; i < batches.batches.length; i++) {
  const batch = batches.batches[i];
  console.log(`  Running batch ${i}/${batches.totalBatches} (${batch.files.length} files)...`);

  // Build batchImportData
  const batchImportData = {};
  for (const f of batch.files) {
    if (importMap[f.path]) {
      batchImportData[f.path] = importMap[f.path];
    }
  }

  // Create input JSON
  const input = {
    projectRoot: PROJECT_ROOT,
    batchFiles: batch.files,
    batchImportData,
  };

  const inputPath = join(TMP, `batch-input-${i}.json`);
  const outputPath = join(TMP, `batch-extract-${i}.json`);
  writeFileSync(inputPath, JSON.stringify(input, null, 2));

  try {
    execSync(`node "${join(SKILL_DIR, 'extract-structure.mjs')}" "${inputPath}" "${outputPath}"`, {
      cwd: PROJECT_ROOT,
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 60000,
      encoding: 'utf-8',
    });
  } catch (e) {
    console.error(`  extract-structure.mjs failed for batch ${i}: ${e.stderr?.slice(0, 200) || e.message}`);
    // Write empty result so pipeline can continue
    writeFileSync(outputPath, JSON.stringify({ scriptCompleted: false, filesAnalyzed: 0, filesSkipped: batch.files.map(f => f.path), results: [] }));
  }

  // Read result
  if (existsSync(outputPath)) {
    const result = JSON.parse(readFileSync(outputPath, 'utf8'));
    extractResults.push({ batchIndex: i, ...result });
    console.log(`  Batch ${i} done: ${result.filesAnalyzed} analyzed, ${result.filesSkipped?.length || 0} skipped`);
  } else {
    console.error(`  Batch ${i}: output file missing!`);
    extractResults.push({ batchIndex: i, scriptCompleted: false, filesAnalyzed: 0, filesSkipped: batch.files.map(f => f.path), results: [] });
  }
}

// ======== STEP 2: Convert structural results to GraphNode/GraphEdge ========
console.log(`\n[Phase 2/7] Converting extract results to graph nodes/edges...`);

// Helper: determine node type from fileCategory and path
function getNodeType(fileCategory, path) {
  switch (fileCategory) {
    case 'config': return 'config';
    case 'docs': return 'document';
    case 'infra':
      if (path.includes('Dockerfile') || path.includes('docker-compose') || path.includes('docker/')) return 'service';
      if (path.includes('.github/workflows') || path.includes('.gitlab-ci') || path.includes('Jenkinsfile')) return 'pipeline';
      if (path.endsWith('.tf') || path.endsWith('.tfvars')) return 'resource';
      return 'service';
    case 'data':
      if (path.endsWith('.sql')) return 'table';
      if (path.endsWith('.graphql') || path.endsWith('.proto') || path.endsWith('.prisma')) return 'schema';
      if (path.includes('openapi') || path.includes('swagger')) return 'endpoint';
      return 'schema';
    case 'script': return 'file';
    case 'markup': return 'file';
    default: return 'file';
  }
}

// Build file info map from scan
const fileInfo = {};
for (const f of scan.files) {
  fileInfo[f.path] = { language: f.language, sizeLines: f.sizeLines, fileCategory: f.fileCategory };
}

// Determine complexity
function getComplexity(metrics, totalLines) {
  if (totalLines > 200 || (metrics.functionCount || 0) > 15) return 'complex';
  if (totalLines > 50 || (metrics.functionCount || 0) > 5) return 'moderate';
  return 'simple';
}

// Determine tags based on file info
function getTags(fileCategory, path, metrics) {
  const tags = [];
  const name = path.split('/').pop() || path;
  const ext = path.split('.').pop();

  // Category-based
  switch (fileCategory) {
    case 'config': tags.push('configuration'); break;
    case 'docs': tags.push('documentation'); break;
    case 'infra': tags.push('infrastructure'); break;
    case 'data': tags.push('data'); break;
    case 'script': tags.push('script'); break;
    case 'markup': tags.push('markup'); break;
  }

  // Path-based
  if (path.includes('/test') || path.includes('/__tests__') || name.includes('.test.') || name.includes('.spec.')) tags.push('test');
  if (name === 'index.js' || name === 'index.ts' || name === 'index.mjs') tags.push('barrel', 'entry-point');
  if (name === 'README.md') tags.push('entry-point', 'overview');
  if (name === 'package.json') tags.push('build-system', 'dependencies');
  if (path.includes('middleware')) tags.push('middleware');
  if (path.includes('component') || path.includes('/components/')) tags.push('component');
  if (path.includes('hook') || path.includes('/hooks/') || name.startsWith('use')) tags.push('hook');
  if (path.includes('api') || path.includes('route')) tags.push('api-handler');
  if (path.includes('service')) tags.push('service');
  if (path.includes('model') || path.includes('schema')) tags.push('data-model');
  if (path.includes('util') || path.includes('helper') || path.includes('lib/')) tags.push('utility');
  if (path.includes('type') || path.includes('types') || path.endsWith('.d.ts')) tags.push('type-definition');
  if (path.includes('context')) tags.push('context');
  if (path.includes('Dockerfile')) tags.push('containerization');
  if (path.includes('.github/workflows')) tags.push('ci-cd', 'deployment');
  if (path.includes('db/') || path.includes('database')) tags.push('database');
  if (path.endsWith('.graphql')) tags.push('api-schema', 'schema-definition');
  if (path.endsWith('.proto')) tags.push('schema-definition');

  // Based on metrics
  if ((metrics.exportCount || 0) > 10) tags.push('exports');
  if ((metrics.functionCount || 0) === 0 && metrics.classCount === 0 && fileCategory === 'code') tags.push('type-definition');

  // Deduplicate and limit
  return [...new Set(tags)].slice(0, 6);
}

// Generate summary
function getSummary(fileCategory, path, metrics) {
  const name = path.split('/').pop() || path;
  switch (fileCategory) {
    case 'config':
      return `Configuration file for ${name} defining project settings.`;
    case 'docs':
      if (name === 'README.md') return `Project overview documentation with setup and usage instructions.`;
      return `Documentation file: ${name}.`;
    case 'infra':
      if (path.includes('Dockerfile')) return `Dockerfile defining the container image build for the application.`;
      if (path.includes('.github/workflows')) return `CI/CD workflow configuration defining automated build and deploy steps.`;
      return `Infrastructure configuration: ${name}.`;
    case 'data':
      if (path.endsWith('.sql')) return `Database migration or table definition.`;
      return `Data schema definition.`;
    case 'code':
    default:
      const funcs = (metrics.functionCount || 0);
      const classes = (metrics.classCount || 0);
      const imports = (metrics.importCount || 0);
      let parts = [];
      if (path.includes('index.')) parts.push('Module entry point');
      else parts.push('Source file');
      if (funcs > 0) parts.push(`${funcs} function${funcs > 1 ? 's' : ''}`);
      if (classes > 0) parts.push(`${classes} class${classes > 1 ? 'es' : ''}`);
      if (imports > 0) parts.push(`${imports} import${imports > 1 ? 's' : ''}`);
      return `${name}: ${parts.join(', ')}.`;
  }
}

// Process each extract result and build nodes/edges
const allNodes = [];
const allEdges = [];

for (const extract of extractResults) {
  for (const result of extract.results || []) {
    const { path, language, fileCategory, totalLines, nonEmptyLines, metrics, functions, classes, exports, sections, definitions, services, endpoints, steps, resources, callGraph } = result;
    const nodeType = getNodeType(fileCategory, path);

    // Determine node prefix
    let prefix = 'file';
    switch (nodeType) {
      case 'config': prefix = 'config'; break;
      case 'document': prefix = 'document'; break;
      case 'service': prefix = 'service'; break;
      case 'pipeline': prefix = 'pipeline'; break;
      case 'resource': prefix = 'resource'; break;
      case 'table': prefix = 'table'; break;
      case 'schema': prefix = 'schema'; break;
      case 'endpoint': prefix = 'endpoint'; break;
      default: prefix = 'file';
    }

    const nodeId = `${prefix}:${path}`;
    const complexity = getComplexity(metrics || {}, totalLines);
    const tags = getTags(fileCategory, path, metrics || {});
    const summary = getSummary(fileCategory, path, metrics || {});
    const fname = path.split('/').pop() || path;

    const node = {
      id: nodeId,
      type: nodeType,
      name: fname,
      filePath: path,
      summary,
      tags,
      complexity,
    };

    allNodes.push(node);

    // Create sub-nodes: functions
    if (functions && functions.length > 0) {
      for (const fn of functions) {
        const fnId = `function:${path}:${fn.name}`;
        const fnNode = {
          id: fnId,
          type: 'function',
          name: fn.name,
          filePath: path,
          lineRange: [fn.startLine, fn.endLine],
          summary: `Function ${fn.name} with ${fn.params?.length || 0} parameters.`,
          tags: ['function'],
          complexity: (fn.endLine - fn.startLine) > 50 ? 'moderate' : 'simple',
        };
        allNodes.push(fnNode);
        // contains edge
        allEdges.push({ source: nodeId, target: fnId, type: 'contains', direction: 'forward', weight: 1.0 });
        // exports edge (if exported)
        if (exports && exports.some(e => e.name === fn.name)) {
          allEdges.push({ source: nodeId, target: fnId, type: 'exports', direction: 'forward', weight: 0.8 });
        }
      }
    }

    // Sub-nodes: classes
    if (classes && classes.length > 0) {
      for (const cls of classes) {
        const clsId = `class:${path}:${cls.name}`;
        const clsNode = {
          id: clsId,
          type: 'class',
          name: cls.name,
          filePath: path,
          lineRange: [cls.startLine, cls.endLine],
          summary: `Class ${cls.name} with ${cls.methods?.length || 0} methods and ${cls.properties?.length || 0} properties.`,
          tags: ['class'],
          complexity: (cls.endLine - cls.startLine) > 100 ? 'complex' : 'moderate',
        };
        allNodes.push(clsNode);
        // contains edge
        allEdges.push({ source: nodeId, target: clsId, type: 'contains', direction: 'forward', weight: 1.0 });
        // exports edge
        if (exports && exports.some(e => e.name === cls.name)) {
          allEdges.push({ source: nodeId, target: clsId, type: 'exports', direction: 'forward', weight: 0.8 });
        }
      }
    }

    // Sub-nodes: services (from Dockerfile/compose analysis)
    if (services && services.length > 0) {
      for (const svc of services) {
        const svcId = `service:${path}:${svc.name}`;
        allNodes.push({
          id: svcId,
          type: 'service',
          name: svc.name,
          filePath: path,
          lineRange: svc.startLine ? [svc.startLine, svc.endLine] : undefined,
          summary: `Service ${svc.name} defined in ${path}.`,
          tags: ['service', 'containerization'],
          complexity: 'moderate',
        });
        allEdges.push({ source: nodeId, target: svcId, type: 'contains', direction: 'forward', weight: 1.0 });
      }
    }

    // Sub-nodes: endpoints (from OpenAPI analysis)
    if (endpoints && endpoints.length > 0) {
      for (const ep of endpoints) {
        const epName = `${ep.method}-${ep.path}`;
        const epId = `endpoint:${path}:${epName}`;
        allNodes.push({
          id: epId,
          type: 'endpoint',
          name: epName,
          filePath: path,
          lineRange: [ep.startLine, ep.endLine],
          summary: `${ep.method.toUpperCase()} ${ep.path} endpoint.`,
          tags: ['api-endpoint', ep.method],
          complexity: 'simple',
        });
        allEdges.push({ source: nodeId, target: epId, type: 'contains', direction: 'forward', weight: 1.0 });
      }
    }

    // Import edges
    const importPaths = importMap[path];
    if (importPaths && importPaths.length > 0) {
      for (const importPath of importPaths) {
        const targetType = getNodeType(fileInfo[importPath]?.fileCategory || 'code', importPath);
        const targetPrefix = targetType === 'config' ? 'config' : targetType === 'document' ? 'document' : 'file';
        const targetId = `${targetPrefix}:${importPath}`;
        allEdges.push({ source: nodeId, target: targetId, type: 'imports', direction: 'forward', weight: 0.7 });
      }
    }

    // Call graph edges
    if (callGraph && callGraph.length > 0) {
      for (const call of callGraph) {
        // Try to find the callee as a function node
        const calleeId = `function:${path}:${call.callee}`;
        const exists = allNodes.some(n => n.id === calleeId);
        if (exists) {
          allEdges.push({ source: nodeId, target: calleeId, type: 'calls', direction: 'forward', weight: 0.8 });
        }
      }
    }
  }
}

// Write batch files
console.log(`  Generated ${allNodes.length} nodes and ${allEdges.length} edges across ${extractResults.length} batches.`);

// Write per-batch output files for merge-batch-graphs.py
// Group nodes and edges by batch
const batchNodes = {};
const batchEdges = {};
for (const extract of extractResults) {
  batchNodes[extract.batchIndex] = [];
  batchEdges[extract.batchIndex] = [];
}

// Assign nodes/edges to batches based on their first appearance
for (const node of allNodes) {
  // Find which batch this file belongs to
  const filePath = node.filePath || '';
  for (const extract of extractResults) {
    const hasFile = extract.results?.some(r => r.path === filePath);
    if (hasFile) {
      batchNodes[extract.batchIndex].push(node);
      break;
    }
  }
  // Fallback: assign to batch 0
  if (!Object.values(batchNodes).some(arr => arr.includes(node))) {
    batchNodes[0]?.push(node);
  }
}

for (const edge of allEdges) {
  // Assign edge to same batch as its source node
  const srcFile = edge.source.split(':').slice(1).join(':');
  for (const extract of extractResults) {
    const hasSrc = extract.results?.some(r => r.path === srcFile);
    if (hasSrc) {
      batchEdges[extract.batchIndex].push(edge);
      break;
    }
  }
  if (!Object.values(batchEdges).some(arr => arr.includes(edge))) {
    batchEdges[0]?.push(edge);
  }
}

let batchFilesWritten = 0;
for (let i = 0; i < batches.totalBatches; i++) {
  const nodes = batchNodes[i] || [];
  const edges = batchEdges[i] || [];

  // Split if needed (more than 60 nodes or 120 edges)
  if (nodes.length <= 60 && edges.length <= 120) {
    writeFileSync(join(INTER, `batch-${i}.json`), JSON.stringify({ nodes, edges }, null, 2));
    batchFilesWritten++;
  } else {
    // Split into parts
    const parts = Math.max(1, Math.ceil(Math.max(nodes.length / 60, edges.length / 120)));
    const partSize = Math.ceil(nodes.length / parts);
    for (let k = 0; k < parts; k++) {
      const start = k * partSize;
      const end = Math.min(start + partSize, nodes.length);
      const partNodes = nodes.slice(start, end);
      const partEdges = edges.filter(e => partNodes.some(n => n.filePath === e.source.split(':').slice(1).join(':')));
      writeFileSync(join(INTER, `batch-${i}-part-${k + 1}.json`), JSON.stringify({ nodes: partNodes, edges: partEdges }, null, 2));
      batchFilesWritten++;
    }
  }
}

console.log(`  Wrote ${batchFilesWritten} batch files to ${INTER}`);

// ======== STEP 3: Merge batches ========
console.log(`\n[Phase 2/7] Running merge-batch-graphs.py...`);

try {
  const mergeOutput = execSync(`python "${join(SKILL_DIR, 'merge-batch-graphs.py')}" "${PROJECT_ROOT}"`, {
    cwd: PROJECT_ROOT,
    stdio: ['pipe', 'pipe', 'pipe'],
    timeout: 60000,
    encoding: 'utf-8',
  });
  console.log(`  Merge output: ${mergeOutput?.slice(0, 500)}`);
} catch (e) {
  console.error(`  Merge stderr: ${e.stderr?.slice(0, 500)}`);
  console.error(`  Merge stdout: ${e.stdout?.slice(0, 500)}`);
  if (e.status) process.exitCode = e.status;
}

// Check assembled graph
const assembledPath = join(INTER, 'assembled-graph.json');
if (existsSync(assembledPath)) {
  const assembled = JSON.parse(readFileSync(assembledPath, 'utf8'));
  console.log(`\n[Phase 2/7] Assembled graph: ${assembled.nodes?.length || 0} nodes, ${assembled.edges?.length || 0} edges`);
} else {
  console.error('  assembled-graph.json not found after merge!');
  // Try to create a basic one from our data
  const assembledGraph = {
    nodes: allNodes,
    edges: allEdges,
  };
  writeFileSync(assembledPath, JSON.stringify(assembledGraph, null, 2));
  console.log('  Fallback: wrote assembled-graph.json from raw data.');
}

console.log(`\nPhase 2 complete.`);
