#!/usr/bin/env python3
"""
Build the hero video assets from a raw intro clip.

    python scripts/build-hero-assets.py
    python scripts/build-hero-assets.py --src media/intro.mp4 --photo media/portrait.jpg
    python scripts/build-hero-assets.py --crop 576:720:352:0     # skip auto-detection

Outputs (into ./public):
    hero/hero.mp4      H.264 yuv420p, CRF 24, AAC 96k, +faststart
    hero/hero.webm     VP9 CRF 36, Opus 80k
    hero/poster.webp   first frame of the loop (shown before the video plays)
    portrait-bust.webp 480x600 head-to-shirt crop (from --photo, else the sharpest video frame)
    og.jpg             1200x630 social card

Requires numpy and ffmpeg (on PATH, or via `pip install imageio-ffmpeg`).
"""
from __future__ import annotations

import argparse
import os
import re
import shutil
import subprocess
import sys
import tempfile
import wave
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
ASPECT = 768 / 960  # width / height of the hero frame
PAPER = "0xf4f2ee"


def ffmpeg_exe() -> str:
    exe = shutil.which("ffmpeg")
    if exe:
        return exe
    try:
        import imageio_ffmpeg

        return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError:
        sys.exit("ffmpeg not found: install it or `pip install imageio-ffmpeg`.")


FF = ffmpeg_exe()


def run(args: list[str], **kw) -> subprocess.CompletedProcess:
    return subprocess.run([FF, "-hide_banner", "-loglevel", "error", "-y", *args], check=True, **kw)


def probe(path: Path) -> dict:
    err = subprocess.run([FF, "-hide_banner", "-i", str(path)], capture_output=True, text=True).stderr
    info: dict = {}
    if m := re.search(r"Duration: (\d+):(\d+):([\d.]+)", err):
        h, mi, s = m.groups()
        info["duration"] = int(h) * 3600 + int(mi) * 60 + float(s)
    if m := re.search(r"Video: .*?, (\d{2,5})x(\d{2,5})", err):
        info["w"], info["h"] = int(m.group(1)), int(m.group(2))
    if m := re.search(r"([\d.]+) fps", err):
        info["fps"] = float(m.group(1))
    if m := re.search(r"Audio: .*?(\d+) Hz", err):
        info["sr"] = int(m.group(1))
    return info


