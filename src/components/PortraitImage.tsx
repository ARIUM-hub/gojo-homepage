import { useState } from 'react'

interface PortraitImageProps {
  src: string
  alt: string
  className?: string
}

export function PortraitImage({ src, alt, className }: PortraitImageProps) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    const fallbackClassName = ['portrait-fallback', className]
      .filter(Boolean)
      .join(' ')

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
      className={className}
      src={src}
      alt={alt}
      width="768"
      height="1024"
      onError={() => setFailed(true)}
    />
  )
}
