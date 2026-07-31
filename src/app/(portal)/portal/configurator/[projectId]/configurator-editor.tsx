"use client";

import {
  Check,
  ChevronLeft,
  ChevronRight,
  Focus,
  Hand,
  LoaderCircle,
  MousePointer2,
  Pencil,
  Redo2,
  Save,
  ScanLine,
  Scissors,
  Sparkles,
  Trash2,
  Undo2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { featureCategories, featureDefinitions, roomTypes } from "@/modules/configurator/constants";
import type { NormalizedPoint } from "@/modules/configurator/schema";
import { calculateConfiguratorSummary } from "@/modules/configurator/summary";
import type {
  EditorAnalysisState,
  EditorFeature,
  EditorPage,
  EditorRoom,
} from "@/modules/configurator/types";
import { confidenceLabel } from "@/modules/plan-analysis/confidence";

type Tool = "SELECT" | "PAN" | "DRAW" | "EDIT";
type DocumentRef = { id: string; name: string };
type EditorDocument = DocumentRef & { mimeType: string; signedUrl: string };

function isRoomResponse(value: unknown): value is { room: EditorRoom } {
  return (
    typeof value === "object" &&
    value !== null &&
    "room" in value &&
    typeof value.room === "object" &&
    value.room !== null &&
    "id" in value.room &&
    typeof value.room.id === "string"
  );
}

function readError(value: unknown): string {
  if (
    typeof value === "object" &&
    value !== null &&
    "error" in value &&
    typeof value.error === "string"
  ) {
    return value.error;
  }
  return "Operația nu a putut fi finalizată.";
}

function isAnalysisState(value: unknown): value is EditorAnalysisState {
  return (
    typeof value === "object" &&
    value !== null &&
    "configured" in value &&
    typeof value.configured === "boolean" &&
    "progress" in value &&
    typeof value.progress === "number" &&
    "roomsDetected" in value &&
    typeof value.roomsDetected === "number"
  );
}

function featureValue(features: EditorFeature[], code: string): EditorFeature | undefined {
  return features.find((feature) => feature.featureCode === code);
}

export function ConfiguratorEditor({
  projectId,
  document,
  documents,
  initialPages,
  initialRooms,
  initialAnalysis,
}: Readonly<{
  projectId: string;
  document: EditorDocument;
  documents: DocumentRef[];
  initialPages: EditorPage[];
  initialRooms: EditorRoom[];
  initialAnalysis: EditorAnalysisState;
}>) {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const panStart = useRef<{ x: number; y: number; left: number; top: number } | null>(null);
  const [pages, setPages] = useState(initialPages);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageCount, setPageCount] = useState(Math.max(1, initialPages.length));
  const [rooms, setRooms] = useState(initialRooms);
  const [selectedRoomId, setSelectedRoomId] = useState(initialRooms[0]?.id ?? null);
  const [tool, setTool] = useState<Tool>("SELECT");
  const [drawingPoints, setDrawingPoints] = useState<NormalizedPoint[]>([]);
  const [draggingVertex, setDraggingVertex] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [imageAspect, setImageAspect] = useState(4 / 3);
  const [filter, setFilter] = useState("ALL");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [analysis, setAnalysis] = useState(initialAnalysis);
  const analysisIsActive = analysis.status === "QUEUED" || analysis.status === "PROCESSING";
  const currentPage = pages.find((page) => page.pageNumber === pageNumber) ?? null;
  const selectedRoom = rooms.find((room) => room.id === selectedRoomId) ?? null;
  const pageRooms = rooms.filter((room) => room.documentPageId === currentPage?.id);
  const visibleRooms = pageRooms.filter(
    (room) =>
      filter === "ALL" ||
      room.detectionStatus === filter ||
      (filter === "CONFIRMED" && room.isConfirmed),
  );
  const summary = useMemo(() => calculateConfiguratorSummary(rooms), [rooms]);

  useEffect(() => {
    setRooms(initialRooms);
    setSelectedRoomId((current) =>
      current && initialRooms.some((room) => room.id === current)
        ? current
        : (initialRooms[0]?.id ?? null),
    );
    setAnalysis(initialAnalysis);
  }, [initialAnalysis, initialRooms]);

  useEffect(() => {
    if (!analysisIsActive) return;
    let cancelled = false;
    const poll = async (): Promise<void> => {
      try {
        const response = await fetch(
          `/api/portal/projects/${projectId}/documents/${document.id}/analysis`,
          { credentials: "include" },
        );
        const payload: unknown = await response.json();
        if (!response.ok || !isAnalysisState(payload) || cancelled) return;
        setAnalysis(payload);
        if (["NEEDS_REVIEW", "COMPLETED"].includes(payload.status ?? "")) {
          setMessage(
            payload.roomsDetected > 0
              ? `${payload.roomsDetected} camere detectate. Confirmă sau corectează rezultatele.`
              : "Nu au fost detectate camere. Poți continua manual.",
          );
          router.refresh();
        }
        if (payload.status === "FAILED") {
          setMessage(payload.errorMessage ?? "Analiza a eșuat. Poți relua jobul.");
        }
      } catch {
        if (!cancelled) setMessage("Statusul analizei nu a putut fi actualizat.");
      }
    };
    const timer = window.setInterval(() => void poll(), 1_500);
    void poll();
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [analysisIsActive, document.id, projectId, router]);

  useEffect(() => {
    if (document.mimeType !== "application/pdf") {
      const image = new window.Image();
      image.onload = () => setImageAspect(image.naturalWidth / image.naturalHeight || 4 / 3);
      image.src = document.signedUrl;
      return;
    }

    let cancelled = false;
    async function renderPdf(): Promise<void> {
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url,
      ).toString();
      const pdf = await pdfjs.getDocument({ url: document.signedUrl }).promise;
      if (cancelled) return;
      setPageCount(pdf.numPages);
      const page = await pdf.getPage(Math.min(pageNumber, pdf.numPages));
      const baseViewport = page.getViewport({ scale: 1 });
      const scale = Math.min(2, 1400 / baseViewport.width);
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      if (!canvas || !context) return;
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      setImageAspect(viewport.width / viewport.height);
      await page.render({ canvas, canvasContext: context, viewport }).promise;

      if (pages.length < pdf.numPages) {
        const response = await fetch(
          `/api/portal/projects/${projectId}/documents/${document.id}/pages`,
          {
            method: "POST",
            credentials: "include",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              pageCount: pdf.numPages,
              width: Math.floor(baseViewport.width),
              height: Math.floor(baseViewport.height),
            }),
          },
        );
        const payload: unknown = await response.json();
        if (
          response.ok &&
          typeof payload === "object" &&
          payload !== null &&
          "pages" in payload &&
          Array.isArray(payload.pages)
        ) {
          const registered = payload.pages.filter(
            (item): item is EditorPage =>
              typeof item === "object" &&
              item !== null &&
              "id" in item &&
              typeof item.id === "string" &&
              "pageNumber" in item &&
              typeof item.pageNumber === "number",
          );
          setPages(registered);
        }
      }
    }
    void renderPdf().catch(() => setMessage("Previzualizarea PDF nu a putut fi randată."));
    return () => {
      cancelled = true;
    };
  }, [document, pageNumber, pages.length, projectId]);

  function pointFromEvent(event: React.PointerEvent<SVGSVGElement>): NormalizedPoint {
    const bounds = event.currentTarget.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width)),
      y: Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height)),
    };
  }

  function patchSelected(patch: Partial<EditorRoom>, markDetectionModified = true): void {
    if (!selectedRoomId) return;
    setRooms((current) =>
      current.map((room) => {
        if (room.id !== selectedRoomId) return room;
        const needsReview = markDetectionModified && room.source === "AI";
        return {
          ...room,
          ...patch,
          ...(needsReview ? { detectionStatus: "MODIFIED" as const, isConfirmed: false } : {}),
        };
      }),
    );
  }

  async function startAnalysis(): Promise<void> {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(
        `/api/portal/projects/${projectId}/documents/${document.id}/analysis`,
        { method: "POST", credentials: "include" },
      );
      const payload: unknown = await response.json();
      if (!response.ok) throw new Error(readError(payload));
      if (
        !isAnalysisState({
          configured: true,
          jobId:
            typeof payload === "object" && payload !== null && "jobId" in payload
              ? payload.jobId
              : null,
          status:
            typeof payload === "object" && payload !== null && "status" in payload
              ? payload.status
              : null,
          progress:
            typeof payload === "object" && payload !== null && "progress" in payload
              ? payload.progress
              : 0,
          roomsDetected: 0,
          errorCode: null,
          errorMessage: null,
          issueCount: 0,
        })
      ) {
        throw new Error("Jobul de analiză nu a putut fi pornit.");
      }
      setAnalysis((current) => ({
        ...current,
        jobId:
          typeof payload === "object" && payload !== null && "jobId" in payload
            ? String(payload.jobId)
            : null,
        status: "QUEUED",
        progress: 0,
        errorCode: null,
        errorMessage: null,
      }));
      setMessage("Planul a intrat în coada de analiză.");
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : "Analiza nu a putut fi pornită.");
    } finally {
      setBusy(false);
    }
  }

  async function finishDrawing(): Promise<void> {
    if (!currentPage || drawingPoints.length < 3) return;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(`/api/portal/projects/${projectId}/rooms`, {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          documentPageId: currentPage.id,
          name: `Cameră ${rooms.length + 1}`,
          roomType: "OTHER",
          polygon: drawingPoints,
        }),
      });
      const payload: unknown = await response.json();
      if (!response.ok || !isRoomResponse(payload)) throw new Error(readError(payload));
      setRooms((current) => [...current, payload.room]);
      setSelectedRoomId(payload.room.id);
      setDrawingPoints([]);
      setTool("SELECT");
      setMessage("Camera a fost desenată. Completează proprietățile și funcțiile smart.");
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : "Camera nu a putut fi creată.");
    } finally {
      setBusy(false);
    }
  }

  async function saveRoom(confirm = false): Promise<void> {
    if (!selectedRoom) return;
    setBusy(true);
    setMessage("");
    const nextStatus = confirm
      ? selectedRoom.detectionStatus === "MANUAL"
        ? "MANUAL"
        : "CONFIRMED"
      : selectedRoom.detectionStatus;
    try {
      const response = await fetch(`/api/portal/projects/${projectId}/rooms/${selectedRoom.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: selectedRoom.name,
          roomType: selectedRoom.roomType,
          area: selectedRoom.area,
          level: selectedRoom.level,
          notes: selectedRoom.notes,
          detectionStatus: nextStatus,
          isConfirmed: confirm || selectedRoom.isConfirmed,
          polygon: selectedRoom.polygon,
          features: selectedRoom.features,
        }),
      });
      const payload: unknown = await response.json();
      if (!response.ok || !isRoomResponse(payload)) throw new Error(readError(payload));
      setRooms((current) =>
        current.map((room) => (room.id === payload.room.id ? payload.room : room)),
      );
      setMessage(confirm ? "Camera a fost confirmată." : "Modificările au fost salvate.");
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : "Camera nu a putut fi salvată.");
    } finally {
      setBusy(false);
    }
  }

  async function deleteRoom(): Promise<void> {
    if (!selectedRoom) return;
    setBusy(true);
    try {
      const response = await fetch(`/api/portal/projects/${projectId}/rooms/${selectedRoom.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Camera nu a putut fi ștearsă.");
      setRooms((current) => current.filter((room) => room.id !== selectedRoom.id));
      setSelectedRoomId(null);
      setMessage("Camera a fost ștearsă.");
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : "Camera nu a putut fi ștearsă.");
    } finally {
      setBusy(false);
    }
  }

  function updateFeature(definitionCode: string, patch: Partial<EditorFeature>): void {
    if (!selectedRoom) return;
    const definition = featureDefinitions.find((item) => item.code === definitionCode);
    if (!definition) return;
    const currentFeature = featureValue(selectedRoom.features, definitionCode);
    const nextFeature: EditorFeature = {
      category: definition.category,
      featureCode: definition.code,
      enabled: currentFeature?.enabled ?? false,
      quantity: currentFeature?.quantity ?? 1,
      ...patch,
    };
    const features = currentFeature
      ? selectedRoom.features.map((feature) =>
          feature.featureCode === definitionCode ? nextFeature : feature,
        )
      : [...selectedRoom.features, nextFeature];
    patchSelected({ features }, false);
  }

  const summaryItems = [
    ["Camere", summary.roomsDetected],
    ["Confirmate", summary.roomsConfirmed],
    ["De corectat", summary.roomsNeedCorrection],
    ["Circuite lumină", summary.lightingCircuits],
    ["Dimabile", summary.dimmableCircuits],
    ["Jaluzele", summary.blinds],
    ["Termostate", summary.thermostats],
    ["Senzori", summary.sensors],
    ["Camere video", summary.cameras],
    ["Detectoare", summary.detectors],
    ["Zone HVAC", summary.hvacZones],
    ["Prize comandate", summary.switchedSockets],
  ] as const;

  return (
    <section className="overflow-hidden rounded-2xl border border-[#d9e2de] bg-[#eef3f1] shadow-[0_18px_50px_rgba(13,32,26,.08)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate/15 bg-white px-3 py-3">
        <div className="flex flex-wrap items-center gap-1">
          {(
            [
              ["SELECT", MousePointer2, "Select"],
              ["PAN", Hand, "Pan"],
              ["DRAW", Pencil, "Desenează cameră"],
              ["EDIT", ScanLine, "Editează contur"],
            ] as const
          ).map(([value, Icon, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setTool(value);
                if (value !== "DRAW") setDrawingPoints([]);
              }}
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-2 text-xs font-medium transition ${tool === value ? "bg-ink text-white" : "text-slate hover:bg-cloud hover:text-ink"}`}
            >
              <Icon className="size-4" /> {label}
            </button>
          ))}
          <span className="mx-1 h-6 w-px bg-slate/15" />
          <button
            type="button"
            onClick={() => setZoom((value) => Math.min(2.5, value + 0.15))}
            className="rounded-md p-2 text-slate hover:bg-cloud"
            aria-label="Mărește"
          >
            <ZoomIn className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoom((value) => Math.max(0.5, value - 0.15))}
            className="rounded-md p-2 text-slate hover:bg-cloud"
            aria-label="Micșorează"
          >
            <ZoomOut className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoom(1)}
            className="rounded-md p-2 text-slate hover:bg-cloud"
            aria-label="Încadrează planul"
          >
            <Focus className="size-4" />
          </button>
          {tool === "DRAW" && drawingPoints.length > 0 && (
            <button
              type="button"
              onClick={() => setDrawingPoints((points) => points.slice(0, -1))}
              className="rounded-md p-2 text-slate hover:bg-cloud"
              aria-label="Anulează ultimul punct"
            >
              <Undo2 className="size-4" />
            </button>
          )}
          {tool === "DRAW" && drawingPoints.length >= 3 && (
            <button
              type="button"
              disabled={busy}
              onClick={() => void finishDrawing()}
              className="ml-1 inline-flex items-center rounded-md bg-emerald-700 px-3 py-2 text-xs font-semibold text-white"
            >
              <Check className="mr-1.5 size-4" /> Închide camera
            </button>
          )}
          <span className="mx-1 h-6 w-px bg-slate/15" />
          <button
            type="button"
            onClick={() => void startAnalysis()}
            disabled={
              busy ||
              analysisIsActive ||
              analysis.status === "NEEDS_REVIEW" ||
              analysis.status === "COMPLETED"
            }
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-2 text-xs font-medium text-slate hover:bg-cloud hover:text-ink disabled:cursor-not-allowed disabled:opacity-45"
          >
            {analysisIsActive ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            {analysis.status === "FAILED" ? "Reia analiza" : "Analizează planul"}
          </button>
          <button
            type="button"
            disabled
            title="Disponibil în Etapa 2"
            className="rounded-md p-2 text-slate opacity-35"
            aria-label="Împarte camera"
          >
            <Scissors className="size-4" />
          </button>
          <button
            type="button"
            disabled
            title="Disponibil în Etapa 2"
            className="rounded-md p-2 text-slate opacity-35"
            aria-label="Refă"
          >
            <Redo2 className="size-4" />
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate">
          <span>{Math.round(zoom * 100)}%</span>
          {busy && <LoaderCircle className="size-4 animate-spin text-emerald-700" />}
        </div>
      </div>

      {(analysis.status || !analysis.configured) && (
        <div className="border-b border-slate/15 bg-white px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div>
              <span className="font-semibold text-ink">
                {analysisIsActive
                  ? "Analizăm planul"
                  : analysis.status === "NEEDS_REVIEW"
                    ? "Necesită confirmare"
                    : analysis.status === "COMPLETED"
                      ? "Analiză confirmată"
                      : analysis.status === "FAILED"
                        ? "Analiza a eșuat"
                        : !analysis.configured
                          ? "Analiza automată nu este configurată"
                          : "Pregătit pentru analiză"}
              </span>
              <span className="ml-2 text-slate">
                {analysis.roomsDetected} camere detectate
                {analysis.issueCount > 0 ? ` · ${analysis.issueCount} atenționări` : ""}
              </span>
            </div>
            {analysisIsActive && (
              <span className="font-medium text-emerald-700">{analysis.progress}%</span>
            )}
          </div>
          {analysisIsActive && (
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-cloud">
              <div
                className="h-full rounded-full bg-emerald-600 transition-[width] duration-300"
                style={{ width: `${analysis.progress}%` }}
              />
            </div>
          )}
          {!analysis.configured && (
            <p className="mt-1 text-[11px] text-slate">
              Configurează cheia server-side pentru detecție sau continuă prin desenare manuală.
            </p>
          )}
          {analysis.errorMessage && (
            <p className="mt-1 text-[11px] font-medium text-red-700">{analysis.errorMessage}</p>
          )}
        </div>
      )}

      <div className="grid min-h-[42rem] xl:grid-cols-[14rem_minmax(0,1fr)_20rem]">
        <aside className="border-r border-slate/15 bg-white p-3">
          <label className="text-[10px] font-semibold uppercase tracking-[.14em] text-slate">
            Document
          </label>
          <select
            value={document.id}
            onChange={(event) =>
              router.push(`/portal/configurator/${projectId}?document=${event.target.value}`)
            }
            className="mt-2 w-full rounded-lg border border-slate/15 bg-white px-2.5 py-2 text-xs"
          >
            {documents.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>

          <div className="mt-5 flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-slate">
              Pagini
            </p>
            <span className="text-[10px] text-slate">{pageCount}</span>
          </div>
          <div className="mt-2 grid grid-cols-4 gap-1.5 xl:grid-cols-3">
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
              <button
                key={number}
                type="button"
                onClick={() => setPageNumber(number)}
                className={`aspect-[3/4] rounded border text-xs font-semibold ${pageNumber === number ? "border-emerald-600 bg-emerald-50 text-emerald-800" : "border-slate/15 bg-cloud text-slate hover:border-slate/30"}`}
              >
                {number}
              </button>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-slate">
              Camere
            </p>
            <span className="text-[10px] text-slate">{visibleRooms.length}</span>
          </div>
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate/15 bg-white px-2.5 py-2 text-xs"
          >
            <option value="ALL">Toate stările</option>
            <option value="DETECTED">Detectate</option>
            <option value="CONFIRMED">Confirmate</option>
            <option value="MANUAL">Desenate manual</option>
            <option value="REJECTED">Respinse</option>
          </select>
          <div className="mt-2 grid gap-1.5">
            {visibleRooms.map((room) => (
              <button
                key={room.id}
                type="button"
                onClick={() => {
                  setSelectedRoomId(room.id);
                  setTool("SELECT");
                }}
                className={`rounded-lg border px-3 py-2.5 text-left transition ${room.id === selectedRoomId ? "border-emerald-300 bg-emerald-50" : "border-transparent bg-cloud hover:border-slate/15"}`}
              >
                <span className="block truncate text-xs font-semibold">{room.name}</span>
                <span className="mt-1 block text-[10px] text-slate">
                  {confidenceLabel(room.confidence)}
                </span>
              </button>
            ))}
          </div>
        </aside>

        <div className="relative min-w-0 bg-[#dfe7e3] p-3 sm:p-5">
          <div
            ref={viewportRef}
            className={`h-[40rem] overflow-auto rounded-xl bg-[#cbd6d1] shadow-inner ${tool === "PAN" ? "cursor-grab active:cursor-grabbing" : ""}`}
            onPointerDown={(event) => {
              if (tool !== "PAN" || !viewportRef.current) return;
              panStart.current = {
                x: event.clientX,
                y: event.clientY,
                left: viewportRef.current.scrollLeft,
                top: viewportRef.current.scrollTop,
              };
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerMove={(event) => {
              if (tool !== "PAN" || !panStart.current || !viewportRef.current) return;
              viewportRef.current.scrollLeft =
                panStart.current.left - (event.clientX - panStart.current.x);
              viewportRef.current.scrollTop =
                panStart.current.top - (event.clientY - panStart.current.y);
            }}
            onPointerUp={() => {
              panStart.current = null;
            }}
          >
            <div className="mx-auto p-5" style={{ width: `${Math.max(100, zoom * 100)}%` }}>
              <div
                className="relative overflow-hidden bg-white shadow-[0_10px_35px_rgba(20,40,33,.18)]"
                style={{ aspectRatio: imageAspect }}
              >
                {document.mimeType === "application/pdf" ? (
                  <canvas ref={canvasRef} className="block size-full" />
                ) : (
                  <div
                    className="size-full bg-contain bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${JSON.stringify(document.signedUrl)})` }}
                  />
                )}
                <svg
                  data-testid="plan-overlay"
                  className={`absolute inset-0 size-full touch-none ${tool === "DRAW" ? "cursor-crosshair" : ""}`}
                  viewBox="0 0 1000 1000"
                  preserveAspectRatio="none"
                  onPointerDown={(event) => {
                    if (tool === "DRAW") {
                      const point = pointFromEvent(event);
                      setDrawingPoints((points) => [...points, point]);
                    }
                  }}
                  onPointerMove={(event) => {
                    if (tool !== "EDIT" || draggingVertex === null || !selectedRoom) return;
                    const point = pointFromEvent(event);
                    const polygon = selectedRoom.polygon.map((value, index) =>
                      index === draggingVertex ? point : value,
                    );
                    patchSelected({ polygon });
                  }}
                  onPointerUp={() => setDraggingVertex(null)}
                >
                  {pageRooms.map((room) => {
                    const selected = room.id === selectedRoomId;
                    const points = room.polygon
                      .map((point) => `${point.x * 1000},${point.y * 1000}`)
                      .join(" ");
                    return (
                      <g
                        key={room.id}
                        onPointerDown={(event) => {
                          if (tool === "SELECT" || tool === "EDIT") {
                            event.stopPropagation();
                            setSelectedRoomId(room.id);
                          }
                        }}
                        className="cursor-pointer"
                      >
                        <polygon
                          points={points}
                          vectorEffect="non-scaling-stroke"
                          className={`transition ${selected ? "fill-emerald-400/35 stroke-emerald-700" : room.isConfirmed ? "fill-cyan-400/20 stroke-cyan-700/80 hover:fill-cyan-400/30" : "fill-amber-300/25 stroke-amber-600/80 hover:fill-amber-300/40"}`}
                          strokeWidth={selected ? 3 : 2}
                        />
                        <text
                          x={
                            (room.polygon.reduce((sum, point) => sum + point.x, 0) /
                              room.polygon.length) *
                            1000
                          }
                          y={
                            (room.polygon.reduce((sum, point) => sum + point.y, 0) /
                              room.polygon.length) *
                            1000
                          }
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="fill-slate-950 pointer-events-none stroke-white/80 text-[24px] font-semibold [paint-order:stroke] [stroke-width:6px]"
                        >
                          {room.name}
                        </text>
                        {room.confidence !== null && (
                          <text
                            x={
                              (room.polygon.reduce((sum, point) => sum + point.x, 0) /
                                room.polygon.length) *
                              1000
                            }
                            y={
                              (room.polygon.reduce((sum, point) => sum + point.y, 0) /
                                room.polygon.length) *
                                1000 +
                              34
                            }
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="fill-slate-700 pointer-events-none stroke-white/80 text-[18px] font-medium [paint-order:stroke] [stroke-width:5px]"
                          >
                            {room.area !== null ? `${room.area} m² · ` : ""}
                            {Math.round(room.confidence * 100)}%
                          </text>
                        )}
                        {selected &&
                          tool === "EDIT" &&
                          room.polygon.map((point, index) => (
                            <circle
                              key={`${room.id}-${index}`}
                              cx={point.x * 1000}
                              cy={point.y * 1000}
                              r="9"
                              vectorEffect="non-scaling-stroke"
                              className="cursor-move fill-white stroke-emerald-700"
                              strokeWidth="3"
                              onPointerDown={(event) => {
                                event.stopPropagation();
                                setDraggingVertex(index);
                                event.currentTarget.setPointerCapture(event.pointerId);
                              }}
                            />
                          ))}
                      </g>
                    );
                  })}
                  {drawingPoints.length > 0 && (
                    <g>
                      <polyline
                        points={drawingPoints
                          .map((point) => `${point.x * 1000},${point.y * 1000}`)
                          .join(" ")}
                        fill="rgba(16,185,129,.18)"
                        stroke="#047857"
                        strokeWidth="3"
                        vectorEffect="non-scaling-stroke"
                      />
                      {drawingPoints.map((point, index) => (
                        <circle
                          key={`${point.x}-${point.y}-${index}`}
                          cx={point.x * 1000}
                          cy={point.y * 1000}
                          r="8"
                          fill="white"
                          stroke="#047857"
                          strokeWidth="3"
                          vectorEffect="non-scaling-stroke"
                        />
                      ))}
                    </g>
                  )}
                </svg>
              </div>
            </div>
          </div>
          <div className="absolute bottom-7 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/60 bg-white/90 px-3 py-2 text-xs shadow-lg backdrop-blur">
            <button
              type="button"
              disabled={pageNumber <= 1}
              onClick={() => setPageNumber((value) => value - 1)}
              className="disabled:opacity-30"
            >
              <ChevronLeft className="size-4" />
            </button>
            Pagina {pageNumber} / {pageCount}
            <button
              type="button"
              disabled={pageNumber >= pageCount}
              onClick={() => setPageNumber((value) => value + 1)}
              className="disabled:opacity-30"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        <aside className="max-h-[42rem] overflow-y-auto border-l border-slate/15 bg-white p-4">
          {selectedRoom ? (
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-emerald-700">
                    Proprietăți cameră
                  </p>
                  <p className="mt-1 text-xs text-slate">
                    {confidenceLabel(selectedRoom.confidence)}
                    {selectedRoom.confidence !== null
                      ? ` · ${Math.round(selectedRoom.confidence * 100)}%`
                      : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void deleteRoom()}
                  disabled={busy}
                  className="rounded-md p-2 text-slate hover:bg-red-50 hover:text-red-700"
                  aria-label="Șterge camera"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              <div className="mt-4 grid gap-3">
                <label className="text-xs font-medium">
                  Nume cameră
                  <input
                    value={selectedRoom.name}
                    onChange={(event) => patchSelected({ name: event.target.value })}
                    className="mt-1.5 w-full rounded-lg border border-slate/15 px-3 py-2 text-sm"
                  />
                </label>
                <label className="text-xs font-medium">
                  Tip
                  <select
                    value={selectedRoom.roomType}
                    onChange={(event) =>
                      patchSelected({ roomType: event.target.value as EditorRoom["roomType"] })
                    }
                    className="mt-1.5 w-full rounded-lg border border-slate/15 px-3 py-2 text-sm"
                  >
                    {roomTypes.map((roomType) => (
                      <option key={roomType.value} value={roomType.value}>
                        {roomType.label}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="text-xs font-medium">
                    Suprafață m²
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={selectedRoom.area ?? ""}
                      onChange={(event) =>
                        patchSelected({
                          area: event.target.value ? Number(event.target.value) : null,
                        })
                      }
                      className="mt-1.5 w-full rounded-lg border border-slate/15 px-3 py-2 text-sm"
                    />
                  </label>
                  <label className="text-xs font-medium">
                    Nivel
                    <input
                      value={selectedRoom.level ?? ""}
                      onChange={(event) => patchSelected({ level: event.target.value || null })}
                      placeholder="Parter"
                      className="mt-1.5 w-full rounded-lg border border-slate/15 px-3 py-2 text-sm"
                    />
                  </label>
                </div>
                <label className="text-xs font-medium">
                  Observații
                  <textarea
                    rows={2}
                    value={selectedRoom.notes ?? ""}
                    onChange={(event) => patchSelected({ notes: event.target.value || null })}
                    className="mt-1.5 w-full rounded-lg border border-slate/15 px-3 py-2 text-sm"
                  />
                </label>
              </div>

              <div className="mt-5 border-t border-slate/10 pt-4">
                <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-slate">
                  Funcții smart
                </p>
                <div className="mt-2 grid gap-2">
                  {featureCategories.map((category) => (
                    <details
                      key={category.value}
                      className="rounded-lg border border-slate/10 bg-cloud/50"
                      open={category.value === "LIGHTING"}
                    >
                      <summary className="cursor-pointer px-3 py-2.5 text-xs font-semibold">
                        {category.label}
                      </summary>
                      <div className="grid gap-1 border-t border-slate/10 bg-white p-2">
                        {featureDefinitions
                          .filter((definition) => definition.category === category.value)
                          .map((definition) => {
                            const feature = featureValue(selectedRoom.features, definition.code);
                            return (
                              <div
                                key={definition.code}
                                className="flex items-center gap-2 rounded-md px-1 py-1.5 text-xs"
                              >
                                <input
                                  type="checkbox"
                                  aria-label={definition.label}
                                  checked={feature?.enabled ?? false}
                                  onChange={(event) =>
                                    updateFeature(definition.code, {
                                      enabled: event.target.checked,
                                    })
                                  }
                                  className="size-4 rounded border-slate/25 text-emerald-700"
                                />
                                <span className="min-w-0 flex-1">{definition.label}</span>
                                {definition.quantityLabel && feature?.enabled && (
                                  <label className="flex items-center gap-1 text-[10px] text-slate">
                                    <span className="sr-only">{definition.quantityLabel}</span>
                                    <input
                                      type="number"
                                      min="1"
                                      max="999"
                                      value={feature.quantity}
                                      onChange={(event) =>
                                        updateFeature(definition.code, {
                                          quantity: Math.max(1, Number(event.target.value)),
                                        })
                                      }
                                      className="w-14 rounded border border-slate/15 px-1.5 py-1 text-center text-xs text-ink"
                                    />
                                  </label>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    </details>
                  ))}
                </div>
              </div>

              <div className="sticky bottom-0 mt-5 grid gap-2 border-t border-slate/10 bg-white pt-4">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void saveRoom(false)}
                  className="button-secondary py-2"
                >
                  <Save className="mr-2 size-4" /> Salvează
                </button>
                <button
                  type="button"
                  disabled={busy || selectedRoom.isConfirmed}
                  onClick={() => void saveRoom(true)}
                  className="button-primary py-2"
                >
                  <Check className="mr-2 size-4" />{" "}
                  {selectedRoom.isConfirmed ? "Cameră confirmată" : "Confirmă camera"}
                </button>
              </div>
            </div>
          ) : (
            <div className="grid min-h-64 place-items-center text-center text-sm text-slate">
              <p>
                Selectează o cameră sau folosește
                <br />
                <strong>Desenează cameră</strong>.
              </p>
            </div>
          )}
        </aside>
      </div>

      <div className="border-t border-slate/15 bg-white px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-emerald-700">
              Rezumat în timp real
            </p>
            {message && <p className="mt-1 text-xs text-slate">{message}</p>}
          </div>
          <span className="text-xs text-slate">Fără ofertare financiară</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-6">
          {summaryItems.map(([label, value]) => (
            <div
              key={label}
              data-testid={`summary-${label.toLowerCase().replaceAll(" ", "-")}`}
              className="rounded-lg bg-cloud px-3 py-2"
            >
              <p className="text-[10px] text-slate">{label}</p>
              <p className="mt-1 text-lg font-semibold text-ink">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
