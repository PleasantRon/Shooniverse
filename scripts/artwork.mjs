// Placeholder shoe artwork: simple flat silhouettes, one per shoe type.
// Each is drawn on a 400 x 200 canvas with the toe pointing right.
//   upper  - the part filled with the colourway colour
//   sole   - the sole (light fill)
//   lines  - extra detail strokes (laces, seams, straps) drawn with no fill
//   straps - extra shapes filled with the colourway colour (sandal straps)
//   detail - the area shown by the close-up "detail" view: [x, y] of its top-left corner
// The first entry, "sneaker", is the original demo shoe and must not change.
export const ARTWORK = {
  sneaker: {
    upper: 'M20 140C20 110 40 100 70 95L110 60C130 50 150 70 170 80C200 95 260 90 320 120C360 135 385 140 385 155V165H20Z',
    sole: 'M15 165H390V182Q390 190 380 190H25Q15 190 15 182Z',
    detail: [84, 12]
  },
  skate: {
    upper: 'M22 150C20 126 30 114 52 110L120 104C146 102 160 112 186 118C232 126 312 122 358 138C382 146 388 158 380 165H22Z',
    sole: 'M14 165H392V184Q392 192 382 192H24Q14 192 14 184Z',
    lines: ['M120 104C132 112 146 120 168 124', 'M150 104L162 118M170 108L182 122M190 112L202 126', 'M300 124C320 128 340 136 352 150'],
    detail: [110, 30]
  },
  trainer: {
    upper: 'M24 148C22 118 34 104 62 100C96 96 120 82 150 84C184 86 210 104 252 112C310 122 368 130 384 150V165H24Z',
    sole: 'M14 165H392V190Q392 196 384 196H24Q14 196 14 190Z',
    lines: ['M150 84C160 96 172 106 190 112', 'M62 100C80 108 100 112 120 112'],
    detail: [110, 30]
  },
  hightop: {
    upper: 'M22 150C20 98 30 64 52 50L96 46C106 54 116 66 132 74C176 86 232 94 290 112C346 126 382 138 386 155V165H22Z',
    sole: 'M14 165H392V184Q392 192 382 192H24Q14 192 14 184Z',
    lines: ['M52 50C60 64 76 74 96 76', 'M150 82L158 100M176 88L184 106M204 94L212 112', 'M28 84L106 88'],
    detail: [30, 20]
  },
  oxford: {
    upper: 'M30 152C28 130 32 112 46 106L96 100C128 98 150 108 178 116C222 128 300 124 352 140C380 148 392 160 380 165H30Z',
    sole: 'M26 165H388V172Q388 177 380 177H122V187H40V177H26Z',
    lines: ['M110 100C140 104 160 112 178 118', 'M122 106L132 118M140 110L150 122M158 114L168 126', 'M300 126C318 130 336 138 346 150'],
    detail: [96, 56]
  },
  brogue: {
    upper: 'M30 152C28 130 32 112 46 106L96 100C128 98 150 108 178 116C222 128 300 124 352 140C380 148 392 160 380 165H30Z',
    sole: 'M26 165H388V172Q388 177 380 177H122V187H40V177H26Z',
    lines: ['M110 100C140 104 160 112 178 118', 'M122 106L132 118M140 110L150 122M158 114L168 126', 'M300 126C318 130 336 138 346 150', 'M312 134L318 138M324 138L330 142M334 144L338 148', 'M60 120H100M62 132H108'],
    detail: [96, 56]
  },
  loafer: {
    upper: 'M28 152C26 128 34 114 54 110L112 106C140 104 160 110 188 118C232 130 302 128 352 142C380 150 392 160 380 165H28Z',
    sole: 'M24 165H388V172Q388 177 380 177H120V187H40V177H24Z',
    lines: ['M142 106C152 114 158 126 158 142', 'M176 112C184 120 188 130 188 144', 'M150 126H182'],
    detail: [100, 56]
  },
  tassel: {
    upper: 'M28 152C26 128 34 114 54 110L112 106C140 104 160 110 188 118C232 130 302 128 352 142C380 150 392 160 380 165H28Z',
    sole: 'M24 165H388V172Q388 177 380 177H120V187H40V177H24Z',
    lines: ['M150 110C158 118 164 128 164 142', 'M164 126L160 150M170 126L168 152M176 126L176 152M182 126L184 150'],
    detail: [100, 56]
  },
  chelsea: {
    upper: 'M56 165L52 40C52 33 57 30 64 30L148 30C156 30 160 35 162 43L170 74C190 90 232 98 288 108C338 118 372 130 380 150C384 160 382 165 376 165Z',
    sole: 'M48 165H386V182Q386 190 376 190H66Q52 190 48 182Z',
    lines: ['M60 104C90 94 120 100 150 106', 'M60 36L58 54M72 34L70 52', 'M300 112C330 120 352 132 366 150'],
    detail: [20, 10]
  },
  hiker: {
    upper: 'M54 165L50 52C50 44 56 40 64 40L140 40C150 40 156 46 158 56L166 80C190 92 236 98 290 108C340 118 374 130 380 150C384 160 382 165 376 165Z',
    sole: 'M46 165H388V184Q388 192 376 192H62Q50 192 46 184Z',
    lines: ['M60 46H150', 'M150 66L176 74M156 78L182 86M164 90L192 96M176 98L206 102', 'M296 112C326 120 350 132 364 150'],
    detail: [100, 20]
  },
  slide: {
    upper: 'M122 154C126 112 150 96 206 96C262 96 286 118 292 154L264 154C260 130 244 122 206 122C170 122 156 132 150 154Z',
    sole: 'M24 170C20 162 28 156 44 154C120 146 300 146 366 154C386 157 390 168 376 174C300 184 110 186 40 180C30 179 26 175 24 170Z',
    lines: [],
    detail: [96, 60]
  },
  sandal: {
    upper: 'M150 154C150 118 176 104 214 104C252 104 276 120 280 154L254 154C250 134 238 128 214 128C190 128 178 136 176 154Z',
    straps: ['M32 154C30 112 56 84 92 80L100 100C78 106 62 124 62 154Z'],
    sole: 'M24 170C20 162 28 156 44 154C120 146 300 146 366 154C386 157 390 168 376 174C300 184 110 186 40 180C30 179 26 175 24 170Z',
    lines: ['M74 98L90 112'],
    detail: [30, 50]
  }
}

// Draws the paths of one artwork for a colourway. For "sneaker" this is exactly the
// original two-path artwork.
export function artworkPaths(name, swatch) {
  const art = ARTWORK[name]
  if (!art) throw new Error(`Unknown artwork "${name}"`)
  const out = []
  if (art.straps) for (const d of art.straps) out.push(`<path d="${d}" fill="${swatch}"/>`)
  out.push(`<path d="${art.upper}" fill="${swatch}"/>`)
  out.push(`<path d="${art.sole}" fill="#F7F5F0"/>`)
  for (const d of art.lines ?? []) out.push(`<path d="${d}" fill="none"/>`)
  return out.join('\n')
}
