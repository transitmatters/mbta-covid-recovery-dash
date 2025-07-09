setup-env:
	poetry install
	cp datagen/secrets.example.py datagen/secrets.py
	npm install

clean-python-env:
	poetry env remove 3

update-data:
	cd datagen; poetry run python3 -m generate

update:
	make update-data
	npm run build-static
	git add .
	git commit -am "Data update: $$(date -R)"