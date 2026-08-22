from pathlib import Path, PurePosixPath
import shutil
import stat
import sys
import zipfile


archive_path = Path(sys.argv[1] if len(sys.argv) > 1 else ".resume-build/project.zip").resolve()
destination = Path(sys.argv[2] if len(sys.argv) > 2 else ".resume-build/source").resolve()

if destination.exists():
    shutil.rmtree(destination)
destination.mkdir(parents=True)

with zipfile.ZipFile(archive_path) as archive:
    members = archive.infolist()
    normalized_names = []

    for member in members:
        normalized = member.filename.replace("\\", "/")
        parts = PurePosixPath(normalized)
        mode = member.external_attr >> 16
        if parts.is_absolute() or ".." in parts.parts or stat.S_ISLNK(mode):
            raise RuntimeError(f"Unsafe ZIP member: {member.filename}")
        normalized_names.append(normalized.rstrip("/"))

    if "main.tex" not in normalized_names:
        raise RuntimeError("Overleaf source ZIP does not contain main.tex at its root.")

    archive.extractall(destination)

print(f"Extracted {len(members)} safe Overleaf source files.")
