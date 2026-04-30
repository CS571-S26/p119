import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Background,
  ControlButton,
  Controls,
  Handle,
  MarkerType,
  MiniMap,
  Position,
  ReactFlow,
  type Edge,
  type Node,
  type NodeProps,
  type NodeTypes,
} from "@xyflow/react"
import dagre from "@dagrejs/dagre"
import { Loader2, Maximize2, Minimize2 } from "lucide-react"
import { cn } from "@/lib/utils"
import "@xyflow/react/dist/style.css"

interface RawNode {
  id: string
  label: string
  title: string
}

interface RawEdge {
  source: string
  target: string
}

interface SubjectGraphProps {
  subject: string
  activeCourseId: string
}

interface CytoscapeEntry {
  data: {
    id?: string
    parent?: string | null
    title?: string
    description?: string
    source?: string
    target?: string
  }
}

const STATIC_API_URL =
  import.meta.env.VITE_STATIC_API_URL ?? "https://static.uwcourses.com"

const NODE_W = 200
const NODE_H = 56

type CourseNodeData = {
  label: string
  title: string
  isActive: boolean
  dimmed: boolean
}

function sanitizeId(id: string): string {
  return id.replace(/[/ ]/g, "_")
}

function adaptCytoscape(entries: CytoscapeEntry[]): {
  nodes: RawNode[]
  edges: RawEdge[]
} {
  const nodes: RawNode[] = []
  const edges: RawEdge[] = []
  for (const entry of entries) {
    const d = entry.data
    if (d.source && d.target) {
      edges.push({ source: sanitizeId(d.source), target: sanitizeId(d.target) })
    } else if (d.id && d.title) {
      nodes.push({ id: sanitizeId(d.id), label: d.id, title: d.title })
    }
  }
  return { nodes, edges }
}

function CourseNode({ data }: NodeProps<Node<CourseNodeData>>) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card px-3 py-2 text-xs shadow-sm transition-all duration-200",
        "min-w-[160px] max-w-[200px]",
        data.isActive
          ? "ring-2 ring-primary ring-offset-2 ring-offset-background shadow-lg scale-105"
          : "hover:shadow-md hover:border-primary/40",
        data.dimmed && "opacity-20",
      )}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!h-1.5 !w-1.5 !border-0 !bg-muted-foreground/60"
      />
      <div className="font-bold tracking-tight">{data.label}</div>
      <div className="truncate text-muted-foreground" title={data.title}>
        {data.title}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!h-1.5 !w-1.5 !border-0 !bg-muted-foreground/60"
      />
    </div>
  )
}

const NODE_TYPES: NodeTypes = { course: CourseNode }

function extractCourseNumber(label: string): number {
  const m = label.match(/(\d+)/)
  return m ? parseInt(m[1], 10) : 0
}

function layoutGraph(
  rawNodes: RawNode[],
  rawEdges: RawEdge[],
  activeCourseId: string,
): { nodes: Node<CourseNodeData>[]; edges: Edge[] } {
  const ids = new Set(rawNodes.map((n) => n.id))
  // The upstream graph can include edges referencing nodes that aren't in this
  // subject's node list (they'd be cross-subject prereqs). Drop them so dagre
  // doesn't synthesize ghost nodes.
  const validEdges = rawEdges.filter(
    (e) => ids.has(e.source) && ids.has(e.target),
  )

  const g = new dagre.graphlib.Graph()
  g.setGraph({ rankdir: "LR", nodesep: 28, ranksep: 90 })
  g.setDefaultEdgeLabel(() => ({}))
  for (const n of rawNodes) g.setNode(n.id, { width: NODE_W, height: NODE_H })
  for (const e of validEdges) g.setEdge(e.source, e.target)
  dagre.layout(g)

  // Re-sort within each column (same x = same dagre rank in LR mode) by course
  // number so the lowest number sits at the top.
  const positions = new Map<string, { x: number; y: number }>()
  const byColumn = new Map<number, RawNode[]>()
  for (const n of rawNodes) {
    const pos = g.node(n.id)
    positions.set(n.id, { x: pos.x, y: pos.y })
    const col = Math.round(pos.x)
    if (!byColumn.has(col)) byColumn.set(col, [])
    byColumn.get(col)!.push(n)
  }

  for (const [, columnNodes] of byColumn) {
    const ys = columnNodes
      .map((n) => positions.get(n.id)!.y)
      .sort((a, b) => a - b)
    columnNodes.sort(
      (a, b) =>
        extractCourseNumber(a.label) - extractCourseNumber(b.label) ||
        a.id.localeCompare(b.id),
    )
    columnNodes.forEach((n, i) => {
      positions.get(n.id)!.y = ys[i]
    })
  }

  const nodes: Node<CourseNodeData>[] = rawNodes.map((n) => {
    const pos = positions.get(n.id)!
    return {
      id: n.id,
      type: "course",
      position: { x: pos.x - NODE_W / 2, y: pos.y - NODE_H / 2 },
      data: {
        label: n.label,
        title: n.title,
        isActive: n.id === activeCourseId,
        dimmed: false,
      },
    }
  })

  const edges: Edge[] = validEdges.map((e) => ({
    id: `${e.source}->${e.target}`,
    source: e.source,
    target: e.target,
    style: { stroke: "var(--color-muted-foreground)", strokeOpacity: 0.55 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 16,
      height: 16,
      color: "var(--color-muted-foreground)",
    },
  }))

  return { nodes, edges }
}

