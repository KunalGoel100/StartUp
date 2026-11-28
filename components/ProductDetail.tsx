"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  MapPin,
  Share2,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";

export default function ProductDetail({ product }: { product: any }) {
  const [image, setImage] = useState(0);
  const [size, setSize] = useState("");
  const [saved, setSaved] = useState(false);
  const [sent, setSent] = useState(false);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const dragStart = useRef<{
    x: number;
    y: number;
    panX: number;
    panY: number;
  } | null>(null);
  const didDrag = useRef(false);

  const resetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const clampPan = (x: number, y: number, scale: number) => {
    const viewport = viewportRef.current;
    const img = imageRef.current;
    if (!viewport || !img) return { x, y };

    const maxX = Math.max(0, (img.offsetWidth * scale - viewport.clientWidth) / 2);
    const maxY = Math.max(0, (img.offsetHeight * scale - viewport.clientHeight) / 2);

    return {
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y)),
    };
  };

  const zoomAtPoint = (clientX: number, clientY: number, scale: number) => {
    const nextZoom = Math.max(1, Math.min(5, scale));
    if (nextZoom === 1) {
      resetZoom();
      return;
    }

    const viewport = viewportRef.current;
    if (!viewport) return;

    const rect = viewport.getBoundingClientRect();
    const pointX = clientX - rect.left - rect.width / 2;
    const pointY = clientY - rect.top - rect.height / 2;
    const ratio = nextZoom / zoom;
    const nextPan = clampPan(
      pointX - (pointX - pan.x) * ratio,
      pointY - (pointY - pan.y) * ratio,
      nextZoom
    );

    setZoom(nextZoom);
    setPan(nextPan);
  };

  const changeImage = (index: number) => {
    setImage(index);
    resetZoom();
  };

  const prev = () =>
    changeImage(image === 0 ? product.gallery.length - 1 : image - 1);

  const next = () =>
    changeImage(image === product.gallery.length - 1 ? 0 : image + 1);

  useEffect(() => {
    if (!lightboxOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxOpen(false);
        resetZoom();
      }

      if (e.key === "ArrowRight" && product.gallery?.length > 1) {
        setImage((i: number) => (i + 1) % product.gallery.length);
        resetZoom();
      }
      if (e.key === "ArrowLeft" && product.gallery?.length > 1) {
        setImage((i: number) =>
          i === 0 ? product.gallery.length - 1 : i - 1
        );
        resetZoom();
      }
      const viewport = viewportRef.current;
      const rect = viewport?.getBoundingClientRect();
      if ((e.key === "+" || e.key === "=") && rect) {
        zoomAtPoint(rect.left + rect.width / 2, rect.top + rect.height / 2, zoom + 0.5);
      }
      if (e.key === "-" && rect) {
        zoomAtPoint(rect.left + rect.width / 2, rect.top + rect.height / 2, zoom - 0.5);
      }
      if (e.key === "0") resetZoom();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxOpen, product.gallery?.length]);

  return (
    <div className="mx-auto max-w-7xl px-5 pb-20 pt-8 lg:px-8">
      <Link
        href="/"
        className="mb-8 flex items-center gap-2 text-sm font-medium text-[#636b60]"
      >
        <ArrowLeft size={17} />
        Back to collections
      </Link>

      <div className="grid gap-10 lg:grid-cols-[1.08fr_.92fr]">
        <div>
          <div className="relative overflow-hidden rounded-[2rem] bg-white">
            <div
              className="relative h-[540px] w-full cursor-zoom-in overflow-hidden sm:h-[680px]"
              onClick={() => {
                setLightboxOpen(true);
                resetZoom();
              }}
            >
              <img
                src={product.gallery?.[image]?.image_url}
                alt={product.title}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />

              <div className="absolute right-4 top-4 rounded-full bg-black/40 p-2 text-white backdrop-blur">
                <ZoomIn size={18} />
              </div>
            </div>

            {product.gallery?.length > 1 && (
              <>
                <button
                  onClick={prev}
                  aria-label="Previous image"
                  className="absolute left-5 top-1/2 -translate-y-1/2 rounded-full bg-white/85 p-3 backdrop-blur"
                >
                  <ChevronLeft />
                </button>

                <button
                  onClick={next}
                  aria-label="Next image"
                  className="absolute right-5 top-1/2 -translate-y-1/2 rounded-full bg-white/85 p-3 backdrop-blur"
                >
                  <ChevronRight />
                </button>
              </>
            )}

            <span className="absolute bottom-5 right-5 rounded-full bg-black/45 px-3 py-1.5 text-xs text-white">
              {image + 1} / {product.gallery?.length || 1}
            </span>
          </div>

          {product.gallery?.length > 0 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {product.gallery.map((img: any, i: number) => (
                <button
                  key={i}
                  onClick={() => setImage(i)}
                  className={`overflow-hidden rounded-2xl border-2 ${
                    image === i
                      ? "border-[#4f5c4d]"
                      : "border-transparent opacity-70"
                  }`}
                >
                  <img
                    src={img.image_url}
                    alt={`${product.title}-${i}`}
                    className="h-28 w-full object-cover sm:h-36"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-28 lg:h-fit">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#879080]">
            {product.category}
          </p>

          <div className="mt-3 flex justify-between gap-6">
            <div>
              <h1 className="text-4xl font-medium sm:text-5xl">
                {product.title}
              </h1>

              <p className="mt-2 text-[#757c72]">
                {product.subtitle}
              </p>
            </div>

            <button
              onClick={() => setSaved(!saved)}
              className="h-fit rounded-full border bg-white p-3"
            >
              <Heart
                className={
                  saved
                    ? "fill-[#7d8878] text-[#7d8878]"
                    : ""
                }
              />
            </button>
          </div>

          <p className="mt-7 text-2xl font-semibold">
            {product.price}
          </p>

          <p className="mt-2 text-sm text-[#71786e]">
            {product.leadTime}
          </p>

          <p className="mt-7 leading-7 text-[#5f675d]">
            {product.description}
          </p>

          <div className="mt-8">
            <p className="text-sm font-semibold">
              Choose size
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes?.map((s: string) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`rounded-full border px-4 py-2.5 text-sm ${
                    size === s
                      ? "bg-[#2f3b31] text-white"
                      : "bg-white"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => size && setSent(true)}
            className={`mt-7 flex w-full items-center justify-center gap-2 rounded-xl py-4 text-sm font-medium text-white ${
              size
                ? "bg-[#2f3b31]"
                : "cursor-not-allowed bg-[#9ba198]"
            }`}
          >
            Contact maker about this dress
            <ArrowRight size={16} />
          </button>

          {!size && (
            <p className="mt-2 text-center text-xs">
              Select a size first.
            </p>
          )}

          {sent && (
            <p className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#e8eee5] p-3 text-sm">
              <Check size={16} />
              Your enquiry has been prepared.
            </p>
          )}

          <div className="mt-8 divide-y rounded-2xl bg-white px-5">
            <p className="flex justify-between py-4 text-sm">
              <span>Material</span>
              <b>{product.material}</b>
            </p>

            <p className="flex justify-between py-4 text-sm">
              <span>Fit</span>
              <b>{product.fit}</b>
            </p>

            <p className="flex justify-between py-4 text-sm">
              <span>Care</span>
              <b>{product.care}</b>
            </p>
          </div>

          <div className="mt-8 rounded-2xl bg-[#e5e8e0] p-6">
            <b className="text-xs uppercase">
              The story
            </b>

            <p className="mt-3 leading-7">
              {product.story}
            </p>
          </div>

          <div className="mt-6 flex items-center justify-between rounded-2xl bg-white p-5">
            <div>
              <small>Made by</small>

              <p className="font-semibold">
                {product.maker}
              </p>

              <p className="flex items-center gap-1 text-sm">
                <MapPin size={14} />
                {product.city}
              </p>
            </div>

            <button className="rounded-full border p-3">
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/95"
          onClick={() => {
            setLightboxOpen(false);
            resetZoom();
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxOpen(false);
              resetZoom();
            }}
            aria-label="Close image viewer"
            className="absolute right-6 top-6 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
          >
            <X size={22} />
          </button>

          {product.gallery?.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                className="absolute left-6 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-4 text-white hover:bg-white/20"
              >
                <ChevronLeft />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-4 text-white hover:bg-white/20"
              >
                <ChevronRight />
              </button>
            </>
          )}

          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${product.title} image viewer`}
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col items-center"
          >
            <div
              ref={viewportRef}
              className="relative flex h-[min(68vh,820px)] w-[min(90vw,1200px)] touch-none items-center justify-center overflow-hidden"
              onClick={(e) => {
                if (didDrag.current) {
                  didDrag.current = false;
                  return;
                }
                if (e.target !== imageRef.current && zoom <= 1) return;
                if (zoom > 1) {
                  resetZoom();
                } else {
                  zoomAtPoint(e.clientX, e.clientY, 2.5);
                }
              }}
              onWheel={(e) => {
                e.preventDefault();
                zoomAtPoint(
                  e.clientX,
                  e.clientY,
                  zoom + (e.deltaY < 0 ? 0.25 : -0.25)
                );
              }}
              onPointerDown={(e) => {
                if (
                  zoom <= 1 ||
                  (e.target instanceof Element && e.target.closest("button"))
                ) {
                  return;
                }
                e.preventDefault();
                e.currentTarget.setPointerCapture(e.pointerId);
                dragStart.current = {
                  x: e.clientX,
                  y: e.clientY,
                  panX: pan.x,
                  panY: pan.y,
                };
                didDrag.current = false;
                setDragging(true);
              }}
              onPointerMove={(e) => {
                if (!dragStart.current) return;
                const deltaX = e.clientX - dragStart.current.x;
                const deltaY = e.clientY - dragStart.current.y;
                if (Math.abs(deltaX) + Math.abs(deltaY) > 3) {
                  didDrag.current = true;
                }
                setPan(
                  clampPan(
                    dragStart.current.panX + deltaX,
                    dragStart.current.panY + deltaY,
                    zoom
                  )
                );
              }}
              onPointerUp={() => {
                dragStart.current = null;
                setDragging(false);
              }}
              onPointerCancel={() => {
                dragStart.current = null;
                setDragging(false);
              }}
            >
              <div className="absolute left-4 top-4 z-10 flex overflow-hidden rounded-full bg-black/50 text-white backdrop-blur">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const rect = viewportRef.current?.getBoundingClientRect();
                    if (rect) zoomAtPoint(rect.left + rect.width / 2, rect.top + rect.height / 2, zoom + 0.5);
                  }}
                  aria-label="Zoom in"
                  className="p-3 hover:bg-white/15"
                >
                  <ZoomIn size={18} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const rect = viewportRef.current?.getBoundingClientRect();
                    if (rect) zoomAtPoint(rect.left + rect.width / 2, rect.top + rect.height / 2, zoom - 0.5);
                  }}
                  aria-label="Zoom out"
                  className="p-3 hover:bg-white/15"
                >
                  <ZoomOut size={18} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    resetZoom();
                  }}
                  aria-label="Reset zoom"
                  className="p-3 hover:bg-white/15"
                >
                  <RotateCcw size={17} />
                </button>
              </div>

              <img
                ref={imageRef}
                src={product.gallery?.[image]?.image_url}
                alt={product.title}
                draggable={false}
                style={{
                  transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
                }}
                className={`max-h-full max-w-full select-none object-contain ${
                  dragging
                    ? "cursor-grabbing transition-none"
                    : zoom > 1
                      ? "cursor-grab transition-transform duration-200"
                      : "cursor-zoom-in transition-transform duration-200"
                }`}
              />
            </div>

            {product.gallery?.length > 1 && (
              <div className="flex max-w-[90vw] gap-3 overflow-x-auto py-1">
              {product.gallery?.map(
                (img: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => {
                      changeImage(i);
                    }}
                    aria-label={`View image ${i + 1}`}
                    className={`overflow-hidden rounded-xl border-2 ${
                      image === i
                        ? "border-white"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={img.image_url}
                      alt=""
                      className="h-20 w-20 object-cover"
                    />
                  </button>
                )
              )}
              </div>
            )}

            <p className="mt-3 text-xs text-white/70 sm:text-sm">
              Click image to zoom · Drag to explore · Scroll or +/- to adjust · Esc to close
            </p>
          </div>
        </div>
      )}
    </div>
  );
}