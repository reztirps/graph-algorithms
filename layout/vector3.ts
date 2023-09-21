export class Vector3 {
  constructor(public x: number = 0, public y: number = 0, public z: number = 0) {}

  clone(): Vector3 {
    return new Vector3(this.x, this.y, this.z);
  }

  add(v: Vector3): Vector3 {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
  }

  sub(v: Vector3): Vector3 {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    return this;
  }

  multiplyScalar(scalar: number): Vector3 {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    return this;
  }

  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  normalize(): Vector3 {
    const len = this.length() || 1;
    this.x /= len;
    this.y /= len;
    this.z /= len;
    return this;
  }

  negate(): Vector3 {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    return this;
  }

  clampLength(min: number, max: number): Vector3 {
    const len = this.length();
    const clampedLength = Math.max(min, Math.min(max, len));
    if (len !== 0) {
      this.multiplyScalar(clampedLength / len);
    }
    return this;
  }
}
