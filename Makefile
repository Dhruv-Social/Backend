dev: 
	@npm run dev

clean:
	rm -rf dist/

_build:
	@rm -rf ./build
	@npm run build

prod:
	@make _build
	node build/index.js

lint:
	npx eslint src/