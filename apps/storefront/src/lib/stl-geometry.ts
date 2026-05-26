// Binary + ASCII STL parser running entirely in the browser.
//
// Produces volume (mm³), bounding-box (mm), surface area (mm²) and
// triangle count for an uploaded mesh. Pure JS — no WebAssembly,
// no Three.js — so it works inside a Web Worker if needed.

export interface GeometrySummary {
  volumeMm3: number;
  surfaceAreaMm2: number;
  boundingBoxMm: { x: number; y: number; z: number };
  triangleCount: number;
}

const ASCII_MAGIC = "solid ";

export function isAsciiStl(buffer: ArrayBuffer): boolean {
  // Heuristic: an ASCII STL starts with "solid " but binary STLs often
  // do too. The real test is whether the declared triangle count matches
  // the file size — see parseBinaryStl below.
  const view = new Uint8Array(buffer);
  if (view.length < ASCII_MAGIC.length) return false;
  for (let i = 0; i < ASCII_MAGIC.length; i += 1) {
    if (view[i] !== ASCII_MAGIC.charCodeAt(i)) return false;
  }
  if (view.length < 84) return true;
  const dv = new DataView(buffer);
  const declared = dv.getUint32(80, true);
  const expectedSize = 80 + 4 + declared * 50;
  return view.length !== expectedSize;
}

export function parseStl(buffer: ArrayBuffer): GeometrySummary {
  return isAsciiStl(buffer) ? parseAsciiStl(buffer) : parseBinaryStl(buffer);
}

function parseBinaryStl(buffer: ArrayBuffer): GeometrySummary {
  if (buffer.byteLength < 84) {
    throw new Error("File is not a valid STL (too small)");
  }
  const dv = new DataView(buffer);
  const triangleCount = dv.getUint32(80, true);
  const expected = 80 + 4 + triangleCount * 50;
  if (buffer.byteLength !== expected) {
    throw new Error("File looks corrupt — declared triangle count doesn't match file size");
  }

  let offset = 84;
  let volume = 0;
  let surfaceArea = 0;
  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

  for (let i = 0; i < triangleCount; i += 1) {
    offset += 12; // skip normal
    const ax = dv.getFloat32(offset, true);     const ay = dv.getFloat32(offset + 4, true);    const az = dv.getFloat32(offset + 8, true);
    const bx = dv.getFloat32(offset + 12, true); const by = dv.getFloat32(offset + 16, true);   const bz = dv.getFloat32(offset + 20, true);
    const cx = dv.getFloat32(offset + 24, true); const cy = dv.getFloat32(offset + 28, true);   const cz = dv.getFloat32(offset + 32, true);
    offset += 36 + 2; // 3 vertices + attribute count

    volume += signedTetraVolume(ax, ay, az, bx, by, bz, cx, cy, cz);
    surfaceArea += triangleArea(ax, ay, az, bx, by, bz, cx, cy, cz);

    if (ax < minX) minX = ax; if (ay < minY) minY = ay; if (az < minZ) minZ = az;
    if (bx < minX) minX = bx; if (by < minY) minY = by; if (bz < minZ) minZ = bz;
    if (cx < minX) minX = cx; if (cy < minY) minY = cy; if (cz < minZ) minZ = cz;
    if (ax > maxX) maxX = ax; if (ay > maxY) maxY = ay; if (az > maxZ) maxZ = az;
    if (bx > maxX) maxX = bx; if (by > maxY) maxY = by; if (bz > maxZ) maxZ = bz;
    if (cx > maxX) maxX = cx; if (cy > maxY) maxY = cy; if (cz > maxZ) maxZ = cz;
  }

  return {
    volumeMm3: Math.abs(volume),
    surfaceAreaMm2: surfaceArea,
    boundingBoxMm: {
      x: maxX - minX,
      y: maxY - minY,
      z: maxZ - minZ,
    },
    triangleCount,
  };
}

function parseAsciiStl(buffer: ArrayBuffer): GeometrySummary {
  const text = new TextDecoder().decode(buffer);
  const vertexRegex = /vertex\s+(-?[\d.eE+-]+)\s+(-?[\d.eE+-]+)\s+(-?[\d.eE+-]+)/g;
  const coords: number[] = [];
  let match: RegExpExecArray | null;
  while ((match = vertexRegex.exec(text)) !== null) {
    coords.push(Number(match[1]), Number(match[2]), Number(match[3]));
  }
  if (coords.length === 0 || coords.length % 9 !== 0) {
    throw new Error("ASCII STL parse error — vertex count not a multiple of 3");
  }

  const triangleCount = coords.length / 9;
  let volume = 0;
  let surfaceArea = 0;
  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

  for (let i = 0; i < coords.length; i += 9) {
    const [ax, ay, az, bx, by, bz, cx, cy, cz] = coords.slice(i, i + 9);
    volume += signedTetraVolume(ax, ay, az, bx, by, bz, cx, cy, cz);
    surfaceArea += triangleArea(ax, ay, az, bx, by, bz, cx, cy, cz);

    if (ax < minX) minX = ax; if (ay < minY) minY = ay; if (az < minZ) minZ = az;
    if (bx < minX) minX = bx; if (by < minY) minY = by; if (bz < minZ) minZ = bz;
    if (cx < minX) minX = cx; if (cy < minY) minY = cy; if (cz < minZ) minZ = cz;
    if (ax > maxX) maxX = ax; if (ay > maxY) maxY = ay; if (az > maxZ) maxZ = az;
    if (bx > maxX) maxX = bx; if (by > maxY) maxY = by; if (bz > maxZ) maxZ = bz;
    if (cx > maxX) maxX = cx; if (cy > maxY) maxY = cy; if (cz > maxZ) maxZ = cz;
  }

  return {
    volumeMm3: Math.abs(volume),
    surfaceAreaMm2: surfaceArea,
    boundingBoxMm: { x: maxX - minX, y: maxY - minY, z: maxZ - minZ },
    triangleCount,
  };
}

// Signed volume of the tetrahedron formed with the origin — sum over
// every triangle gives the closed mesh's volume (sign depends on winding).
function signedTetraVolume(
  ax: number, ay: number, az: number,
  bx: number, by: number, bz: number,
  cx: number, cy: number, cz: number
): number {
  return (
    ax * (by * cz - bz * cy) +
    ay * (bz * cx - bx * cz) +
    az * (bx * cy - by * cx)
  ) / 6;
}

function triangleArea(
  ax: number, ay: number, az: number,
  bx: number, by: number, bz: number,
  cx: number, cy: number, cz: number
): number {
  const ux = bx - ax, uy = by - ay, uz = bz - az;
  const vx = cx - ax, vy = cy - ay, vz = cz - az;
  const nx = uy * vz - uz * vy;
  const ny = uz * vx - ux * vz;
  const nz = ux * vy - uy * vx;
  return Math.sqrt(nx * nx + ny * ny + nz * nz) / 2;
}
