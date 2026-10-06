// Cuts drinks out of their background for the customer menu.
//
//   swift scripts/cutout-photos.swift            (or: npm run photos)
//
// Reads photos/<category>/<name>.(png|jpg|jpeg|heic|webp), lifts the subject with Apple's
// Vision foreground mask (same as "Lift subject" in Photos, macOS 14+), crops to it, scales it
// to at most MAX_HEIGHT px tall and writes public/menu-photos/<category>/<name>.png with a transparent
// background. Photos already processed (output newer than input) are skipped.

import AppKit
import CoreImage
import Foundation
import ImageIO
import UniformTypeIdentifiers
import Vision

let MAX_HEIGHT: CGFloat = 1000
let root = URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
let inputRoot = root.appendingPathComponent("photos")
let outputRoot = root.appendingPathComponent("public/menu-photos")
let exts: Set<String> = ["png", "jpg", "jpeg", "heic", "webp"]
let ciContext = CIContext()

func modified(_ url: URL) -> Date? {
  (try? url.resourceValues(forKeys: [.contentModificationDateKey]))?.contentModificationDate
}

func cutout(_ input: URL, to output: URL) throws {
  guard let source = CIImage(contentsOf: input, options: [.applyOrientationProperty: true]) else {
    throw NSError(domain: "cutout", code: 1, userInfo: [NSLocalizedDescriptionKey: "cannot read image"])
  }
  let request = VNGenerateForegroundInstanceMaskRequest()
  let handler = VNImageRequestHandler(ciImage: source)
  try handler.perform([request])
  guard let result = request.results?.first else {
    throw NSError(domain: "cutout", code: 2, userInfo: [NSLocalizedDescriptionKey: "no subject found"])
  }
  let buffer = try result.generateMaskedImage(ofInstances: result.allInstances, from: handler, croppedToInstancesExtent: true)
  var image = CIImage(cvPixelBuffer: buffer)

  if image.extent.height > MAX_HEIGHT {
    let scale = MAX_HEIGHT / image.extent.height
    let filter = CIFilter(name: "CILanczosScaleTransform")!
    filter.setValue(image, forKey: kCIInputImageKey)
    filter.setValue(scale, forKey: kCIInputScaleKey)
    filter.setValue(1.0, forKey: kCIInputAspectRatioKey)
    image = filter.outputImage!
  }

  guard let cg = ciContext.createCGImage(image, from: image.extent, format: .RGBA8, colorSpace: CGColorSpace(name: CGColorSpace.sRGB)) else {
    throw NSError(domain: "cutout", code: 3, userInfo: [NSLocalizedDescriptionKey: "render failed"])
  }
  guard let dest = CGImageDestinationCreateWithURL(output as CFURL, UTType.png.identifier as CFString, 1, nil) else {
    throw NSError(domain: "cutout", code: 4, userInfo: [NSLocalizedDescriptionKey: "cannot write output"])
  }
  CGImageDestinationAddImage(dest, cg, nil)
  if !CGImageDestinationFinalize(dest) {
    throw NSError(domain: "cutout", code: 5, userInfo: [NSLocalizedDescriptionKey: "write failed"])
  }
}

let fm = FileManager.default
guard let categories = try? fm.contentsOfDirectory(at: inputRoot, includingPropertiesForKeys: [.isDirectoryKey]) else {
  print("no photos/ folder — put raw photos in photos/<category>/")
  exit(0)
}

var done = 0, skipped = 0, failed = 0
for dir in categories where (try? dir.resourceValues(forKeys: [.isDirectoryKey]))?.isDirectory == true {
  let outDir = outputRoot.appendingPathComponent(dir.lastPathComponent)
  try? fm.createDirectory(at: outDir, withIntermediateDirectories: true)
  for file in (try? fm.contentsOfDirectory(at: dir, includingPropertiesForKeys: nil)) ?? [] where exts.contains(file.pathExtension.lowercased()) {
    let out = outDir.appendingPathComponent(file.deletingPathExtension().lastPathComponent).appendingPathExtension("png")
    if let o = modified(out), let i = modified(file), o >= i { skipped += 1; continue }
    do {
      try cutout(file, to: out)
      print("✓ \(dir.lastPathComponent)/\(file.lastPathComponent) → public/menu-photos/\(dir.lastPathComponent)/\(out.lastPathComponent)")
      done += 1
    } catch {
      print("✗ \(dir.lastPathComponent)/\(file.lastPathComponent): \(error.localizedDescription)")
      failed += 1
    }
  }
}
print("cutout: \(done) done, \(skipped) already up to date, \(failed) failed")
