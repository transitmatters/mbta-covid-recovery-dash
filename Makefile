update-data:
	cd datagen; pipenv run python -m generate
	npm run build-static
	git add .
	git commit