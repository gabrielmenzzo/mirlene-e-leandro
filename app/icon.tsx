import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'
export const runtime = 'edge'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FAF8F5',
          borderRadius: 4,
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 60 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="25" cy="30" r="15" stroke="#B8976A" strokeWidth="2" fill="none" />
          <circle cx="35" cy="30" r="15" stroke="#B8976A" strokeWidth="2" fill="none" />
          <path d="M30 15C30 15 28 12 30 10C32 12 30 15 30 15Z" fill="#B8976A" />
        </svg>
      </div>
    ),
    { ...size }
  )
}
