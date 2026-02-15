export const deckMetrics = [
  { key: 'documents', label: 'Source Docs', value: '1,247' },
  { key: 'queries', label: 'Expanded Queries', value: '25' },
  { key: 'startups', label: 'Startup Matches', value: '163' },
  { key: 'confidence', label: 'Quality Score', value: '94.1%' }
]

export const pipelineStages = [
  {
    id: 'ingest',
    code: '01',
    title: 'Data Ingestor',
    subtitle: 'Multiformat source intake',
    narrative:
      'Fund briefs, decks, PDFs, spreadsheets, and email notes are normalized into machine-readable blocks with source fingerprints.',
    outputs: ['Parsed text chunks', 'Document fingerprints', 'Initial entity hints'],
    metrics: [
      { key: 'throughput', label: 'Ingest Rate', value: '1,247 docs/hr' },
      { key: 'latency', label: 'Parse Latency', value: '410 ms' },
      { key: 'quality', label: 'Parse Success', value: '99.2%' }
    ],
    durationMs: 5400
  },
  {
    id: 'discovery',
    code: '02',
    title: 'Discovery + Query Expansion',
    subtitle: 'Sector decomposition',
    narrative:
      'The thesis is decomposed into high-signal research prompts. Each branch emits both search queries and a scoped analyst brief.',
    outputs: ['25 query tracks', 'Query rationale notes', 'Priority sectors map'],
    metrics: [
      { key: 'throughput', label: 'Query Fanout', value: '25 tracks' },
      { key: 'latency', label: 'Expansion Time', value: '2.1 s' },
      { key: 'quality', label: 'Coverage', value: '96.4%' }
    ],
    durationMs: 5600
  },
  {
    id: 'extract',
    code: '03',
    title: 'Structured Extract',
    subtitle: 'Company candidate pass',
    narrative:
      'Discovery reports are scanned for company mentions, then normalized into deterministic startup records with duplicate collapse.',
    outputs: ['Canonical startup IDs', 'Seed metadata rows', 'Deduplication map'],
    metrics: [
      { key: 'throughput', label: 'Rows Extracted', value: '3,482 rows' },
      { key: 'latency', label: 'Normalize Pass', value: '1.7 s' },
      { key: 'quality', label: 'Dedup Precision', value: '97.8%' }
    ],
    durationMs: 5600
  },
  {
    id: 'research',
    code: '04',
    title: 'Deep Research Agents',
    subtitle: 'Per-company intelligence',
    narrative:
      'Parallel agents investigate each startup to gather traction, funding, product maturity, geography, and market evidence.',
    outputs: ['Research dossiers', 'Source citations', 'Evidence confidence'],
    metrics: [
      { key: 'throughput', label: 'Agents Active', value: '48 workers' },
      { key: 'latency', label: 'Avg Runtime', value: '14.2 s' },
      { key: 'quality', label: 'Coverage Depth', value: '92.6%' }
    ],
    durationMs: 6200
  },
  {
    id: 'enrich',
    code: '05',
    title: 'Enrich + Schema Mapping',
    subtitle: 'Taxonomy alignment',
    narrative:
      'Raw findings are mapped into a schema-backed entity model, with normalized fields for sector, fit, stage, and strategic relevance.',
    outputs: ['Schema entities', 'Taxonomy tags', 'Consistency checks'],
    metrics: [
      { key: 'throughput', label: 'Entities Enriched', value: '163 profiles' },
      { key: 'latency', label: 'Mapping Time', value: '3.6 s' },
      { key: 'quality', label: 'Schema Validity', value: '98.7%' }
    ],
    durationMs: 5600
  },
  {
    id: 'document',
    code: '06',
    title: 'Document + Final List',
    subtitle: 'Human-readable synthesis',
    narrative:
      'Structured entities are rendered into presentation-ready briefs and compact startup lists for quick investor decision loops.',
    outputs: ['Markdown brief', 'PDF packet', 'Final startup table'],
    metrics: [
      { key: 'throughput', label: 'Pages Rendered', value: '142 pages' },
      { key: 'latency', label: 'Render Time', value: '1.3 s' },
      { key: 'quality', label: 'Editorial Completeness', value: '95.9%' }
    ],
    durationMs: 5200
  },
  {
    id: 'vector',
    code: '07',
    title: 'VectorDB Indexing',
    subtitle: 'Semantic retrieval layer',
    narrative:
      'Final entities are embedded and stored in vector space to enable semantic search, query recall, and downstream agent orchestration.',
    outputs: ['Vector embeddings', 'Semantic index', 'Retrieval endpoints'],
    metrics: [
      { key: 'throughput', label: 'Embeddings', value: '10,420 vectors' },
      { key: 'latency', label: 'Index Commit', value: '890 ms' },
      { key: 'quality', label: 'Retrieval Recall', value: '93.4%' }
    ],
    durationMs: 5200
  }
]

export const fallbackRuntime = {
  ingest: { signal: '99.2% parse success', queue: '218 files in queue' },
  discovery: { signal: '25 active query tracks', queue: '8 pending expansions' },
  extract: { signal: '3,482 rows normalized', queue: '211 rows to review' },
  research: { signal: '48 agents running', queue: '31 deep dives queued' },
  enrich: { signal: '163 entities mapped', queue: '14 conflicts pending' },
  document: { signal: '142 pages rendered', queue: '2 packs building' },
  vector: { signal: '10,420 vectors indexed', queue: 'Live semantic sync' }
}
