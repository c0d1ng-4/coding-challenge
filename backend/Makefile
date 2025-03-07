.PHONY: install run

PYTHON_VERSION=3.11
VENV_DIR=.venv
PORT=8000

install:
	@if [ ! -d "$(VENV_DIR)" ]; then \
		echo "Creating virtual environment with Python $(PYTHON_VERSION)..."; \
		python$(PYTHON_VERSION) -m venv $(VENV_DIR); \
	fi
	@echo "Activating virtual environment and installing dependencies..."
	@source $(VENV_DIR)/bin/activate && poetry install

run:
	@echo "Running the FastAPI application on port $(PORT) with hot reload..."
	@source $(VENV_DIR)/bin/activate && poetry run uvicorn app.main:app --host 0.0.0.0 --port $(PORT) --reload --reload-dir . --reload-include "*.py"