setup-env:
	pipenv --python 3.9
	pipenv install
	cp datagen/secrets.example.py datagen/secrets.py
	npm install

clean-python-env:
	pipenv --rm

update-data:
	cd datagen; pipenv run python -m generate
	npm run build-static
	git add .
	git commit -am "Data update: $$(date -R)"