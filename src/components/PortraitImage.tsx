import { useState } from 'react'

interface PortraitImageProps {
  src: string
  alt: string
  className?: string
}

export function PortraitImage({ src, alt, className }: PortraitImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const portraitClassName = ['portrait-media', className]
    .filter(Boolean)
    .join(' ')

  if (failedSrc === src) {
    const fallbackClassName = ['portrait-fallback', portraitClassName].join(' ')

    return (
      <div
        className={fallbackClassName}
        role="img"
        aria-label={`${alt}加载失败`}
      >
        五条悟
      </div>
    )
  }

  return (
    <img
      className={portraitClassName}
      src={src}
      alt={alt}
      width="768"
      height="1024"
      onError={() => setFailedSrc(src)}
    />
  )
}
