# infrastructure/package_lambda.py
import os
import shutil
import subprocess


def package_backend():
    print("Packaging backend for Lambda deployment...")

    # Define paths
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    backend_dir = os.path.join(project_root, "backend")
    build_dir = os.path.join(project_root, "backend_build")
    zip_path = os.path.join(project_root, "backend_lambda_package.zip")

    # Clean previous build if exists
    if os.path.exists(build_dir):
        shutil.rmtree(build_dir)
    if os.path.exists(zip_path):
        os.remove(zip_path)

    # Create build directory
    os.makedirs(build_dir)

    # Install dependencies to the build directory
    subprocess.run(
        ["pip", "install", "-t", build_dir, "--requirement", os.path.join(backend_dir, "requirements.txt")], check=True
    )

    # Copy application code
    for item in os.listdir(backend_dir):
        if item in [".venv", "__pycache__", "tests", ".pytest_cache"]:
            continue

        source = os.path.join(backend_dir, item)
        dest = os.path.join(build_dir, item)

        if os.path.isdir(source):
            shutil.copytree(source, dest)
        else:
            shutil.copy2(source, dest)

    # Create zip file
    shutil.make_archive(os.path.splitext(zip_path)[0], "zip", build_dir)

    print(f"Lambda package created at: {zip_path}")

    # Clean up build directory
    shutil.rmtree(build_dir)


if __name__ == "__main__":
    package_backend()