function buildAdjacency(edges: RawEdge[]) {
  const forward = new Map<string, string[]>()
  const backward = new Map<string, string[]>()
  for (const e of edges) {
    if (!forward.has(e.source)) forward.set(e.source, [])
    forward.get(e.source)!.push(e.target)
    if (!backward.has(e.target)) backward.set(e.target, [])
    backward.get(e.target)!.push(e.source)
  }
  return { forward, backward }
}

function computeRelated(
  forward: Map<string, string[]>,
  backward: Map<string, string[]>,
  root: string,
): Set<string> {
  const result = new Set<string>([root])
  const walk = (start: string, adj: Map<string, string[]>) => {
    const queue = [start]
    while (queue.length > 0) {
      const cur = queue.shift()!
      for (const next of adj.get(cur) ?? []) {
        if (!result.has(next)) {
          result.add(next)
          queue.push(next)
        }
      }
    }
  }
  walk(root, forward)
  walk(root, backward)
  return result
}

export function SubjectGraph({ subject, activeCourseId }: SubjectGraphProps) {
  const [graph, setGraph] = useState<{
    nodes: RawNode[]
    edges: RawEdge[]
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const controller = new AbortController()
    fetch(`${STATIC_API_URL}/graphs/${subject}.json`, {
      signal: controller.signal,
    })
      .then((r) => {
        if (!r.ok) throw new Error(`graph fetch failed: ${r.status}`)
        return r.json() as Promise<CytoscapeEntry[]>
      })
      .then((entries) => setGraph(adaptCytoscape(entries)))
      .catch((err) => {
        if (err.name === "AbortError") return
        setError("Could not load subject graph.")
      })
    return () => controller.abort()
  }, [subject])

  useEffect(() => {
    const onChange = () =>
      setIsFullscreen(document.fullscreenElement === containerRef.current)
    document.addEventListener("fullscreenchange", onChange)
    return () => document.removeEventListener("fullscreenchange", onChange)
  }, [])

  const layout = useMemo(() => {
    if (!graph) return null
    return layoutGraph(graph.nodes, graph.edges, activeCourseId)
  }, [graph, activeCourseId])

  const adjacency = useMemo(() => {
    if (!graph) return null
    return buildAdjacency(graph.edges)
  }, [graph])

  const relatedSet = useMemo(() => {
    if (!hoveredId || !adjacency) return null
    return computeRelated(adjacency.forward, adjacency.backward, hoveredId)
  }, [hoveredId, adjacency])

  const displayNodes = useMemo(() => {
    if (!layout) return [] as Node<CourseNodeData>[]
    if (!relatedSet) return layout.nodes
    return layout.nodes.map((n) => ({
      ...n,
      data: { ...n.data, dimmed: !relatedSet.has(n.id) },
    }))
  }, [layout, relatedSet])

  const displayEdges = useMemo(() => {
    if (!layout) return [] as Edge[]
    if (!relatedSet) return layout.edges
    return layout.edges.map((e) => {
      const dim = !relatedSet.has(e.source) || !relatedSet.has(e.target)
      return {
        ...e,
        style: { ...e.style, strokeOpacity: dim ? 0.08 : 0.85 },
      }
    })
  }, [layout, relatedSet])

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      containerRef.current.requestFullscreen()
    }
  }, [])

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center rounded-xl border bg-muted/20 text-sm text-muted-foreground">
        {error}
      </div>
    )
  }

  if (!layout) {
    return (
      <div className="flex h-96 items-center justify-center rounded-xl border bg-muted/20 text-sm text-muted-foreground">
        <Loader2 className="mr-2 size-4 animate-spin" />
        Loading {subject} graph...
      </div>
    )
  }

  const activeNodeExists = layout.nodes.some((n) => n.id === activeCourseId)
  const fitViewOptions = activeNodeExists
    ? {
        nodes: [{ id: activeCourseId }],
        padding: 1.5,
        duration: 600,
        maxZoom: 1.4,
      }
    : { padding: 0.15, duration: 600 }

  return (
    <div
      ref={containerRef}
      className={cn(
        "w-full overflow-hidden rounded-xl border bg-muted/10",
        isFullscreen ? "h-screen rounded-none border-0" : "h-[640px]",
      )}
    >
      <ReactFlow
        nodes={displayNodes}
        edges={displayEdges}
        nodeTypes={NODE_TYPES}
        nodesDraggable={false}
        nodesConnectable={false}
        edgesFocusable={false}
        onNodeClick={(_, node) => navigate(`/course/${node.id}`)}
        onNodeMouseEnter={(_, node) => setHoveredId(node.id)}
        onNodeMouseLeave={() => setHoveredId(null)}
        fitView
        fitViewOptions={fitViewOptions}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={16} size={1} />
        <Controls showInteractive={false}>
          <ControlButton
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="size-3" />
            ) : (
              <Maximize2 className="size-3" />
            )}
          </ControlButton>
        </Controls>
        <MiniMap pannable zoomable className="!bg-background" />
      </ReactFlow>
    </div>
  )
}
