setup-env:
	poetry install
	cp datagen/secrets.example.py datagen/secrets.py
	npm install

clean-python-env:
	poetry env remove 3

update-data:
	cd datagen; poetry run python3 -m generate

update:
	git commit -am "Data update: $$(date -R)"