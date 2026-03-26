'use client'

import { useEffect, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  images: string[]
  index: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export default function Lightbox({ images, index, onClose, onPrev, onNext }: Props) {
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'ArrowLeft') onPrev()
    if (e.key === 'ArrowRight') onNext()
  }, [onClose, onPrev, onNext])

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [handleKey])

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.95)' }}
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 w-10 h-10 border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-white/50 transition-colors z-10"
      >
        <X size={18} />
      </button>

      {/* Counter */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white/40 text-xs tracking-widest">
        {index + 1} / {images.length}
      </div>

      {/* Prev */}
      {images.length > 1 && (
        <button
          onClick={e => { e.stopPropagation(); onPrev() }}
          className="absolute left-4 sm:left-8 w-12 h-12 border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-white/50 transition-colors z-10"
        >
          <ChevronLeft size={20} />
        </button>
      )}

      {/* Image */}
      <div
        className="relative max-w-5xl max-h-[85vh] w-full mx-16 sm:mx-24 flex items-center justify-center"
        onClick={e => e.stopPropagation()}
      >
        <img
          src={images[index]}
          alt={`Gallery image ${index + 1}`}
          className="max-w-full max-h-[85vh] object-contain select-none"
          style={{ boxShadow: '0 25px 80px rgba(0,0,0,0.8)' }}
        />
      </div>

      {/* Next */}
      {images.length > 1 && (
        <button
          onClick={e => { e.stopPropagation(); onNext() }}
          className="absolute right-4 sm:right-8 w-12 h-12 border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-white/50 transition-colors z-10"
        >
          <ChevronRight size={20} />
        </button>
      )}

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 max-w-full px-4 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={e => { e.stopPropagation(); }}
              className="relative w-12 h-12 shrink-0 overflow-hidden transition-all"
              style={{ opacity: i === index ? 1 : 0.4, outline: i === index ? '2px solid var(--accent)' : 'none' }}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