def grab_frames(path: Path, w: int, h: int, every: float, limit: float) -> np.ndarray:
    """Return RGB frames (n, h, w, 3) sampled every `every` seconds."""
    out = subprocess.run(
        [FF, "-hide_banner", "-loglevel", "error", "-t", str(limit), "-i", str(path),
         "-vf", f"fps=1/{every},scale={w}:{h}", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
        capture_output=True, check=True,
    ).stdout
    return np.frombuffer(out, np.uint8).reshape(-1, h, w, 3)


def background_level(frames: np.ndarray) -> np.ndarray:
    """Median RGB of the four corner patches, 0-255."""
    n, h, w, _ = frames.shape
    ph, pw = max(4, h // 12), max(4, w // 12)
    patches = [frames[:, :ph, :pw], frames[:, :ph, -pw:], frames[:, -ph:, :pw], frames[:, -ph:, -pw:]]
    return np.median(np.concatenate([p.reshape(-1, 3) for p in patches]), axis=0)


def detect_person(src: Path, info: dict, limit: float) -> tuple[int, int, int, int]:
    """Bounding box (x0, y0, x1, y1) of the subject in source pixels."""
    sw = 320
    sh = round(info["h"] * sw / info["w"])
    frames = grab_frames(src, sw, sh, 0.5, limit).astype(np.int16)
    bg = background_level(frames.astype(np.uint8))
    diff = np.abs(frames - bg).max(axis=3) > 28  # (n, h, w)
    mask = diff.any(axis=0)
    # Projection thresholds ignore small blobs such as corner watermarks.
    cols = np.where(mask.sum(axis=0) > sh * 0.12)[0]
    rows = np.where(mask[:, cols.min():cols.max() + 1].sum(axis=1) > 2)[0] if cols.size else np.array([])
    if not cols.size or not rows.size:
        sys.exit("Could not detect the person; pass --crop W:H:X:Y.")
    sx = info["w"] / sw
    sy = info["h"] / sh
    return int(cols.min() * sx), int(rows.min() * sy), int((cols.max() + 1) * sx), int((rows.max() + 1) * sy)


def even(v: float) -> int:
    return int(round(v / 2)) * 2


def crop_for(box: tuple[int, int, int, int], info: dict) -> tuple[int, int, int, int]:
    """Tight head-to-toe crop with the hero aspect ratio, subject centred horizontally."""
    x0, y0, x1, y1 = box
    pad = 0.06 * (y1 - y0)
    h = min(info["h"], even((y1 - y0) + 2 * pad))
    w = even(h * ASPECT)
    if w > info["w"]:
        w = even(info["w"])
        h = even(w / ASPECT)
    cx = (x0 + x1) / 2
    cy = (y0 + y1) / 2
    x = even(min(max(cx - w / 2, 0), info["w"] - w))
    y = even(min(max(cy - h / 2, 0), info["h"] - h))
    return w, h, x, y


def read_audio(src: Path, sr: int, seconds: float) -> np.ndarray:
    out = subprocess.run(
        [FF, "-hide_banner", "-loglevel", "error", "-t", str(seconds), "-i", str(src),
         "-vn", "-ac", "2", "-ar", str(sr), "-f", "f32le", "-"],
        capture_output=True, check=True,
    ).stdout
    audio = np.frombuffer(out, np.float32).reshape(-1, 2)
    need = round(seconds * sr)
    if audio.shape[0] < need:
        audio = np.vstack([audio, np.zeros((need - audio.shape[0], 2), np.float32)])
    return audio[:need]


def loop_audio(audio: np.ndarray, sr: int, fade: float) -> np.ndarray:
    """Mirror of the video xfade: drop the first `fade`s and blend it into the tail."""
    n = round(fade * sr)
    head, body = audio[:n], audio[n:]
    t = np.linspace(0.0, 1.0, n, dtype=np.float32)[:, None]
    tail = body[-n:] * np.cos(t * np.pi / 2) + head * np.sin(t * np.pi / 2)
    return np.vstack([body[:-n], tail])


def write_wav(path: Path, audio: np.ndarray, sr: int) -> None:
    pcm = (np.clip(audio, -1, 1) * 32767).astype("<i2")
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes(pcm.tobytes())


def font_arg(path: str) -> str:
    # drawtext needs the drive colon escaped on Windows.
    return path.replace("\\", "/").replace(":", "\\:")


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--src", default="media/intro.mp4")
    ap.add_argument("--photo", default="media/portrait.jpg", help="front-facing photo for the ID card ('' to use the video)")
    ap.add_argument("--out", default="public")
    ap.add_argument("--crop", help="W:H:X:Y in source pixels (skips detection)")
    ap.add_argument("--seconds", type=float, default=10.0, help="use at most this much of the clip")
    ap.add_argument("--fade", type=float, default=0.5, help="loop cross-fade length")
    ap.add_argument("--width", type=int, default=768, help="max output width (never upscales)")
    ap.add_argument("--photo-cx", type=float, default=0.5, help="horizontal centre of the face in the photo, 0-1")
    ap.add_argument("--name", default="Yuvraj Shishodia")
    ap.add_argument("--role", default="Full Stack Developer.")
    ap.add_argument("--font", default=r"C:\Windows\Fonts\arialbd.ttf" if os.name == "nt" else "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf")
    args = ap.parse_args()

    src = (ROOT / args.src).resolve()
    out = (ROOT / args.out).resolve()
    (out / "hero").mkdir(parents=True, exist_ok=True)

    info = probe(src)
    dur = min(args.seconds, info["duration"])
    fps = info.get("fps", 24)
    sr = 48000
    print(f"source  {info['w']}x{info['h']} @ {fps}fps, {info['duration']:.2f}s -> using {dur:.2f}s")

    if args.crop:
        cw, ch, cx, cy = (int(v) for v in args.crop.split(":"))
    else:
        box = detect_person(src, info, dur)
        cw, ch, cx, cy = crop_for(box, info)
        print(f"person  box={box}")
    print(f"crop    {cw}:{ch}:{cx}:{cy}")

    ow = min(args.width, cw)
    ow -= ow % 2
    oh = even(ow / ASPECT)

    # Whiten: map the measured backdrop level (slightly below) to pure white.
    bg = background_level(grab_frames(src, 160, 90, 1.0, dur))
    lv = [float(np.clip(c / 255 - 0.015, 0.80, 0.98)) for c in bg]
    print(f"levels  backdrop={bg.round().astype(int).tolist()} -> rimax={lv[0]:.3f} gimax={lv[1]:.3f} bimax={lv[2]:.3f}")

    # Loop: drop the first `fade` seconds and cross-fade them into the tail, so
    # the last frame flows into the first. No retiming, so lips stay in sync.
    f = round(args.fade * fps) / fps
    vf = (
        f"[0:v]trim=0:{dur},setpts=PTS-STARTPTS,crop={cw}:{ch}:{cx}:{cy},scale={ow}:{oh}:flags=lanczos,"
        f"colorlevels=rimax={lv[0]:.3f}:gimax={lv[1]:.3f}:bimax={lv[2]:.3f},fps={fps},split[a][b];"
        f"[a]trim=start={f},setpts=PTS-STARTPTS,fps={fps},settb=1/{round(fps * 1000)}[body];"
        f"[b]trim=end={f},setpts=PTS-STARTPTS,fps={fps},settb=1/{round(fps * 1000)}[head];"
        f"[body][head]xfade=transition=fade:duration={f}:offset={dur - 2 * f},format=yuv420p[v]"
    )

    with tempfile.TemporaryDirectory() as tmp:
        wav = Path(tmp) / "loop.wav"
        if "sr" in info:
            write_wav(wav, loop_audio(read_audio(src, sr, dur), sr, f), sr)
        else:
            write_wav(wav, np.zeros((round((dur - f) * sr), 2), np.float32), sr)

        common = ["-i", str(src), "-i", str(wav), "-filter_complex", vf, "-map", "[v]", "-map", "1:a"]
        print("encode  hero.mp4")
        run([*common, "-c:v", "libx264", "-crf", "24", "-preset", "slow", "-pix_fmt", "yuv420p",
             "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", str(out / "hero" / "hero.mp4")])
        print("encode  hero.webm")
        run([*common, "-c:v", "libvpx-vp9", "-crf", "36", "-b:v", "0", "-row-mt", "1", "-pix_fmt", "yuv420p",
             "-c:a", "libopus", "-b:a", "80k", str(out / "hero" / "hero.webm")])

    poster = out / "hero" / "poster.webp"
    run(["-i", str(out / "hero" / "hero.mp4"), "-frames:v", "1", "-c:v", "libwebp", "-quality", "82", str(poster)])

    # Portrait for the ID card.
    bust = out / "portrait-bust.webp"
    photo = (ROOT / args.photo) if args.photo else None
    if photo and photo.exists():
        pi = probe(photo)
        h = pi["h"]
        w = even(h * 0.8)
        if w > pi["w"]:
            w = even(pi["w"])
            h = even(w / 0.8)
        x = even(min(max(pi["w"] * args.photo_cx - w / 2, 0), pi["w"] - w))
        run(["-i", str(photo), "-vf", f"crop={w}:{h}:{x}:0,scale=480:600:flags=lanczos",
             "-c:v", "libwebp", "-quality", "84", str(bust)])
        print(f"portrait from photo {pi['w']}x{pi['h']} crop={w}:{h}:{x}:0")
    else:
        # Sharpest frame (variance of a Laplacian), head-to-shirt = top ~45% of the crop.
        frames = grab_frames(src, cw // 2, ch // 2, 0.25, dur).astype(np.float32).mean(axis=3)
        lap = frames[:, 1:-1, 1:-1] * 4 - frames[:, :-2, 1:-1] - frames[:, 2:, 1:-1] - frames[:, 1:-1, :-2] - frames[:, 1:-1, 2:]
        best = int(lap.reshape(len(frames), -1).var(axis=1).argmax())
        bh = even(ch * 0.45)
        bw = even(bh * 0.8)
        run(["-ss", str(best * 0.25), "-i", str(src), "-frames:v", "1",
             "-vf", f"crop={bw}:{bh}:{cx + (cw - bw) // 2}:{cy},scale=480:600:flags=lanczos",
             "-c:v", "libwebp", "-quality", "84", str(bust)])
        print(f"portrait from video frame {best * 0.25:.2f}s")

    # OG card: subject multiplied onto paper, name + role on the left.
    og = out / "og.jpg"
    text = ""
    if Path(args.font).exists():
        fa = font_arg(args.font)
        text = (
            f",drawtext=fontfile='{fa}':text='{args.name}':fontcolor=0x0d0d0d:fontsize=68:x=80:y=230,"
            f"drawtext=fontfile='{fa}':text='{args.role}':fontcolor=0x77756f:fontsize=40:x=80:y=330"
        )
    run(["-i", str(poster), "-f", "lavfi", "-i", f"color=c={PAPER}:s=1200x630",
         "-filter_complex",
         "[0:v]scale=-2:600,pad=1200:630:700:30:color=white,format=gbrp[fg];"
         f"[1:v]format=gbrp[bg];[bg][fg]blend=all_mode=multiply{text}",
         "-frames:v", "1", "-q:v", "3", str(og)])

    for p in [out / "hero" / "hero.mp4", out / "hero" / "hero.webm", poster, bust, og]:
        print(f"wrote   {p.relative_to(ROOT)}  {p.stat().st_size / 1024:.0f} KB")


if __name__ == "__main__":
    main()
