"use client";

import { useState, useMemo } from "react";
import { useTreeStore } from "@/stores/tree-store";
import { useEditorStore } from "@/stores/editor-store";
import { useAppStore } from "@/stores/app-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TreeNode } from "./tree-node";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LinkRepoDialog } from "./link-repo-dialog";
import {
  CornerLeftUp,
  ChevronRight,
  Plus,
  BookOpen,
  Pencil,
  FilePlus,
  FolderOpen,
  GitBranch,
  ClipboardCopy,
  Copy,
  Trash2,
  Archive,
  TriangleAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  findNodeByPath,
  findParentCabinetNode,
  findRootCabinetNode,
} from "@/lib/cabinets/tree";
import { ROOT_CABINET_PATH } from "@/lib/cabinets/paths";
import {
  CABINET_VISIBILITY_OPTIONS,
} from "@/lib/cabinets/visibility";
import { getDataDir } from "@/lib/data-dir-cache";
import type { CabinetVisibilityMode } from "@/types/cabinets";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function TreeView() {
  const { nodes, loading } = useTreeStore();
  const selectPage = useTreeStore((s) => s.selectPage);
  const createPage = useTreeStore((s) => s.createPage);
  const deletePage = useTreeStore((s) => s.deletePage);
  const loadPage = useEditorStore((s) => s.loadPage);
  const section = useAppStore((s) => s.section);
  const setSection = useAppStore((s) => s.setSection);
  const cabinetVisibilityModes = useAppStore((s) => s.cabinetVisibilityModes);
  const setCabinetVisibilityMode = useAppStore((s) => s.setCabinetVisibilityMode);

  const [kbExpanded, setKbExpanded] = useState(true);
  const [kbSubPageOpen, setKbSubPageOpen] = useState(false);
  const [kbSubPageTitle, setKbSubPageTitle] = useState("");
  const [cabinetDeleteOpen, setCabinetDeleteOpen] = useState(false);
  const [kbCreating, setKbCreating] = useState(false);
  const [linkRepoOpen, setLinkRepoOpen] = useState(false);

  const rootCabinet = useMemo(() => findRootCabinetNode(nodes), [nodes]);
  const routeCabinetPath = section.mode === "cabinet" ? section.cabinetPath : undefined;
  const activeCabinet = useMemo(() => {
    if (!routeCabinetPath) return null;
    return findNodeByPath(nodes, routeCabinetPath);
  }, [nodes, routeCabinetPath]);
  const parentCabinet = useMemo(() => {
    if (!activeCabinet) return null;
    return findParentCabinetNode(nodes, activeCabinet.path);
  }, [activeCabinet, nodes]);
  const effectiveCabinetPath = activeCabinet?.path || ROOT_CABINET_PATH;
  const cabinetVisibilityMode =
    cabinetVisibilityModes[effectiveCabinetPath] || (activeCabinet ? "own" : "all");
  const visibleTreeNodes = activeCabinet?.children || rootCabinet?.children || nodes;
  const kbSectionLabel = "Data";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }

  // depth-based padding matching TreeNode: depth * 16 + 8
  const pad = (depth: number) => ({ paddingLeft: `${depth * 16 + 8}px` });
  const cabinetPath = activeCabinet?.path || rootCabinet?.path || ROOT_CABINET_PATH;
  const dataRootPath = activeCabinet
    ? activeCabinet.path === ROOT_CABINET_PATH
      ? ""
      : activeCabinet.path
    : "";

  const openCabinetOverview = (targetCabinetPath = cabinetPath) => {
    selectPage(targetCabinetPath);
    void loadPage(targetCabinetPath);
    setSection({
      type: "cabinet",
      mode: "cabinet",
      cabinetPath: targetCabinetPath,
    });
  };

  const openCabinetDataPage = (targetCabinetPath = cabinetPath) => {
    selectPage(targetCabinetPath);
    void loadPage(targetCabinetPath);
    setSection({
      type: "page",
      mode: "cabinet",
      cabinetPath: targetCabinetPath,
    });
  };

  const openParentCabinet = () => {
    if (!parentCabinet) return;
    openCabinetOverview(parentCabinet.path);
  };

  return (
    <>
    <ScrollArea className="flex-1 min-h-0">
      <div className="py-1">
        {/* ── Back to parent cabinet ────────────────────── */}
        {activeCabinet && parentCabinet ? (
          <button
            onClick={openParentCabinet}
            className="flex w-full items-center gap-1 px-3 pt-2 pb-1 text-left text-[9px] font-medium uppercase tracking-wider text-muted-foreground/60 transition-colors hover:text-foreground/80"
            style={pad(0)}
            title={`Back to ${parentCabinet.frontmatter?.title || parentCabinet.name}`}
          >
            <CornerLeftUp className="h-2.5 w-2.5 shrink-0 relative -top-px" />
            Back
          </button>
        ) : null}

        {/* ── Cabinet (depth 0) ───────────────────────────── */}
        <div className="flex items-center gap-1.5 px-3 pt-2 pb-1 w-full" style={pad(0)}>
          <ContextMenu>
          <ContextMenuTrigger>
          <button
            onClick={() => openCabinetOverview(activeCabinet?.path || cabinetPath)}
            className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex min-w-0 flex-1 items-center gap-1.5 text-left hover:text-foreground/80 transition-colors"
          >
            <Archive className="h-3.5 w-3.5 shrink-0 text-amber-400" />
            {activeCabinet?.frontmatter?.title || activeCabinet?.name || "Cabinet"}
          </button>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem disabled className="flex-col items-start gap-0">
              <span className="flex items-center">
                <Pencil className="h-4 w-4 mr-2" />
                Rename
              </span>
              <span className="text-[10px] text-muted-foreground/60 ml-6">
                Coming soon
              </span>
            </ContextMenuItem>
            {cabinetPath !== ROOT_CABINET_PATH && (
              <ContextMenuItem onClick={() => navigator.clipboard.writeText(cabinetPath)}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Relative Path
              </ContextMenuItem>
            )}
            <ContextMenuItem onClick={async () => {
              const dir = await getDataDir();
              navigator.clipboard.writeText(
                cabinetPath === ROOT_CABINET_PATH ? dir : `${dir}/${cabinetPath}`
              );
            }}>
              <ClipboardCopy className="h-4 w-4 mr-2" />
              Copy Full Path
            </ContextMenuItem>
            <ContextMenuItem onClick={() => {
              fetch("/api/system/open-data-dir", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  subpath: cabinetPath === ROOT_CABINET_PATH ? "" : cabinetPath,
                }),
              });
            }}>
              <FolderOpen className="h-4 w-4 mr-2" />
              Open in Finder
            </ContextMenuItem>
            {cabinetPath !== ROOT_CABINET_PATH && (
              <>
                <ContextMenuSeparator />
                <ContextMenuItem
                  className="text-destructive"
                  onClick={() => setCabinetDeleteOpen(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </ContextMenuItem>
              </>
            )}
          </ContextMenuContent>
          </ContextMenu>

          <Select
            items={CABINET_VISIBILITY_OPTIONS.map((opt) => ({
              label: opt.shortLabel,
              value: opt.value,
            }))}
            value={cabinetVisibilityMode}
            onValueChange={(value) =>
              setCabinetVisibilityMode(
                effectiveCabinetPath,
                value as CabinetVisibilityMode
              )
            }
          >
            <SelectTrigger
              size="sm"
              className="ml-auto h-5 min-w-0 w-auto gap-0.5 rounded border-none bg-transparent px-1.5 py-0 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/60 shadow-none hover:text-foreground/80 focus-visible:ring-0"
            >
              <SelectValue placeholder="Own" />
            </SelectTrigger>
            <SelectContent align="end" className="min-w-[200px]">
              <SelectGroup>
                {CABINET_VISIBILITY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    <span className="font-medium">{opt.shortLabel}</span>
                    <span className="ml-1.5 text-xs text-muted-foreground">
                      {opt.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* ── Knowledge Base label ──────────────────────── */}
        <div className="flex items-center gap-1.5 px-3 pt-2 pb-1 w-full" style={pad(0)}>
          <button
            onClick={() => setKbExpanded(!kbExpanded)}
            className="shrink-0 text-muted-foreground/50 hover:text-foreground/80 transition-colors"
          >
            <ChevronRight
              className={cn(
                "h-3 w-3 shrink-0 transition-transform duration-150",
                kbExpanded && "rotate-90"
              )}
            />
          </button>
          <ContextMenu>
          <ContextMenuTrigger>
            <button
              onClick={() => {
                if (activeCabinet) {
                  openCabinetDataPage(activeCabinet.path);
                  return;
                }
                setSection({ type: "home" });
              }}
              className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground text-left flex items-center gap-1.5 hover:text-foreground/80 transition-colors"
            >
              <BookOpen className="h-3.5 w-3.5 shrink-0" />
              {kbSectionLabel}
            </button>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem onClick={() => setKbSubPageOpen(true)}>
              <FilePlus className="h-4 w-4 mr-2" />
              Add Sub Page
            </ContextMenuItem>
            <ContextMenuItem onClick={() => setLinkRepoOpen(true)}>
              <GitBranch className="h-4 w-4 mr-2" />
              Load Knowledge
            </ContextMenuItem>
            <ContextMenuItem onClick={async () => {
              const dir = await getDataDir();
              navigator.clipboard.writeText(
                dataRootPath ? `${dir}/${dataRootPath}` : dir
              );
            }}>
              <ClipboardCopy className="h-4 w-4 mr-2" />
              Copy Full Path
            </ContextMenuItem>
            <ContextMenuItem onClick={() => {
              fetch("/api/system/open-data-dir", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subpath: dataRootPath }),
              });
            }}>
              <FolderOpen className="h-4 w-4 mr-2" />
              Open in Finder
            </ContextMenuItem>
          </ContextMenuContent>
          </ContextMenu>
        </div>

        {kbExpanded && (
          <>
            {visibleTreeNodes.length === 0 ? (
              <button
                onClick={() => {
                  if (activeCabinet) {
                    setKbSubPageOpen(true);
                  } else {
                    const btn = document.querySelector<HTMLButtonElement>(
                      "[data-new-page-trigger]"
                    );
                    btn?.click();
                  }
                }}
                className={cn(
                  "flex items-center gap-1.5 w-full text-left py-1.5 px-2 text-[13px] rounded-md transition-colors",
                  "hover:bg-accent/50"
                )}
                style={pad(2)}
              >
                <span className="w-3.5" />
                <Plus className="h-4 w-4 shrink-0 text-muted-foreground" />
                {activeCabinet ? "Add cabinet data" : "Add your first page"}
              </button>
            ) : (
              visibleTreeNodes.map((node) => (
                <TreeNode
                  key={node.path}
                  node={node}
                  depth={2}
                  contextCabinetPath={activeCabinet?.path || null}
                />
              ))
            )}
          </>
        )}
      </div>
    </ScrollArea>

    <Dialog open={kbSubPageOpen} onOpenChange={setKbSubPageOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Add Sub Page to &ldquo;{kbSectionLabel}&rdquo;
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!kbSubPageTitle.trim()) return;
            setKbCreating(true);
            try {
              await createPage(dataRootPath, kbSubPageTitle.trim());
              const slug = kbSubPageTitle
                .trim()
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "");
              const nextPath = dataRootPath ? `${dataRootPath}/${slug}` : slug;
              selectPage(nextPath);
              await loadPage(nextPath);
              setSection(
                activeCabinet
                  ? {
                      type: "page",
                      mode: "cabinet",
                      cabinetPath: activeCabinet.path,
                    }
                  : { type: "page" }
              );
              setKbSubPageTitle("");
              setKbSubPageOpen(false);
            } catch (error) {
              console.error("Failed to create sub page:", error);
            } finally {
              setKbCreating(false);
            }
          }}
          className="flex gap-2"
        >
          <Input
            placeholder="Page title..."
            value={kbSubPageTitle}
            onChange={(e) => setKbSubPageTitle(e.target.value)}
            autoFocus
          />
          <Button type="submit" disabled={!kbSubPageTitle.trim() || kbCreating}>
            {kbCreating ? "Creating..." : "Create"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>

    <LinkRepoDialog open={linkRepoOpen} onOpenChange={setLinkRepoOpen} />

    <Dialog open={cabinetDeleteOpen} onOpenChange={setCabinetDeleteOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-destructive/10">
              <TriangleAlert className="h-4 w-4 text-destructive" />
            </div>
            <div className="flex flex-col gap-1">
              <DialogTitle>
                Delete Cabinet &ldquo;{activeCabinet?.frontmatter?.title || activeCabinet?.name || cabinetPath}&rdquo;
              </DialogTitle>
              <DialogDescription>
                This will permanently delete the cabinet and everything inside it. This cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter className="mt-2">
          <Button variant="outline" onClick={() => setCabinetDeleteOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={async () => {
              await deletePage(cabinetPath);
              setCabinetDeleteOpen(false);
              setSection({ type: "home" });
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    </>
  );
}
