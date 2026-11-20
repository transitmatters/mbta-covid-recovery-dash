setup-env:
	uv sync
	npm install

clean-python-env:
	rm -rf .venv

update-data:
	cd datagen; uv run python3 -m generate

update:
	make update-data
	npm run build-static
	git add .
	git commit -am "Data update: $$(date -R)"
