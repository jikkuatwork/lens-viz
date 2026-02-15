// CX Lens Visualization API
// Goja runtime: synchronous only

var STAGES = [
  {
    id: 'ingest',
    code: '01',
    title: 'Data Ingestor',
    queue: '218 files in queue',
    signal: '99.2% parse success',
    metrics: {
      throughput: '1,247 docs/hr',
      latency: '410 ms',
      quality: '99.2%'
    }
  },
  {
    id: 'discovery',
    code: '02',
    title: 'Discovery + Query Expansion',
    queue: '8 pending expansions',
    signal: '25 active query tracks',
    metrics: {
      throughput: '25 tracks',
      latency: '2.1 s',
      quality: '96.4%'
    }
  },
  {
    id: 'extract',
    code: '03',
    title: 'Structured Extract',
    queue: '211 rows to review',
    signal: '3,482 rows normalized',
    metrics: {
      throughput: '3,482 rows',
      latency: '1.7 s',
      quality: '97.8%'
    }
  },
  {
    id: 'research',
    code: '04',
    title: 'Deep Research Agents',
    queue: '31 deep dives queued',
    signal: '48 agents running',
    metrics: {
      throughput: '48 workers',
      latency: '14.2 s',
      quality: '92.6%'
    }
  },
  {
    id: 'enrich',
    code: '05',
    title: 'Enrich + Schema Mapping',
    queue: '14 conflicts pending',
    signal: '163 entities mapped',
    metrics: {
      throughput: '163 profiles',
      latency: '3.6 s',
      quality: '98.7%'
    }
  },
  {
    id: 'document',
    code: '06',
    title: 'Document + Final List',
    queue: '2 packs building',
    signal: '142 pages rendered',
    metrics: {
      throughput: '142 pages',
      latency: '1.3 s',
      quality: '95.9%'
    }
  },
  {
    id: 'vector',
    code: '07',
    title: 'VectorDB Indexing',
    queue: 'Live semantic sync',
    signal: '10,420 vectors indexed',
    metrics: {
      throughput: '10,420 vectors',
      latency: '890 ms',
      quality: '93.4%'
    }
  }
]

var user = fazt.auth.getUser()

function findStage(idOrCode) {
  var i
  for (i = 0; i < STAGES.length; i++) {
    if (STAGES[i].id === idOrCode || STAGES[i].code === idOrCode) {
      return STAGES[i]
    }
  }
  return null
}

if (request.path === '/api/hello' && request.method === 'GET') {
  respond({
    app: 'cx-lens-viz',
    status: 'ok',
    generatedAt: Date.now()
  })
}

else if (request.path === '/api/me' && request.method === 'GET') {
  respond({
    user: user
  })
}

else if (request.path === '/api/pipeline' && request.method === 'GET') {
  var runtime = {}
  var stageList = []
  var i

  for (i = 0; i < STAGES.length; i++) {
    runtime[STAGES[i].id] = {
      signal: STAGES[i].signal,
      queue: STAGES[i].queue,
      metrics: STAGES[i].metrics
    }

    stageList.push({
      id: STAGES[i].id,
      code: STAGES[i].code,
      title: STAGES[i].title,
      signal: STAGES[i].signal
    })
  }

  respond({
    generatedAt: Date.now(),
    summary: {
      documents: '1,247',
      queries: '25',
      startups: '163',
      confidence: '94.1%'
    },
    runtime: runtime,
    stages: stageList
  })
}

else if (request.path === '/api/pipeline/step' && request.method === 'GET') {
  var stageId = request.query && request.query.id ? request.query.id : null

  if (!stageId) {
    respond(400, {
      code: 'validation_error',
      message: 'query parameter "id" is required'
    })
  } else {
    var stage = findStage(stageId)

    if (!stage) {
      respond(404, {
        code: 'not_found',
        message: 'stage not found'
      })
    } else {
      respond({ stage: stage })
    }
  }
}

else {
  respond(404, {
    code: 'not_found',
    message: 'route not found'
  })
}
